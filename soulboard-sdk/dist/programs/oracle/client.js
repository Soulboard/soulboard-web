"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OracleClient = void 0;
const context_1 = require("./context");
const device_service_1 = require("./services/device-service");
class OracleClient {
    context;
    devices;
    constructor(config) {
        this.context = (0, context_1.createOracleContext)(config);
        this.devices = new device_service_1.DeviceService(this.context);
    }
    get provider() {
        return this.context.provider;
    }
    get program() {
        return this.context.program;
    }
    get programId() {
        return this.context.programId;
    }
    get events() {
        return this.context.events;
    }
    async onProgramLogs(handler) {
        return this.context.events.subscribeToProgramLogs(this.programId, handler);
    }
    async close() {
        await this.context.events.closeAll();
    }
}
exports.OracleClient = OracleClient;
//# sourceMappingURL=client.js.map