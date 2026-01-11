import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createClient, formatAddress } from '../utils/client.js';

export function advertiserCommands(program: Command) {
  const advertiser = program
    .command('advertiser')
    .description('Manage advertiser accounts');

  advertiser
    .command('create')
    .description('Create a new advertiser account')
    .option('-k, --keypair <path>', 'Path to wallet keypair')
    .action(async (options) => {
      const spinner = ora('Creating advertiser account...').start();
      try {
        const client = createClient(options.keypair);
        const result = await client.advertisers.create();

        spinner.succeed('Advertiser account created successfully!');
        console.log(chalk.cyan('\nAdvertiser Details:'));
        console.log(`  Address: ${chalk.bold(result?.address?.toString() || 'N/A')}`);
        console.log(`  Authority: ${chalk.bold(result?.data?.authority?.toString() || 'N/A')}`);
        console.log(`  Total Campaigns: ${chalk.bold(result?.data?.lastCampaignId || 0)}`);
      } catch (error) {
        spinner.fail('Failed to create advertiser account');
        console.error(chalk.red('createAdvertiser failed:', error instanceof Error ? error.message : String(error)));
        if (error instanceof Error && error.stack) {
          console.error(chalk.gray(error.stack));
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
      const spinner = ora('Fetching advertiser account...').start();
      try {
        const client = createClient(options.keypair);
        const authority = options.authority 
          ? new (await import('@solana/web3.js')).PublicKey(options.authority)
          : client.provider.wallet.publicKey;

        const result = await client.advertisers.fetch(authority);

        spinner.succeed('Advertiser account fetched!');
        console.log(chalk.cyan('\nAdvertiser Details:'));
        console.log(`  Address: ${chalk.bold(result.address.toString())}`);
        console.log(`  Authority: ${chalk.bold(result.data.authority.toString())}`);
        console.log(`  Total Campaigns: ${chalk.bold(result.data.lastCampaignId)}`);
      } catch (error) {
        spinner.fail('Failed to fetch advertiser account');
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    });
}
