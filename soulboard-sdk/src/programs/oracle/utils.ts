import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { resolveAuthority as resolveProviderAuthority } from "@soulboard/core/provider";
import { SoulBoardOracle } from "@soulboard/types/soul_board_oracle";
import { OracleContext } from "@soulboard/programs/oracle/context";

export const resolveAuthority = (context: OracleContext, authority?: PublicKey): PublicKey =>
  resolveProviderAuthority(context.provider, authority);

export const decodeAccount = <T>(
  program: Program<SoulBoardOracle>,
  name: string,
  data: Buffer
): T => program.coder.accounts.decode<T>(name, data);
