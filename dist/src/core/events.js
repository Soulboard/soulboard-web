"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSubscriptionManager = void 0;
class EventSubscriptionManager {
    constructor(connection, commitment = "confirmed") {
        this.connection = connection;
        this.commitment = commitment;
        this.accountSubscriptions = new Map();
        this.logSubscriptions = new Map();
    }
    async subscribeToAccount(address, handler) {
        const id = await this.connection.onAccountChange(address, handler, this.commitment);
        this.accountSubscriptions.set(id, address);
        return async () => {
            await this.connection.removeAccountChangeListener(id);
            this.accountSubscriptions.delete(id);
        };
    }
    async subscribeToProgramLogs(programId, handler) {
        const id = await this.connection.onLogs(programId, handler, this.commitment);
        this.logSubscriptions.set(id, programId);
        return async () => {
            await this.connection.removeOnLogsListener(id);
            this.logSubscriptions.delete(id);
        };
    }
    async closeAll() {
        const accountRemovals = [...this.accountSubscriptions.keys()].map((id) => this.connection.removeAccountChangeListener(id));
        const logRemovals = [...this.logSubscriptions.keys()].map((id) => this.connection.removeOnLogsListener(id));
        await Promise.all([...accountRemovals, ...logRemovals]);
        this.accountSubscriptions.clear();
        this.logSubscriptions.clear();
    }
}
exports.EventSubscriptionManager = EventSubscriptionManager;
