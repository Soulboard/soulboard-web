"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionExecutor = void 0;
const errors_1 = require("./errors");
class TransactionExecutor {
    mapError;
    constructor(mapError = errors_1.mapToSdkError) {
        this.mapError = mapError;
    }
    async run(label, operation) {
        try {
            return await operation();
        }
        catch (error) {
            throw this.mapError(error, label);
        }
    }
}
exports.TransactionExecutor = TransactionExecutor;
//# sourceMappingURL=transactions.js.map