import { AnchorProvider, Wallet } from "@coral-xyz/anchor";
import { Commitment, ConfirmOptions, Connection, PublicKey } from "@solana/web3.js";
export interface ProviderConfig {
    connection: Connection | string;
    wallet: Wallet;
    opts?: ConfirmOptions;
    commitment?: Commitment;
}
export type ProviderInput = AnchorProvider | ProviderConfig;
export declare const createProvider: (config: ProviderConfig) => AnchorProvider;
export declare const resolveProvider: (input: ProviderInput) => AnchorProvider;
export declare const getProviderWallet: (provider: AnchorProvider) => PublicKey;
export declare const resolveAuthority: (provider: AnchorProvider, authority?: PublicKey) => PublicKey;
//# sourceMappingURL=provider.d.ts.map