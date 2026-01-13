import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { fetchAccountOrThrow } from "@soulboard/core/accounts";
import {
  AccountWithAddress,
  CampaignLocationAccount,
  CampaignBookingAccount,
  LocationAccount,
  LocationScheduleAccount,
  LocationStatus,
  OnchainPricingModel,
  SoulboardConfigAccount,
} from "@soulboard/programs/soulboard/types";
import {
  calculateSettlementQuote,
  MetricInputs,
  PricingModel,
  SettlementQuote,
  SettlementQuoteOptions,
} from "@soulboard/programs/soulboard/fees";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
import {
  findCampaignLocationPda,
  findCampaignBookingPda,
  findCampaignPda,
  findLocationPda,
  findLocationSchedulePda,
  findProviderPda,
  findSoulboardConfigPda,
} from "@soulboard/programs/soulboard/pdas";
import {
  decodeAccount,
  resolveAuthority,
  toBN,
} from "@soulboard/programs/soulboard/utils";
import { findDevicePda } from "@soulboard/programs/oracle/pdas";

export class LocationService {
  constructor(private readonly context: SoulboardContext) {}

  async register(
    name: string,
    description: string,
    priceLamports: BN | number | bigint,
    oracleAuthority: PublicKey,
    authority?: PublicKey
  ): Promise<AccountWithAddress<LocationAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [provider] = findProviderPda(signer, this.context.programId);
    const providerData = await fetchAccountOrThrow(
      "fetchProvider",
      provider,
      () => this.context.program.account.provider.fetch(provider)
    );
    const [location] = findLocationPda(
      signer,
      providerData.lastLocationId,
      this.context.programId
    );

