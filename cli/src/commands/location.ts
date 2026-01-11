import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { PublicKey } from '@solana/web3.js';
import { createClient, lamportsToSol } from '../utils/client.js';

export function locationCommands(program: Command) {
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
      const spinner = ora('Registering location...').start();
      try {
        const client = createClient(options.keypair);
        const priceLamports = Math.floor(parseFloat(options.price) * 1e9);
        const oracleAuthority = options.oracle
          ? new (await import('@solana/web3.js')).PublicKey(options.oracle)
          : client.provider.wallet.publicKey;

        const result = await client.locations.register(
          options.name,
          options.description,
          priceLamports,
          oracleAuthority
        );

        spinner.succeed('Location registered successfully!');
        console.log(chalk.cyan('\nLocation Details:'));
        console.log(`  Address: ${chalk.bold(result.address.toString())}`);
        console.log(`  Location ID: ${chalk.bold(result.data.locationIdx.toString())}`);
        console.log(`  Name: ${chalk.bold(result.data.locationName)}`);
        console.log(`  Price: ${chalk.bold(lamportsToSol(result.data.price))} SOL/day`);
        console.log(`  Status: ${chalk.bold(JSON.stringify(result.data.locationStatus))}`);
        console.log(`  Authority: ${chalk.bold(result.data.authority.toString())}`);
      } catch (error) {
        spinner.fail('Failed to register location');
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
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
      const spinner = ora('Booking location...').start();
      try {
        const client = createClient(options.keypair);
        const campaignIdx = parseInt(options.campaignId);
        const locationIdx = parseInt(options.locationId);
        const providerAuthority = new PublicKey(options.provider);

        const result = await client.locations.book(
          campaignIdx,
          locationIdx,
          providerAuthority
        );

        spinner.succeed('Location booked successfully!');
        console.log(chalk.cyan('\nBooking Details:'));
        console.log(`  Campaign Location: ${chalk.bold(result.address.toString())}`);
        console.log(`  Campaign: ${chalk.bold(result.data.campaign.toString())}`);
        console.log(`  Location: ${chalk.bold(result.data.location.toString())}`);
        console.log(`  Price: ${chalk.bold(lamportsToSol(result.data.price))} SOL`);
        console.log(`  Status: ${chalk.bold(JSON.stringify(result.data.status))}`);
      } catch (error) {
        spinner.fail('Failed to book location');
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
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
      const spinner = ora('Cancelling booking...').start();
      try {
        const client = createClient(options.keypair);
        const campaignIdx = parseInt(options.campaignId);
        const locationIdx = parseInt(options.locationId);
        const providerAuthority = new PublicKey(options.provider);

        const result = await client.locations.cancelBooking(
          campaignIdx,
          locationIdx,
          providerAuthority
        );

        spinner.succeed('Booking cancelled successfully!');
        console.log(chalk.cyan('\nBooking Status:'));
        console.log(`  Campaign Location: ${chalk.bold(result.address.toString())}`);
        console.log(`  Status: ${chalk.bold(JSON.stringify(result.data.status))}`);
      } catch (error) {
        spinner.fail('Failed to cancel booking');
        console.error(chalk.red(error instanceof Error ? error.message : String(error)));
        process.exit(1);
      }
    });
}
