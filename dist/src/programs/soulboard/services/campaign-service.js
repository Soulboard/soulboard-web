"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CampaignService = void 0;
const web3_js_1 = require("@solana/web3.js");
const accounts_1 = require("@soulboard/core/accounts");
const pdas_1 = require("@soulboard/programs/soulboard/pdas");
const utils_1 = require("@soulboard/programs/soulboard/utils");
class CampaignService {
    constructor(context) {
        this.context = context;
    }
    async create(metadata, budgetLamports, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [advertiser] = (0, pdas_1.findAdvertiserPda)(signer, this.context.programId);
        const advertiserData = await (0, accounts_1.fetchAccountOrThrow)("fetchAdvertiser", advertiser, () => this.context.program.account.advertiser.fetch(advertiser));
        const [campaign] = (0, pdas_1.findCampaignPda)(signer, advertiserData.lastCampaignId, this.context.programId);
        await this.context.executor.run("createCampaign", () => this.context.program.methods
            .createCampaign(metadata.name, metadata.description, metadata.imageUrl, (0, utils_1.toBN)(budgetLamports))
            .accounts({
            advertiser,
            authority: signer,
            campaign,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .rpc());
        const data = await this.fetchByAddress(campaign);
        return { address: campaign, data };
    }
    async addBudget(campaignIdx, lamports, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [campaign] = (0, pdas_1.findCampaignPda)(signer, campaignIdx, this.context.programId);
        await this.context.executor.run("addBudget", () => this.context.program.methods
            .addBudget((0, utils_1.toBN)(campaignIdx), (0, utils_1.toBN)(lamports))
            .accounts({
            authority: signer,
            campaign,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .rpc());
    }
    async withdrawBudget(campaignIdx, lamports, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [campaign] = (0, pdas_1.findCampaignPda)(signer, campaignIdx, this.context.programId);
        await this.context.executor.run("withdrawBudget", () => this.context.program.methods
            .withdrawBudget((0, utils_1.toBN)(campaignIdx), (0, utils_1.toBN)(lamports))
            .accounts({
            authority: signer,
            campaign,
        })
            .rpc());
    }
    async close(campaignIdx, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [advertiser] = (0, pdas_1.findAdvertiserPda)(signer, this.context.programId);
        const [campaign] = (0, pdas_1.findCampaignPda)(signer, campaignIdx, this.context.programId);
        await this.context.executor.run("closeCampaign", () => this.context.program.methods
            .closeCampaign((0, utils_1.toBN)(campaignIdx))
            .accounts({
            advertiser,
            authority: signer,
            campaign,
        })
            .rpc());
    }
    async update(campaignIdx, updates, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [campaign] = (0, pdas_1.findCampaignPda)(signer, campaignIdx, this.context.programId);
        await this.context.executor.run("updateCampaign", () => this.context.program.methods
            .updateCampaign((0, utils_1.toBN)(campaignIdx), updates.name ?? null, updates.description ?? null, updates.imageUrl ?? null)
            .accounts({
            authority: signer,
            campaign,
        })
            .rpc());
    }
    async fetch(authority, campaignIdx) {
        const [campaign] = (0, pdas_1.findCampaignPda)(authority, campaignIdx, this.context.programId);
        const data = await this.fetchByAddress(campaign);
        return { address: campaign, data };
    }
    async fetchByAddress(address) {
        return (0, accounts_1.fetchAccountOrThrow)("fetchCampaign", address, () => this.context.program.account.campaign.fetch(address));
    }
    async list() {
        try {
            // Fetch accounts with proper discriminator filtering
            const accounts = await this.context.program.account.campaign.all();
            return accounts
                .filter((account) => account.account != null)
                .map((account) => ({
                address: account.publicKey,
                data: account.account,
            }));
        }
        catch (error) {
            console.error("Error fetching campaigns:", error);
            // Return empty array if there are no accounts or deserialization fails
            return [];
        }
    }
    async onChange(authority, campaignIdx, handler) {
        const [campaign] = (0, pdas_1.findCampaignPda)(authority, campaignIdx, this.context.programId);
        return this.context.events.subscribeToAccount(campaign, (accountInfo) => {
            const data = (0, utils_1.decodeAccount)(this.context.program, "campaign", accountInfo.data);
            handler({ address: campaign, data });
        });
    }
}
exports.CampaignService = CampaignService;
