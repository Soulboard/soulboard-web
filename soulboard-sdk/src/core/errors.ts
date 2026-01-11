import { AnchorError } from "@coral-xyz/anchor";
import { SendTransactionError } from "@solana/web3.js";

export class SdkError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message);
    this.name = "SdkError";
  }
}

export class MissingWalletError extends SdkError {
  constructor() {
    super("Wallet is required to sign and send transactions");
    this.name = "MissingWalletError";
  }
}

export class AccountNotFoundError extends SdkError {
  constructor(public readonly account: string, cause?: unknown) {
    super(`Account ${account} not found`, cause);
    this.name = "AccountNotFoundError";
  }
}

export class InvalidArgumentError extends SdkError {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
    this.name = "InvalidArgumentError";
  }
}

export class TransactionFailedError extends SdkError {
  constructor(
    message: string,
    public readonly logs?: string[],
    cause?: unknown
  ) {
    super(message, cause);
    this.name = "TransactionFailedError";
  }
}

export const mapToSdkError = (error: unknown, context?: string): SdkError => {
  if (error instanceof SdkError) {
    return error;
  }

  if (error instanceof AnchorError) {
    const message = context
      ? `${context} failed: ${error.error.errorMessage}`
      : error.error.errorMessage;
    return new TransactionFailedError(message, error.logs ?? [], error);
  }

  if (error instanceof SendTransactionError) {
    const message = context
      ? `${context} failed: ${error.message}`
      : error.message;
    return new TransactionFailedError(message, error.logs ?? [], error);
  }

  if (error instanceof Error) {
    const message = context
      ? `${context} failed: ${error.message}`
      : error.message;
    return new SdkError(message, error);
  }

  return new SdkError(context ?? "Unknown error", error);
};
