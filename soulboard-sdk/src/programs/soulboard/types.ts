import { IdlAccounts, IdlTypes } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { Soulboard } from "@soulboard/types/soulboard";

export type AdvertiserAccount = IdlAccounts<Soulboard>["advertiser"];
export type CampaignAccount = IdlAccounts<Soulboard>["campaign"];
export type ProviderAccount = IdlAccounts<Soulboard>["provider"];
export type LocationAccount = IdlAccounts<Soulboard>["location"];
export type LocationStatus = IdlTypes<Soulboard>["locationStatus"];
export type LocationBooking = IdlTypes<Soulboard>["locationBooking"];

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
