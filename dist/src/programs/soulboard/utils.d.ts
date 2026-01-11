import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { Soulboard } from "@soulboard/types/soulboard";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
export declare const resolveAuthority: (context: SoulboardContext, authority?: PublicKey) => PublicKey;
export declare const toBN: (value: BN | number | bigint) => BN;
export declare const decodeAccount: <T>(program: Program<Soulboard>, name: string, data: Buffer) => T;
