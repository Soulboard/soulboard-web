import { SdkError } from "@soulboard/core/errors";
export declare class TransactionExecutor {
    private readonly mapError;
    constructor(mapError?: (error: unknown, context?: string) => SdkError);
    run<T>(label: string, operation: () => Promise<T>): Promise<T>;
}
