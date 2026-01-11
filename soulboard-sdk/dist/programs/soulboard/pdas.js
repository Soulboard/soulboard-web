"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findCampaignLocationPda = exports.findLocationPda = exports.findProviderPda = exports.findCampaignPda = exports.findAdvertiserPda = exports.SOULBOARD_PROGRAM_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const errors_1 = require("../../core/errors");
exports.SOULBOARD_PROGRAM_ID = new web3_js_1.PublicKey("915wZsHsUJ7Pdei1XUY8jtdfia7D8t4r9XkhGD3TvrDV");
const ADVERTISER_SEED = Buffer.from("advertiser");
const CAMPAIGN_SEED = Buffer.from("campaign");
const PROVIDER_SEED = Buffer.from("provider");
const LOCATION_SEED = Buffer.from("location");
const CAMPAIGN_LOCATION_SEED = Buffer.from("campaign_location");
const toU64Buffer = (value) => {
    const bn = bn_js_1.default.isBN(value) ? value : new bn_js_1.default(value.toString());
    if (bn.isNeg()) {
        throw new errors_1.InvalidArgumentError("Index must be a non-negative integer");
    }
    if (bn.bitLength() > 64) {
        throw new errors_1.InvalidArgumentError("Index exceeds u64 max value");
    }
    return bn.toArrayLike(Buffer, "le", 8);
};
const findAdvertiserPda = (authority, programId = exports.SOULBOARD_PROGRAM_ID) => web3_js_1.PublicKey.findProgramAddressSync([ADVERTISER_SEED, authority.toBuffer()], programId);
exports.findAdvertiserPda = findAdvertiserPda;
const findCampaignPda = (authority, campaignIdx, programId = exports.SOULBOARD_PROGRAM_ID) => {
    return web3_js_1.PublicKey.findProgramAddressSync([CAMPAIGN_SEED, authority.toBuffer(), toU64Buffer(campaignIdx)], programId);
};
exports.findCampaignPda = findCampaignPda;
const findProviderPda = (authority, programId = exports.SOULBOARD_PROGRAM_ID) => web3_js_1.PublicKey.findProgramAddressSync([PROVIDER_SEED, authority.toBuffer()], programId);
exports.findProviderPda = findProviderPda;
const findLocationPda = (authority, locationIdx, programId = exports.SOULBOARD_PROGRAM_ID) => {
    return web3_js_1.PublicKey.findProgramAddressSync([LOCATION_SEED, authority.toBuffer(), toU64Buffer(locationIdx)], programId);
};
exports.findLocationPda = findLocationPda;
const findCampaignLocationPda = (campaign, location, programId = exports.SOULBOARD_PROGRAM_ID) => web3_js_1.PublicKey.findProgramAddressSync([CAMPAIGN_LOCATION_SEED, campaign.toBuffer(), location.toBuffer()], programId);
exports.findCampaignLocationPda = findCampaignLocationPda;
//# sourceMappingURL=pdas.js.map