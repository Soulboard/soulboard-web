/*****************************************************************
 *  lib/soulboard-client.ts
 *****************************************************************/
import * as anchor from '@coral-xyz/anchor';
import {
  AnchorProvider,
  Program,
  web3 ,
} from '@coral-xyz/anchor';
import type { Commitment} from '@solana/web3.js';
import { PublicKey, SystemProgram, Connection, Transaction, VersionedTransaction } from '@solana/web3.js';
import BN from 'bn.js';
import { SendTransactionOptions } from '@solana/wallet-adapter-base';
import {useSendTransaction} from '@privy-io/react-auth/solana';
import { ConnectedSolanaWallet } from '@privy-io/react-auth';
import { SupportedSolanaTransaction  } from '@privy-io/react-auth/solana';
import { SendTransactionModalUIOptions  } from '@privy-io/react-auth';
import { SolanaFundingConfig , SolanaTransactionReceipt } from '@privy-io/react-auth';


/* ──────────────────────────────────────────────────────────── */
/*                         CONFIG                              */
/* ──────────────────────────────────────────────────────────── */



export const SOULBOARD_PROGRAM_ID = new PublicKey(
  '61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQ',
);

const DEFAULT_COMMITMENT: Commitment = 'confirmed';
const DEFAULT_RPC = 'https://devnet.helius-rpc.com/?api-key=5f1828f6-a7b9-417d-9b7c-dadba932af8d';

/* ──────────────────────────────────────────────────────────── */
/*                       IDL IMPORT                            */
/* ──────────────────────────────────────────────────────────── */
import { Soulboard } from "../../target/types/soulboard";
import soulboardIdl  from "../../target/idl/soulboard.json"


// We'll use a type assertion for the IDL since we don't have access to the JSON file

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

export interface PrivyWallet {
  wallet : ConnectedSolanaWallet
  publicKey: PublicKey;
  sendTransaction: (input: {
    transaction: SupportedSolanaTransaction;
    connection: Connection;
    uiOptions?: SendTransactionModalUIOptions;
    transactionOptions?: SendTransactionOptions;
    fundWalletConfig?: SolanaFundingConfig;
    address?: string;
  }) => Promise<SolanaTransactionReceipt>
} 

export class SoulboardClient {
  readonly connection: Connection;
  readonly wallet: PrivyWallet;
  readonly provider: AnchorProvider;
  readonly program: Program<Soulboard>;

  /* ─────────────── constructor ─────────────── */
  constructor(
    wallet: PrivyWallet,
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
      connection ?? new Connection(rpcEndpoint);
    this.wallet = wallet;

    const provider = new AnchorProvider(
      this.connection,
      {
        publicKey: wallet.publicKey,
        signTransaction: async (tx) => {
          // For Privy, we don't need to sign transactions directly
          // as they are handled by the wallet's sendTransaction method
          return tx;
        },
        signAllTransactions: async (txs) => {
          // For Privy, we don't need to sign transactions directly
          return txs;
        },
      },
      { commitment },
    );
    
    this.provider = provider;

    this.program = new Program(
  soulboardIdl as Soulboard,
  this.provider // <- important: use full AnchorProvider
);

    anchor.setProvider(provider);
  }

  /* ────────────────────── PDA HELPERS ────────────────────── */

