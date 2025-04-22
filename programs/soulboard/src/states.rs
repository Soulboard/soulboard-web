use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Advertiser {
    pub authority: Pubkey,

    pub last_campaign_id: u8,

    pub campaign_count: u8,
}

#[account]
#[derive(InitSpace)]
pub struct Campaign {
    pub authority: Pubkey,

    pub campaign_idx: u8,

    #[max_len(32)]
    pub campaign_name: String,

    #[max_len(100)]
    pub campaign_description: String,

    #[max_len(255)]
    pub campaign_image_url: String,
}
