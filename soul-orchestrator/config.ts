import { PublicKey } from "@solana/web3.js";
import path from "path";

export interface OrchestratorConfig {
  rpcUrl: string;
  walletPath: string;
  thingspeakUrl: string;
  channelId: number;
  deviceIdx?: number;
  deviceAuthority?: PublicKey;
  location?: PublicKey;
  pollIntervalMs: number;
  statePath: string;
  allowRegister: boolean;
}

const parseNumber = (value: string | undefined, label: string): number | undefined => {
  if (!value) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${label} must be a non-negative number`);
  }
  return parsed;
};

const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) return defaultValue;
  return value.toLowerCase() === "true";
};

const parsePublicKey = (value: string | undefined, label: string): PublicKey | undefined => {
  if (!value) return undefined;
  try {
    return new PublicKey(value);
  } catch (error) {
    throw new Error(`${label} must be a valid public key`);
  }
};

export const loadConfig = (): OrchestratorConfig => {
  const rpcUrl = process.env.RPC_URL ?? "https://api.devnet.solana.com";
  const walletPath =
    process.env.WALLET_PATH ?? `${process.env.HOME}/.config/solana/phantom.json`;
  const thingspeakUrl =
    process.env.THINGSPEAK_URL ??
    "https://api.thingspeak.com/channels/2890626/feeds.json?results=11";
  const channelId = Number(thingspeakUrl.match(/channels\/(\d+)\//)?.[1] ?? 0);
  const deviceIdx = parseNumber(process.env.DEVICE_IDX, "DEVICE_IDX");
  const deviceAuthority = parsePublicKey(
    process.env.DEVICE_AUTHORITY,
    "DEVICE_AUTHORITY"
  );
  const location = parsePublicKey(
    process.env.LOCATION_PUBKEY ?? process.env.DEVICE_LOCATION,
    "LOCATION_PUBKEY"
  );
  const pollIntervalMs =
    parseNumber(process.env.POLL_INTERVAL_MS, "POLL_INTERVAL_MS") ??
    2 * 60 * 1_000;
  const statePath = path.resolve(
    process.env.STATE_PATH ?? path.join(process.cwd(), "oracle-state.json")
  );
  const allowRegister = parseBoolean(process.env.ALLOW_REGISTER, true);

  if (!Number.isFinite(channelId) || channelId <= 0) {
    throw new Error("Unable to derive channel ID from THINGSPEAK_URL");
  }

  return {
    rpcUrl,
    walletPath,
    thingspeakUrl,
    channelId,
    deviceIdx,
    deviceAuthority,
    location,
    pollIntervalMs,
    statePath,
    allowRegister,
  };
};
