import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { AccountWithAddress, CampaignAccount, CampaignMetadata } from "@soulboard/programs/soulboard/types";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
export declare class CampaignService {
    private readonly context;
    constructor(context: SoulboardContext);
    create(metadata: CampaignMetadata, budgetLamports: BN | number | bigint, authority?: PublicKey): Promise<AccountWithAddress<CampaignAccount>>;
    addBudget(campaignIdx: BN | number | bigint, lamports: BN | number | bigint, authority?: PublicKey): Promise<void>;
    withdrawBudget(campaignIdx: BN | number | bigint, lamports: BN | number | bigint, authority?: PublicKey): Promise<void>;
    close(campaignIdx: BN | number | bigint, authority?: PublicKey): Promise<void>;
    update(campaignIdx: BN | number | bigint, updates: Partial<CampaignMetadata>, authority?: PublicKey): Promise<void>;
    fetch(authority: PublicKey, campaignIdx: BN | number | bigint): Promise<AccountWithAddress<CampaignAccount>>;
    fetchByAddress(address: PublicKey): Promise<CampaignAccount>;
    list(): Promise<AccountWithAddress<CampaignAccount>[]>;
    onChange(authority: PublicKey, campaignIdx: BN | number | bigint, handler: (campaign: AccountWithAddress<CampaignAccount>) => void): Promise<() => Promise<void>>;
}
//# sourceMappingURL=campaign-service.d.ts.map