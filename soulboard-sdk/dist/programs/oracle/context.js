"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOracleContext = void 0;
const anchor_1 = require("@coral-xyz/anchor");
const soul_board_oracle_json_1 = __importDefault(require("../../idl/soul_board_oracle.json"));
const events_1 = require("../../core/events");
const errors_1 = require("../../core/errors");
const provider_1 = require("../../core/provider");
const transactions_1 = require("../../core/transactions");
const pdas_1 = require("./pdas");
const createOracleContext = (config) => {
    const provider = (0, provider_1.resolveProvider)(config.provider);
    const programId = config.programId ?? pdas_1.SOULBOARD_ORACLE_PROGRAM_ID;
    const idl = {
        ...soul_board_oracle_json_1.default,
        address: programId.toBase58(),
    };
    const program = new anchor_1.Program(idl, provider);
    const commitment = config.commitment ??
        provider.connection.commitment ??
        provider.opts?.commitment ??
        "confirmed";
    const events = new events_1.EventSubscriptionManager(provider.connection, commitment);
    const executor = new transactions_1.TransactionExecutor(errors_1.mapToSdkError);
    return { provider, program, programId, events, executor };
};
exports.createOracleContext = createOracleContext;
//# sourceMappingURL=context.js.map