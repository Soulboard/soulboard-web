import { BN } from "@coral-xyz/anchor";
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
export type PricingModel = {
    type: "flat";
    amountLamports: BN | number | bigint;
} | {
    type: "perView";
    priceLamports: BN | number | bigint;
} | {
    type: "perImpression";
    priceLamports: BN | number | bigint;
} | {
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
export declare const calculateFeeBreakdown: (grossLamports: BN | number | bigint, config?: FeeConfig) => FeeBreakdown;
export declare const calculateFeeTotals: (grossLamports: BN | number | bigint, config?: FeeConfig) => FeeTotals;
export declare const calculatePricingAmount: (pricing: PricingModel, metrics: MetricInputs, rounding?: FeeRounding) => BN;
export declare const calculateSettlementQuote: (pricing: PricingModel, metrics: MetricInputs, options?: SettlementQuoteOptions) => SettlementQuote;
