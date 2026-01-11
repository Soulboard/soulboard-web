import { PublicKey } from "@solana/web3.js";
export declare const fetchAccountOrThrow: <T>(label: string, address: PublicKey, fetcher: () => Promise<T>) => Promise<T>;
