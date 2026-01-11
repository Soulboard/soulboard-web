import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { AccountWithAddress, CampaignLocationAccount, LocationAccount, LocationStatus } from "@soulboard/programs/soulboard/types";
import { MetricInputs, PricingModel, SettlementQuote, SettlementQuoteOptions } from "@soulboard/programs/soulboard/fees";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
export declare class LocationService {
    private readonly context;
    constructor(context: SoulboardContext);
    register(name: string, description: string, priceLamports: BN | number | bigint, oracleAuthority: PublicKey, authority?: PublicKey): Promise<AccountWithAddress<LocationAccount>>;
    updateDetails(locationIdx: BN | number | bigint, name?: string | null, description?: string | null, authority?: PublicKey): Promise<AccountWithAddress<LocationAccount>>;
    updatePrice(locationIdx: BN | number | bigint, priceLamports: BN | number | bigint, authority?: PublicKey): Promise<AccountWithAddress<LocationAccount>>;
    setStatus(locationIdx: BN | number | bigint, status: LocationStatus, authority?: PublicKey): Promise<AccountWithAddress<LocationAccount>>;
    addCampaignLocation(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, providerAuthority: PublicKey, campaignAuthority?: PublicKey): Promise<AccountWithAddress<CampaignLocationAccount>>;
    removeCampaignLocation(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, providerAuthority: PublicKey, campaignAuthority?: PublicKey): Promise<AccountWithAddress<CampaignLocationAccount>>;
    settleCampaignLocation(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, settlementAmount: BN | number | bigint, providerAuthority: PublicKey, campaignAuthority: PublicKey, oracleAuthority?: PublicKey, locationAuthority?: PublicKey): Promise<AccountWithAddress<CampaignLocationAccount>>;
    quoteSettlement(pricing: PricingModel, metrics: MetricInputs, options?: SettlementQuoteOptions): SettlementQuote;
    settleCampaignLocationWithPricing(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, pricing: PricingModel, metrics: MetricInputs, providerAuthority: PublicKey, campaignAuthority: PublicKey, oracleAuthority?: PublicKey, locationAuthority?: PublicKey, options?: SettlementQuoteOptions): Promise<{
        account: AccountWithAddress<CampaignLocationAccount>;
        quote: SettlementQuote;
    }>;
    book(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, providerAuthority: PublicKey, campaignAuthority?: PublicKey): Promise<AccountWithAddress<CampaignLocationAccount>>;
    cancelBooking(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, providerAuthority: PublicKey, campaignAuthority?: PublicKey): Promise<AccountWithAddress<CampaignLocationAccount>>;
    fetch(providerAuthority: PublicKey, locationIdx: BN | number | bigint): Promise<AccountWithAddress<LocationAccount>>;
    fetchByAddress(address: PublicKey): Promise<LocationAccount>;
    fetchCampaignLocation(campaignAuthority: PublicKey, campaignIdx: BN | number | bigint, providerAuthority: PublicKey, locationIdx: BN | number | bigint): Promise<AccountWithAddress<CampaignLocationAccount>>;
    fetchCampaignLocationByAddress(address: PublicKey): Promise<CampaignLocationAccount>;
    list(): Promise<AccountWithAddress<LocationAccount>[]>;
    listCampaignLocations(): Promise<AccountWithAddress<CampaignLocationAccount>[]>;
    onChange(providerAuthority: PublicKey, locationIdx: BN | number | bigint, handler: (location: AccountWithAddress<LocationAccount>) => void): Promise<() => Promise<void>>;
    onCampaignLocationChange(campaignAuthority: PublicKey, campaignIdx: BN | number | bigint, providerAuthority: PublicKey, locationIdx: BN | number | bigint, handler: (booking: AccountWithAddress<CampaignLocationAccount>) => void): Promise<() => Promise<void>>;
}
