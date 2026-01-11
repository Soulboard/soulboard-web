"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SoulboardClient = void 0;
const context_1 = require("./context");
const advertiser_service_1 = require("./services/advertiser-service");
const campaign_service_1 = require("./services/campaign-service");
const provider_service_1 = require("./services/provider-service");
const location_service_1 = require("./services/location-service");
class SoulboardClient {
    context;
    advertisers;
    campaigns;
    providers;
    locations;
    constructor(config) {
        this.context = (0, context_1.createSoulboardContext)(config);
        this.advertisers = new advertiser_service_1.AdvertiserService(this.context);
        this.campaigns = new campaign_service_1.CampaignService(this.context);
        this.providers = new provider_service_1.ProviderService(this.context);
        this.locations = new location_service_1.LocationService(this.context);
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
    async onProgramLogs(handler) {
        return this.context.events.subscribeToProgramLogs(this.programId, handler);
    }
    async close() {
        await this.context.events.closeAll();
    }
}
exports.SoulboardClient = SoulboardClient;
//# sourceMappingURL=client.js.map