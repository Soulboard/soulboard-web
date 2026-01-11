"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSettlementQuote = exports.calculatePricingAmount = exports.calculateFeeTotals = exports.calculateFeeBreakdown = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const utils_1 = require("./utils");
const BPS_DENOMINATOR = new anchor_1.BN(10_000);
const THOUSAND = new anchor_1.BN(1_000);
const bnMax = (left, right) => (left.gt(right) ? left : right);
const bnMin = (left, right) => (left.lt(right) ? left : right);
const assertIntegerNumber = (value, field) => {
    if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
        throw new Error(`${field} must be a non-negative integer`);
    }
};
const normalizeLamports = (value, field) => {
    if (typeof value === "number") {
        assertIntegerNumber(value, field);
    }
    const result = (0, utils_1.toBN)(value);
    if (result.isNeg()) {
        throw new Error(`${field} must be non-negative`);
    }
    return result;
};
const normalizeMetric = (value, field) => {
    if (value === undefined) {
        throw new Error(`${field} is required for this pricing model`);
    }
    if (typeof value === "number") {
        assertIntegerNumber(value, field);
    }
    const result = (0, utils_1.toBN)(value);
    if (result.isNeg()) {
        throw new Error(`${field} must be a non-negative integer`);
    }
    return result;
};
const applyRounding = (numerator, denominator, rounding) => {
    if (rounding === "ceil") {
        return numerator.add(denominator.subn(1)).div(denominator);
    }
    if (rounding === "round") {
        return numerator.add(denominator.divn(2)).div(denominator);
    }
    return numerator.div(denominator);
};
const calculateBpsFee = (amount, feeBps, rounding) => {
    if (!Number.isFinite(feeBps) || feeBps < 0 || !Number.isInteger(feeBps)) {
        throw new Error("feeBps must be a non-negative integer");
    }
    const bps = feeBps;
    if (bps > 10_000) {
        throw new Error("feeBps must be less than or equal to 10000");
    }
    const numerator = amount.mul(new anchor_1.BN(bps));
    return applyRounding(numerator, BPS_DENOMINATOR, rounding);
};
const calculateFeeBreakdown = (grossLamports, config = {}) => {
    const gross = normalizeLamports(grossLamports, "grossLamports");
    const rounding = config.rounding ?? "floor";
    const feeBps = config.feeBps ?? 0;
    const bpsFee = feeBps === 0 ? new anchor_1.BN(0) : calculateBpsFee(gross, feeBps, rounding);
    const flatFee = config.flatLamports
        ? normalizeLamports(config.flatLamports, "flatLamports")
        : new anchor_1.BN(0);
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
exports.calculateFeeBreakdown = calculateFeeBreakdown;
const calculateFeeTotals = (grossLamports, config) => {
    const breakdown = (0, exports.calculateFeeBreakdown)(grossLamports, config ?? {});
    return {
        ...breakdown,
        totalLamports: breakdown.grossLamports.add(breakdown.feeLamports),
    };
};
exports.calculateFeeTotals = calculateFeeTotals;
const calculatePricingAmount = (pricing, metrics, rounding = "floor") => {
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
            const exhaustiveCheck = pricing;
            return exhaustiveCheck;
        }
    }
};
exports.calculatePricingAmount = calculatePricingAmount;
const calculateSettlementQuote = (pricing, metrics, options = {}) => {
    const gross = (0, exports.calculatePricingAmount)(pricing, metrics, options.pricingRounding ?? "floor");
    const capLamports = options.capLamports !== undefined
        ? normalizeLamports(options.capLamports, "capLamports")
        : undefined;
    let cappedGross = gross;
    let capped = false;
    if (capLamports && gross.gt(capLamports)) {
        cappedGross = capLamports;
        capped = true;
    }
    const breakdown = (0, exports.calculateFeeBreakdown)(cappedGross, options.fee ?? {});
    return {
        ...breakdown,
        capped,
        capLamports,
    };
};
exports.calculateSettlementQuote = calculateSettlementQuote;
//# sourceMappingURL=fees.js.map