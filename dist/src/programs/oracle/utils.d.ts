import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { SoulBoardOracle } from "@soulboard/types/soul_board_oracle";
import { OracleContext } from "@soulboard/programs/oracle/context";
export declare const resolveAuthority: (context: OracleContext, authority?: PublicKey) => PublicKey;
export declare const decodeAccount: <T>(program: Program<SoulBoardOracle>, name: string, data: Buffer) => T;
export declare const toBN: (value: BN | number | bigint) => BN;
