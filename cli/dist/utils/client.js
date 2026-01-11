"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadWallet = loadWallet;
exports.createClient = createClient;
exports.formatAddress = formatAddress;
exports.lamportsToSol = lamportsToSol;
const anchor_1 = require("@coral-xyz/anchor");
const nodewallet_js_1 = __importDefault(require("@coral-xyz/anchor/dist/cjs/nodewallet.js"));
const web3_js_1 = require("@solana/web3.js");
const fs_1 = require("fs");
const os_1 = require("os");
const soulboard_sdk_1 = require("soulboard-sdk");
const DEVNET_URL = 'https://api.devnet.solana.com';
function loadWallet(keypairPath) {
    const path = keypairPath || `${(0, os_1.homedir)()}/.config/solana/phantom.json`;
    try {
        const keypairData = JSON.parse((0, fs_1.readFileSync)(path, 'utf-8'));
        return web3_js_1.Keypair.fromSecretKey(new Uint8Array(keypairData));
    }
    catch (error) {
        throw new Error(`Failed to load keypair from ${path}: ${error}`);
    }
}
function createClient(keypairPath) {
    const connection = new web3_js_1.Connection(DEVNET_URL, 'confirmed');
    const wallet = loadWallet(keypairPath);
    const nodeWallet = new nodewallet_js_1.default(wallet);
    const provider = new anchor_1.AnchorProvider(connection, nodeWallet, { commitment: 'confirmed' });
    return new soulboard_sdk_1.SoulboardClient({ provider });
}
function formatAddress(address, chars = 4) {
    const str = typeof address === 'string' ? address : address.toString();
    return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}
function lamportsToSol(lamports) {
    if (typeof lamports === 'object' && 'toNumber' in lamports) {
        return lamports.toNumber() / 1e9;
    }
    return Number(lamports) / 1e9;
}
//# sourceMappingURL=client.js.map