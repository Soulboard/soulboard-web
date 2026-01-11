#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { advertiserCommands } from './commands/advertiser.js';
import { providerCommands } from './commands/provider.js';
import { campaignCommands } from './commands/campaign.js';
import { locationCommands } from './commands/location.js';
import { viewCommands } from './commands/view.js';

const program = new Command();

program
  .name('soulboard')
  .description('CLI tool for testing Soulboard SDK and programs')
  .version('1.0.0');

// Add command groups
advertiserCommands(program);
providerCommands(program);
campaignCommands(program);
locationCommands(program);
viewCommands(program);

// Display welcome message if no command provided
if (!process.argv.slice(2).length) {
  console.log(chalk.cyan.bold('\n🎯 Soulboard CLI\n'));
  console.log(chalk.gray('Decentralized advertising on Solana\n'));
  program.outputHelp();
}

program.parse(process.argv);
