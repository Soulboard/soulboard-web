import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { fetchAccountOrThrow } from "@soulboard/core/accounts";
import {
  AccountWithAddress,
  CampaignAccount,
  CampaignMetadata,
} from "@soulboard/programs/soulboard/types";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
import {
  findAdvertiserPda,
  findCampaignPda,
} from "@soulboard/programs/soulboard/pdas";
import {
  decodeAccount,
  resolveAuthority,
  toBN,
} from "@soulboard/programs/soulboard/utils";

export class CampaignService {
  constructor(private readonly context: SoulboardContext) {}

  async create(
    metadata: CampaignMetadata,
    budgetLamports: BN | number | bigint,
    authority?: PublicKey
  ): Promise<AccountWithAddress<CampaignAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [advertiser] = findAdvertiserPda(signer, this.context.programId);
    const advertiserData = await fetchAccountOrThrow(
      "fetchAdvertiser",
      advertiser,
      () => this.context.program.account.advertiser.fetch(advertiser)
    );
    const [campaign] = findCampaignPda(
      signer,
      advertiserData.lastCampaignId,
      this.context.programId
    );

    await this.context.executor.run("createCampaign", () =>
      this.context.program.methods
        .createCampaign(
          metadata.name,
          metadata.description,
          metadata.imageUrl,
          toBN(budgetLamports)
        )
        .accounts({
          advertiser,
          authority: signer,
          campaign,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(campaign);
    return { address: campaign, data };
  }

  async addBudget(
    campaignIdx: BN | number | bigint,
    lamports: BN | number | bigint,
    authority?: PublicKey
  ): Promise<void> {
    const signer = resolveAuthority(this.context, authority);
    const [campaign] = findCampaignPda(
      signer,
      campaignIdx,
      this.context.programId
    );

    await this.context.executor.run("addBudget", () =>
      this.context.program.methods
        .addBudget(toBN(campaignIdx), toBN(lamports))
        .accounts({
          authority: signer,
          campaign,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );
  }

  async withdrawBudget(
    campaignIdx: BN | number | bigint,
    lamports: BN | number | bigint,
    authority?: PublicKey
  ): Promise<void> {
    const signer = resolveAuthority(this.context, authority);
    const [campaign] = findCampaignPda(
      signer,
      campaignIdx,
      this.context.programId
    );

    await this.context.executor.run("withdrawBudget", () =>
      this.context.program.methods
        .withdrawBudget(toBN(campaignIdx), toBN(lamports))
        .accounts({
          authority: signer,
          campaign,
        })
        .rpc()
    );
  }

  async close(
    campaignIdx: BN | number | bigint,
    authority?: PublicKey
  ): Promise<void> {
    const signer = resolveAuthority(this.context, authority);
    const [advertiser] = findAdvertiserPda(signer, this.context.programId);
    const [campaign] = findCampaignPda(
      signer,
      campaignIdx,
      this.context.programId
    );

    await this.context.executor.run("closeCampaign", () =>
      this.context.program.methods
        .closeCampaign(toBN(campaignIdx))
        .accounts({
          advertiser,
          authority: signer,
          campaign,
        })
        .rpc()
    );
  }

  async update(
    campaignIdx: BN | number | bigint,
    updates: Partial<CampaignMetadata>,
    authority?: PublicKey
  ): Promise<void> {
    const signer = resolveAuthority(this.context, authority);
    const [campaign] = findCampaignPda(
      signer,
      campaignIdx,
      this.context.programId
    );

    await this.context.executor.run("updateCampaign", () =>
      this.context.program.methods
        .updateCampaign(
          toBN(campaignIdx),
          updates.name ?? null,
          updates.description ?? null,
          updates.imageUrl ?? null
        )
        .accounts({
          authority: signer,
          campaign,
        })
        .rpc()
    );
  }

  async fetch(
    authority: PublicKey,
    campaignIdx: BN | number | bigint
  ): Promise<AccountWithAddress<CampaignAccount>> {
    const [campaign] = findCampaignPda(
      authority,
      campaignIdx,
      this.context.programId
    );
    const data = await this.fetchByAddress(campaign);
    return { address: campaign, data };
  }

  async fetchByAddress(address: PublicKey): Promise<CampaignAccount> {
    return fetchAccountOrThrow("fetchCampaign", address, () =>
      this.context.program.account.campaign.fetch(address)
    );
  }

  async list(): Promise<AccountWithAddress<CampaignAccount>[]> {
    try {
      // Fetch accounts with proper discriminator filtering
      const accounts = await this.context.program.account.campaign.all();
      return accounts
        .filter((account) => account.account != null)
        .map((account) => ({
          address: account.publicKey,
          data: account.account,
        }));
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      // Return empty array if there are no accounts or deserialization fails
      return [];
    }
  }

  async onChange(
    authority: PublicKey,
    campaignIdx: BN | number | bigint,
    handler: (campaign: AccountWithAddress<CampaignAccount>) => void
  ): Promise<() => Promise<void>> {
    const [campaign] = findCampaignPda(
      authority,
      campaignIdx,
      this.context.programId
    );
    return this.context.events.subscribeToAccount(campaign, (accountInfo) => {
      const data = decodeAccount<CampaignAccount>(
        this.context.program,
        "campaign",
        accountInfo.data
      );
      handler({ address: campaign, data });
    });
  }
}
