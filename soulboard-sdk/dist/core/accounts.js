"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchAccountOrThrow = void 0;
const errors_1 = require("./errors");
const ACCOUNT_NOT_FOUND = /account does not exist/i;
const fetchAccountOrThrow = async (label, address, fetcher) => {
    try {
        return await fetcher();
    }
    catch (error) {
        if (error instanceof Error && ACCOUNT_NOT_FOUND.test(error.message)) {
            throw new errors_1.AccountNotFoundError(address.toBase58(), error);
        }
        throw (0, errors_1.mapToSdkError)(error, label);
    }
};
exports.fetchAccountOrThrow = fetchAccountOrThrow;
//# sourceMappingURL=accounts.js.map