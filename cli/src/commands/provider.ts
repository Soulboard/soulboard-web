import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { createClient } from '../utils/client.js';

export function providerCommands(program: Command) {
  const provider = program
    .command('provider')
    .description('Manage provider accounts');

  provider
    .command('create')
    .description('Create a new provider account')
    .option('-k, --keypair <path>', 'Path to wallet keypair')
    .action(async (options) => {
      const spinner = ora('Creating provider account...').start();
      try {
        const client = createClient(options.keypair);
        const result = await client.providers.create();

        spinner.succeed('Provider account created successfully!');
        console.log(chalk.cyan('\nProvider Details:'));
        console.log(`  Address: ${chalk.bold(result.address.toString())}`);
        console.log(`  Authority: ${chalk.bold(result.data.authority.toString())}`);
        console.log(`  Total Locations: ${chalk.bold(result.data.lastLocationId)}`);
      } catch (error) {
        spinner.fail('Failed to create provider account');
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    });

  provider
    .command('view')
    .description('View provider account details')
    .option('-k, --keypair <path>', 'Path to wallet keypair')
    .option('-a, --authority <pubkey>', 'Provider authority public key')
    .action(async (options) => {
      const spinner = ora('Fetching provider account...').start();
      try {
        const client = createClient(options.keypair);
        const authority = options.authority 
          ? new (await import('@solana/web3.js')).PublicKey(options.authority)
          : client.provider.wallet.publicKey;

        const result = await client.providers.fetch(authority);

        spinner.succeed('Provider account fetched!');
        console.log(chalk.cyan('\nProvider Details:'));
        console.log(`  Address: ${chalk.bold(result.address.toString())}`);
        console.log(`  Authority: ${chalk.bold(result.data.authority.toString())}`);
        console.log(`  Total Locations: ${chalk.bold(result.data.lastLocationId)}`);
      } catch (error) {
        spinner.fail('Failed to fetch provider account');
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    });
}
