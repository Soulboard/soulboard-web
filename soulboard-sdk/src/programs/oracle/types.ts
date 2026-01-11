import { IdlAccounts, IdlTypes } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { SoulBoardOracle } from "@soulboard/types/soul_board_oracle";

export type DeviceAccount = IdlAccounts<SoulBoardOracle>["device"];
export type DeviceRegistryAccount =
  IdlAccounts<SoulBoardOracle>["deviceRegistry"];
export type DeviceMetrics = IdlTypes<SoulBoardOracle>["deviceMetrics"];
export type DeviceStatus = IdlTypes<SoulBoardOracle>["deviceStatus"];

export interface DeviceWithAddress {
  address: PublicKey;
  data: DeviceAccount;
}

export interface DeviceRegistryWithAddress {
  address: PublicKey;
  data: DeviceRegistryAccount;
}
