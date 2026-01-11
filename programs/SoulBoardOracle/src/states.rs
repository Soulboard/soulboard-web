use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct DeviceRegistry {
    pub authority: Pubkey,
    pub last_device_id: u64,
    pub device_count: u64,
}

#[account]
#[derive(InitSpace)]
pub struct Device {
    pub authority: Pubkey,
    pub device_idx: u64,
    pub location: Pubkey,
    pub oracle_authority: Pubkey,
    pub status: DeviceStatus,
    pub metrics: DeviceMetrics,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, PartialEq, Debug)]
pub enum DeviceStatus {
    Active,
    Inactive,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, InitSpace, Debug)]
pub struct DeviceMetrics {
    pub total_views: u64,
    pub total_impressions: u64,
    pub last_reported_at: i64,
}

#[event]
pub struct DeviceRegistryCreated {
    pub registry: Pubkey,
    pub authority: Pubkey,
}

#[event]
pub struct DeviceRegistered {
    pub device: Pubkey,
    pub authority: Pubkey,
    pub device_idx: u64,
    pub location: Pubkey,
    pub oracle_authority: Pubkey,
}

#[event]
pub struct DeviceLocationUpdated {
    pub device: Pubkey,
    pub location: Pubkey,
}

#[event]
pub struct DeviceOracleUpdated {
    pub device: Pubkey,
    pub oracle_authority: Pubkey,
}

#[event]
pub struct DeviceStatusUpdated {
    pub device: Pubkey,
    pub status: DeviceStatus,
}

#[event]
pub struct DeviceMetricsReported {
    pub device: Pubkey,
    pub views: u64,
    pub impressions: u64,
    pub total_views: u64,
    pub total_impressions: u64,
    pub reported_at: i64,
}
