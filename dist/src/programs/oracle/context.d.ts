import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Commitment, PublicKey } from "@solana/web3.js";
import { SoulBoardOracle } from "@soulboard/types/soul_board_oracle";
import { EventSubscriptionManager } from "@soulboard/core/events";
import { ProviderInput } from "@soulboard/core/provider";
import { TransactionExecutor } from "@soulboard/core/transactions";
export interface OracleContextConfig {
    provider: ProviderInput;
    commitment?: Commitment;
    programId?: PublicKey;
}
export interface OracleContext {
    provider: AnchorProvider;
    program: Program<SoulBoardOracle>;
    programId: PublicKey;
    events: EventSubscriptionManager;
    executor: TransactionExecutor;
}
export declare const createOracleContext: (config: OracleContextConfig) => OracleContext;
