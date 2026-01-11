"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.advertiserCommands = advertiserCommands;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const client_js_1 = require("../utils/client.js");
function advertiserCommands(program) {
    const advertiser = program
        .command('advertiser')
        .description('Manage advertiser accounts');
    advertiser
        .command('create')
        .description('Create a new advertiser account')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Creating advertiser account...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const result = await client.advertisers.create();
            spinner.succeed('Advertiser account created successfully!');
            console.log(chalk_1.default.cyan('\nAdvertiser Details:'));
            console.log(`  Address: ${chalk_1.default.bold(result?.address?.toString() || 'N/A')}`);
            console.log(`  Authority: ${chalk_1.default.bold(result?.data?.authority?.toString() || 'N/A')}`);
            console.log(`  Total Campaigns: ${chalk_1.default.bold(result?.data?.lastCampaignId || 0)}`);
        }
        catch (error) {
            spinner.fail('Failed to create advertiser account');
            console.error(chalk_1.default.red('createAdvertiser failed:', error instanceof Error ? error.message : String(error)));
            if (error instanceof Error && error.stack) {
                console.error(chalk_1.default.gray(error.stack));
            }
            process.exit(1);
        }
    });
    advertiser
        .command('view')
        .description('View advertiser account details')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .option('-a, --authority <pubkey>', 'Advertiser authority public key')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Fetching advertiser account...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const authority = options.authority
                ? new (await Promise.resolve().then(() => __importStar(require('@solana/web3.js')))).PublicKey(options.authority)
                : client.provider.wallet.publicKey;
            const result = await client.advertisers.fetch(authority);
            spinner.succeed('Advertiser account fetched!');
            console.log(chalk_1.default.cyan('\nAdvertiser Details:'));
            console.log(`  Address: ${chalk_1.default.bold(result.address.toString())}`);
            console.log(`  Authority: ${chalk_1.default.bold(result.data.authority.toString())}`);
            console.log(`  Total Campaigns: ${chalk_1.default.bold(result.data.lastCampaignId)}`);
        }
        catch (error) {
            spinner.fail('Failed to fetch advertiser account');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
}
//# sourceMappingURL=advertiser.js.map