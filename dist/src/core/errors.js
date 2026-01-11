"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToSdkError = exports.TransactionFailedError = exports.InvalidArgumentError = exports.AccountNotFoundError = exports.MissingWalletError = exports.SdkError = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
class SdkError extends Error {
    constructor(message, cause) {
        super(message);
        this.cause = cause;
        this.name = "SdkError";
    }
}
exports.SdkError = SdkError;
class MissingWalletError extends SdkError {
    constructor() {
        super("Wallet is required to sign and send transactions");
        this.name = "MissingWalletError";
    }
}
exports.MissingWalletError = MissingWalletError;
class AccountNotFoundError extends SdkError {
    constructor(account, cause) {
        super(`Account ${account} not found`, cause);
        this.account = account;
        this.name = "AccountNotFoundError";
    }
}
exports.AccountNotFoundError = AccountNotFoundError;
class InvalidArgumentError extends SdkError {
    constructor(message, cause) {
        super(message, cause);
        this.name = "InvalidArgumentError";
    }
}
exports.InvalidArgumentError = InvalidArgumentError;
class TransactionFailedError extends SdkError {
    constructor(message, logs, cause) {
        super(message, cause);
        this.logs = logs;
        this.name = "TransactionFailedError";
    }
}
exports.TransactionFailedError = TransactionFailedError;
const mapToSdkError = (error, context) => {
    if (error instanceof SdkError) {
        return error;
    }
    if (error instanceof anchor_1.AnchorError) {
        const message = context
            ? `${context} failed: ${error.error.errorMessage}`
            : error.error.errorMessage;
        return new TransactionFailedError(message, error.logs ?? [], error);
    }
    if (error instanceof web3_js_1.SendTransactionError) {
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
exports.mapToSdkError = mapToSdkError;
