import { PublicKey } from "@solana/web3.js";
import { InvalidArgumentError } from "@soulboard/core/errors";

export const SOULBOARD_PROGRAM_ID = new PublicKey("61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQ");

const ADVERTISER_SEED = Buffer.from("advertiser");
const CAMPAIGN_SEED = Buffer.from("campaign");
const PROVIDER_SEED = Buffer.from("provider");
const LOCATION_SEED = Buffer.from("location");

const assertU8 = (value: number): number => {
  if (!Number.isInteger(value) || value < 0 || value > 255) {
    throw new InvalidArgumentError(`Index ${value} must be an unsigned 8-bit integer`);
  }
  return value;
};

export const findAdvertiserPda = (
  authority: PublicKey,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] => PublicKey.findProgramAddressSync([ADVERTISER_SEED, authority.toBuffer()], programId);

export const findCampaignPda = (
  authority: PublicKey,
  campaignIdx: number,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] => {
  const idx = assertU8(campaignIdx);
  return PublicKey.findProgramAddressSync(
    [CAMPAIGN_SEED, authority.toBuffer(), Buffer.from([idx])],
    programId
  );
};

export const findProviderPda = (
  authority: PublicKey,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] => PublicKey.findProgramAddressSync([PROVIDER_SEED, authority.toBuffer()], programId);

export const findLocationPda = (
  authority: PublicKey,
  locationIdx: number,
  programId: PublicKey = SOULBOARD_PROGRAM_ID
): [PublicKey, number] => {
  const idx = assertU8(locationIdx);
  return PublicKey.findProgramAddressSync(
    [LOCATION_SEED, authority.toBuffer(), Buffer.from([idx])],
    programId
  );
};
