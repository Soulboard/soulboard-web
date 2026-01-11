import { PublicKey, SystemProgram } from "@solana/web3.js";
import { fetchAccountOrThrow } from "@soulboard/core/accounts";
import { OracleContext } from "@soulboard/programs/oracle/context";
import { findDevicePda } from "@soulboard/programs/oracle/pdas";
import { DeviceAccount, DeviceWithAddress } from "@soulboard/programs/oracle/types";
import { decodeAccount, resolveAuthority } from "@soulboard/programs/oracle/utils";

export class DeviceService {
  constructor(private readonly context: OracleContext) {}

  async initialize(location: PublicKey, authority?: PublicKey): Promise<DeviceWithAddress> {
    const signer = resolveAuthority(this.context, authority);
    const [device] = findDevicePda(signer, this.context.programId);

    await this.context.executor.run("initializeDevice", () =>
      this.context.program.methods
        .initialize(location)
        .accounts({
          authority: signer,
          device,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async add(authority?: PublicKey): Promise<DeviceWithAddress> {
    const signer = resolveAuthority(this.context, authority);
    const [device] = findDevicePda(signer, this.context.programId);

    await this.context.executor.run("addDevice", () =>
      this.context.program.methods
        .addDevice()
        .accounts({
          authority: signer,
          device,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async updateMetrics(authority?: PublicKey): Promise<DeviceWithAddress> {
    const signer = resolveAuthority(this.context, authority);
    const [device] = findDevicePda(signer, this.context.programId);

    await this.context.executor.run("updateDeviceMetrics", () =>
      this.context.program.methods
        .updateDeviceMetrics()
        .accounts({
          authority: signer,
          device,
          systemProgram: SystemProgram.programId,
        })
        .rpc()
    );

    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async fetch(authority: PublicKey): Promise<DeviceWithAddress> {
    const [device] = findDevicePda(authority, this.context.programId);
    const data = await this.fetchByAddress(device);
    return { address: device, data };
  }

  async fetchByAddress(address: PublicKey): Promise<DeviceAccount> {
    return fetchAccountOrThrow("fetchDevice", address, () =>
      this.context.program.account.device.fetch(address)
    );
  }

  async onChange(
    authority: PublicKey,
    handler: (device: DeviceWithAddress) => void
  ): Promise<() => Promise<void>> {
    const [device] = findDevicePda(authority, this.context.programId);
    return this.context.events.subscribeToAccount(device, (accountInfo) => {
      const data = decodeAccount<DeviceAccount>(this.context.program, "device", accountInfo.data);
      handler({ address: device, data });
    });
  }
}
