"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDevicePda = exports.findRegistryPda = exports.SOULBOARD_ORACLE_PROGRAM_ID = void 0;
const web3_js_1 = require("@solana/web3.js");
const bn_js_1 = __importDefault(require("bn.js"));
const errors_1 = require("@soulboard/core/errors");
exports.SOULBOARD_ORACLE_PROGRAM_ID = new web3_js_1.PublicKey("HbjHJmYYCSjfyiJWCRvaYWo1vKsgRurFDkrxNnNusVFX");
const DEVICE_REGISTRY_SEED = Buffer.from("device_registry");
const DEVICE_SEED = Buffer.from("device");
const toU64Buffer = (value) => {
    const bn = bn_js_1.default.isBN(value) ? value : new bn_js_1.default(value.toString());
    if (bn.isNeg()) {
        throw new errors_1.InvalidArgumentError("Index must be a non-negative integer");
    }
    if (bn.bitLength() > 64) {
        throw new errors_1.InvalidArgumentError("Index exceeds u64 max value");
    }
    return bn.toArrayLike(Buffer, "le", 8);
};
const findRegistryPda = (authority, programId = exports.SOULBOARD_ORACLE_PROGRAM_ID) => web3_js_1.PublicKey.findProgramAddressSync([DEVICE_REGISTRY_SEED, authority.toBuffer()], programId);
exports.findRegistryPda = findRegistryPda;
const findDevicePda = (authority, deviceIdx, programId = exports.SOULBOARD_ORACLE_PROGRAM_ID) => web3_js_1.PublicKey.findProgramAddressSync([DEVICE_SEED, authority.toBuffer(), toU64Buffer(deviceIdx)], programId);
exports.findDevicePda = findDevicePda;
