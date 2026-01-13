import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { AccountWithAddress, CampaignLocationAccount, CampaignBookingAccount, LocationAccount, LocationScheduleAccount, LocationStatus, OnchainPricingModel } from "@soulboard/programs/soulboard/types";
import { MetricInputs, PricingModel, SettlementQuote, SettlementQuoteOptions } from "@soulboard/programs/soulboard/fees";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
export declare class LocationService {
    private readonly context;
    constructor(context: SoulboardContext);
    register(name: string, description: string, priceLamports: BN | number | bigint, oracleAuthority: PublicKey, authority?: PublicKey): Promise<AccountWithAddress<LocationAccount>>;
    updateDetails(locationIdx: BN | number | bigint, name?: string | null, description?: string | null, authority?: PublicKey): Promise<AccountWithAddress<LocationAccount>>;
    updatePrice(locationIdx: BN | number | bigint, priceLamports: BN | number | bigint, authority?: PublicKey): Promise<AccountWithAddress<LocationAccount>>;
    setStatus(locationIdx: BN | number | bigint, status: LocationStatus, authority?: PublicKey): Promise<AccountWithAddress<LocationAccount>>;
    createLocationSchedule(locationIdx: BN | number | bigint, maxSlots: number, authority?: PublicKey): Promise<AccountWithAddress<LocationScheduleAccount>>;
    addLocationSlot(locationIdx: BN | number | bigint, startTs: BN | number | bigint, endTs: BN | number | bigint, priceLamports: BN | number | bigint, authority?: PublicKey): Promise<AccountWithAddress<LocationScheduleAccount>>;
    addCampaignLocation(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, providerAuthority: PublicKey, campaignAuthority?: PublicKey): Promise<AccountWithAddress<CampaignLocationAccount>>;
    bookLocationRange(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, rangeStartTs: BN | number | bigint, rangeEndTs: BN | number | bigint, deviceIdx: BN | number | bigint, pricingModel: OnchainPricingModel, providerAuthority: PublicKey, deviceAuthority: PublicKey, campaignAuthority?: PublicKey): Promise<AccountWithAddress<CampaignBookingAccount>>;
    cancelLocationBooking(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, rangeStartTs: BN | number | bigint, rangeEndTs: BN | number | bigint, providerAuthority: PublicKey, campaignAuthority?: PublicKey): Promise<void>;
    settleLocationBooking(campaignIdx: BN | number | bigint, locationIdx: BN | number | bigint, rangeStartTs: BN | number | bigint, rangeEndTs: BN | number | bigint, providerAuthority: PublicKey, campaignAuthority: PublicKey, oracleAuthority?: PublicKey, locationAuthority?: PublicKey): Promise<void>;
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
    fetchLocationSchedule(providerAuthority: PublicKey, locationIdx: BN | number | bigint): Promise<AccountWithAddress<LocationScheduleAccount>>;
    fetchLocationScheduleByAddress(address: PublicKey): Promise<LocationScheduleAccount>;
    fetchCampaignBooking(campaignAuthority: PublicKey, campaignIdx: BN | number | bigint, providerAuthority: PublicKey, locationIdx: BN | number | bigint, rangeStartTs: BN | number | bigint, rangeEndTs: BN | number | bigint): Promise<AccountWithAddress<CampaignBookingAccount>>;
    fetchCampaignBookingByAddress(address: PublicKey): Promise<CampaignBookingAccount>;
    list(): Promise<AccountWithAddress<LocationAccount>[]>;
    listCampaignLocations(): Promise<AccountWithAddress<CampaignLocationAccount>[]>;
    onChange(providerAuthority: PublicKey, locationIdx: BN | number | bigint, handler: (location: AccountWithAddress<LocationAccount>) => void): Promise<() => Promise<void>>;
    onCampaignLocationChange(campaignAuthority: PublicKey, campaignIdx: BN | number | bigint, providerAuthority: PublicKey, locationIdx: BN | number | bigint, handler: (booking: AccountWithAddress<CampaignLocationAccount>) => void): Promise<() => Promise<void>>;
}
//# sourceMappingURL=location-service.d.ts.map