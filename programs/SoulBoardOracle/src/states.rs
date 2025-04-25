use anchor_lang::prelude::*;


#[account]
pub struct Device {
    pub authority: Pubkey,
    pub device_id: u64,
    pub location: Pubkey,
    pub location_idx: u64,
    pub device_metrics: DeviceMetrics,
}


#[account]
pub struct DeviceMetrics {
    pub device_id: u64,
    pub location: Pubkey,
    pub location_idx: u64,
    pub metrics: Vec<DeviceMetric>, 
}


#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct DeviceMetric {
    pub timestamp: u64,
    pub views: u64,
    pub impressions: u64,
}

