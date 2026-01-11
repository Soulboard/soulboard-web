import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { fetchAccountOrThrow } from "@soulboard/core/accounts";
import { AccountWithAddress, LocationAccount } from "@soulboard/programs/soulboard/types";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
import { findCampaignPda, findLocationPda, findProviderPda } from "@soulboard/programs/soulboard/pdas";
import { decodeAccount, resolveAuthority, toBN } from "@soulboard/programs/soulboard/utils";

export class LocationService {
  constructor(private readonly context: SoulboardContext) {}

  async register(
    name: string,
    description: string,
    authority?: PublicKey
  ): Promise<AccountWithAddress<LocationAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [provider] = findProviderPda(signer, this.context.programId);
    const providerData = await fetchAccountOrThrow("fetchProvider", provider, () =>
      this.context.program.account.provider.fetch(provider)
    );
    const [location] = findLocationPda(
      signer,
      providerData.lastLocationId,
      this.context.programId
    );

    await this.context.executor.run("registerLocation", () =>
      this.context.program.methods
        .registerLocation(name, description)
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

  async book(
    campaignIdx: number,
    locationIdx: number,
    providerAuthority: PublicKey,
    campaignAuthority?: PublicKey
  ): Promise<AccountWithAddress<LocationAccount>> {
    const signer = resolveAuthority(this.context, campaignAuthority);
    const [campaign] = findCampaignPda(signer, campaignIdx, this.context.programId);
    const [provider] = findProviderPda(providerAuthority, this.context.programId);
    const [location] = findLocationPda(providerAuthority, locationIdx, this.context.programId);

    await this.context.executor.run("bookLocation", () =>
      this.context.program.methods
        .bookLocation(campaignIdx, locationIdx)
        .accounts({
          authority: signer,
          campaign,
          location,
          adProvider: provider,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(location);
    return { address: location, data };
  }

  async cancelBooking(
    campaignIdx: number,
    locationIdx: number,
    slotId: BN | number | bigint,
    providerAuthority: PublicKey,
    campaignAuthority?: PublicKey
  ): Promise<AccountWithAddress<LocationAccount>> {
    const signer = resolveAuthority(this.context, campaignAuthority);
    const [campaign] = findCampaignPda(signer, campaignIdx, this.context.programId);
    const [provider] = findProviderPda(providerAuthority, this.context.programId);
    const [location] = findLocationPda(providerAuthority, locationIdx, this.context.programId);

    await this.context.executor.run("cancelBooking", () =>
      this.context.program.methods
        .cancelBooking(campaignIdx, locationIdx, toBN(slotId))
        .accounts({
          authority: signer,
          campaign,
          location,
          adProvider: provider,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(location);
    return { address: location, data };
  }

  async withdrawEarnings(
    locationIdx: number,
    lamports: BN | number | bigint,
    authority?: PublicKey
  ): Promise<void> {
    const signer = resolveAuthority(this.context, authority);
    const [location] = findLocationPda(signer, locationIdx, this.context.programId);

    await this.context.executor.run("withdrawEarnings", () =>
      this.context.program.methods
        .withdrawEarnings(locationIdx, toBN(lamports))
        .accounts({
          authority: signer,
          location,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );
  }

  async fetch(
    providerAuthority: PublicKey,
    locationIdx: number
  ): Promise<AccountWithAddress<LocationAccount>> {
    const [location] = findLocationPda(providerAuthority, locationIdx, this.context.programId);
    const data = await this.fetchByAddress(location);
    return { address: location, data };
  }

  async fetchByAddress(address: PublicKey): Promise<LocationAccount> {
    return fetchAccountOrThrow("fetchLocation", address, () =>
      this.context.program.account.location.fetch(address)
    );
  }

  async list(): Promise<AccountWithAddress<LocationAccount>[]> {
    try {
      // Fetch accounts with proper discriminator filtering
      const accounts = await this.context.program.account.location.all();
      return accounts
        .filter((account) => account.account != null)
        .map((account) => ({
          address: account.publicKey,
          data: account.account,
        }));
    } catch (error) {
      console.error('Error fetching locations:', error);
      // Return empty array if there are no accounts or deserialization fails
      return [];
    }
  }

  async onChange(
    providerAuthority: PublicKey,
    locationIdx: number,
    handler: (location: AccountWithAddress<LocationAccount>) => void
  ): Promise<() => Promise<void>> {
    const [location] = findLocationPda(providerAuthority, locationIdx, this.context.programId);
    return this.context.events.subscribeToAccount(location, (accountInfo) => {
      const data = decodeAccount<LocationAccount>(
        this.context.program,
        "location",
        accountInfo.data
      );
      handler({ address: location, data });
    });
  }
}
