"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewCommands = viewCommands;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const client_js_1 = require("../utils/client.js");
function viewCommands(program) {
    const view = program
        .command('view')
        .description('View on-chain data');
    view
        .command('campaigns')
        .description('List all campaigns')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Fetching campaigns...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const campaigns = await client.campaigns.list();
            spinner.succeed(`Found ${campaigns.length} campaigns`);
            if (campaigns.length === 0) {
                console.log(chalk_1.default.yellow('\nNo campaigns found.'));
                return;
            }
            console.log(chalk_1.default.cyan('\n📊 Campaigns:\n'));
            campaigns.forEach((campaign, index) => {
                console.log(chalk_1.default.bold(`${index + 1}. ${campaign.data.campaignName}`));
                console.log(`   ID: ${chalk_1.default.gray(campaign.data.campaignIdx.toString())}`);
                console.log(`   Address: ${chalk_1.default.gray((0, client_js_1.formatAddress)(campaign.address))}`);
                console.log(`   Authority: ${chalk_1.default.gray((0, client_js_1.formatAddress)(campaign.data.authority))}`);
                console.log(`   Available Budget: ${chalk_1.default.green((0, client_js_1.lamportsToSol)(campaign.data.availableBudget))} SOL`);
                console.log(`   Reserved Budget: ${chalk_1.default.yellow((0, client_js_1.lamportsToSol)(campaign.data.reservedBudget))} SOL`);
                console.log(`   Description: ${chalk_1.default.gray(campaign.data.campaignDescription || 'N/A')}`);
                console.log(`   Status: ${chalk_1.default.gray(JSON.stringify(campaign.data.status))}`);
                console.log('');
            });
        }
        catch (error) {
            spinner.fail('Failed to fetch campaigns');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
    view
        .command('locations')
        .description('List all locations')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Fetching locations...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const locations = await client.locations.list();
            spinner.succeed(`Found ${locations.length} locations`);
            if (locations.length === 0) {
                console.log(chalk_1.default.yellow('\nNo locations found.'));
                return;
            }
            console.log(chalk_1.default.cyan('\n📍 Locations:\n'));
            locations.forEach((location, index) => {
                console.log(chalk_1.default.bold(`${index + 1}. ${location.data.locationName}`));
                console.log(`   ID: ${chalk_1.default.gray(location.data.locationIdx.toString())}`);
                console.log(`   Address: ${chalk_1.default.gray((0, client_js_1.formatAddress)(location.address))}`);
                console.log(`   Authority: ${chalk_1.default.gray((0, client_js_1.formatAddress)(location.data.authority))}`);
                console.log(`   Price: ${chalk_1.default.green((0, client_js_1.lamportsToSol)(location.data.price))} SOL/day`);
                console.log(`   Status: ${chalk_1.default.green(JSON.stringify(location.data.locationStatus))}`);
                console.log(`   Description: ${chalk_1.default.gray(location.data.locationDescription || 'N/A')}`);
                console.log('');
            });
        }
        catch (error) {
            spinner.fail('Failed to fetch locations');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
    view
        .command('balance')
        .description('Check wallet SOL balance')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Fetching balance...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const balance = await client.provider.connection.getBalance(client.provider.wallet.publicKey);
            spinner.succeed('Balance fetched!');
            console.log(chalk_1.default.cyan('\nWallet Details:'));
            console.log(`  Address: ${chalk_1.default.bold(client.provider.wallet.publicKey.toString())}`);
            console.log(`  Balance: ${chalk_1.default.green.bold((0, client_js_1.lamportsToSol)(balance))} SOL`);
        }
        catch (error) {
            spinner.fail('Failed to fetch balance');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
}
//# sourceMappingURL=view.js.map