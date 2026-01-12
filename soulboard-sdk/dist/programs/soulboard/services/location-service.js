"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationService = void 0;
const web3_js_1 = require("@solana/web3.js");
const accounts_1 = require("../../../core/accounts");
const fees_1 = require("../fees");
const pdas_1 = require("../pdas");
const utils_1 = require("../utils");
class LocationService {
    context;
    constructor(context) {
        this.context = context;
    }
    async register(name, description, priceLamports, oracleAuthority, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [provider] = (0, pdas_1.findProviderPda)(signer, this.context.programId);
        const providerData = await (0, accounts_1.fetchAccountOrThrow)("fetchProvider", provider, () => this.context.program.account.provider.fetch(provider));
        const [location] = (0, pdas_1.findLocationPda)(signer, providerData.lastLocationId, this.context.programId);
        await this.context.executor.run("registerLocation", () => this.context.program.methods
            .registerLocation(name, description, (0, utils_1.toBN)(priceLamports), oracleAuthority)
            .accounts({
            authority: signer,
            provider,
            location,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .rpc());
        const data = await this.fetchByAddress(location);
        return { address: location, data };
    }
    async updateDetails(locationIdx, name, description, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [provider] = (0, pdas_1.findProviderPda)(signer, this.context.programId);
        const [location] = (0, pdas_1.findLocationPda)(signer, locationIdx, this.context.programId);
        await this.context.executor.run("updateLocationDetails", () => this.context.program.methods
            .updateLocationDetails((0, utils_1.toBN)(locationIdx), name ?? null, description ?? null)
            .accounts({
            authority: signer,
            provider,
            location,
        })
            .rpc());
        const data = await this.fetchByAddress(location);
        return { address: location, data };
    }
    async updatePrice(locationIdx, priceLamports, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [provider] = (0, pdas_1.findProviderPda)(signer, this.context.programId);
        const [location] = (0, pdas_1.findLocationPda)(signer, locationIdx, this.context.programId);
        await this.context.executor.run("updateLocationPrice", () => this.context.program.methods
            .updateLocationPrice((0, utils_1.toBN)(locationIdx), (0, utils_1.toBN)(priceLamports))
            .accounts({
            authority: signer,
            provider,
            location,
        })
            .rpc());
        const data = await this.fetchByAddress(location);
        return { address: location, data };
    }
    async setStatus(locationIdx, status, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [provider] = (0, pdas_1.findProviderPda)(signer, this.context.programId);
        const [location] = (0, pdas_1.findLocationPda)(signer, locationIdx, this.context.programId);
        await this.context.executor.run("setLocationStatus", () => this.context.program.methods
            .setLocationStatus((0, utils_1.toBN)(locationIdx), status)
            .accounts({
            authority: signer,
            provider,
            location,
        })
            .rpc());
        const data = await this.fetchByAddress(location);
        return { address: location, data };
    }
    async addCampaignLocation(campaignIdx, locationIdx, providerAuthority, campaignAuthority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, campaignAuthority);
        const [campaign] = (0, pdas_1.findCampaignPda)(signer, campaignIdx, this.context.programId);
        const [provider] = (0, pdas_1.findProviderPda)(providerAuthority, this.context.programId);
        const [location] = (0, pdas_1.findLocationPda)(providerAuthority, locationIdx, this.context.programId);
        const [campaignLocation] = (0, pdas_1.findCampaignLocationPda)(campaign, location, this.context.programId);
        await this.context.executor.run("addCampaignLocation", () => this.context.program.methods
            .addCampaignLocation((0, utils_1.toBN)(campaignIdx), (0, utils_1.toBN)(locationIdx))
            .accounts({
            authority: signer,
            provider,
            campaign,
            location,
            campaignLocation,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .rpc());
        const data = await this.fetchCampaignLocationByAddress(campaignLocation);
        return { address: campaignLocation, data };
    }
    async removeCampaignLocation(campaignIdx, locationIdx, providerAuthority, campaignAuthority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, campaignAuthority);
        const [campaign] = (0, pdas_1.findCampaignPda)(signer, campaignIdx, this.context.programId);
        const [provider] = (0, pdas_1.findProviderPda)(providerAuthority, this.context.programId);
        const [location] = (0, pdas_1.findLocationPda)(providerAuthority, locationIdx, this.context.programId);
        const [campaignLocation] = (0, pdas_1.findCampaignLocationPda)(campaign, location, this.context.programId);
        await this.context.executor.run("removeCampaignLocation", () => this.context.program.methods
            .removeCampaignLocation((0, utils_1.toBN)(campaignIdx), (0, utils_1.toBN)(locationIdx))
            .accounts({
            authority: signer,
            campaign,
            provider,
            location,
            campaignLocation,
        })
            .rpc());
        const data = await this.fetchCampaignLocationByAddress(campaignLocation);
        return { address: campaignLocation, data };
    }
    async settleCampaignLocation(campaignIdx, locationIdx, settlementAmount, providerAuthority, campaignAuthority, oracleAuthority, locationAuthority) {
        const oracleSigner = (0, utils_1.resolveAuthority)(this.context, oracleAuthority);
        const recipient = locationAuthority ?? providerAuthority;
        // Derive PDAs for reference
        const [campaign] = (0, pdas_1.findCampaignPda)(campaignAuthority, campaignIdx, this.context.programId);
        const [location] = (0, pdas_1.findLocationPda)(providerAuthority, locationIdx, this.context.programId);
        const [campaignLocation] = (0, pdas_1.findCampaignLocationPda)(campaign, location, this.context.programId);
        await this.context.executor.run("settleCampaignLocation", () => this.context.program.methods
            .settleCampaignLocation((0, utils_1.toBN)(campaignIdx), (0, utils_1.toBN)(locationIdx), campaignAuthority, providerAuthority, (0, utils_1.toBN)(settlementAmount))
            .accounts({
            locationAuthority: recipient,
            oracleAuthority: oracleSigner,
        })
            .rpc());
        const data = await this.fetchCampaignLocationByAddress(campaignLocation);
        return { address: campaignLocation, data };
    }
    quoteSettlement(pricing, metrics, options) {
        return (0, fees_1.calculateSettlementQuote)(pricing, metrics, options ?? {});
    }
    async settleCampaignLocationWithPricing(campaignIdx, locationIdx, pricing, metrics, providerAuthority, campaignAuthority, oracleAuthority, locationAuthority, options) {
        const resolvedCap = options?.capLamports ??
            (await this.fetchCampaignLocation(campaignAuthority, campaignIdx, providerAuthority, locationIdx)).data.price;
        const quoteOptions = {
            ...(options ?? {}),
            capLamports: resolvedCap,
        };
        const quote = (0, fees_1.calculateSettlementQuote)(pricing, metrics, quoteOptions);
        const account = await this.settleCampaignLocation(campaignIdx, locationIdx, quote.grossLamports, providerAuthority, campaignAuthority, oracleAuthority, locationAuthority);
        return { account, quote };
    }
    async book(campaignIdx, locationIdx, providerAuthority, campaignAuthority) {
        return this.addCampaignLocation(campaignIdx, locationIdx, providerAuthority, campaignAuthority);
    }
    async cancelBooking(campaignIdx, locationIdx, providerAuthority, campaignAuthority) {
        return this.removeCampaignLocation(campaignIdx, locationIdx, providerAuthority, campaignAuthority);
    }
    async fetch(providerAuthority, locationIdx) {
        const [location] = (0, pdas_1.findLocationPda)(providerAuthority, locationIdx, this.context.programId);
        const data = await this.fetchByAddress(location);
        return { address: location, data };
    }
    async fetchByAddress(address) {
        return (0, accounts_1.fetchAccountOrThrow)("fetchLocation", address, () => this.context.program.account.location.fetch(address));
    }
    async fetchCampaignLocation(campaignAuthority, campaignIdx, providerAuthority, locationIdx) {
        const [campaign] = (0, pdas_1.findCampaignPda)(campaignAuthority, campaignIdx, this.context.programId);
        const [location] = (0, pdas_1.findLocationPda)(providerAuthority, locationIdx, this.context.programId);
        const [campaignLocation] = (0, pdas_1.findCampaignLocationPda)(campaign, location, this.context.programId);
        const data = await this.fetchCampaignLocationByAddress(campaignLocation);
        return { address: campaignLocation, data };
    }
    async fetchCampaignLocationByAddress(address) {
        return (0, accounts_1.fetchAccountOrThrow)("fetchCampaignLocation", address, () => this.context.program.account.campaignLocation.fetch(address));
    }
    async list() {
        try {
            const accounts = await this.context.program.account.location.all();
            return accounts
                .filter((account) => account.account != null)
                .map((account) => ({
                address: account.publicKey,
                data: account.account,
            }));
        }
        catch (error) {
            console.error("Error fetching locations:", error);
            return [];
        }
    }
    async listCampaignLocations() {
        try {
            const accounts = await this.context.program.account.campaignLocation.all();
            return accounts
                .filter((account) => account.account != null)
                .map((account) => ({
                address: account.publicKey,
                data: account.account,
            }));
        }
        catch (error) {
            console.error("Error fetching campaign locations:", error);
            return [];
        }
    }
    async onChange(providerAuthority, locationIdx, handler) {
        const [location] = (0, pdas_1.findLocationPda)(providerAuthority, locationIdx, this.context.programId);
        return this.context.events.subscribeToAccount(location, (accountInfo) => {
            const data = (0, utils_1.decodeAccount)(this.context.program, "location", accountInfo.data);
            handler({ address: location, data });
        });
    }
    async onCampaignLocationChange(campaignAuthority, campaignIdx, providerAuthority, locationIdx, handler) {
        const [campaign] = (0, pdas_1.findCampaignPda)(campaignAuthority, campaignIdx, this.context.programId);
        const [location] = (0, pdas_1.findLocationPda)(providerAuthority, locationIdx, this.context.programId);
        const [campaignLocation] = (0, pdas_1.findCampaignLocationPda)(campaign, location, this.context.programId);
        return this.context.events.subscribeToAccount(campaignLocation, (accountInfo) => {
            const data = (0, utils_1.decodeAccount)(this.context.program, "campaignLocation", accountInfo.data);
            handler({ address: campaignLocation, data });
        });
    }
}
exports.LocationService = LocationService;
//# sourceMappingURL=location-service.js.map