  /** [Advertiser, bump] */
  getAdvertiserPda(authority: PublicKey = this.wallet.publicKey) {
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
  getProviderPda(authority: PublicKey = this.wallet.publicKey) {
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
        Buffer.from([locationIdx])
        ,
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
    const tx = await this.program.methods
      .createAdvertiser()
      .accounts({ authority: this.wallet.publicKey })
      .transaction();

      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      tx.feePayer = this.wallet.publicKey;


    const txSig = await this.wallet.sendTransaction({
      transaction: tx,
      connection: this.connection
    });
    return txSig;
  }

  /** Creates a campaign and returns its PDA (already cached on-chain). */
  async createCampaign(
  metadata: CampaignMetadata,
  budgetLamports: BN,
) {
  const advertiserPda = this.getAdvertiserPda()[0];

  const tx = await this.program.methods
    .createCampaign(
      metadata.campaignName,
      metadata.campaignDescription,
      "example.com",
      budgetLamports,
    )
    .accounts({
      advertiser: advertiserPda,
      authority: this.wallet.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
  tx.feePayer = this.wallet.publicKey;

  const txSig = await this.wallet.sendTransaction({
    transaction: tx,
    connection: this.connection
  });

  // Re-fetch to get the latest campaign index
  const advertiser = await this.program.account.advertiser.fetch(advertiserPda);
  const campaignIdx = advertiser.lastCampaignId - 1;

  const campaignPda = this.getCampaignPda(this.wallet.publicKey, campaignIdx)[0];

  return { txSig, campaignPda, campaignIdx };
}
  /** Tops up campaign escrow */
  async addBudget(
    campaignIdx: number,
    extraLamports: BN,
  ) {
    const advertiserPda = this.getAdvertiserPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey,
      campaignIdx,
    )[0];

    const tx = await this.program.methods
      .addBudget(campaignIdx, extraLamports)
      .accounts({
        advertiser: advertiserPda,
        authority: this.wallet.publicKey,
        campaign: campaignPda,
        systemProgram: SystemProgram.programId,
      })
      .transaction();

      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      tx.feePayer = this.wallet.publicKey;


    return this.wallet.sendTransaction({
      transaction: tx,
      connection: this.connection
    });
  }

  async withdrawAmount(
    campaignIdx: number,
    lamports: BN,
  ) {
    const advertiserPda = this.getAdvertiserPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey,
      campaignIdx,
    )[0];

    const tx = await this.program.methods
      .withdrawAmount(campaignIdx, lamports)
      .accounts({
        advertiser: advertiserPda,
        authority: this.wallet.publicKey,
        campaign: campaignPda,
      })
      .transaction();

      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      tx.feePayer = this.wallet.publicKey;


    return this.wallet.sendTransaction({
      transaction: tx,
      connection: this.connection
    });
  }

  /* -------- Provider / Location flow -------- */

  async createProvider() {
    const tx = await this.program.methods
      .createProvider()
      .accounts({ authority: this.wallet.publicKey })
      .transaction();

      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      tx.feePayer = this.wallet.publicKey;


    const txSig = await this.wallet.sendTransaction({
      transaction: tx,
      connection: this.connection
    });
    const providerPda = this.getProviderPda()[0];
    return { txSig, providerPda };
  }
async registerLocation(
  name: string,
  description: string,
) {
  const providerPda = this.getProviderPda()[0];
  const provider = await this.program.account.provider.fetch(providerPda);

  const locationIdx = provider.lastLocationId;
  const [locationPda] = this.getLocationPda(this.wallet.publicKey, locationIdx);

  console.log('locationPda', locationPda.toBase58());
  console.log('providerPda', providerPda.toBase58());
  console.log('provider', provider);
  console.log('provider.lastLocationId', provider.lastLocationId);
  console.log('provider.lastLocationId - 1', provider.lastLocationId - 1);

  const tx = await this.program.methods
    .registerLocation(name, description)
    .accounts({
      authority: this.wallet.publicKey,
      provider: providerPda,
      location: locationPda,
      systemProgram: SystemProgram.programId,
    })
    .transaction();

  tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
  tx.feePayer = this.wallet.publicKey;

  const txSig = await this.wallet.sendTransaction({
    transaction: tx,
    connection: this.connection,
  });

  return { txSig, locationPda, locationIdx };
}
  async bookLocation(
    locationIdx: number,
    campaignIdx: number,
   
  ) {
    const locationPda = this.getLocationPda(
      this.wallet.publicKey,
      locationIdx,
    )[0];
    const providerPda = this.getProviderPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey,
      campaignIdx,
    )[0];

    const tx = await this.program.methods
      .bookLocation(locationIdx, campaignIdx)
      .accounts({
        authority: this.wallet.publicKey,
        adProvider: providerPda,
        location: locationPda,
        campaign: campaignPda,
      } as any)
      .transaction();

      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      tx.feePayer = this.wallet.publicKey;


    return this.wallet.sendTransaction({
      transaction: tx,
      connection: this.connection
    });
  }

  async cancelBooking(
    locationIdx: number,
    campaignIdx: number,
    slotUnix: BN,
  ) {
    const locationPda = this.getLocationPda(
      this.wallet.publicKey,
      locationIdx,
    )[0];
    const providerPda = this.getProviderPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey,
      campaignIdx,
    )[0];

    const tx = await this.program.methods
      .cancelBooking(locationIdx, campaignIdx, slotUnix)
      .accounts({
        authority: this.wallet.publicKey,
        adProvider: providerPda,
        location: locationPda,
        campaign: campaignPda,
      } as any)
      .transaction();


      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      tx.feePayer = this.wallet.publicKey;


    return this.wallet.sendTransaction({
      transaction: tx,
      connection: this.connection
    });
  }

  /* -------- Campaign closure -------- */

  async closeCampaign(campaignIdx: number) {
    const advertiserPda = this.getAdvertiserPda()[0];
    const campaignPda = this.getCampaignPda(
      this.wallet.publicKey,
      campaignIdx,
    )[0];

    const tx = await this.program.methods
      .closeCampaign(campaignIdx)
      .accounts({
        advertiser: advertiserPda,
        authority: this.wallet.publicKey,
        campaign: campaignPda,
      })
      .transaction();

      tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;
      tx.feePayer = this.wallet.publicKey;


    return this.wallet.sendTransaction({
      transaction: tx,
      connection: this.connection
    });
  }

  /* ─────────────────────── QUERIES ─────────────────────── */

  /** Reads every Campaign account (filter locally if needed). */
  getAllCampaigns() {
    return this.program.account.campaign.all();
  }

  async getAllCampaignLocations( id : PublicKey ) {
   const camapign = await this.program.account.campaign.fetch(id);
    return camapign.bookedLocations
  }

  getAllLocations() {
    return this.program.account.location.all();
  }

  async getAdvertiser() {
    const [pda] = this.getAdvertiserPda();
    return this.program.account.advertiser.fetch(pda);
  }

  async getProvider() {
    const [pda] = this.getProviderPda();
    return this.program.account.provider.fetch(pda);
  }

  async getCampaignLocations( pda: PublicKey ) { 
    const  campaign = await   this.program.account.campaign.fetch(pda);

   return campaign.bookedLocations    
  }

  async getCampaignById( pda : PublicKey ) { 
    const campaign = await this.program.account.campaign.fetch(pda);
    return campaign;

  }

  async getLocationById( pda: PublicKey ) { 
    const location = await this.program.account.location.fetch(pda);
    return location;

  }

  async getLocation(locationIdx: number) {
    const [pda] = this.getLocationPda(
      this.wallet.publicKey,
      locationIdx,
    );
    return this.program.account.location.fetch(pda);
  }
}
