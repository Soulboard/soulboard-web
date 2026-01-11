"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAccount = exports.toBN = exports.resolveAuthority = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const provider_1 = require("../../core/provider");
const resolveAuthority = (context, authority) => (0, provider_1.resolveAuthority)(context.provider, authority);
exports.resolveAuthority = resolveAuthority;
const toBN = (value) => {
    if (anchor_1.BN.isBN(value)) {
        return value;
    }
    return new anchor_1.BN(value.toString());
};
exports.toBN = toBN;
const decodeAccount = (program, name, data) => program.coder.accounts.decode(name, data);
exports.decodeAccount = decodeAccount;
//# sourceMappingURL=utils.js.map