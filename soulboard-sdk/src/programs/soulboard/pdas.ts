import { PublicKey } from "@solana/web3.js";
import BN from "bn.js";
import { InvalidArgumentError } from "@soulboard/core/errors";

export const SOULBOARD_PROGRAM_ID = new PublicKey(
  "915wZsHsUJ7Pdei1XUY8jtdfia7D8t4r9XkhGD3TvrDV"
);

const ADVERTISER_SEED = Buffer.from("advertiser");
const CAMPAIGN_SEED = Buffer.from("campaign");
const PROVIDER_SEED = Buffer.from("provider");
const LOCATION_SEED = Buffer.from("location");
const CAMPAIGN_LOCATION_SEED = Buffer.from("campaign_location");
const LOCATION_SCHEDULE_SEED = Buffer.from("location_schedule");
const CAMPAIGN_BOOKING_SEED = Buffer.from("campaign_booking");
const SOULBOARD_CONFIG_SEED = Buffer.from("soulboard_config");

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

const toI64Buffer = (value: BN | number | bigint): Buffer => {
  const bn = BN.isBN(value) ? value : new BN(value.toString());
  if (bn.isNeg()) {
    throw new InvalidArgumentError("Timestamp must be non-negative");
  }
  if (bn.bitLength() > 63) {
    throw new InvalidArgumentError("Timestamp exceeds i64 max value");
  }
  return bn.toArrayLike(Buffer, "le", 8);
};

export const findAdvertiserPda = (
  authority: PublicKey,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [ADVERTISER_SEED, authority.toBuffer()],
    programId
  );

export const findCampaignPda = (
  authority: PublicKey,
  campaignIdx: BN | number | bigint,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [CAMPAIGN_SEED, authority.toBuffer(), toU64Buffer(campaignIdx)],
    programId
  );
};

export const findProviderPda = (
  authority: PublicKey,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [PROVIDER_SEED, authority.toBuffer()],
    programId
  );

export const findLocationPda = (
  authority: PublicKey,
  locationIdx: BN | number | bigint,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] => {
  return PublicKey.findProgramAddressSync(
    [LOCATION_SEED, authority.toBuffer(), toU64Buffer(locationIdx)],
    programId
  );
};

export const findCampaignLocationPda = (
  campaign: PublicKey,
  location: PublicKey,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [CAMPAIGN_LOCATION_SEED, campaign.toBuffer(), location.toBuffer()],
    programId
  );

export const findLocationSchedulePda = (
  location: PublicKey,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [LOCATION_SCHEDULE_SEED, location.toBuffer()],
    programId
  );

export const findCampaignBookingPda = (
  campaign: PublicKey,
  location: PublicKey,
  rangeStartTs: BN | number | bigint,
  rangeEndTs: BN | number | bigint,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] =>
  PublicKey.findProgramAddressSync(
    [
      CAMPAIGN_BOOKING_SEED,
      campaign.toBuffer(),
      location.toBuffer(),
      toI64Buffer(rangeStartTs),
      toI64Buffer(rangeEndTs),
    ],
    programId
  );

export const findSoulboardConfigPda = (
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] =>
  PublicKey.findProgramAddressSync([SOULBOARD_CONFIG_SEED], programId);
