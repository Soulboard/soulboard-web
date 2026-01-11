import { BN } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { OracleContext } from "@soulboard/programs/oracle/context";
import { DeviceAccount, DeviceRegistryAccount, DeviceRegistryWithAddress, DeviceStatus, DeviceWithAddress } from "@soulboard/programs/oracle/types";
export declare class DeviceService {
    private readonly context;
    constructor(context: OracleContext);
    createRegistry(authority?: PublicKey): Promise<DeviceRegistryWithAddress>;
    registerDevice(location: PublicKey, oracleAuthority: PublicKey, authority?: PublicKey): Promise<DeviceWithAddress>;
    updateLocation(deviceIdx: BN | number | bigint, location: PublicKey, authority?: PublicKey): Promise<DeviceWithAddress>;
    updateOracle(deviceIdx: BN | number | bigint, oracleAuthority: PublicKey, authority?: PublicKey): Promise<DeviceWithAddress>;
    setStatus(deviceIdx: BN | number | bigint, status: DeviceStatus, authority?: PublicKey): Promise<DeviceWithAddress>;
    reportMetrics(deviceAuthority: PublicKey, deviceIdx: BN | number | bigint, views: BN | number | bigint, impressions: BN | number | bigint, oracleAuthority?: PublicKey): Promise<DeviceWithAddress>;
    fetch(authority: PublicKey, deviceIdx: BN | number | bigint): Promise<DeviceWithAddress>;
    fetchByAddress(address: PublicKey): Promise<DeviceAccount>;
    fetchRegistry(authority: PublicKey): Promise<DeviceRegistryWithAddress>;
    fetchRegistryByAddress(address: PublicKey): Promise<DeviceRegistryAccount>;
    onChange(authority: PublicKey, deviceIdx: BN | number | bigint, handler: (device: DeviceWithAddress) => void): Promise<() => Promise<void>>;
}
