"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeviceService = void 0;
const web3_js_1 = require("@solana/web3.js");
const accounts_1 = require("../../../core/accounts");
const pdas_1 = require("../pdas");
const utils_1 = require("../utils");
class DeviceService {
    context;
    constructor(context) {
        this.context = context;
    }
    async createRegistry(authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [registry] = (0, pdas_1.findRegistryPda)(signer, this.context.programId);
        await this.context.executor.run("createDeviceRegistry", () => this.context.program.methods
            .createDeviceRegistry()
            .accounts({
            authority: signer,
        })
            .rpc());
        const data = await this.fetchRegistryByAddress(registry);
        return { address: registry, data };
    }
    async registerDevice(location, oracleAuthority, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [registry] = (0, pdas_1.findRegistryPda)(signer, this.context.programId);
        const registryData = await this.fetchRegistryByAddress(registry);
        const [device] = (0, pdas_1.findDevicePda)(signer, registryData.lastDeviceId, this.context.programId);
        await this.context.executor.run("registerDevice", () => this.context.program.methods
            .registerDevice(location, oracleAuthority)
            .accounts({
            authority: signer,
            registry,
            device,
            systemProgram: web3_js_1.SystemProgram.programId,
        })
            .rpc());
        const data = await this.fetchByAddress(device);
        return { address: device, data };
    }
    async updateLocation(deviceIdx, location, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [device] = (0, pdas_1.findDevicePda)(signer, deviceIdx, this.context.programId);
        await this.context.executor.run("updateDeviceLocation", () => this.context.program.methods
            .updateDeviceLocation((0, utils_1.toBN)(deviceIdx), location)
            .accounts({
            authority: signer,
            device,
        })
            .rpc());
        const data = await this.fetchByAddress(device);
        return { address: device, data };
    }
    async updateOracle(deviceIdx, oracleAuthority, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [device] = (0, pdas_1.findDevicePda)(signer, deviceIdx, this.context.programId);
        await this.context.executor.run("updateDeviceOracle", () => this.context.program.methods
            .updateDeviceOracle((0, utils_1.toBN)(deviceIdx), oracleAuthority)
            .accounts({
            authority: signer,
            device,
        })
            .rpc());
        const data = await this.fetchByAddress(device);
        return { address: device, data };
    }
    async setStatus(deviceIdx, status, authority) {
        const signer = (0, utils_1.resolveAuthority)(this.context, authority);
        const [device] = (0, pdas_1.findDevicePda)(signer, deviceIdx, this.context.programId);
        await this.context.executor.run("setDeviceStatus", () => this.context.program.methods
            .setDeviceStatus((0, utils_1.toBN)(deviceIdx), status)
            .accounts({
            authority: signer,
            device,
        })
            .rpc());
        const data = await this.fetchByAddress(device);
        return { address: device, data };
    }
    async reportMetrics(deviceAuthority, deviceIdx, views, impressions, oracleAuthority) {
        const oracleSigner = (0, utils_1.resolveAuthority)(this.context, oracleAuthority);
        const [device] = (0, pdas_1.findDevicePda)(deviceAuthority, deviceIdx, this.context.programId);
        await this.context.executor.run("reportDeviceMetrics", () => this.context.program.methods
            .reportDeviceMetrics((0, utils_1.toBN)(deviceIdx), (0, utils_1.toBN)(views), (0, utils_1.toBN)(impressions))
            .accounts({
            deviceAuthority,
            oracleAuthority: oracleSigner,
        })
            .rpc());
        const data = await this.fetchByAddress(device);
        return { address: device, data };
    }
    async fetch(authority, deviceIdx) {
        const [device] = (0, pdas_1.findDevicePda)(authority, deviceIdx, this.context.programId);
        const data = await this.fetchByAddress(device);
        return { address: device, data };
    }
    async fetchByAddress(address) {
        return (0, accounts_1.fetchAccountOrThrow)("fetchDevice", address, () => this.context.program.account.device.fetch(address));
    }
    async fetchRegistry(authority) {
        const [registry] = (0, pdas_1.findRegistryPda)(authority, this.context.programId);
        const data = await this.fetchRegistryByAddress(registry);
        return { address: registry, data };
    }
    async fetchRegistryByAddress(address) {
        return (0, accounts_1.fetchAccountOrThrow)("fetchDeviceRegistry", address, () => this.context.program.account.deviceRegistry.fetch(address));
    }
    async onChange(authority, deviceIdx, handler) {
        const [device] = (0, pdas_1.findDevicePda)(authority, deviceIdx, this.context.programId);
        return this.context.events.subscribeToAccount(device, (accountInfo) => {
            const data = (0, utils_1.decodeAccount)(this.context.program, "device", accountInfo.data);
            handler({ address: device, data });
        });
    }
}
exports.DeviceService = DeviceService;
//# sourceMappingURL=device-service.js.map