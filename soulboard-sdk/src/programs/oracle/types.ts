import { IdlAccounts, IdlTypes } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";
import { SoulBoardOracle } from "@soulboard/types/soul_board_oracle";

export type DeviceAccount = IdlAccounts<SoulBoardOracle>["device"];
export type DeviceMetrics = IdlTypes<SoulBoardOracle>["deviceMetrics"];
export type DeviceMetric = IdlTypes<SoulBoardOracle>["deviceMetric"];

export interface DeviceWithAddress {
  address: PublicKey;
  data: DeviceAccount;
}
