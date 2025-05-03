/*****************************************************************
 *  lib/soulboard-client.ts
 *****************************************************************/
import * as anchor from '@coral-xyz/anchor';
import {
  AnchorProvider,
  Program,
  web3 as anchorWeb3,
  Wallet,
} from '@coral-xyz/anchor';
import type { Commitment, PublicKeyInitData } from '@solana/web3.js';
import { PublicKey, SystemProgram, Connection } from '@solana/web3.js';
import BN from 'bn.js';

/* ──────────────────────────────────────────────────────────── */
/*                         CONFIG                              */
/* ──────────────────────────────────────────────────────────── */

export const SOULBOARD_PROGRAM_ID = new PublicKey(
  '61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQd',
);

const DEFAULT_COMMITMENT: Commitment = 'confirmed';
const DEFAULT_RPC = 'https://devnet.helius-rpc.com/?api-key=5f1828f6-a7b9-417d-9b7c-dadba932af8d';

/* ──────────────────────────────────────────────────────────── */
/*                       IDL IMPORT                            */
/* ──────────────────────────────────────────────────────────── */
// If you generated an IDL JSON during `anchor build`, copy it into
//   `idl/soulboard.json` (or use whatever path you prefer) and
//   adjust the import below.  Next can import JSON natively.
import { Soulboard } from "../../target/types/soulboard"


/* ──────────────────────────────────────────────────────────── */
/*                       TYPE HELPERS                          */
/* ──────────────────────────────────────────────────────────── */

export interface CampaignMetadata {
  campaignName: string;
  campaignDescription: string;
  campaignImageUrl: string;
}
export interface TimeSlotInput {
  slotId: BN;
  price: BN;
  /** status defaults to { available: {} } when omitted */
  status?: {
    available: Record<string, never>;
    booked?: undefined;
    unavailable?: undefined;
  } | {
    available?: undefined;
    booked: { campaignId: PublicKey };
    unavailable?: undefined;
  } | {
    available?: undefined;
    booked?: undefined;
    unavailable: Record<string, never>;
  };
}

/* ──────────────────────────────────────────────────────────── */
/*                      MAIN CLIENT CLASS                       */
/* ──────────────────────────────────────────────────────────── */

export class SoulboardClient {
  readonly connection: Connection;
  readonly wallet: Wallet;
  readonly provider: AnchorProvider;
  readonly program: Program<Soulboard>;

  /* ─────────────── constructor ─────────────── */
  constructor(
    wallet: Wallet,
    {
      rpcEndpoint = DEFAULT_RPC,
      commitment = DEFAULT_COMMITMENT,
      connection,
    }: {
      rpcEndpoint?: string;
      commitment?: Commitment;
      connection?: Connection;
    } = {},
  ) {
    this.connection =
      connection ?? new Connection(rpcEndpoint, { commitment });
    this.wallet = wallet;

    this.provider = new AnchorProvider(
      this.connection,
      this.wallet,
      { commitment },
    );
    anchor.setProvider(this.provider);

    this.program = new Program<Soulboard>(
      soulboardIdl as anchor.Idl,
      SOULBOARD_PROGRAM_ID,
      this.provider,
    );
  }

  /* ────────────────────── PDA HELPERS ────────────────────── */

