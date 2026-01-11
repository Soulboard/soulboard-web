import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Commitment, PublicKey } from "@solana/web3.js";
import { Soulboard } from "@soulboard/types/soulboard";
import { EventSubscriptionManager } from "@soulboard/core/events";
import { ProviderInput } from "@soulboard/core/provider";
import { TransactionExecutor } from "@soulboard/core/transactions";
export interface SoulboardContextConfig {
    provider: ProviderInput;
    commitment?: Commitment;
    programId?: PublicKey;
}
export interface SoulboardContext {
    provider: AnchorProvider;
    program: Program<Soulboard>;
    programId: PublicKey;
    events: EventSubscriptionManager;
    executor: TransactionExecutor;
}
export declare const createSoulboardContext: (config: SoulboardContextConfig) => SoulboardContext;
//# sourceMappingURL=context.d.ts.map