    await this.context.executor.run("registerLocation", () =>
      this.context.program.methods
        .registerLocation(
          name,
          description,
          toBN(priceLamports),
          oracleAuthority
        )
        .accounts({
          authority: signer,
          provider,
          location,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(location);
    return { address: location, data };
  }

  async updateDetails(
    locationIdx: BN | number | bigint,
    name?: string | null,
    description?: string | null,
    authority?: PublicKey
  ): Promise<AccountWithAddress<LocationAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [provider] = findProviderPda(signer, this.context.programId);
    const [location] = findLocationPda(
      signer,
      locationIdx,
      this.context.programId
    );

    await this.context.executor.run("updateLocationDetails", () =>
      this.context.program.methods
        .updateLocationDetails(
          toBN(locationIdx),
          name ?? null,
          description ?? null
        )
        .accounts({
          authority: signer,
          provider,
          location,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(location);
    return { address: location, data };
  }

  async updatePrice(
    locationIdx: BN | number | bigint,
    priceLamports: BN | number | bigint,
    authority?: PublicKey
  ): Promise<AccountWithAddress<LocationAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [provider] = findProviderPda(signer, this.context.programId);
    const [location] = findLocationPda(
      signer,
      locationIdx,
      this.context.programId
    );

    await this.context.executor.run("updateLocationPrice", () =>
      this.context.program.methods
        .updateLocationPrice(toBN(locationIdx), toBN(priceLamports))
        .accounts({
          authority: signer,
          provider,
          location,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(location);
    return { address: location, data };
  }

  async setStatus(
    locationIdx: BN | number | bigint,
    status: LocationStatus,
    authority?: PublicKey
  ): Promise<AccountWithAddress<LocationAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [provider] = findProviderPda(signer, this.context.programId);
    const [location] = findLocationPda(
      signer,
      locationIdx,
      this.context.programId
    );

    await this.context.executor.run("setLocationStatus", () =>
      this.context.program.methods
        .setLocationStatus(toBN(locationIdx), status)
        .accounts({
          authority: signer,
          provider,
          location,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(location);
    return { address: location, data };
  }

  async createLocationSchedule(
    locationIdx: BN | number | bigint,
    maxSlots: number,
    authority?: PublicKey
  ): Promise<AccountWithAddress<LocationScheduleAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [provider] = findProviderPda(signer, this.context.programId);
    const [location] = findLocationPda(
      signer,
      locationIdx,
      this.context.programId
    );
    const [schedule] = findLocationSchedulePda(
      location,
      this.context.programId
    );

    await this.context.executor.run("createLocationSchedule", () =>
      this.context.program.methods
        .createLocationSchedule(toBN(locationIdx), maxSlots)
        .accounts({
          authority: signer,
          provider,
          location,
          schedule,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchLocationScheduleByAddress(schedule);
    return { address: schedule, data };
  }

  async addLocationSlot(
    locationIdx: BN | number | bigint,
    startTs: BN | number | bigint,
    endTs: BN | number | bigint,
    priceLamports: BN | number | bigint,
    authority?: PublicKey
  ): Promise<AccountWithAddress<LocationScheduleAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [provider] = findProviderPda(signer, this.context.programId);
    const [location] = findLocationPda(
      signer,
      locationIdx,
      this.context.programId
    );
    const [schedule] = findLocationSchedulePda(
      location,
      this.context.programId
    );

    await this.context.executor.run("addLocationSlot", () =>
      this.context.program.methods
        .addLocationSlot(
          toBN(locationIdx),
          toBN(startTs),
          toBN(endTs),
          toBN(priceLamports)
        )
        .accounts({
          authority: signer,
          provider,
          location,
          schedule,
        })
        .rpc()
    );

    const data = await this.fetchLocationScheduleByAddress(schedule);
    return { address: schedule, data };
  }

  async addCampaignLocation(
    campaignIdx: BN | number | bigint,
    locationIdx: BN | number | bigint,
    providerAuthority: PublicKey,
    campaignAuthority?: PublicKey
  ): Promise<AccountWithAddress<CampaignLocationAccount>> {
    const signer = resolveAuthority(this.context, campaignAuthority);
    const [campaign] = findCampaignPda(
      signer,
      campaignIdx,
      this.context.programId
    );
    const [provider] = findProviderPda(
      providerAuthority,
      this.context.programId
    );
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [campaignLocation] = findCampaignLocationPda(
      campaign,
      location,
      this.context.programId
    );

    await this.context.executor.run("addCampaignLocation", () =>
      this.context.program.methods
        .addCampaignLocation(toBN(campaignIdx), toBN(locationIdx))
        .accounts({
          authority: signer,
          provider,
          campaign,
          location,
          campaignLocation,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchCampaignLocationByAddress(campaignLocation);
    return { address: campaignLocation, data };
  }

  async bookLocationRange(
    campaignIdx: BN | number | bigint,
    locationIdx: BN | number | bigint,
    rangeStartTs: BN | number | bigint,
    rangeEndTs: BN | number | bigint,
    deviceIdx: BN | number | bigint,
    pricingModel: OnchainPricingModel,
    providerAuthority: PublicKey,
    deviceAuthority: PublicKey,
    campaignAuthority?: PublicKey
  ): Promise<AccountWithAddress<CampaignBookingAccount>> {
    const signer = resolveAuthority(this.context, campaignAuthority);
    const [campaign] = findCampaignPda(
      signer,
      campaignIdx,
      this.context.programId
    );
    const [provider] = findProviderPda(
      providerAuthority,
      this.context.programId
    );
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [schedule] = findLocationSchedulePda(
      location,
      this.context.programId
    );
    const [booking] = findCampaignBookingPda(
      campaign,
      location,
      rangeStartTs,
      rangeEndTs,
      this.context.programId
    );
    const [oracleDevice] = findDevicePda(deviceAuthority, deviceIdx);

    await this.context.executor.run("bookLocationRange", () =>
      this.context.program.methods
        .bookLocationRange(
          toBN(campaignIdx),
          toBN(locationIdx),
          toBN(rangeStartTs),
          toBN(rangeEndTs),
          toBN(deviceIdx),
          pricingModel
        )
        .accountsPartial({
          authority: signer,
          campaign,
          provider,
          location,
          schedule,
          booking,
          oracleDevice,
          deviceAuthority,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchCampaignBookingByAddress(booking);
    return { address: booking, data };
  }

  async cancelLocationBooking(
    campaignIdx: BN | number | bigint,
    locationIdx: BN | number | bigint,
    rangeStartTs: BN | number | bigint,
    rangeEndTs: BN | number | bigint,
    providerAuthority: PublicKey,
    campaignAuthority?: PublicKey
  ): Promise<void> {
    const signer = resolveAuthority(this.context, campaignAuthority);
    const [campaign] = findCampaignPda(
      signer,
      campaignIdx,
      this.context.programId
    );
    const [provider] = findProviderPda(
      providerAuthority,
      this.context.programId
    );
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [schedule] = findLocationSchedulePda(
      location,
      this.context.programId
    );
    const [booking] = findCampaignBookingPda(
      campaign,
      location,
      rangeStartTs,
      rangeEndTs,
      this.context.programId
    );

    await this.context.executor.run("cancelLocationBooking", () =>
      this.context.program.methods
        .cancelLocationBooking(
          toBN(campaignIdx),
          toBN(locationIdx),
          toBN(rangeStartTs),
          toBN(rangeEndTs)
        )
        .accounts({
          authority: signer,
          campaign,
          provider,
          location,
          schedule,
          booking,
        })
        .rpc()
    );
  }

  async settleLocationBooking(
    campaignIdx: BN | number | bigint,
    locationIdx: BN | number | bigint,
    rangeStartTs: BN | number | bigint,
    rangeEndTs: BN | number | bigint,
    providerAuthority: PublicKey,
    campaignAuthority: PublicKey,
    oracleAuthority?: PublicKey,
    locationAuthority?: PublicKey
  ): Promise<void> {
    const oracleSigner = resolveAuthority(this.context, oracleAuthority);
    const recipient = locationAuthority ?? providerAuthority;
    const [campaign] = findCampaignPda(
      campaignAuthority,
      campaignIdx,
      this.context.programId
    );
    const [provider] = findProviderPda(
      providerAuthority,
      this.context.programId
    );
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [schedule] = findLocationSchedulePda(
      location,
      this.context.programId
    );
    const [booking] = findCampaignBookingPda(
      campaign,
      location,
      rangeStartTs,
      rangeEndTs,
      this.context.programId
    );
    const [config] = findSoulboardConfigPda(this.context.programId);
    const bookingData = await this.fetchCampaignBookingByAddress(booking);
    const [oracleDevice] = findDevicePda(
      bookingData.deviceAuthority,
      bookingData.deviceIdx
    );
    const configData = await fetchAccountOrThrow<SoulboardConfigAccount>(
      "fetchSoulboardConfig",
      config,
      () => this.context.program.account.soulboardConfig.fetch(config)
    );

    await this.context.executor.run("settleLocationBooking", () =>
      this.context.program.methods
        .settleLocationBooking(
          toBN(campaignIdx),
          toBN(locationIdx),
          toBN(rangeStartTs),
          toBN(rangeEndTs),
          campaignAuthority,
          providerAuthority
        )
        .accountsPartial({
          campaign,
          provider,
          location,
          schedule,
          booking,
          config,
          oracleDevice,
          deviceAuthority: bookingData.deviceAuthority,
          locationAuthority: recipient,
          treasury: configData.treasury,
          oracleAuthority: oracleSigner,
        })
        .rpc()
    );
  }

  async removeCampaignLocation(
    campaignIdx: BN | number | bigint,
    locationIdx: BN | number | bigint,
    providerAuthority: PublicKey,
    campaignAuthority?: PublicKey
  ): Promise<AccountWithAddress<CampaignLocationAccount>> {
    const signer = resolveAuthority(this.context, campaignAuthority);
    const [campaign] = findCampaignPda(
      signer,
      campaignIdx,
      this.context.programId
    );
    const [provider] = findProviderPda(
      providerAuthority,
      this.context.programId
    );
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [campaignLocation] = findCampaignLocationPda(
      campaign,
      location,
      this.context.programId
    );

    await this.context.executor.run("removeCampaignLocation", () =>
      this.context.program.methods
        .removeCampaignLocation(toBN(campaignIdx), toBN(locationIdx))
        .accounts({
          authority: signer,
          campaign,
          provider,
          location,
          campaignLocation,
        })
        .rpc()
    );

    const data = await this.fetchCampaignLocationByAddress(campaignLocation);
    return { address: campaignLocation, data };
  }

  async settleCampaignLocation(
    campaignIdx: BN | number | bigint,
    locationIdx: BN | number | bigint,
    settlementAmount: BN | number | bigint,
    providerAuthority: PublicKey,
    campaignAuthority: PublicKey,
    oracleAuthority?: PublicKey,
    locationAuthority?: PublicKey
  ): Promise<AccountWithAddress<CampaignLocationAccount>> {
    const oracleSigner = resolveAuthority(this.context, oracleAuthority);
    const recipient = locationAuthority ?? providerAuthority;

    // Derive PDAs for reference
    const [campaign] = findCampaignPda(
      campaignAuthority,
      campaignIdx,
      this.context.programId
    );
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [campaignLocation] = findCampaignLocationPda(
      campaign,
      location,
      this.context.programId
    );

    await this.context.executor.run("settleCampaignLocation", () =>
      this.context.program.methods
        .settleCampaignLocation(
          toBN(campaignIdx),
          toBN(locationIdx),
          campaignAuthority,
          providerAuthority,
          toBN(settlementAmount)
        )
        .accounts({
          locationAuthority: recipient,
          oracleAuthority: oracleSigner,
        })
        .rpc()
    );

    const data = await this.fetchCampaignLocationByAddress(campaignLocation);
    return { address: campaignLocation, data };
  }

  quoteSettlement(
    pricing: PricingModel,
    metrics: MetricInputs,
    options?: SettlementQuoteOptions
  ): SettlementQuote {
    return calculateSettlementQuote(pricing, metrics, options ?? {});
  }

  async settleCampaignLocationWithPricing(
    campaignIdx: BN | number | bigint,
    locationIdx: BN | number | bigint,
    pricing: PricingModel,
    metrics: MetricInputs,
    providerAuthority: PublicKey,
    campaignAuthority: PublicKey,
    oracleAuthority?: PublicKey,
    locationAuthority?: PublicKey,
    options?: SettlementQuoteOptions
  ): Promise<{
    account: AccountWithAddress<CampaignLocationAccount>;
    quote: SettlementQuote;
  }> {
    const resolvedCap =
      options?.capLamports ??
      (
        await this.fetchCampaignLocation(
          campaignAuthority,
          campaignIdx,
          providerAuthority,
          locationIdx
        )
      ).data.price;

    const quoteOptions: SettlementQuoteOptions = {
      ...(options ?? {}),
      capLamports: resolvedCap,
    };
    const quote = calculateSettlementQuote(pricing, metrics, quoteOptions);

    const account = await this.settleCampaignLocation(
      campaignIdx,
      locationIdx,
      quote.grossLamports,
      providerAuthority,
      campaignAuthority,
      oracleAuthority,
      locationAuthority
    );

    return { account, quote };
  }

  async book(
    campaignIdx: BN | number | bigint,
    locationIdx: BN | number | bigint,
    providerAuthority: PublicKey,
    campaignAuthority?: PublicKey
  ): Promise<AccountWithAddress<CampaignLocationAccount>> {
    return this.addCampaignLocation(
      campaignIdx,
      locationIdx,
      providerAuthority,
      campaignAuthority
    );
  }

  async cancelBooking(
    campaignIdx: BN | number | bigint,
    locationIdx: BN | number | bigint,
    providerAuthority: PublicKey,
    campaignAuthority?: PublicKey
  ): Promise<AccountWithAddress<CampaignLocationAccount>> {
    return this.removeCampaignLocation(
      campaignIdx,
      locationIdx,
      providerAuthority,
      campaignAuthority
    );
  }

  async fetch(
    providerAuthority: PublicKey,
    locationIdx: BN | number | bigint
  ): Promise<AccountWithAddress<LocationAccount>> {
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const data = await this.fetchByAddress(location);
    return { address: location, data };
  }

  async fetchByAddress(address: PublicKey): Promise<LocationAccount> {
    return fetchAccountOrThrow("fetchLocation", address, () =>
      this.context.program.account.location.fetch(address)
    );
  }

  async fetchCampaignLocation(
    campaignAuthority: PublicKey,
    campaignIdx: BN | number | bigint,
    providerAuthority: PublicKey,
    locationIdx: BN | number | bigint
  ): Promise<AccountWithAddress<CampaignLocationAccount>> {
    const [campaign] = findCampaignPda(
      campaignAuthority,
      campaignIdx,
      this.context.programId
    );
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [campaignLocation] = findCampaignLocationPda(
      campaign,
      location,
      this.context.programId
    );
    const data = await this.fetchCampaignLocationByAddress(campaignLocation);
    return { address: campaignLocation, data };
  }

  async fetchCampaignLocationByAddress(
    address: PublicKey
  ): Promise<CampaignLocationAccount> {
    return fetchAccountOrThrow("fetchCampaignLocation", address, () =>
      this.context.program.account.campaignLocation.fetch(address)
    );
  }

  async fetchLocationSchedule(
    providerAuthority: PublicKey,
    locationIdx: BN | number | bigint
  ): Promise<AccountWithAddress<LocationScheduleAccount>> {
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [schedule] = findLocationSchedulePda(
      location,
      this.context.programId
    );
    const data = await this.fetchLocationScheduleByAddress(schedule);
    return { address: schedule, data };
  }

  async fetchLocationScheduleByAddress(
    address: PublicKey
  ): Promise<LocationScheduleAccount> {
    return fetchAccountOrThrow("fetchLocationSchedule", address, () =>
      this.context.program.account.locationSchedule.fetch(address)
    );
  }

  async fetchCampaignBooking(
    campaignAuthority: PublicKey,
    campaignIdx: BN | number | bigint,
    providerAuthority: PublicKey,
    locationIdx: BN | number | bigint,
    rangeStartTs: BN | number | bigint,
    rangeEndTs: BN | number | bigint
  ): Promise<AccountWithAddress<CampaignBookingAccount>> {
    const [campaign] = findCampaignPda(
      campaignAuthority,
      campaignIdx,
      this.context.programId
    );
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [booking] = findCampaignBookingPda(
      campaign,
      location,
      rangeStartTs,
      rangeEndTs,
      this.context.programId
    );
    const data = await this.fetchCampaignBookingByAddress(booking);
    return { address: booking, data };
  }

  async fetchCampaignBookingByAddress(
    address: PublicKey
  ): Promise<CampaignBookingAccount> {
    return fetchAccountOrThrow("fetchCampaignBooking", address, () =>
      this.context.program.account.campaignBooking.fetch(address)
    );
  }

  async list(): Promise<AccountWithAddress<LocationAccount>[]> {
    try {
      const accounts = await this.context.program.account.location.all();
      return accounts
        .filter((account) => account.account != null)
        .map((account) => ({
          address: account.publicKey,
          data: account.account,
        }));
    } catch (error) {
      console.error("Error fetching locations:", error);
      return [];
    }
  }

  async listCampaignLocations(): Promise<
    AccountWithAddress<CampaignLocationAccount>[]
  > {
    try {
      const accounts =
        await this.context.program.account.campaignLocation.all();
      return accounts
        .filter((account) => account.account != null)
        .map((account) => ({
          address: account.publicKey,
          data: account.account,
        }));
    } catch (error) {
      console.error("Error fetching campaign locations:", error);
      return [];
    }
  }

  async onChange(
    providerAuthority: PublicKey,
    locationIdx: BN | number | bigint,
    handler: (location: AccountWithAddress<LocationAccount>) => void
  ): Promise<() => Promise<void>> {
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    return this.context.events.subscribeToAccount(location, (accountInfo) => {
      const data = decodeAccount<LocationAccount>(
        this.context.program,
        "location",
        accountInfo.data
      );
      handler({ address: location, data });
    });
  }

  async onCampaignLocationChange(
    campaignAuthority: PublicKey,
    campaignIdx: BN | number | bigint,
    providerAuthority: PublicKey,
    locationIdx: BN | number | bigint,
    handler: (booking: AccountWithAddress<CampaignLocationAccount>) => void
  ): Promise<() => Promise<void>> {
    const [campaign] = findCampaignPda(
      campaignAuthority,
      campaignIdx,
      this.context.programId
    );
    const [location] = findLocationPda(
      providerAuthority,
      locationIdx,
      this.context.programId
    );
    const [campaignLocation] = findCampaignLocationPda(
      campaign,
      location,
      this.context.programId
    );
    return this.context.events.subscribeToAccount(
      campaignLocation,
      (accountInfo) => {
        const data = decodeAccount<CampaignLocationAccount>(
          this.context.program,
          "campaignLocation",
          accountInfo.data
        );
        handler({ address: campaignLocation, data });
      }
    );
  }
}
