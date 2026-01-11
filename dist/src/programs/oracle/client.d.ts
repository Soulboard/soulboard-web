import { OracleContext, OracleContextConfig } from "@soulboard/programs/oracle/context";
import { DeviceService } from "@soulboard/programs/oracle/services/device-service";
export type OracleClientConfig = OracleContextConfig;
export declare class OracleClient {
    readonly context: OracleContext;
    readonly devices: DeviceService;
    constructor(config: OracleClientConfig);
    get provider(): import("@coral-xyz/anchor").AnchorProvider;
    get program(): import("@coral-xyz/anchor").Program<import("../../types/soul_board_oracle").SoulBoardOracle>;
    get programId(): import("@solana/web3.js").PublicKey;
    get events(): import("../..").EventSubscriptionManager;
    onProgramLogs(handler: Parameters<OracleContext["events"]["subscribeToProgramLogs"]>[1]): Promise<() => Promise<void>>;
    close(): Promise<void>;
}
