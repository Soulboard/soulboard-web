"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProviderService = void 0;
const accounts_1 = require("@soulboard/core/accounts");
const pdas_1 = require("@soulboard/programs/soulboard/pdas");
const utils_1 = require("@soulboard/programs/soulboard/utils");
class ProviderService {
    constructor(context) {
        this.context = context;
    }
    async create(authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [provider] = (0, pdas_1.findProviderPda)(signer, this.context.programId);
        await this.context.executor.run("createProvider", () => this.context.program.methods
            .createProvider()
            .accounts({
            authority: signer,
        })
            .rpc());
        const data = await this.fetchByAddress(provider);
        return { address: provider, data };
    }
    async fetch(authority) {
        const [provider] = (0, pdas_1.findProviderPda)(authority, this.context.programId);
        const data = await this.fetchByAddress(provider);
        return { address: provider, data };
    }
    async fetchByAddress(address) {
        return (0, accounts_1.fetchAccountOrThrow)("fetchProvider", address, () => this.context.program.account.provider.fetch(address));
    }
    async list() {
        const accounts = await this.context.program.account.provider.all();
        return accounts.map((account) => ({
            address: account.publicKey,
            data: account.account,
        }));
    }
    async onChange(authority, handler) {
        const [provider] = (0, pdas_1.findProviderPda)(authority, this.context.programId);
        return this.context.events.subscribeToAccount(provider, (accountInfo) => {
            const data = (0, utils_1.decodeAccount)(this.context.program, "provider", accountInfo.data);
            handler({ address: provider, data });
        });
    }
}
exports.ProviderService = ProviderService;
