use anchor_lang::prelude::*;
use crate::states::*;
use crate::constant::*;

#[derive(Accounts)]
pub struct CreateAdvertiser<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority, 
        space = ANCHOR_DISCRIMINATOR_SIZE + Advertiser::INIT_SPACE,
        seeds = [ADVERTISER_KEY , authority.key().as_ref() ],
        bump,
    )]
    pub advertiser: Account<'info, Advertiser> ,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction()]
pub struct CreateCampaign<'info> { 
    #[
        account(
            mut,
            seeds = [ADVERTISER_KEY ,authority.key().as_ref() ],
            bump,
            has_one = authority,
        )
    ]
    pub advertiser: Account<'info, Advertiser>,


    #[account(
        init,
        payer = authority, 
        space = ANCHOR_DISCRIMINATOR_SIZE + Campaign::INIT_SPACE,
        seeds = [CAMPAIGN_KEY , authority.key().as_ref() , &advertiser.last_campaign_id.to_le_bytes() ],
        bump,
    )]
    pub campaign: Account<'info, Campaign>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(campaign_idx: u8)]
pub struct AddBudget<'info> {
    #[account(mut,seeds = [ADVERTISER_KEY , authority.key().as_ref() ],bump,has_one = authority)]
    pub advertiser: Account<'info, Advertiser>,

    #[account(mut,seeds = [CAMPAIGN_KEY, authority.key().as_ref() , &campaign_idx.to_le_bytes()],bump)]
    pub campaign: Account<'info, Campaign>,

    #[account(mut)]
    pub authority: Signer<'info>,

    

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(campaign_idx: u8)]
pub struct WithdrawBudget<'info> {

    #[account(mut,seeds = [ADVERTISER_KEY , authority.key().as_ref() ],bump,has_one = authority)]
    pub advertiser: Account<'info, Advertiser>,

    #[account(mut,has_one = authority,seeds = [CAMPAIGN_KEY, authority.key().as_ref() , &campaign_idx.to_le_bytes()],bump)]
    pub campaign: Account<'info, Campaign>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,


}

#[derive(Accounts)]
#[instruction(campaign_idx: u8)]
pub struct CloseCampaign<'info> {
    #[account(mut,seeds = [ADVERTISER_KEY , authority.key().as_ref() ],bump,has_one = authority)]

    pub advertiser: Account<'info, Advertiser>,
   
    #[account(mut,close = authority,has_one = authority,seeds = [CAMPAIGN_KEY, authority.key().as_ref() , &campaign_idx.to_le_bytes()],bump)]
    pub campaign: Account<'info, Campaign>,
   
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

}

#[derive(Accounts)]
pub struct CreateProvider<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

    #[account(
        init,
        payer = authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + Provider::INIT_SPACE,
        seeds = [PROVIDER_KEY, authority.key().as_ref()],
        bump,
    )]
    pub provider: Account<'info, Provider>,
    
}


#[derive(Accounts)]
pub struct RegisterLocation<'info> {
    #[account(mut,seeds = [PROVIDER_KEY, authority.key().as_ref()],bump,has_one = authority)]
    pub provider: Account<'info, Provider>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + Location::INIT_SPACE,
        seeds = [LOCATION_KEY, authority.key().as_ref()],
        bump,
    )]
    pub location: Account<'info, Location>,

    pub system_program: Program<'info, System>,
}


