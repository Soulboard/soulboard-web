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
exports.providerCommands = providerCommands;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const client_js_1 = require("../utils/client.js");
function providerCommands(program) {
    const provider = program
        .command('provider')
        .description('Manage provider accounts');
    provider
        .command('create')
        .description('Create a new provider account')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Creating provider account...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const result = await client.providers.create();
            spinner.succeed('Provider account created successfully!');
            console.log(chalk_1.default.cyan('\nProvider Details:'));
            console.log(`  Address: ${chalk_1.default.bold(result.address.toString())}`);
            console.log(`  Authority: ${chalk_1.default.bold(result.data.authority.toString())}`);
            console.log(`  Total Locations: ${chalk_1.default.bold(result.data.lastLocationId)}`);
        }
        catch (error) {
            spinner.fail('Failed to create provider account');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
    provider
        .command('view')
        .description('View provider account details')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .option('-a, --authority <pubkey>', 'Provider authority public key')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Fetching provider account...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const authority = options.authority
                ? new (await Promise.resolve().then(() => __importStar(require('@solana/web3.js')))).PublicKey(options.authority)
                : client.provider.wallet.publicKey;
            const result = await client.providers.fetch(authority);
            spinner.succeed('Provider account fetched!');
            console.log(chalk_1.default.cyan('\nProvider Details:'));
            console.log(`  Address: ${chalk_1.default.bold(result.address.toString())}`);
            console.log(`  Authority: ${chalk_1.default.bold(result.data.authority.toString())}`);
            console.log(`  Total Locations: ${chalk_1.default.bold(result.data.lastLocationId)}`);
        }
        catch (error) {
            spinner.fail('Failed to fetch provider account');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
}
//# sourceMappingURL=provider.js.map