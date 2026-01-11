import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { InvalidArgumentError } from "@soulboard/core/errors";

export const SOULBOARD_ORACLE_PROGRAM_ID = new PublicKey(
  "HbjHJmYYCSjfyiJWCRvaYWo1vKsgRurFDkrxNnNusVFX"
);

const DEVICE_REGISTRY_SEED = Buffer.from("device_registry");
const DEVICE_SEED = Buffer.from("device");

const toU64Buffer = (value: BN | number | bigint): Buffer => {
  const bn = BN.isBN(value) ? value : new BN(value.toString());
  if (bn.isNeg()) {
    throw new InvalidArgumentError("Index must be a non-negative integer");
  }
  if (bn.bitLength() > 64) {
    throw new InvalidArgumentError("Index exceeds u64 max value");
  }
  return bn.toArrayLike(Buffer, "le", 8);
};

export const findRegistryPda = (
  authority: PublicKey,
  programId: PublicKey = SOULBOARD_ORACLE_PROGRAM_ID
): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [DEVICE_REGISTRY_SEED, authority.toBuffer()],
    programId
  );

export const findDevicePda = (
  authority: PublicKey,
  deviceIdx: BN | number | bigint,
  programId: PublicKey = SOULBOARD_ORACLE_PROGRAM_ID
): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [DEVICE_SEED, authority.toBuffer(), toU64Buffer(deviceIdx)],
    programId
  );
