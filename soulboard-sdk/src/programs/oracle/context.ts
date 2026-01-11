import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { Commitment, PublicKey } from "@solana/web3.js";
import oracleIdl from "@soulboard/idl/soul_board_oracle.json";
import { SoulBoardOracle } from "@soulboard/types/soul_board_oracle";
import { EventSubscriptionManager } from "@soulboard/core/events";
import { mapToSdkError } from "@soulboard/core/errors";
import { ProviderInput, resolveProvider } from "@soulboard/core/provider";
import { TransactionExecutor } from "@soulboard/core/transactions";
import { SOULBOARD_ORACLE_PROGRAM_ID } from "@soulboard/programs/oracle/pdas";

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

export const createOracleContext = (
  config: OracleContextConfig
): OracleContext => {
  const provider = resolveProvider(config.provider);
  const programId = config.programId ?? SOULBOARD_ORACLE_PROGRAM_ID;

  const idl = {
    ...(oracleIdl as SoulBoardOracle),
    address: programId.toBase58(),
  };
  const program = new Program(idl, provider) as any as Program<SoulBoardOracle>;

  const commitment =
    config.commitment ??
    provider.connection.commitment ??
    provider.opts?.commitment ??
    "confirmed";
  const events = new EventSubscriptionManager(provider.connection, commitment);
  const executor = new TransactionExecutor(mapToSdkError);

  return { provider, program, programId, events, executor };
};
