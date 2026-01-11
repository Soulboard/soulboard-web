import { BN } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import { fetchAccountOrThrow } from "@soulboard/core/accounts";
import { OracleContext } from "@soulboard/programs/oracle/context";
import {
  findDevicePda,
  findRegistryPda,
} from "@soulboard/programs/oracle/pdas";
import {
  DeviceAccount,
  DeviceRegistryAccount,
  DeviceRegistryWithAddress,
  DeviceStatus,
  DeviceWithAddress,
} from "@soulboard/programs/oracle/types";
import {
  decodeAccount,
  resolveAuthority,
  toBN,
} from "@soulboard/programs/oracle/utils";

export class DeviceService {
  constructor(private readonly context: OracleContext) {}

  async createRegistry(
    authority?: PublicKey
  ): Promise<DeviceRegistryWithAddress> {
    const signer = resolveAuthority(this.context, authority);
    const [registry] = findRegistryPda(signer, this.context.programId);

    await this.context.executor.run("createDeviceRegistry", () =>
      this.context.program.methods
        .createDeviceRegistry()
        .accounts({
          authority: signer,
        })
        .rpc()
    );

    const data = await this.fetchRegistryByAddress(registry);
    return { address: registry, data };
  }

  async registerDevice(
    location: PublicKey,
    oracleAuthority: PublicKey,
    authority?: PublicKey
  ): Promise<DeviceWithAddress> {
    const signer = resolveAuthority(this.context, authority);
    const [registry] = findRegistryPda(signer, this.context.programId);
    const registryData = await this.fetchRegistryByAddress(registry);
    const [device] = findDevicePda(
      signer,
      registryData.lastDeviceId,
      this.context.programId
    );

    await this.context.executor.run("registerDevice", () =>
      this.context.program.methods
        .registerDevice(location, oracleAuthority)
        .accounts({
          authority: signer,
          registry,
          device,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async updateLocation(
    deviceIdx: BN | number | bigint,
    location: PublicKey,
    authority?: PublicKey
  ): Promise<DeviceWithAddress> {
    const signer = resolveAuthority(this.context, authority);
    const [device] = findDevicePda(signer, deviceIdx, this.context.programId);

    await this.context.executor.run("updateDeviceLocation", () =>
      this.context.program.methods
        .updateDeviceLocation(toBN(deviceIdx), location)
        .accounts({
          authority: signer,
          device,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async updateOracle(
    deviceIdx: BN | number | bigint,
    oracleAuthority: PublicKey,
    authority?: PublicKey
  ): Promise<DeviceWithAddress> {
    const signer = resolveAuthority(this.context, authority);
    const [device] = findDevicePda(signer, deviceIdx, this.context.programId);

    await this.context.executor.run("updateDeviceOracle", () =>
      this.context.program.methods
        .updateDeviceOracle(toBN(deviceIdx), oracleAuthority)
        .accounts({
          authority: signer,
          device,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async setStatus(
    deviceIdx: BN | number | bigint,
    status: DeviceStatus,
    authority?: PublicKey
  ): Promise<DeviceWithAddress> {
    const signer = resolveAuthority(this.context, authority);
    const [device] = findDevicePda(signer, deviceIdx, this.context.programId);

    await this.context.executor.run("setDeviceStatus", () =>
      this.context.program.methods
        .setDeviceStatus(toBN(deviceIdx), status)
        .accounts({
          authority: signer,
          device,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async reportMetrics(
    deviceAuthority: PublicKey,
    deviceIdx: BN | number | bigint,
    views: BN | number | bigint,
    impressions: BN | number | bigint,
    oracleAuthority?: PublicKey
  ): Promise<DeviceWithAddress> {
    const oracleSigner = resolveAuthority(this.context, oracleAuthority);
    const [device] = findDevicePda(
      deviceAuthority,
      deviceIdx,
      this.context.programId
    );

    await this.context.executor.run("reportDeviceMetrics", () =>
      this.context.program.methods
        .reportDeviceMetrics(toBN(deviceIdx), toBN(views), toBN(impressions))
        .accounts({
          deviceAuthority,
          oracleAuthority: oracleSigner,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async fetch(
    authority: PublicKey,
    deviceIdx: BN | number | bigint
  ): Promise<DeviceWithAddress> {
    const [device] = findDevicePda(
      authority,
      deviceIdx,
      this.context.programId
    );
    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async fetchByAddress(address: PublicKey): Promise<DeviceAccount> {
    return fetchAccountOrThrow("fetchDevice", address, () =>
      this.context.program.account.device.fetch(address)
    );
  }

  async fetchRegistry(
    authority: PublicKey
  ): Promise<DeviceRegistryWithAddress> {
    const [registry] = findRegistryPda(authority, this.context.programId);
    const data = await this.fetchRegistryByAddress(registry);
    return { address: registry, data };
  }

  async fetchRegistryByAddress(
    address: PublicKey
  ): Promise<DeviceRegistryAccount> {
    return fetchAccountOrThrow("fetchDeviceRegistry", address, () =>
      this.context.program.account.deviceRegistry.fetch(address)
    );
  }

  async onChange(
    authority: PublicKey,
    deviceIdx: BN | number | bigint,
    handler: (device: DeviceWithAddress) => void
  ): Promise<() => Promise<void>> {
    const [device] = findDevicePda(
      authority,
      deviceIdx,
      this.context.programId
    );
    return this.context.events.subscribeToAccount(device, (accountInfo) => {
      const data = decodeAccount<DeviceAccount>(
        this.context.program,
        "device",
        accountInfo.data
      );
      handler({ address: device, data });
    });
  }
}
