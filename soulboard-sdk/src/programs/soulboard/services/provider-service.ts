import { PublicKey, SystemProgram } from "@solana/web3.js";
import { fetchAccountOrThrow } from "@soulboard/core/accounts";
import {
  AccountWithAddress,
  ProviderAccount,
} from "@soulboard/programs/soulboard/types";
import { SoulboardContext } from "@soulboard/programs/soulboard/context";
import { findProviderPda } from "@soulboard/programs/soulboard/pdas";
import {
  decodeAccount,
  resolveAuthority,
} from "@soulboard/programs/soulboard/utils";

export class ProviderService {
  constructor(private readonly context: SoulboardContext) {}

  async create(
    authority?: PublicKey
  ): Promise<AccountWithAddress<ProviderAccount>> {
    const signer = resolveAuthority(this.context, authority);
    const [provider] = findProviderPda(signer, this.context.programId);

    await this.context.executor.run("createProvider", () =>
      this.context.program.methods
        .createProvider()
        .accounts({
          authority: signer,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(provider);
    return { address: provider, data };
  }

  async fetch(
    authority: PublicKey
  ): Promise<AccountWithAddress<ProviderAccount>> {
    const [provider] = findProviderPda(authority, this.context.programId);
    const data = await this.fetchByAddress(provider);
    return { address: provider, data };
  }

  async fetchByAddress(address: PublicKey): Promise<ProviderAccount> {
    return fetchAccountOrThrow("fetchProvider", address, () =>
      this.context.program.account.provider.fetch(address)
    );
  }

  async list(): Promise<AccountWithAddress<ProviderAccount>[]> {
    const accounts = await this.context.program.account.provider.all();
    return accounts.map((account) => ({
      address: account.publicKey,
      data: account.account,
    }));
  }

  async onChange(
    authority: PublicKey,
    handler: (provider: AccountWithAddress<ProviderAccount>) => void
  ): Promise<() => Promise<void>> {
    const [provider] = findProviderPda(authority, this.context.programId);
    return this.context.events.subscribeToAccount(provider, (accountInfo) => {
      const data = decodeAccount<ProviderAccount>(
        this.context.program,
        "provider",
        accountInfo.data
      );
      handler({ address: provider, data });
    });
  }
}
