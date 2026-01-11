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
exports.locationCommands = locationCommands;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const web3_js_1 = require("@solana/web3.js");
const client_js_1 = require("../utils/client.js");
function locationCommands(program) {
    const location = program
        .command('location')
        .description('Manage advertising locations');
    location
        .command('register')
        .description('Register a new location')
        .requiredOption('-n, --name <name>', 'Location name')
        .requiredOption('-p, --price <sol>', 'Location price per day in SOL')
        .option('-d, --description <text>', 'Location description', '')
        .option('-o, --oracle <pubkey>', 'Oracle authority public key')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Registering location...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const priceLamports = Math.floor(parseFloat(options.price) * 1e9);
            const oracleAuthority = options.oracle
                ? new (await Promise.resolve().then(() => __importStar(require('@solana/web3.js')))).PublicKey(options.oracle)
                : client.provider.wallet.publicKey;
            const result = await client.locations.register(options.name, options.description, priceLamports, oracleAuthority);
            spinner.succeed('Location registered successfully!');
            console.log(chalk_1.default.cyan('\nLocation Details:'));
            console.log(`  Address: ${chalk_1.default.bold(result.address.toString())}`);
            console.log(`  Location ID: ${chalk_1.default.bold(result.data.locationIdx.toString())}`);
            console.log(`  Name: ${chalk_1.default.bold(result.data.locationName)}`);
            console.log(`  Price: ${chalk_1.default.bold((0, client_js_1.lamportsToSol)(result.data.price))} SOL/day`);
            console.log(`  Status: ${chalk_1.default.bold(JSON.stringify(result.data.locationStatus))}`);
            console.log(`  Authority: ${chalk_1.default.bold(result.data.authority.toString())}`);
        }
        catch (error) {
            spinner.fail('Failed to register location');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
    location
        .command('book')
        .description('Book a location for a campaign')
        .requiredOption('-c, --campaign-id <id>', 'Campaign index')
        .requiredOption('-l, --location-id <id>', 'Location index')
        .requiredOption('-p, --provider <pubkey>', 'Provider authority public key')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Booking location...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const campaignIdx = parseInt(options.campaignId);
            const locationIdx = parseInt(options.locationId);
            const providerAuthority = new web3_js_1.PublicKey(options.provider);
            const result = await client.locations.book(campaignIdx, locationIdx, providerAuthority);
            spinner.succeed('Location booked successfully!');
            console.log(chalk_1.default.cyan('\nBooking Details:'));
            console.log(`  Campaign Location: ${chalk_1.default.bold(result.address.toString())}`);
            console.log(`  Campaign: ${chalk_1.default.bold(result.data.campaign.toString())}`);
            console.log(`  Location: ${chalk_1.default.bold(result.data.location.toString())}`);
            console.log(`  Price: ${chalk_1.default.bold((0, client_js_1.lamportsToSol)(result.data.price))} SOL`);
            console.log(`  Status: ${chalk_1.default.bold(JSON.stringify(result.data.status))}`);
        }
        catch (error) {
            spinner.fail('Failed to book location');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
    location
        .command('cancel')
        .description('Cancel a booking')
        .requiredOption('-c, --campaign-id <id>', 'Campaign index')
        .requiredOption('-p, --provider <pubkey>', 'Provider authority public key')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Cancelling booking...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const campaignIdx = parseInt(options.campaignId);
            const locationIdx = parseInt(options.locationId);
            const providerAuthority = new web3_js_1.PublicKey(options.provider);
            const result = await client.locations.cancelBooking(campaignIdx, locationIdx, providerAuthority);
            spinner.succeed('Booking cancelled successfully!');
            console.log(chalk_1.default.cyan('\nBooking Status:'));
            console.log(`  Campaign Location: ${chalk_1.default.bold(result.address.toString())}`);
            console.log(`  Status: ${chalk_1.default.bold(JSON.stringify(result.data.status))}`);
        }
        catch (error) {
            spinner.fail('Failed to cancel booking');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
}
//# sourceMappingURL=location.js.map