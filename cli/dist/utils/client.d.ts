import { Keypair, PublicKey } from '@solana/web3.js';
import { SoulboardClient } from 'soulboard-sdk';
export declare function loadWallet(keypairPath?: string): Keypair;
export declare function createClient(keypairPath?: string): SoulboardClient;
export declare function formatAddress(address: PublicKey | string, chars?: number): string;
export declare function lamportsToSol(lamports: number | bigint | any): number;
//# sourceMappingURL=client.d.ts.map