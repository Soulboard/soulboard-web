import { PublicKey } from "@solana/web3.js";
import { AccountNotFoundError, mapToSdkError } from "@soulboard/core/errors";

const ACCOUNT_NOT_FOUND = /account does not exist/i;

export const fetchAccountOrThrow = async <T>(
  label: string,
  address: PublicKey,
  fetcher: () => Promise<T>
): Promise<T> => {
  try {
    return await fetcher();
  } catch (error) {
    if (error instanceof Error && ACCOUNT_NOT_FOUND.test(error.message)) {
      throw new AccountNotFoundError(address.toBase58(), error);
    }
    throw mapToSdkError(error, label);
  }
};
