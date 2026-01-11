import { PublicKey } from "@solana/web3.js";
import { AccountWithAddress, AdvertiserAccount } from "@soulboard/programs/soulboard/types";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
export declare class AdvertiserService {
    private readonly context;
    constructor(context: SoulboardContext);
    create(authority?: PublicKey): Promise<AccountWithAddress<AdvertiserAccount>>;
    fetch(authority: PublicKey): Promise<AccountWithAddress<AdvertiserAccount>>;
    fetchByAddress(address: PublicKey): Promise<AdvertiserAccount>;
    list(): Promise<AccountWithAddress<AdvertiserAccount>[]>;
    onChange(authority: PublicKey, handler: (advertiser: AccountWithAddress<AdvertiserAccount>) => void): Promise<() => Promise<void>>;
}
