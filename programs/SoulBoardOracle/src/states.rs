use anchor_lang::prelude::*;


#[account]
#[derive(InitSpace)]
pub struct Device {
    pub authority: Pubkey,
    pub device_id: u64,
    pub location: Pubkey,
    pub location_idx: u64,
    pub device_metrics: DeviceMetrics,
}

#[account]
#[derive(InitSpace)]
pub struct DeviceMetrics {
    pub device_id: u64,
    pub location: Pubkey,
    
    #[max_len(100)]
    pub metrics: Vec<DeviceMetric>, 
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
#[derive(InitSpace)]
pub struct DeviceMetric {
    pub timestamp: i64,
    pub views: u64,
    pub impressions: u64,
}