  /** [Advertiser, bump] */
  getAdvertiserPda(authority: PublicKey = this.wallet.publicKey!) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('advertiser'), authority.toBuffer()],
      SOULBOARD_PROGRAM_ID,
    );
  }

  /** [Campaign, bump] */
  getCampaignPda(authority: PublicKey, campaignIdx: number) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('campaign'),
        authority.toBuffer(),
        new BN(campaignIdx).toArrayLike(Buffer, 'le', 1), // u8
      ],
      SOULBOARD_PROGRAM_ID,
    );
  }

  /** [Provider, bump] */
  getProviderPda(authority: PublicKey = this.wallet.publicKey!) {
    return PublicKey.findProgramAddressSync(
      [Buffer.from('provider'), authority.toBuffer()],
      SOULBOARD_PROGRAM_ID,
    );
  }

  /** [Location, bump] */
  getLocationPda(
    authority: PublicKey,
    locationIdx: number,
  ) {
    return PublicKey.findProgramAddressSync(
      [
        Buffer.from('location'),
        authority.toBuffer(),
        new BN(locationIdx).toArrayLike(Buffer, 'le', 1),
      ],
      SOULBOARD_PROGRAM_ID,
    );
  }

  /* ────────────────────── UTILITIES ─────────────────────── */

  /** "1pm" → BN(unixSeconds).  Pass `date` to pin a different day. */
  static timeStringToUnix(
    timeString: string,
    date: Date = new Date(),
  ): BN {
    const isPM = timeString.toLowerCase().includes('pm');
    let hour = parseInt(timeString.replace(/[^0-9]/g, ''), 10);
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
    date.setHours(hour, 0, 0, 0);
    return new BN(Math.floor(date.getTime() / 1_000));
  }

  /* ─────────────────────── MUTATIONS ────────────────────── */

  /** Creates the Advertiser PDA for the connected wallet. */
  async createAdvertiser() {
    const txSig = await this.program.methods
      .createAdvertiser()
      .accounts({ authority: this.wallet.publicKey })
      .rpc();
    return txSig; // UI can toast & link to explorer
  }

  /** Creates a campaign and returns its PDA (already cached on-chain). */
  async createCampaign(
    metadata: CampaignMetadata,
    budgetLamports: BN,
  ) {
    const advertiserPda = this.getAdvertiserPda()[0];

    const txSig = await this.program.methods
      .createCampaign(
        metadata.campaignName,
        metadata.campaignDescription,
        metadata.campaignImageUrl,
        budgetLamports,
      )
      .accounts({
        advertiser: advertiserPda,
        authority: this.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    // Re-fetch advertiser to learn lastCampaignId
    const advertiserAcc = await this.program.account.advertiser.fetch(
      advertiserPda,
    );
    const campaignIdx = advertiserAcc.lastCampaignId - 1; // new campaign = last-1
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey!,
      campaignIdx,
    )[0];

    return { txSig, campaignPda, campaignIdx };
  }

  /** Tops up campaign escrow */
  async addBudget(
    campaignIdx: number,
    extraLamports: BN,
  ) {
    const advertiserPda = this.getAdvertiserPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey!,
      campaignIdx,
    )[0];

    return this.program.methods
      .addBudget(campaignIdx, extraLamports)
      .accounts({
        advertiser: advertiserPda,
        authority: this.wallet.publicKey,
        campaign: campaignPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  async withdrawAmount(
    campaignIdx: number,
    lamports: BN,
  ) {
    const advertiserPda = this.getAdvertiserPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey!,
      campaignIdx,
    )[0];

    return this.program.methods
      .withdrawAmount(campaignIdx, lamports)
      .accounts({
        advertiser: advertiserPda,
        authority: this.wallet.publicKey,
        campaign: campaignPda,
      })
      .rpc();
  }

  /* -------- Provider / Location flow -------- */

  async createProvider() {
    const txSig = await this.program.methods
      .createProvider()
      .accounts({ authority: this.wallet.publicKey })
      .rpc();
    const providerPda = this.getProviderPda()[0];
    return { txSig, providerPda };
  }

  async registerLocation(
    locationIdx: number,
    name: string,
    description: string,
    slots: TimeSlotInput[],
  ) {
    const providerPda = this.getProviderPda()[0];
    const locationPda = this.getLocationPda(
      this.wallet.publicKey!,
      locationIdx,
    )[0];

    // Normalise slots → program expects each slot.status to be fully specified
    const _slots = slots.map((s) => ({
      slotId: s.slotId,
      price: s.price,
      status: s.status ?? { available: {} },
    }));

    return this.program.methods
      .registerLocation(name, description, _slots)
      .accounts({
        authority: this.wallet.publicKey,
        provider: providerPda,
        location: locationPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
  }

  async addTimeSlot(
    locationIdx: number,
    slot: TimeSlotInput,
  ) {
    const locationPda = this.getLocationPda(
      this.wallet.publicKey!,
      locationIdx,
    )[0];

    return this.program.methods
      .addTimeSlot(locationIdx, {
        slotId: slot.slotId,
        price: slot.price,
        status: slot.status ?? { available: {} },
      })
      .accounts({
        authority: this.wallet.publicKey,
        location: locationPda,
      })
      .rpc();
  }

  async bookLocation(
    locationIdx: number,
    campaignIdx: number,
    slotUnix: BN,
  ) {
    const locationPda = this.getLocationPda(
      this.wallet.publicKey!,
      locationIdx,
    )[0];
    const providerPda = this.getProviderPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey!,
      campaignIdx,
    )[0];

    return this.program.methods
      .bookLocation(locationIdx, campaignIdx, slotUnix)
      .accounts({
        authority: this.wallet.publicKey,
        adProvider: providerPda,
        location: locationPda,
        campaign: campaignPda,
      })
      .rpc();
  }

  async cancelBooking(
    locationIdx: number,
    campaignIdx: number,
    slotUnix: BN,
  ) {
    const locationPda = this.getLocationPda(
      this.wallet.publicKey!,
      locationIdx,
    )[0];
    const providerPda = this.getProviderPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey!,
      campaignIdx,
    )[0];

    return this.program.methods
      .cancelBooking(locationIdx, campaignIdx, slotUnix)
      .accounts({
        authority: this.wallet.publicKey,
        adProvider: providerPda,
        location: locationPda,
        campaign: campaignPda,
      })
      .rpc();
  }

  /* -------- Campaign closure -------- */

  async closeCampaign(campaignIdx: number) {
    const advertiserPda = this.getAdvertiserPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey!,
      campaignIdx,
    )[0];

    return this.program.methods
      .closeCampaign(campaignIdx)
      .accounts({
        advertiser: advertiserPda,
        authority: this.wallet.publicKey,
        campaign: campaignPda,
      })
      .rpc();
  }

  /* ─────────────────────── QUERIES ─────────────────────── */

  /** Reads every Campaign account (filter locally if needed). */
  getAllCampaigns() {
    return this.program.account.campaign.all();
  }

  async getAdvertiser() {
    const [pda] = this.getAdvertiserPda();
    return this.program.account.advertiser.fetch(pda);
  }

  async getProvider() {
    const [pda] = this.getProviderPda();
    return this.program.account.provider.fetch(pda);
  }

  async getLocation(locationIdx: number) {
    const [pda] = this.getLocationPda(
      this.wallet.publicKey!,
      locationIdx,
    );
    return this.program.account.location.fetch(pda);
  }
}
