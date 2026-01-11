import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet.js';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';
import { readFileSync } from 'fs';
import { homedir } from 'os';
import { SoulboardClient } from 'soulboard-sdk';

const DEVNET_URL = 'https://api.devnet.solana.com';

export function loadWallet(keypairPath?: string): Keypair {
  const path = keypairPath || `${homedir()}/.config/solana/phantom.json`;
  try {
    const keypairData = JSON.parse(readFileSync(path, 'utf-8'));
    return Keypair.fromSecretKey(new Uint8Array(keypairData));
  } catch (error) {
    throw new Error(`Failed to load keypair from ${path}: ${error}`);
  }
}

export function createClient(keypairPath?: string): SoulboardClient {
  const connection = new Connection(DEVNET_URL, 'confirmed');
  const wallet = loadWallet(keypairPath);
  const nodeWallet = new NodeWallet(wallet);

  const provider = new AnchorProvider(
    connection,
    nodeWallet,
    { commitment: 'confirmed' }
  );

  return new SoulboardClient({ provider });
}

export function formatAddress(address: PublicKey | string, chars = 4): string {
  const str = typeof address === 'string' ? address : address.toString();
  return `${str.slice(0, chars)}...${str.slice(-chars)}`;
}

export function lamportsToSol(lamports: number | bigint | any): number {
  if (typeof lamports === 'object' && 'toNumber' in lamports) {
    return lamports.toNumber() / 1e9;
  }
  return Number(lamports) / 1e9;
}
