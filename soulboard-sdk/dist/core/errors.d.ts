export declare class SdkError extends Error {
    readonly cause?: unknown;
    constructor(message: string, cause?: unknown);
}
export declare class MissingWalletError extends SdkError {
    constructor();
}
export declare class AccountNotFoundError extends SdkError {
    readonly account: string;
    constructor(account: string, cause?: unknown);
}
export declare class InvalidArgumentError extends SdkError {
    constructor(message: string, cause?: unknown);
}
export declare class TransactionFailedError extends SdkError {
    readonly logs?: string[];
    constructor(message: string, logs?: string[], cause?: unknown);
}
export declare const mapToSdkError: (error: unknown, context?: string) => SdkError;
//# sourceMappingURL=errors.d.ts.map