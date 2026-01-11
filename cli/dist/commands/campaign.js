"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.campaignCommands = campaignCommands;
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const client_js_1 = require("../utils/client.js");
function campaignCommands(program) {
    const campaign = program
        .command('campaign')
        .description('Manage advertising campaigns');
    campaign
        .command('create')
        .description('Create a new campaign')
        .requiredOption('-n, --name <name>', 'Campaign name')
        .requiredOption('-b, --budget <sol>', 'Initial budget in SOL')
        .option('-d, --description <text>', 'Campaign description', '')
        .option('-i, --image <url>', 'Campaign image URL', '')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Creating campaign...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const budgetLamports = Math.floor(parseFloat(options.budget) * 1e9);
            const result = await client.campaigns.create({
                name: options.name,
                description: options.description,
                imageUrl: options.image,
            }, budgetLamports);
            spinner.succeed('Campaign created successfully!');
            console.log(chalk_1.default.cyan('\nCampaign Details:'));
            console.log(`  Address: ${chalk_1.default.bold(result.address.toString())}`);
            console.log(`  Campaign ID: ${chalk_1.default.bold(result.data.campaignIdx.toString())}`);
            console.log(`  Name: ${chalk_1.default.bold(result.data.campaignName)}`);
            console.log(`  Available Budget: ${chalk_1.default.bold((0, client_js_1.lamportsToSol)(result.data.availableBudget))} SOL`);
            console.log(`  Reserved Budget: ${chalk_1.default.bold((0, client_js_1.lamportsToSol)(result.data.reservedBudget))} SOL`);
            console.log(`  Authority: ${chalk_1.default.bold(result.data.authority.toString())}`);
        }
        catch (error) {
            spinner.fail('Failed to create campaign');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
    campaign
        .command('add-budget')
        .description('Add budget to a campaign')
        .requiredOption('-i, --campaign-id <id>', 'Campaign index')
        .requiredOption('-a, --amount <sol>', 'Amount in SOL to add')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Adding budget to campaign...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const campaignIdx = parseInt(options.campaignId);
            const lamports = Math.floor(parseFloat(options.amount) * 1e9);
            await client.campaigns.addBudget(campaignIdx, lamports);
            spinner.succeed(`Added ${options.amount} SOL to campaign #${campaignIdx}!`);
        }
        catch (error) {
            spinner.fail('Failed to add budget');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
    campaign
        .command('withdraw')
        .description('Withdraw budget from a campaign')
        .requiredOption('-i, --campaign-id <id>', 'Campaign index')
        .requiredOption('-a, --amount <sol>', 'Amount in SOL to withdraw')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Withdrawing budget from campaign...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const campaignIdx = parseInt(options.campaignId);
            const lamports = Math.floor(parseFloat(options.amount) * 1e9);
            await client.campaigns.withdrawBudget(campaignIdx, lamports);
            spinner.succeed(`Withdrew ${options.amount} SOL from campaign #${campaignIdx}!`);
        }
        catch (error) {
            spinner.fail('Failed to withdraw budget');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
    campaign
        .command('close')
        .description('Close a campaign')
        .requiredOption('-i, --campaign-id <id>', 'Campaign index')
        .option('-k, --keypair <path>', 'Path to wallet keypair')
        .action(async (options) => {
        const spinner = (0, ora_1.default)('Closing campaign...').start();
        try {
            const client = (0, client_js_1.createClient)(options.keypair);
            const campaignIdx = parseInt(options.campaignId);
            await client.campaigns.close(campaignIdx);
            spinner.succeed(`Campaign #${campaignIdx} closed successfully!`);
        }
        catch (error) {
            spinner.fail('Failed to close campaign');
            console.error(chalk_1.default.red(error instanceof Error ? error.message : String(error)));
            process.exit(1);
        }
    });
}
//# sourceMappingURL=campaign.js.map