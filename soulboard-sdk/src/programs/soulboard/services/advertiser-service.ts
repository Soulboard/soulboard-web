import { PublicKey, SystemProgram } from "@solana/web3.js";
import { fetchAccountOrThrow } from "@soulboard/core/accounts";
import {
  AccountWithAddress,
  AdvertiserAccount,
} from "@soulboard/programs/soulboard/types";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
import { findAdvertiserPda } from "@soulboard/programs/soulboard/pdas";
import {
  decodeAccount,
  resolveAuthority,
} from "@soulboard/programs/soulboard/utils";

export class AdvertiserService {
  constructor(private readonly context: SoulboardContext) {}

  async create(
    authority?: PublicKey
  ): Promise<AccountWithAddress<AdvertiserAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [advertiser] = findAdvertiserPda(signer, this.context.programId);

    const signature = await this.context.executor.run("createAdvertiser", () =>
      this.context.program.methods
        .createAdvertiser()
        .accounts({
          authority: signer,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(advertiser);
    return { address: advertiser, data };
  }

  async fetch(
    authority: PublicKey
  ): Promise<AccountWithAddress<AdvertiserAccount>> {
    const [advertiser] = findAdvertiserPda(authority, this.context.programId);
    const data = await this.fetchByAddress(advertiser);
    return { address: advertiser, data };
  }

  async fetchByAddress(address: PublicKey): Promise<AdvertiserAccount> {
    return fetchAccountOrThrow("fetchAdvertiser", address, () =>
      this.context.program.account.advertiser.fetch(address)
    );
  }

  async list(): Promise<AccountWithAddress<AdvertiserAccount>[]> {
    const accounts = await this.context.program.account.advertiser.all();
    return accounts.map((account) => ({
      address: account.publicKey,
      data: account.account,
    }));
  }

  async onChange(
    authority: PublicKey,
    handler: (advertiser: AccountWithAddress<AdvertiserAccount>) => void
  ): Promise<() => Promise<void>> {
    const [advertiser] = findAdvertiserPda(authority, this.context.programId);
    return this.context.events.subscribeToAccount(advertiser, (accountInfo) => {
      const data = decodeAccount<AdvertiserAccount>(
        this.context.program,
        "advertiser",
        accountInfo.data
      );
      handler({ address: advertiser, data });
    });
  }
}
