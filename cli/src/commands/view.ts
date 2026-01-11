import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createClient, formatAddress, lamportsToSol } from '../utils/client.js';

export function viewCommands(program: Command) {
  const view = program
    .command('view')
    .description('View on-chain data');

  view
    .command('campaigns')
    .description('List all campaigns')
    .option('-k, --keypair <path>', 'Path to wallet keypair')
    .action(async (options) => {
      const spinner = ora('Fetching campaigns...').start();
      try {
        const client = createClient(options.keypair);
        const campaigns = await client.campaigns.list();

        spinner.succeed(`Found ${campaigns.length} campaigns`);

        if (campaigns.length === 0) {
          console.log(chalk.yellow('\nNo campaigns found.'));
          return;
        }

        console.log(chalk.cyan('\n📊 Campaigns:\n'));
        campaigns.forEach((campaign, index) => {
          console.log(chalk.bold(`${index + 1}. ${campaign.data.campaignName}`));
          console.log(`   ID: ${chalk.gray(campaign.data.campaignIdx.toString())}`);
          console.log(`   Address: ${chalk.gray(formatAddress(campaign.address))}`);
          console.log(`   Authority: ${chalk.gray(formatAddress(campaign.data.authority))}`);
          console.log(`   Available Budget: ${chalk.green(lamportsToSol(campaign.data.availableBudget))} SOL`);
          console.log(`   Reserved Budget: ${chalk.yellow(lamportsToSol(campaign.data.reservedBudget))} SOL`);
          console.log(`   Description: ${chalk.gray(campaign.data.campaignDescription || 'N/A')}`);
          console.log(`   Status: ${chalk.gray(JSON.stringify(campaign.data.status))}`);
          console.log('');
        });
      } catch (error) {
        spinner.fail('Failed to fetch campaigns');
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    });

  view
    .command('locations')
    .description('List all locations')
    .option('-k, --keypair <path>', 'Path to wallet keypair')
    .action(async (options) => {
      const spinner = ora('Fetching locations...').start();
      try {
        const client = createClient(options.keypair);
        const locations = await client.locations.list();

        spinner.succeed(`Found ${locations.length} locations`);

        if (locations.length === 0) {
          console.log(chalk.yellow('\nNo locations found.'));
          return;
        }

        console.log(chalk.cyan('\n📍 Locations:\n'));
        locations.forEach((location, index) => {
          console.log(chalk.bold(`${index + 1}. ${location.data.locationName}`));
          console.log(`   ID: ${chalk.gray(location.data.locationIdx.toString())}`);
          console.log(`   Address: ${chalk.gray(formatAddress(location.address))}`);
          console.log(`   Authority: ${chalk.gray(formatAddress(location.data.authority))}`);
          console.log(`   Price: ${chalk.green(lamportsToSol(location.data.price))} SOL/day`);
          console.log(`   Status: ${chalk.green(JSON.stringify(location.data.locationStatus))}`);
          console.log(`   Description: ${chalk.gray(location.data.locationDescription || 'N/A')}`);
          console.log('');
        });
      } catch (error) {
        spinner.fail('Failed to fetch locations');
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    });

  view
    .command('balance')
    .description('Check wallet SOL balance')
    .option('-k, --keypair <path>', 'Path to wallet keypair')
    .action(async (options) => {
      const spinner = ora('Fetching balance...').start();
      try {
        const client = createClient(options.keypair);
        const balance = await client.provider.connection.getBalance(
          client.provider.wallet.publicKey
        );

        spinner.succeed('Balance fetched!');
        console.log(chalk.cyan('\nWallet Details:'));
        console.log(`  Address: ${chalk.bold(client.provider.wallet.publicKey.toString())}`);
        console.log(`  Balance: ${chalk.green.bold(lamportsToSol(balance))} SOL`);
      } catch (error) {
        spinner.fail('Failed to fetch balance');
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    });
}
