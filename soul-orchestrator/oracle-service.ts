import { Wallet } from "@coral-xyz/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs/promises";
import { AccountNotFoundError } from "@soulboard/core/errors";
import { OracleClient } from "@soulboard/programs/oracle";
import { DeviceAccount } from "@soulboard/programs/oracle/types";
import { OrchestratorConfig } from "./config";
import { OracleState } from "./state";

export interface OracleDeviceContext {
  client: OracleClient;
  wallet: Wallet;
  deviceAuthority: PublicKey;
  deviceIdx: number;
  device: DeviceAccount;
}

const loadWallet = async (walletPath: string): Promise<Wallet> => {
  const bytes = JSON.parse(await fs.readFile(walletPath, "utf8"));
  const keypair = Keypair.fromSecretKey(Uint8Array.from(bytes));
  return new Wallet(keypair);
};

export const createOracleClient = async (
  config: OrchestratorConfig
): Promise<OracleClient> => {
  const wallet = await loadWallet(config.walletPath);
  return new OracleClient({
    provider: {
      connection: config.rpcUrl,
      wallet,
    },
  });
};

const ensureRegistry = async (client: OracleClient, authority: PublicKey) => {
  try {
    return await client.devices.fetchRegistry(authority);
  } catch (error) {
    if (error instanceof AccountNotFoundError) {
      return client.devices.createRegistry(authority);
    }
    throw error;
  }
};

const parseDeviceIdx = (value?: string | number): number | undefined => {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error("DEVICE_IDX must be a non-negative number");
  }
  return parsed;
};

export const ensureDevice = async (
  config: OrchestratorConfig,
  state: OracleState,
  allowRegister: boolean
): Promise<OracleDeviceContext> => {
  const client = await createOracleClient(config);
  const wallet = client.provider.wallet as Wallet;
  const walletAuthority = wallet.publicKey;
  const deviceAuthority = config.deviceAuthority ?? walletAuthority;

  await ensureRegistry(client, walletAuthority);

  const configuredIdx =
    parseDeviceIdx(config.deviceIdx) ?? parseDeviceIdx(state.deviceIdx);

  if (configuredIdx === undefined && !allowRegister) {
    throw new Error("DEVICE_IDX is required when auto-registration is disabled");
  }

  if (configuredIdx !== undefined) {
    try {
      const device = await client.devices.fetch(deviceAuthority, configuredIdx);
      const oracleAuthority = walletAuthority;
      if (!device.data.oracleAuthority.equals(oracleAuthority)) {
        throw new Error(
          `Oracle authority mismatch. Expected ${oracleAuthority.toBase58()}, got ${device.data.oracleAuthority.toBase58()}`
        );
      }
      return {
        client,
        wallet,
        deviceAuthority,
        deviceIdx: configuredIdx,
        device: device.data,
      };
    } catch (error) {
      if (!(error instanceof AccountNotFoundError) || !allowRegister) {
        throw error;
      }
    }
  }

  if (!allowRegister) {
    throw new Error("Device account not found and auto-registration is disabled");
  }

  if (!config.location) {
    throw new Error("LOCATION_PUBKEY is required to register a device");
  }

  if (!deviceAuthority.equals(walletAuthority)) {
    throw new Error(
      "Cannot register a device for a different DEVICE_AUTHORITY without its keypair"
    );
  }

  const created = await client.devices.registerDevice(
    config.location,
    walletAuthority
  );

  return {
    client,
    wallet,
    deviceAuthority,
    deviceIdx: Number(created.data.deviceIdx.toString()),
    device: created.data,
  };
};
