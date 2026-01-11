#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const advertiser_js_1 = require("./commands/advertiser.js");
const provider_js_1 = require("./commands/provider.js");
const campaign_js_1 = require("./commands/campaign.js");
const location_js_1 = require("./commands/location.js");
const view_js_1 = require("./commands/view.js");
const program = new commander_1.Command();
program
    .name('soulboard')
    .description('CLI tool for testing Soulboard SDK and programs')
    .version('1.0.0');
// Add command groups
(0, advertiser_js_1.advertiserCommands)(program);
(0, provider_js_1.providerCommands)(program);
(0, campaign_js_1.campaignCommands)(program);
(0, location_js_1.locationCommands)(program);
(0, view_js_1.viewCommands)(program);
// Display welcome message if no command provided
if (!process.argv.slice(2).length) {
    console.log(chalk_1.default.cyan.bold('\n🎯 Soulboard CLI\n'));
    console.log(chalk_1.default.gray('Decentralized advertising on Solana\n'));
    program.outputHelp();
}
program.parse(process.argv);
//# sourceMappingURL=index.js.map