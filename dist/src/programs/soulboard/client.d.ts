import { PublicKey } from "@solana/web3.js";
import { SoulboardContext, SoulboardContextConfig } from "@soulboard/programs/soulboard/context";
import { AdvertiserService } from "@soulboard/programs/soulboard/services/advertiser-service";
import { CampaignService } from "@soulboard/programs/soulboard/services/campaign-service";
import { ProviderService } from "@soulboard/programs/soulboard/services/provider-service";
import { LocationService } from "@soulboard/programs/soulboard/services/location-service";
export type SoulboardClientConfig = SoulboardContextConfig;
export declare class SoulboardClient {
    readonly context: SoulboardContext;
    readonly advertisers: AdvertiserService;
    readonly campaigns: CampaignService;
    readonly providers: ProviderService;
    readonly locations: LocationService;
    constructor(config: SoulboardClientConfig);
    get provider(): import("@coral-xyz/anchor").AnchorProvider;
    get program(): import("@coral-xyz/anchor").Program<import("../../types/soulboard").Soulboard>;
    get programId(): PublicKey;
    get events(): import("../..").EventSubscriptionManager;
    onProgramLogs(handler: Parameters<SoulboardContext["events"]["subscribeToProgramLogs"]>[1]): Promise<() => Promise<void>>;
    close(): Promise<void>;
}
