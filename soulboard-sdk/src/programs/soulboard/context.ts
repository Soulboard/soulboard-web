import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Commitment, PublicKey } from "@solana/web3.js";
import soulboardIdl from "@soulboard/idl/soulboard.json";
import { Soulboard } from "@soulboard/types/soulboard";
import { EventSubscriptionManager } from "@soulboard/core/events";
import { mapToSdkError } from "@soulboard/core/errors";
import { ProviderInput, resolveProvider } from "@soulboard/core/provider";
import { TransactionExecutor } from "@soulboard/core/transactions";
import { SOULBOARD_PROGRAM_ID } from "@soulboard/programs/soulboard/pdas";

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

export const createSoulboardContext = (config: SoulboardContextConfig): SoulboardContext => {
  const provider = resolveProvider(config.provider);
  const programId = config.programId ?? SOULBOARD_PROGRAM_ID;
  
  // Create program with IDL and provider
  const program = new Program(
    soulboardIdl as Soulboard,
    provider
  );
  
  const commitment =
    config.commitment ??
    provider.connection.commitment ??
    provider.opts?.commitment ??
    "confirmed";
  const events = new EventSubscriptionManager(provider.connection, commitment);
  const executor = new TransactionExecutor(mapToSdkError);

  return { provider, program, programId, events, executor };
};
