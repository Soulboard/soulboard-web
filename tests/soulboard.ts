import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Soulboard } from "../target/types/soulboard";
import { expect } from "chai";
import {
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import BN from "bn.js";

describe("soulboard", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.soulboard as Program<Soulboard>;
  const connection = provider.connection;
  const ZERO_PUBKEY = new PublicKey(Buffer.alloc(32));

  const u64 = (value: number | BN) =>
    new BN(value).toArrayLike(Buffer, "le", 8);

  const deriveAdvertiserPda = (authority: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("advertiser"), authority.toBuffer()],
      program.programId
    )[0];

  const deriveProviderPda = (authority: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("provider"), authority.toBuffer()],
      program.programId
    )[0];

  const deriveCampaignPda = (authority: PublicKey, campaignIdx: BN) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("campaign"), authority.toBuffer(), u64(campaignIdx)],
      program.programId
    )[0];

  const deriveLocationPda = (authority: PublicKey, locationIdx: BN) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from("location"), authority.toBuffer(), u64(locationIdx)],
      program.programId
    )[0];

  const deriveCampaignLocationPda = (
    campaign: PublicKey,
    location: PublicKey
  ) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from("campaign_location"),
        campaign.toBuffer(),
        location.toBuffer(),
      ],
      program.programId
    )[0];

  const airdropTo = async (pubkey: PublicKey, sol = 5) => {
    const signature = await connection.requestAirdrop(
      pubkey,
      sol * LAMPORTS_PER_SOL
    );
    const latest = await connection.getLatestBlockhash();
    await connection.confirmTransaction({ signature, ...latest }, "confirmed");
  };

  const expectAnchorError = async (
    promise: Promise<string>,
    code: string | string[]
  ) => {
    try {
      await promise;
      expect.fail("Expected error");
    } catch (error: any) {
      const anchorError = error?.error ?? error;
      const actualCode =
        anchorError?.errorCode?.code ?? anchorError?.error?.errorCode?.code;
      const expectedCodes = Array.isArray(code) ? code : [code];
      expect(expectedCodes).to.include(actualCode);
    }
  };

  const setupActors = async () => {
    const advertiser = Keypair.generate();
    const providerKeypair = Keypair.generate();
    const oracle = Keypair.generate();

    await airdropTo(advertiser.publicKey);
    await airdropTo(providerKeypair.publicKey);
    await airdropTo(oracle.publicKey);

    const advertiserPda = deriveAdvertiserPda(advertiser.publicKey);
    await program.methods
      .createAdvertiser()
      .accounts({
        authority: advertiser.publicKey,
        advertiser: advertiserPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    const providerPda = deriveProviderPda(providerKeypair.publicKey);
    await program.methods
      .createProvider()
      .accounts({
        authority: providerKeypair.publicKey,
        provider: providerPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([providerKeypair])
      .rpc();

    return {
      advertiser,
      provider: providerKeypair,
      oracle,
      advertiserPda,
      providerPda,
    };
  };

  const getNextCampaignIdx = async (advertiserPda: PublicKey) => {
    const advertiserAccount = await program.account.advertiser.fetch(
      advertiserPda
    );
    return new BN(advertiserAccount.lastCampaignId.toString());
  };

  const createCampaign = async (
    advertiser: Keypair,
    advertiserPda: PublicKey,
    budget: BN,
    campaignIdx?: BN
  ) => {
    const nextIdx = campaignIdx ?? (await getNextCampaignIdx(advertiserPda));
    const campaignPda = deriveCampaignPda(advertiser.publicKey, nextIdx);

    await program.methods
      .createCampaign(
        "Campaign One",
        "Test campaign description",
        "https://example.com/campaign.png",
        budget
      )
      .accounts({
        advertiser: advertiserPda,
        campaign: campaignPda,
        authority: advertiser.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    return { campaignIdx: nextIdx, campaignPda };
  };

  const getNextLocationIdx = async (providerPda: PublicKey) => {
    const providerAccount = await program.account.provider.fetch(providerPda);
    return new BN(providerAccount.lastLocationId.toString());
  };

  const registerLocation = async (
    provider: Keypair,
    providerPda: PublicKey,
    price: BN,
    oracleAuthority: PublicKey,
    locationIdx?: BN
  ) => {
    const nextIdx = locationIdx ?? (await getNextLocationIdx(providerPda));
    const locationPda = deriveLocationPda(provider.publicKey, nextIdx);

    await program.methods
      .registerLocation(
        "Location A",
        "High traffic area",
        price,
        oracleAuthority
      )
      .accounts({
        authority: provider.publicKey,
        provider: providerPda,
        location: locationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([provider])
      .rpc();

    return { locationIdx: nextIdx, locationPda };
  };

  it("creates advertiser/provider and campaign metadata", async () => {
    const { advertiser, advertiserPda, provider, providerPda } =
      await setupActors();

    const advertiserAccount = await program.account.advertiser.fetch(
      advertiserPda
    );
    expect(advertiserAccount.authority.toBase58()).to.equal(
      advertiser.publicKey.toBase58()
    );
    expect(advertiserAccount.campaignCount.toNumber()).to.equal(0);

    const providerAccount = await program.account.provider.fetch(providerPda);
    expect(providerAccount.authority.toBase58()).to.equal(
      provider.publicKey.toBase58()
    );
    expect(providerAccount.locationCount.toNumber()).to.equal(0);

    const budget = new BN(2 * LAMPORTS_PER_SOL);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );

    const campaign = await program.account.campaign.fetch(campaignPda);
    expect(campaign.campaignIdx.toString()).to.equal(campaignIdx.toString());
    expect(campaign.availableBudget.toString()).to.equal(budget.toString());
    expect(campaign.reservedBudget.toNumber()).to.equal(0);
    expect(campaign.status).to.have.property("active");
  });

  it("adds and withdraws budget safely", async () => {
    const { advertiser, advertiserPda } = await setupActors();
    const initialBudget = new BN(1 * LAMPORTS_PER_SOL);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      initialBudget
    );

    const topUp = new BN(500_000_000);
    await program.methods
      .addBudget(campaignIdx, topUp)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    let campaign = await program.account.campaign.fetch(campaignPda);
    const expectedAvailable = initialBudget.add(topUp);
    expect(campaign.availableBudget.toString()).to.equal(
      expectedAvailable.toString()
    );

    const withdraw = new BN(200_000_000);
    await program.methods
      .withdrawBudget(campaignIdx, withdraw)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
      })
      .signers([advertiser])
      .rpc();

    campaign = await program.account.campaign.fetch(campaignPda);
    const afterWithdraw = expectedAvailable.sub(withdraw);
    expect(campaign.availableBudget.toString()).to.equal(
      afterWithdraw.toString()
    );

    await expectAnchorError(
      program.methods
        .withdrawBudget(campaignIdx, afterWithdraw.add(new BN(1)))
        .accounts({
          authority: advertiser.publicKey,
          campaign: campaignPda,
        })
        .signers([advertiser])
        .rpc(),
      "InsufficientBudget"
    );
  });

  it("registers and updates a location", async () => {
    const { provider, providerPda, oracle } = await setupActors();
    const price = new BN(250_000);
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );

    await program.methods
      .updateLocationDetails(locationIdx, "Location B", null)
      .accounts({
        authority: provider.publicKey,
        provider: providerPda,
        location: locationPda,
      })
      .signers([provider])
      .rpc();

    await program.methods
      .updateLocationPrice(locationIdx, new BN(750_000))
      .accounts({
        authority: provider.publicKey,
        provider: providerPda,
        location: locationPda,
      })
      .signers([provider])
      .rpc();

    await program.methods
      .setLocationStatus(locationIdx, { inactive: {} })
      .accounts({
        authority: provider.publicKey,
        provider: providerPda,
        location: locationPda,
      })
      .signers([provider])
      .rpc();

    const location = await program.account.location.fetch(locationPda);
    expect(location.locationName).to.equal("Location B");
    expect(location.price.toString()).to.equal("750000");
    expect(location.locationStatus).to.have.property("inactive");
  });

  it("rejects registering a location without an oracle", async () => {
    const { provider, providerPda } = await setupActors();
    const price = new BN(120_000);
    const locationIdx = await getNextLocationIdx(providerPda);
    const locationPda = deriveLocationPda(provider.publicKey, locationIdx);

    await expectAnchorError(
      program.methods
        .registerLocation(
          "Location Missing Oracle",
          "No oracle configured",
          price,
          ZERO_PUBKEY
        )
        .accounts({
          authority: provider.publicKey,
          provider: providerPda,
          location: locationPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([provider])
        .rpc(),
      "OracleNotConfigured"
    );
  });

  it("rejects booked status via setLocationStatus", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();
    const price = new BN(150_000);
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );
    const { campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      new BN(500_000)
    );

    await expectAnchorError(
      program.methods
        .setLocationStatus(locationIdx, { booked: { campaign: campaignPda } })
        .accounts({
          authority: provider.publicKey,
          provider: providerPda,
          location: locationPda,
        })
        .signers([provider])
        .rpc(),
      "InvalidParameters"
    );
  });

  it("books and settles a location with escrow", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();

    const budget = new BN(1 * LAMPORTS_PER_SOL);
    const price = new BN(500_000);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );
    const campaignLocationPda = deriveCampaignLocationPda(
      campaignPda,
      locationPda
    );

    const balanceBefore = await connection.getBalance(campaignPda);

    await program.methods
      .addCampaignLocation(campaignIdx, locationIdx)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    const campaignAfterBooking = await program.account.campaign.fetch(
      campaignPda
    );
    const locationAfterBooking = await program.account.location.fetch(
      locationPda
    );
    const bookingAccount = await program.account.campaignLocation.fetch(
      campaignLocationPda
    );
    const balanceAfter = await connection.getBalance(campaignPda);

    expect(balanceBefore - balanceAfter).to.equal(price.toNumber());
    expect(campaignAfterBooking.availableBudget.toString()).to.equal(
      budget.sub(price).toString()
    );
    expect(campaignAfterBooking.reservedBudget.toString()).to.equal(
      price.toString()
    );
    expect(locationAfterBooking.locationStatus).to.have.property("booked");
    expect(bookingAccount.status).to.have.property("active");

    const settlementAmount = new BN(300_000);
    await program.methods
      .settleCampaignLocation(campaignIdx, locationIdx, settlementAmount)
      .accounts({
        oracleAuthority: oracle.publicKey,
        locationAuthority: provider.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
      })
      .signers([oracle])
      .rpc();

    const campaignAfterSettlement = await program.account.campaign.fetch(
      campaignPda
    );
    const locationAfterSettlement = await program.account.location.fetch(
      locationPda
    );
    const bookingAfterSettlement = await program.account.campaignLocation.fetch(
      campaignLocationPda
    );

    const refund = price.sub(settlementAmount);
    expect(campaignAfterSettlement.reservedBudget.toNumber()).to.equal(0);
    expect(campaignAfterSettlement.availableBudget.toString()).to.equal(
      budget.sub(settlementAmount).toString()
    );
    expect(locationAfterSettlement.locationStatus).to.have.property(
      "available"
    );
    expect(bookingAfterSettlement.status).to.have.property("settled");
    expect(bookingAfterSettlement.settledAmount.toString()).to.equal(
      settlementAmount.toString()
    );
  });

  it("rejects settlement above booked price", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();

    const budget = new BN(1 * LAMPORTS_PER_SOL);
    const price = new BN(400_000);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );
    const campaignLocationPda = deriveCampaignLocationPda(
      campaignPda,
      locationPda
    );

    await program.methods
      .addCampaignLocation(campaignIdx, locationIdx)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    await expectAnchorError(
      program.methods
        .settleCampaignLocation(campaignIdx, locationIdx, price.add(new BN(1)))
        .accounts({
          oracleAuthority: oracle.publicKey,
          locationAuthority: provider.publicKey,
          campaign: campaignPda,
          provider: providerPda,
          location: locationPda,
          campaignLocation: campaignLocationPda,
        })
        .signers([oracle])
        .rpc(),
      "SettlementTooHigh"
    );
  });

  it("rejects settlement with the wrong oracle", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();
    const budget = new BN(1 * LAMPORTS_PER_SOL);
    const price = new BN(350_000);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );
    const campaignLocationPda = deriveCampaignLocationPda(
      campaignPda,
      locationPda
    );

    await program.methods
      .addCampaignLocation(campaignIdx, locationIdx)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    const wrongOracle = Keypair.generate();
    await airdropTo(wrongOracle.publicKey);

    await expectAnchorError(
      program.methods
        .settleCampaignLocation(campaignIdx, locationIdx, new BN(100_000))
        .accounts({
          oracleAuthority: wrongOracle.publicKey,
          locationAuthority: provider.publicKey,
          campaign: campaignPda,
          provider: providerPda,
          location: locationPda,
          campaignLocation: campaignLocationPda,
        })
        .signers([wrongOracle])
        .rpc(),
      "InvalidOracleAuthority"
    );
  });

  it("rejects settlement with the wrong location authority", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();
    const budget = new BN(1 * LAMPORTS_PER_SOL);
    const price = new BN(420_000);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );
    const campaignLocationPda = deriveCampaignLocationPda(
      campaignPda,
      locationPda
    );

    await program.methods
      .addCampaignLocation(campaignIdx, locationIdx)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    const wrongRecipient = Keypair.generate();
    await airdropTo(wrongRecipient.publicKey);

    await expectAnchorError(
      program.methods
        .settleCampaignLocation(campaignIdx, locationIdx, new BN(100_000))
        .accounts({
          oracleAuthority: oracle.publicKey,
          locationAuthority: wrongRecipient.publicKey,
          campaign: campaignPda,
          provider: providerPda,
          location: locationPda,
          campaignLocation: campaignLocationPda,
        })
        .signers([oracle])
        .rpc(),
      "InvalidAuthority"
    );
  });

  it("prevents booking an inactive location", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();
    const budget = new BN(1 * LAMPORTS_PER_SOL);
    const price = new BN(180_000);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );

    await program.methods
      .setLocationStatus(locationIdx, { inactive: {} })
      .accounts({
        authority: provider.publicKey,
        provider: providerPda,
        location: locationPda,
      })
      .signers([provider])
      .rpc();

    const campaignLocationPda = deriveCampaignLocationPda(
      campaignPda,
      locationPda
    );

    await expectAnchorError(
      program.methods
        .addCampaignLocation(campaignIdx, locationIdx)
        .accounts({
          authority: advertiser.publicKey,
          campaign: campaignPda,
          provider: providerPda,
          location: locationPda,
          campaignLocation: campaignLocationPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([advertiser])
        .rpc(),
      "LocationInactive"
    );
  });

  it("prevents booking an already booked location", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();
    const price = new BN(220_000);
    const budget = new BN(1 * LAMPORTS_PER_SOL);
    const { campaignIdx: firstCampaignIdx, campaignPda: firstCampaignPda } =
      await createCampaign(advertiser, advertiserPda, budget);
    const { campaignIdx: secondCampaignIdx, campaignPda: secondCampaignPda } =
      await createCampaign(advertiser, advertiserPda, budget);
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );

    const firstCampaignLocationPda = deriveCampaignLocationPda(
      firstCampaignPda,
      locationPda
    );

    await program.methods
      .addCampaignLocation(firstCampaignIdx, locationIdx)
      .accounts({
        authority: advertiser.publicKey,
        campaign: firstCampaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: firstCampaignLocationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    const secondCampaignLocationPda = deriveCampaignLocationPda(
      secondCampaignPda,
      locationPda
    );

    await expectAnchorError(
      program.methods
        .addCampaignLocation(secondCampaignIdx, locationIdx)
        .accounts({
          authority: advertiser.publicKey,
          campaign: secondCampaignPda,
          provider: providerPda,
          location: locationPda,
          campaignLocation: secondCampaignLocationPda,
          systemProgram: SystemProgram.programId,
        })
        .signers([advertiser])
        .rpc(),
      "LocationAlreadyBooked"
    );
  });

  it("prevents closing with active booking", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();
    const budget = new BN(1 * LAMPORTS_PER_SOL);
    const price = new BN(200_000);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );
    const campaignLocationPda = deriveCampaignLocationPda(
      campaignPda,
      locationPda
    );

    await program.methods
      .addCampaignLocation(campaignIdx, locationIdx)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    await expectAnchorError(
      program.methods
        .closeCampaign(campaignIdx)
        .accounts({
          authority: advertiser.publicKey,
          advertiser: advertiserPda,
          campaign: campaignPda,
        })
        .signers([advertiser])
        .rpc(),
      "CampaignHasActiveBookings"
    );
  });

  it("prevents removing a non-active booking", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();
    const budget = new BN(1 * LAMPORTS_PER_SOL);
    const price = new BN(260_000);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );
    const campaignLocationPda = deriveCampaignLocationPda(
      campaignPda,
      locationPda
    );

    await program.methods
      .addCampaignLocation(campaignIdx, locationIdx)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    await program.methods
      .settleCampaignLocation(campaignIdx, locationIdx, new BN(200_000))
      .accounts({
        oracleAuthority: oracle.publicKey,
        locationAuthority: provider.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
      })
      .signers([oracle])
      .rpc();

    await expectAnchorError(
      program.methods
        .removeCampaignLocation(campaignIdx, locationIdx)
        .accounts({
          authority: advertiser.publicKey,
          campaign: campaignPda,
          provider: providerPda,
          location: locationPda,
          campaignLocation: campaignLocationPda,
        })
        .signers([advertiser])
        .rpc(),
      "BookingNotActive"
    );
  });

  it("cancels a booking and refunds the campaign", async () => {
    const { advertiser, advertiserPda, provider, providerPda, oracle } =
      await setupActors();
    const budget = new BN(1 * LAMPORTS_PER_SOL);
    const price = new BN(300_000);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );
    const { locationIdx, locationPda } = await registerLocation(
      provider,
      providerPda,
      price,
      oracle.publicKey
    );
    const campaignLocationPda = deriveCampaignLocationPda(
      campaignPda,
      locationPda
    );

    await program.methods
      .addCampaignLocation(campaignIdx, locationIdx)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
        systemProgram: SystemProgram.programId,
      })
      .signers([advertiser])
      .rpc();

    await program.methods
      .removeCampaignLocation(campaignIdx, locationIdx)
      .accounts({
        authority: advertiser.publicKey,
        campaign: campaignPda,
        provider: providerPda,
        location: locationPda,
        campaignLocation: campaignLocationPda,
      })
      .signers([advertiser])
      .rpc();

    const campaignAfterCancel = await program.account.campaign.fetch(
      campaignPda
    );
    const locationAfterCancel = await program.account.location.fetch(
      locationPda
    );
    const bookingAfterCancel = await program.account.campaignLocation.fetch(
      campaignLocationPda
    );

    expect(campaignAfterCancel.availableBudget.toString()).to.equal(
      budget.toString()
    );
    expect(campaignAfterCancel.reservedBudget.toNumber()).to.equal(0);
    expect(locationAfterCancel.locationStatus).to.have.property("available");
    expect(bookingAfterCancel.status).to.have.property("cancelled");
  });

  it("closes a campaign with no active bookings", async () => {
    const { advertiser, advertiserPda } = await setupActors();
    const budget = new BN(500_000);
    const { campaignIdx, campaignPda } = await createCampaign(
      advertiser,
      advertiserPda,
      budget
    );

    await program.methods
      .closeCampaign(campaignIdx)
      .accounts({
        authority: advertiser.publicKey,
        advertiser: advertiserPda,
        campaign: campaignPda,
      })
      .signers([advertiser])
      .rpc();

    const advertiserAccount = await program.account.advertiser.fetch(
      advertiserPda
    );
    expect(advertiserAccount.campaignCount.toNumber()).to.equal(0);

    let fetchError: any = null;
    try {
      await program.account.campaign.fetch(campaignPda);
    } catch (error) {
      fetchError = error;
    }
    expect(fetchError).to.be.ok;
  });
});
