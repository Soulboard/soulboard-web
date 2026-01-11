import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
export declare const SOULBOARD_ORACLE_PROGRAM_ID: PublicKey;
export declare const findRegistryPda: (authority: PublicKey, programId?: PublicKey) => [PublicKey, number];
export declare const findDevicePda: (authority: PublicKey, deviceIdx: BN | number | bigint, programId?: PublicKey) => [PublicKey, number];
