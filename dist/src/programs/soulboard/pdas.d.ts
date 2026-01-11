import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export declare const SOULBOARD_PROGRAM_ID: PublicKey;
export declare const findAdvertiserPda: (authority: PublicKey, programId?: PublicKey) => [PublicKey, number];
export declare const findCampaignPda: (authority: PublicKey, campaignIdx: BN | number | bigint, programId?: PublicKey) => [PublicKey, number];
export declare const findProviderPda: (authority: PublicKey, programId?: PublicKey) => [PublicKey, number];
export declare const findLocationPda: (authority: PublicKey, locationIdx: BN | number | bigint, programId?: PublicKey) => [PublicKey, number];
export declare const findCampaignLocationPda: (campaign: PublicKey, location: PublicKey, programId?: PublicKey) => [PublicKey, number];
