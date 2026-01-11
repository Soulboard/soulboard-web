import { AccountInfo, Commitment, Connection, Logs, PublicKey } from "@solana/web3.js";
export type AccountChangeHandler = (accountInfo: AccountInfo<Buffer>) => void;
export type LogHandler = (logs: Logs) => void;
export declare class EventSubscriptionManager {
    private readonly connection;
    private readonly commitment;
    private readonly accountSubscriptions;
    private readonly logSubscriptions;
    constructor(connection: Connection, commitment?: Commitment);
    subscribeToAccount(address: PublicKey, handler: AccountChangeHandler): Promise<() => Promise<void>>;
    subscribeToProgramLogs(programId: PublicKey, handler: LogHandler): Promise<() => Promise<void>>;
    closeAll(): Promise<void>;
}
