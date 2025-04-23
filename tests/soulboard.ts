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
      .addBudget(new BN(1000000000000000), 0)
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


    it("withdraw amount", async () => {
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
        .withdrawAmount(0, new BN(1000000))
        .accounts({
          advertiser: advertiserPda,
          authority: user.publicKey,
          campaign: campaignPda,
        })
        .rpc();
      console.log("Your transaction signature", tx);
    })

    it("get all campaigns", async () => {
      const [advertiserPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from('advertiser'), user.publicKey.toBuffer()],
        program.programId
      );  

      const campaigns = await program.account.campaign.all();
      
      console.log("campaigns", campaigns);
    })

    it("create provider", async () => {
      const tx = await program.methods
        .createProvider()
        .accounts({
          authority: user.publicKey,
        })
        .rpc();

      console.log("Your transaction signature", tx);

      const [providerPda, providerBump] = PublicKey.findProgramAddressSync(
        [Buffer.from('provider'), user.publicKey.toBuffer()],
        program.programId
      );

      const provider = await program.account.provider.fetch(providerPda);
      console.log("provider", provider);
      console.log( "provider.authority", provider.authority)
      console.log( "user.publicKey", user.publicKey)

      expect(provider.authority.toBase58()).to.equal(user.publicKey.toBase58()  );

    })



    it("register location", async () => {
      // Helper function to convert time string to Unix timestamp
      const timeToTimestamp = (timeString: string, date?: Date): BN => {
        // Use current date if not specified
        const baseDate = date || new Date();
        
        // Parse time string (format: "1pm", "12pm", etc.)
        const isPM = timeString.toLowerCase().includes('pm');
        let hour = parseInt(timeString.replace(/[^0-9]/g, ''));
        
        // Convert to 24-hour format if PM
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        
        // Set the hours on the base date
        baseDate.setHours(hour, 0, 0, 0);
        
        // Return Unix timestamp (seconds since epoch)
        return new BN(Math.floor(baseDate.getTime() / 1000));
      };
      
      // Example: Create slots for today at 12pm and 1pm
      const today = new Date();

      // First, make sure we have a provider account
      const [providerPda, providerBump] = PublicKey.findProgramAddressSync(
        [Buffer.from('provider'), user.publicKey.toBuffer()],
        program.programId
      );
      
      const provider = await program.account.provider.fetch(providerPda);
      // Use consistent location PDA derivation
      const locationIdx = 0;
      const [locationPda, locationBump] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('location'), 
          user.publicKey.toBuffer(), 
          Buffer.from([locationIdx])
        ],
        program.programId
      );
      
      const tx = await program.methods
        .registerLocation("location name", "location description", [
          {
            slotId: timeToTimestamp("12pm", today),
            status: { available: {} }
          },
          {
            slotId: timeToTimestamp("1pm", today),
            status: { available: {} }
          }
        ])
        .accounts({
          authority: user.publicKey,
          provider: providerPda,
          location: locationPda,
        })
        .rpc();

      console.log("Your transaction signature", tx);

      const location = await program.account.location.fetch(locationPda);
      console.log("location", location);
      console.log("location_idx" , location.locationIdx)
      console.log("provider.last_count" ,provider.lastLocationId)
      console.log("location count" , provider.locationCount)

      expect(location.locationName).to.equal("location name");
      expect(location.locationDescription).to.equal("location description");

      expect(location.slots.length).to.equal(2);
      expect(location.slots[0].slotId.toString()).to.equal(timeToTimestamp("12pm", today).toString());
      expect(location.slots[1].slotId.toString()).to.equal(timeToTimestamp("1pm", today).toString());
    })

    it("book location", async () => {
      const timeToTimestamp = (timeString: string, date?: Date): BN => {
        // Use current date if not specified
        const baseDate = date || new Date();
        
        // Parse time string (format: "1pm", "12pm", etc.)
        const isPM = timeString.toLowerCase().includes('pm');
        let hour = parseInt(timeString.replace(/[^0-9]/g, ''));
        
        // Convert to 24-hour format if PM
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        
        // Set the hours on the base date
        baseDate.setHours(hour, 0, 0, 0);
        
        // Return Unix timestamp (seconds since epoch)
        return new BN(Math.floor(baseDate.getTime() / 1000));
      };
      
      // Example: Create slots for today at 12pm and 1pm
      const today = new Date();
      const [advertiserPda, _] = PublicKey.findProgramAddressSync(
        [Buffer.from('advertiser'), user.publicKey.toBuffer()],
        program.programId
      );

      const [campaignPda, __] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('campaign'), user.publicKey.toBuffer(), new BN(0).toArrayLike(Buffer, "le", 1)], 
        program.programId
      );

      const [locationPda, locationBump] = PublicKey.findProgramAddressSync(
        [Buffer.from('location'), user.publicKey.toBuffer(), new BN(0).toArrayLike(Buffer, "le", 1)], 
        program.programId
      );

      const tx = await program.methods
        .bookLocation(0, 0, timeToTimestamp("12pm", today))
        .accounts({
          authority: user.publicKey,
          location: locationPda,
          campaign: campaignPda,
        })
        .rpc();

    })
    
    it("add time slot", async () => {
      const today = new Date();
      
      // Helper function to convert time string to Unix timestamp
      const timeToTimestamp = (timeString: string, date?: Date): BN => {
        const baseDate = date || new Date();
        const isPM = timeString.toLowerCase().includes('pm');
        let hour = parseInt(timeString.replace(/[^0-9]/g, ''));
        if (isPM && hour < 12) hour += 12;
        if (!isPM && hour === 12) hour = 0;
        baseDate.setHours(hour, 0, 0, 0);
        return new BN(Math.floor(baseDate.getTime() / 1000));
      };

      const [providerPda] = PublicKey.findProgramAddressSync(
        [Buffer.from('provider'), user.publicKey.toBuffer()],
        program.programId
      );

      const provider = await program.account.provider.fetch(providerPda);
      console.log("provider", provider);  
      console.log("provider.last_location_id" , provider.lastLocationId)
      console.log("provider.location_count" , provider.locationCount)
      
      // Match the location PDA calculation exactly as in the program
      // The locationIdx parameter is passed as 0, so we need to use that
      const locationIdx = 0;
      const [locationPda] = PublicKey.findProgramAddressSync(
        [
          Buffer.from('location'), 
          user.publicKey.toBuffer(), 
          new BN(0).toArrayLike(Buffer, "le", 1)  // Use simple Buffer.from with byte array
        ],
        program.programId
      );

      const location = await program.account.location.fetch(locationPda);
      // console.log("locationPdaieuegr" , locationPda.toBase58())
      console.log("location", location);
      console.log("location_idx" , location.locationIdx)
      console.log("provider.last_count" ,provider.lastLocationId)
      console.log("location count" , provider.locationCount)
      
      const tx = await program.methods
        .addTimeSlot(
          {
            slotId: timeToTimestamp("3pm", today),
            status: { available: {} }
          }, 
          0  // Make sure we use the same index here as in the PDA
        )
        .accounts({
          location: locationPda,
          authority: user.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();
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
        [Buffer.from('campaign'), user.publicKey.toBuffer(), new BN(0).toArrayLike(Buffer, "le", 1)], 
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
    
    