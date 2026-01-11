import { mapToSdkError, SdkError } from "@soulboard/core/errors";

export class TransactionExecutor {
  constructor(
    private readonly mapError: (
      error: unknown,
      context?: string
    ) => SdkError = mapToSdkError
  ) {}

  async run<T>(label: string, operation: () => Promise<T>): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      throw this.mapError(error, label);
    }
  }
}
