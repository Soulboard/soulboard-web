"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveAuthority = exports.getProviderWallet = exports.resolveProvider = exports.createProvider = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const web3_js_1 = require("@solana/web3.js");
const errors_1 = require("./errors");
const createProvider = (config) => {
    const commitment = config.commitment ?? "confirmed";
    const connection = typeof config.connection === "string"
        ? new web3_js_1.Connection(config.connection, commitment)
        : config.connection;
    const opts = config.opts ?? anchor_1.AnchorProvider.defaultOptions();
    return new anchor_1.AnchorProvider(connection, config.wallet, {
        ...opts,
        commitment,
    });
};
exports.createProvider = createProvider;
const resolveProvider = (input) => input instanceof anchor_1.AnchorProvider ? input : (0, exports.createProvider)(input);
exports.resolveProvider = resolveProvider;
const getProviderWallet = (provider) => {
    const wallet = provider.wallet?.publicKey;
    if (!wallet) {
        throw new errors_1.MissingWalletError();
    }
    return wallet;
};
exports.getProviderWallet = getProviderWallet;
const resolveAuthority = (provider, authority) => authority ?? (0, exports.getProviderWallet)(provider);
exports.resolveAuthority = resolveAuthority;
//# sourceMappingURL=provider.js.map