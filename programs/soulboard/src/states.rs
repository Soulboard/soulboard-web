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
pub struct Provider {
    pub authority: Pubkey,

    pub last_location_id: u8,

    pub location_count: u8,
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

    #[max_len(10)]
    pub booked_locations: Vec<LocationBooking>
     
}

#[account]
#[derive(InitSpace)]
pub struct Location {
    pub authority: Pubkey, // Ad Provider

    pub location_idx: u8,

    pub price: u64,

    #[max_len(64)]
    pub location_name: String,

    #[max_len(100)]
    pub location_description: String,

    pub location_status: LocationStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub enum LocationStatus {
    Available,
    Booked {
        campaign_id: Pubkey,
    }, // booked by campaign id or authority
    Unavailable,// For under maintenance or other reasons
}





#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace)]
pub struct LocationBooking {
    pub location: Pubkey,    // Location account
          // Booked slot
}