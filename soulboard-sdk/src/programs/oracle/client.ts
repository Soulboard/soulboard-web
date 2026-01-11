import {
  OracleContext,
  OracleContextConfig,
  createOracleContext,
} from "@soulboard/programs/oracle/context";
import { DeviceService } from "@soulboard/programs/oracle/services/device-service";

export type OracleClientConfig = OracleContextConfig;

export class OracleClient {
  readonly context: OracleContext;
  readonly devices: DeviceService;

  constructor(config: OracleClientConfig) {
    this.context = createOracleContext(config);
    this.devices = new DeviceService(this.context);
  }

  get provider() {
    return this.context.provider;
  }

  get program() {
    return this.context.program;
  }

  get programId() {
    return this.context.programId;
  }

  get events() {
    return this.context.events;
  }

  async onProgramLogs(
    handler: Parameters<OracleContext["events"]["subscribeToProgramLogs"]>[1]
  ) {
    return this.context.events.subscribeToProgramLogs(this.programId, handler);
  }

  async close(): Promise<void> {
    await this.context.events.closeAll();
  }
}
