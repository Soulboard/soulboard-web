"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdvertiserService = void 0;
const accounts_1 = require("../../../core/accounts");
const pdas_1 = require("../pdas");
const utils_1 = require("../utils");
class AdvertiserService {
    context;
    constructor(context) {
        this.context = context;
    }
    async create(authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [advertiser] = (0, pdas_1.findAdvertiserPda)(signer, this.context.programId);
        const signature = await this.context.executor.run("createAdvertiser", () => this.context.program.methods
            .createAdvertiser()
            .accounts({
            authority: signer,
        })
            .rpc());
        const data = await this.fetchByAddress(advertiser);
        return { address: advertiser, data };
    }
    async fetch(authority) {
        const [advertiser] = (0, pdas_1.findAdvertiserPda)(authority, this.context.programId);
        const data = await this.fetchByAddress(advertiser);
        return { address: advertiser, data };
    }
    async fetchByAddress(address) {
        return (0, accounts_1.fetchAccountOrThrow)("fetchAdvertiser", address, () => this.context.program.account.advertiser.fetch(address));
    }
    async list() {
        const accounts = await this.context.program.account.advertiser.all();
        return accounts.map((account) => ({
            address: account.publicKey,
            data: account.account,
        }));
    }
    async onChange(authority, handler) {
        const [advertiser] = (0, pdas_1.findAdvertiserPda)(authority, this.context.programId);
        return this.context.events.subscribeToAccount(advertiser, (accountInfo) => {
            const data = (0, utils_1.decodeAccount)(this.context.program, "advertiser", accountInfo.data);
            handler({ address: advertiser, data });
        });
    }
}
exports.AdvertiserService = AdvertiserService;
//# sourceMappingURL=advertiser-service.js.map