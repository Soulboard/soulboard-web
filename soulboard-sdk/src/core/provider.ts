import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Commitment, ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
import { MissingWalletError } from "@soulboard/core/errors";

export interface ProviderConfig {
  connection: Connection | string;
  wallet: Wallet;
  opts?: ConfirmOptions;
  commitment?: Commitment;
}

export type ProviderInput = AnchorProvider | ProviderConfig;

export const createProvider = (config: ProviderConfig): AnchorProvider => {
  const commitment = config.commitment ?? "confirmed";
  const connection =
    typeof config.connection === "string"
      ? new Connection(config.connection, commitment)
      : config.connection;

  const opts = config.opts ?? AnchorProvider.defaultOptions();
  return new AnchorProvider(connection, config.wallet, {
    ...opts,
    commitment,
  });
};

export const resolveProvider = (input: ProviderInput): AnchorProvider =>
  input instanceof AnchorProvider ? input : createProvider(input);

export const getProviderWallet = (provider: AnchorProvider): PublicKey => {
  const wallet = provider.wallet?.publicKey;
  if (!wallet) {
    throw new MissingWalletError();
  }
  return wallet;
};

export const resolveAuthority = (
  provider: AnchorProvider,
  authority?: PublicKey
): PublicKey => authority ?? getProviderWallet(provider);
