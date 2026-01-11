import { BN, Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { resolveAuthority as resolveProviderAuthority } from "@soulboard/core/provider";
import { Soulboard } from "@soulboard/types/soulboard";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";

export const resolveAuthority = (
  context: SoulboardContext,
  authority?: PublicKey
): PublicKey => resolveProviderAuthority(context.provider, authority);

export const toBN = (value: BN | number | bigint): BN => {
  if (BN.isBN(value)) {
    return value;
  }
  return new BN(value.toString());
};

export const decodeAccount = <T>(
  program: Program<Soulboard>,
  name: string,
  data: Buffer
): T => program.coder.accounts.decode<T>(name, data);
