import { AccountInfo, Commitment, Connection, Logs, PublicKey } from "@solana/web3.js";

export type AccountChangeHandler = (accountInfo: AccountInfo<Buffer>) => void;
export type LogHandler = (logs: Logs) => void;

export class EventSubscriptionManager {
  private readonly accountSubscriptions = new Map<number, PublicKey>();
  private readonly logSubscriptions = new Map<number, PublicKey>();

  constructor(
    private readonly connection: Connection,
    private readonly commitment: Commitment = "confirmed"
  ) {}

  async subscribeToAccount(address: PublicKey, handler: AccountChangeHandler): Promise<() => Promise<void>> {
    const id = await this.connection.onAccountChange(address, handler, this.commitment);
    this.accountSubscriptions.set(id, address);

    return async () => {
      await this.connection.removeAccountChangeListener(id);
      this.accountSubscriptions.delete(id);
    };
  }

  async subscribeToProgramLogs(programId: PublicKey, handler: LogHandler): Promise<() => Promise<void>> {
    const id = await this.connection.onLogs(programId, handler, this.commitment);
    this.logSubscriptions.set(id, programId);

    return async () => {
      await this.connection.removeOnLogsListener(id);
      this.logSubscriptions.delete(id);
    };
  }

  async closeAll(): Promise<void> {
    const accountRemovals = [...this.accountSubscriptions.keys()].map((id) =>
      this.connection.removeAccountChangeListener(id)
    );
    const logRemovals = [...this.logSubscriptions.keys()].map((id) =>
      this.connection.removeOnLogsListener(id)
    );

    await Promise.all([...accountRemovals, ...logRemovals]);
    this.accountSubscriptions.clear();
    this.logSubscriptions.clear();
  }
}
