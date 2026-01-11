import { PublicKey } from "@solana/web3.js";

export const SOULBOARD_ORACLE_PROGRAM_ID = new PublicKey(
  "9hpXQKdSM4gJLa37Lb259dNJ5J2d6wA2sy2sAzni5nNF"
);

const DEVICE_SEED = Buffer.from("device");

export const findDevicePda = (
  authority: PublicKey,
  programId: PublicKey = SOULBOARD_ORACLE_PROGRAM_ID
): [PublicKey, number] => PublicKey.findProgramAddressSync([DEVICE_SEED, authority.toBuffer()], programId);
