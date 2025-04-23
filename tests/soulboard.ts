import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Soulboard } from "../target/types/soulboard";
import { publicKey } from "@coral-xyz/anchor/dist/cjs/utils";
import { expect, use } from "chai";
import { PublicKey, SystemProgram } from '@solana/web3.js';
import BN from 'bn.js';
const web3 = anchor.web3;

describe("soulboard", () => {
  // Configure the client to use the local cluster.

  const program = anchor.workspace.soulboard as Program<Soulboard>;
  
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const campaignId = new anchor.BN(1);

  // See https://github.com/coral-xyz/anchor/issues/3122
  const user = (provider.wallet as anchor.Wallet).payer;

  before(async () => {
    const balance = await provider.connection.getBalance(user.publicKey);
    const balanceInSOL = balance / web3.LAMPORTS_PER_SOL;
    const formattedBalance = new Intl.NumberFormat().format(balanceInSOL);
    console.log(`Balance: ${formattedBalance} SOL`);
  });

  it("create Advertiser" , async () =>  { 
    const tx = await program.methods
                            .createAdvertiser()
                            .accounts({
                              authority : user.publicKey 
                            })
                            .rpc()

    const [advertiserPda, _] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("advertiser") , 
        user.publicKey.toBuffer()
      ] , 
      program.programId
    )

    const advertiser = await program.account.advertiser.fetch(advertiserPda) ; 

    console.log(advertiser.authority)
    console.log(advertiser.campaignCount)
    console.log(advertiser.lastCampaignId)

  }) ; 

  it("Create a campaign", async () => {
    // Add your test here.
    const campaignMetadata = {
      campaignName: "Test Campaign",
      campaignDescription: "Test Description",
      campaignImageUrl: "https://example.com/image.png",
    };
    
    const [advertiserPda, _] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("advertiser") , 
        user.publicKey.toBuffer()
      ] , 
      program.programId
    )

    const tx = await program.methods
      .createCampaign(campaignMetadata.campaignName, campaignMetadata.campaignDescription, campaignMetadata.campaignImageUrl , new BN(100000000000000))
      .accounts({
        advertiser: advertiserPda,
        authority: user.publicKey,
      })
      .rpc();

    console.log("Your transaction signature", tx);
    
    const advertiser = await program.account.advertiser.fetch(advertiserPda);
    const last_campaign_id = advertiser.lastCampaignId;

    const [campaignPda, campaignBump] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('campaign'), user.publicKey.toBuffer(), new BN(last_campaign_id - 1).toArrayLike(Buffer, "le", 1)], 
      program.programId
    );

    const campaign = await program.account.campaign.fetch(campaignPda);
    const lamports = await provider.connection.getBalance(campaignPda);
    const lamportsInSOL = lamports / web3.LAMPORTS_PER_SOL;
      const formattedLamports = new Intl.NumberFormat().format(lamportsInSOL);
    

    console.log("Campaign PDA", campaignPda.toString());
    console.log("Campaign Bump", campaignBump);
    console.log("Campaign Name", campaign.campaignName);
    console.log("Campaign Description", campaign.campaignDescription);
    console.log("Campaign Image URL", campaign.campaignImageUrl); 

    console.log("Campaign Budget", formattedLamports);

    expect(campaign.campaignName).to.equal(campaignMetadata.campaignName);
    expect(campaign.campaignDescription).to.equal(campaignMetadata.campaignDescription);
    expect(campaign.campaignImageUrl).to.equal(campaignMetadata.campaignImageUrl);
    console.log(advertiser.campaignCount)
    console.log(advertiser.lastCampaignId)
  });

 it("add budget" , async () => {
  const [advertiserPda, _] = PublicKey.findProgramAddressSync(
    [
      Buffer.from("advertiser"),
      user.publicKey.toBuffer()
    ],
    program.programId
  );

  const [campaignPda, __] = web3.PublicKey.findProgramAddressSync(
    [Buffer.from('campaign'), user.publicKey.toBuffer(), new BN(0).toArrayLike(Buffer, "le", 1)], 
    program.programId
  );

  const tx = await program.methods
    .addBudget(new BN(100000000000000), 0)
    .accounts({
      advertiser: advertiserPda,
      authority: user.publicKey,
      campaign: campaignPda,
    })
    .rpc();

    const lamports = await provider.connection.getBalance(campaignPda);
    const lamportsInSOL = lamports / web3.LAMPORTS_PER_SOL;
    const formattedLamports = new Intl.NumberFormat().format(lamportsInSOL);
  
    console.log("Campaign Budget", formattedLamports);

  console.log("Your transaction signature", tx);

 
  
 })

  it("Close a campaign", async () => {
    const [advertiserPda, _] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("advertiser"),
        user.publicKey.toBuffer()
      ],
      program.programId
    );
    
    const advertiser = await program.account.advertiser.fetch(advertiserPda);
    const campaign_idx = 0; // Use appropriate campaign index
    
    const [campaignPda, __] = web3.PublicKey.findProgramAddressSync(
      [Buffer.from('campaign'), user.publicKey.toBuffer(), new BN(campaign_idx).toArrayLike(Buffer, "le", 1)], 
      program.programId
    );
    
    const tx = await program.methods
      .closeCampaign(campaign_idx)
      .accounts({ 
        advertiser: advertiserPda,
        authority: user.publicKey,
        campaign: campaignPda,
      })
      .rpc();

    console.log("Your transaction signature", tx);
  });
});
  