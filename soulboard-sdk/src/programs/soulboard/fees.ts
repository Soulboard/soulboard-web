import { BN } from "@coral-xyz/anchor";
import { toBN } from "@soulboard/programs/soulboard/utils";

export type FeeRounding = "floor" | "ceil" | "round";

export interface FeeConfig {
  feeBps?: number;
  flatLamports?: BN | number | bigint;
  minFeeLamports?: BN | number | bigint;
  maxFeeLamports?: BN | number | bigint;
  rounding?: FeeRounding;
}

export interface FeeBreakdown {
  grossLamports: BN;
  feeLamports: BN;
  netLamports: BN;
}

export interface FeeTotals extends FeeBreakdown {
  totalLamports: BN;
}

export type PricingModel =
  | {
      type: "flat";
      amountLamports: BN | number | bigint;
    }
  | {
      type: "perView";
      priceLamports: BN | number | bigint;
    }
  | {
      type: "perImpression";
      priceLamports: BN | number | bigint;
    }
  | {
      type: "cpm";
      priceLamports: BN | number | bigint;
    };

export interface MetricInputs {
  views?: BN | number | bigint;
  impressions?: BN | number | bigint;
}

export interface SettlementQuote extends FeeBreakdown {
  capped: boolean;
  capLamports?: BN;
}

export interface SettlementQuoteOptions {
  capLamports?: BN | number | bigint;
  fee?: FeeConfig;
  pricingRounding?: FeeRounding;
}

const BPS_DENOMINATOR = new BN(10_000);
const THOUSAND = new BN(1_000);

const bnMax = (left: BN, right: BN): BN => (left.gt(right) ? left : right);
const bnMin = (left: BN, right: BN): BN => (left.lt(right) ? left : right);

const assertIntegerNumber = (value: number, field: string) => {
  if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
    throw new Error(`${field} must be a non-negative integer`);
  }
};

const normalizeLamports = (
  value: BN | number | bigint,
  field: string
): BN => {
  if (typeof value === "number") {
    assertIntegerNumber(value, field);
  }
  const result = toBN(value);
  if (result.isNeg()) {
    throw new Error(`${field} must be non-negative`);
  }
  return result;
};

const normalizeMetric = (
  value: BN | number | bigint | undefined,
  field: string
): BN => {
  if (value === undefined) {
    throw new Error(`${field} is required for this pricing model`);
  }
  if (typeof value === "number") {
    assertIntegerNumber(value, field);
  }
  const result = toBN(value);
  if (result.isNeg()) {
    throw new Error(`${field} must be a non-negative integer`);
  }
  return result;
};

const applyRounding = (
  numerator: BN,
  denominator: BN,
  rounding: FeeRounding
): BN => {
  if (rounding === "ceil") {
    return numerator.add(denominator.subn(1)).div(denominator);
  }
  if (rounding === "round") {
    return numerator.add(denominator.divn(2)).div(denominator);
  }
  return numerator.div(denominator);
};

const calculateBpsFee = (amount: BN, feeBps: number, rounding: FeeRounding) => {
  if (!Number.isFinite(feeBps) || feeBps < 0 || !Number.isInteger(feeBps)) {
    throw new Error("feeBps must be a non-negative integer");
  }
  const bps = feeBps;
  if (bps > 10_000) {
    throw new Error("feeBps must be less than or equal to 10000");
  }
  const numerator = amount.mul(new BN(bps));
  return applyRounding(numerator, BPS_DENOMINATOR, rounding);
};

export const calculateFeeBreakdown = (
  grossLamports: BN | number | bigint,
  config: FeeConfig = {}
): FeeBreakdown => {
  const gross = normalizeLamports(grossLamports, "grossLamports");
  const rounding = config.rounding ?? "floor";

  const feeBps = config.feeBps ?? 0;
  const bpsFee = feeBps === 0 ? new BN(0) : calculateBpsFee(gross, feeBps, rounding);
  const flatFee = config.flatLamports
    ? normalizeLamports(config.flatLamports, "flatLamports")
    : new BN(0);
  let fee = bpsFee.add(flatFee);

  if (config.minFeeLamports !== undefined) {
    fee = bnMax(fee, normalizeLamports(config.minFeeLamports, "minFeeLamports"));
  }
  if (config.maxFeeLamports !== undefined) {
    fee = bnMin(fee, normalizeLamports(config.maxFeeLamports, "maxFeeLamports"));
  }

  if (fee.gt(gross)) {
    fee = gross;
  }

  return {
    grossLamports: gross,
    feeLamports: fee,
    netLamports: gross.sub(fee),
  };
};

export const calculateFeeTotals = (
  grossLamports: BN | number | bigint,
  config?: FeeConfig
): FeeTotals => {
  const breakdown = calculateFeeBreakdown(grossLamports, config ?? {});
  return {
    ...breakdown,
    totalLamports: breakdown.grossLamports.add(breakdown.feeLamports),
  };
};

export const calculatePricingAmount = (
  pricing: PricingModel,
  metrics: MetricInputs,
  rounding: FeeRounding = "floor"
): BN => {
  switch (pricing.type) {
    case "flat":
      return normalizeLamports(pricing.amountLamports, "amountLamports");
    case "perView": {
      const views = normalizeMetric(metrics.views, "views");
      const price = normalizeLamports(pricing.priceLamports, "priceLamports");
      return price.mul(views);
    }
    case "perImpression": {
      const impressions = normalizeMetric(metrics.impressions, "impressions");
      const price = normalizeLamports(pricing.priceLamports, "priceLamports");
      return price.mul(impressions);
    }
    case "cpm": {
      const impressions = normalizeMetric(metrics.impressions, "impressions");
      const price = normalizeLamports(pricing.priceLamports, "priceLamports");
      const numerator = price.mul(impressions);
      return applyRounding(numerator, THOUSAND, rounding);
    }
    default: {
      const exhaustiveCheck: never = pricing;
      return exhaustiveCheck;
    }
  }
};

export const calculateSettlementQuote = (
  pricing: PricingModel,
  metrics: MetricInputs,
  options: SettlementQuoteOptions = {}
): SettlementQuote => {
  const gross = calculatePricingAmount(
    pricing,
    metrics,
    options.pricingRounding ?? "floor"
  );
  const capLamports =
    options.capLamports !== undefined
      ? normalizeLamports(options.capLamports, "capLamports")
      : undefined;

  let cappedGross = gross;
  let capped = false;
  if (capLamports && gross.gt(capLamports)) {
    cappedGross = capLamports;
    capped = true;
  }

  const breakdown = calculateFeeBreakdown(cappedGross, options.fee ?? {});

  return {
    ...breakdown,
    capped,
    capLamports,
  };
};
