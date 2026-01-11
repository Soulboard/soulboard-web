import { PublicKey } from "@solana/web3.js";
import {
  SoulboardContext,
  SoulboardContextConfig,
  createSoulboardContext,
} from "@soulboard/programs/soulboard/context";
import { AdvertiserService } from "@soulboard/programs/soulboard/services/advertiser-service";
import { CampaignService } from "@soulboard/programs/soulboard/services/campaign-service";
import { ProviderService } from "@soulboard/programs/soulboard/services/provider-service";
import { LocationService } from "@soulboard/programs/soulboard/services/location-service";

export type SoulboardClientConfig = SoulboardContextConfig;

export class SoulboardClient {
  readonly context: SoulboardContext;
  readonly advertisers: AdvertiserService;
  readonly campaigns: CampaignService;
  readonly providers: ProviderService;
  readonly locations: LocationService;

  constructor(config: SoulboardClientConfig) {
    this.context = createSoulboardContext(config);
    this.advertisers = new AdvertiserService(this.context);
    this.campaigns = new CampaignService(this.context);
    this.providers = new ProviderService(this.context);
    this.locations = new LocationService(this.context);
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
    handler: Parameters<SoulboardContext["events"]["subscribeToProgramLogs"]>[1]
  ) {
    return this.context.events.subscribeToProgramLogs(this.programId, handler);
  }

  async close(): Promise<void> {
    await this.context.events.closeAll();
  }
}
