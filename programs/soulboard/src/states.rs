use anchor_lang::prelude::*;



#[account]
#[derive(InitSpace)]
pub struct Advertiser {
    pub authority: Pubkey,

    pub last_campaign_id: u64,

    pub campaign_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Provider {
    pub authority: Pubkey,

    pub last_location_id: u64,

    pub location_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    pub authority: Pubkey,

    pub campaign_idx: u64,

    #[max_len(64)]
    pub campaign_name: String,

    #[max_len(256)]
    pub campaign_description: String,

    #[max_len(256)]
    pub campaign_image_url: String,

    pub status: CampaignStatus,

    pub available_budget: u64,

    pub reserved_budget: u64,
     
}

#[account]
#[derive(InitSpace)]
pub struct Location {
    pub authority: Pubkey, // Ad Provider

    pub location_idx: u64,

    pub price: u64,

    pub oracle_authority: Pubkey,

    #[max_len(64)]
    pub location_name: String,

    #[max_len(256)]
    pub location_description: String,

    pub location_status: LocationStatus,
}

#[account]
#[derive(InitSpace)]
pub struct CampaignLocation {
    pub campaign: Pubkey,
    pub location: Pubkey,
    pub advertiser: Pubkey,
    pub provider: Pubkey,
    pub oracle_authority: Pubkey,
    pub price: u64,
    pub status: CampaignLocationStatus,
    pub created_at: i64,
    pub updated_at: i64,
    pub settled_amount: u64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub enum CampaignStatus {
    Active,
    Closed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub enum CampaignLocationStatus {
    Active,
    Cancelled,
    Settled,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub enum LocationStatus {
    Available,
    Booked {
        campaign: Pubkey,
    },
    Inactive,
}

#[event]
pub struct CampaignCreated {
    pub campaign: Pubkey,
    pub authority: Pubkey,
    pub campaign_idx: u64,
}

#[event]
pub struct CampaignUpdated {
    pub campaign: Pubkey,
}

#[event]
pub struct BudgetAdded {
    pub campaign: Pubkey,
    pub amount: u64,
    pub available_budget: u64,
}

#[event]
pub struct BudgetWithdrawn {
    pub campaign: Pubkey,
    pub amount: u64,
    pub available_budget: u64,
}

#[event]
pub struct CampaignClosed {
    pub campaign: Pubkey,
    pub authority: Pubkey,
}

#[event]
pub struct LocationRegistered {
    pub location: Pubkey,
    pub authority: Pubkey,
    pub location_idx: u64,
}

#[event]
pub struct LocationUpdated {
    pub location: Pubkey,
}

#[event]
pub struct CampaignLocationBooked {
    pub campaign: Pubkey,
    pub location: Pubkey,
    pub price: u64,
}

#[event]
pub struct CampaignLocationCancelled {
    pub campaign: Pubkey,
    pub location: Pubkey,
    pub price: u64,
}

#[event]
pub struct CampaignLocationSettled {
    pub campaign: Pubkey,
    pub location: Pubkey,
    pub settled_amount: u64,
    pub refunded_amount: u64,
}
