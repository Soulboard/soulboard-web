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
pub struct CreateCampaign<'info> { 
    #[account(
        mut,
        seeds = [ADVERTISER_KEY ,authority.key().as_ref() ],
        bump,
        has_one = authority,
    )]
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
#[instruction(campaign_idx: u64)]
pub struct AddBudget<'info> {
    #[account(mut,has_one = authority,seeds = [CAMPAIGN_KEY, authority.key().as_ref() , &campaign_idx.to_le_bytes()],bump)]
    pub campaign: Account<'info, Campaign>,

    #[account(mut)]
    pub authority: Signer<'info>,

    

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(campaign_idx: u64)]
pub struct WithdrawBudget<'info> {

    #[account(mut,has_one = authority,seeds = [CAMPAIGN_KEY, authority.key().as_ref() , &campaign_idx.to_le_bytes()],bump)]
    pub campaign: Account<'info, Campaign>,

    #[account(mut)]
    pub authority: Signer<'info>,

}

#[derive(Accounts)]
#[instruction(campaign_idx: u64)]
pub struct CloseCampaign<'info> {
    #[account(mut,seeds = [ADVERTISER_KEY , authority.key().as_ref() ],bump,has_one = authority)]

    pub advertiser: Account<'info, Advertiser>,
   
    #[account(mut,close = authority,has_one = authority,seeds = [CAMPAIGN_KEY, authority.key().as_ref() , &campaign_idx.to_le_bytes()],bump)]
    pub campaign: Account<'info, Campaign>,
   
    #[account(mut)]
    pub authority: Signer<'info>,

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
    #[account(mut,seeds = [PROVIDER_KEY, authority.key().as_ref() ,],bump,has_one = authority)]
    pub provider: Account<'info, Provider>,

    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + Location::INIT_SPACE,
        seeds = [LOCATION_KEY, authority.key().as_ref() , &provider.last_location_id.to_le_bytes()],
        bump,
    )]
    pub location: Account<'info, Location>,
    
    

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(campaign_idx: u64)]
pub struct UpdateCampaign<'info> {
    #[account(mut, has_one = authority, seeds = [CAMPAIGN_KEY, authority.key().as_ref(), &campaign_idx.to_le_bytes()], bump)]
    pub campaign: Account<'info, Campaign>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(location_idx: u64)]
pub struct UpdateLocationDetails<'info> {
    #[account(seeds = [PROVIDER_KEY, authority.key().as_ref() ], bump, has_one = authority)]
    pub provider: Account<'info, Provider>,

    #[account(mut, seeds = [LOCATION_KEY, authority.key().as_ref(), &location_idx.to_le_bytes()], bump)]
    pub location: Account<'info, Location>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(location_idx: u64)]
pub struct UpdateLocationPrice<'info> {
    #[account(seeds = [PROVIDER_KEY, authority.key().as_ref() ], bump, has_one = authority)]
    pub provider: Account<'info, Provider>,

    #[account(mut, seeds = [LOCATION_KEY, authority.key().as_ref(), &location_idx.to_le_bytes()], bump)]
    pub location: Account<'info, Location>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(location_idx: u64)]
pub struct SetLocationStatus<'info> {
    #[account(seeds = [PROVIDER_KEY, authority.key().as_ref() ], bump, has_one = authority)]
    pub provider: Account<'info, Provider>,

    #[account(mut, seeds = [LOCATION_KEY, authority.key().as_ref(), &location_idx.to_le_bytes()], bump)]
    pub location: Account<'info, Location>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(campaign_idx: u64, location_idx: u64)]
pub struct AddCampaignLocation<'info> {
    #[account(mut, has_one = authority, seeds = [CAMPAIGN_KEY , authority.key().as_ref() , &campaign_idx.to_le_bytes()], bump)]
    pub campaign: Account<'info, Campaign>,

    #[account(seeds = [PROVIDER_KEY, provider.authority.as_ref()], bump)]
    pub provider: Account<'info, Provider>,

    #[account(mut, seeds = [LOCATION_KEY , provider.authority.as_ref() , &location_idx.to_le_bytes()], bump)]
    pub location: Account<'info, Location>,

    #[account(
        init,
        payer = authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + CampaignLocation::INIT_SPACE,
        seeds = [CAMPAIGN_LOCATION_KEY, campaign.key().as_ref(), location.key().as_ref()],
        bump,
    )]
    pub campaign_location: Account<'info, CampaignLocation>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(campaign_idx: u64, location_idx: u64)]
pub struct RemoveCampaignLocation<'info> {
    #[account(mut, has_one = authority, seeds = [CAMPAIGN_KEY , authority.key().as_ref() , &campaign_idx.to_le_bytes()], bump)]
    pub campaign: Account<'info, Campaign>,

    #[account(seeds = [PROVIDER_KEY, provider.authority.as_ref()], bump)]
    pub provider: Account<'info, Provider>,

    #[account(mut, seeds = [LOCATION_KEY , provider.authority.as_ref() , &location_idx.to_le_bytes()], bump)]
    pub location: Account<'info, Location>,

    #[account(mut, seeds = [CAMPAIGN_LOCATION_KEY, campaign.key().as_ref(), location.key().as_ref()], bump)]
    pub campaign_location: Account<'info, CampaignLocation>,

    #[account(mut)]
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(campaign_idx: u64, location_idx: u64, campaign_authority: Pubkey, provider_authority: Pubkey)]
pub struct SettleCampaignLocation<'info> {
    #[account(mut, seeds = [CAMPAIGN_KEY , campaign_authority.as_ref() , &campaign_idx.to_le_bytes()], bump)]
    pub campaign: Account<'info, Campaign>,

    #[account(seeds = [PROVIDER_KEY, provider_authority.as_ref()], bump)]
    pub provider: Account<'info, Provider>,

    #[account(mut, seeds = [LOCATION_KEY , provider_authority.as_ref() , &location_idx.to_le_bytes()], bump)]
    pub location: Account<'info, Location>,

    #[account(
        mut,
        seeds = [CAMPAIGN_LOCATION_KEY, campaign.key().as_ref(), location.key().as_ref()],
        bump,
        close = campaign
    )]
    pub campaign_location: Account<'info, CampaignLocation>,

    /// CHECK: receives settlement funds; validated in instruction
    #[account(mut)]
    pub location_authority: AccountInfo<'info>,

    pub oracle_authority: Signer<'info>,
}
