import { IdlAccounts, IdlTypes } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Soulboard } from "@soulboard/types/soulboard";

export type AdvertiserAccount = IdlAccounts<Soulboard>["advertiser"];
export type CampaignAccount = IdlAccounts<Soulboard>["campaign"];
export type CampaignLocationAccount =
  IdlAccounts<Soulboard>["campaignLocation"];
export type ProviderAccount = IdlAccounts<Soulboard>["provider"];
export type LocationAccount = IdlAccounts<Soulboard>["location"];
export type CampaignStatus = IdlTypes<Soulboard>["campaignStatus"];
export type CampaignLocationStatus =
  IdlTypes<Soulboard>["campaignLocationStatus"];
export type LocationStatus = IdlTypes<Soulboard>["locationStatus"];

export interface CampaignMetadata {
  name: string;
  description: string;
  imageUrl: string;
}

export interface AccountWithAddress<T> {
  address: PublicKey;
  data: T;
}

export interface BudgetChange {
  lamports: BN | number | bigint;
}
