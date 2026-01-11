import { PublicKey } from "@solana/web3.js";
import { AccountWithAddress, ProviderAccount } from "@soulboard/programs/soulboard/types";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
export declare class ProviderService {
    private readonly context;
    constructor(context: SoulboardContext);
    create(authority?: PublicKey): Promise<AccountWithAddress<ProviderAccount>>;
    fetch(authority: PublicKey): Promise<AccountWithAddress<ProviderAccount>>;
    fetchByAddress(address: PublicKey): Promise<ProviderAccount>;
    list(): Promise<AccountWithAddress<ProviderAccount>[]>;
    onChange(authority: PublicKey, handler: (provider: AccountWithAddress<ProviderAccount>) => void): Promise<() => Promise<void>>;
}
