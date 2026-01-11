use anchor_lang::prelude::*;
pub mod constants;
pub mod context;
pub mod errors;
pub mod instructions;
pub mod states;

use context::*;
use states::DeviceStatus;
declare_id!("HbjHJmYYCSjfyiJWCRvaYWo1vKsgRurFDkrxNnNusVFX");

#[program]
pub mod soul_board_oracle {
    use super::*;

    pub fn create_device_registry(ctx: Context<CreateDeviceRegistry>) -> Result<()> {
        crate::instructions::registry::create_device_registry(ctx)
    }

    pub fn register_device(
        ctx: Context<RegisterDevice>,
        location: Pubkey,
        oracle_authority: Pubkey,
    ) -> Result<()> {
        crate::instructions::device::register_device(ctx, location, oracle_authority)
    }

    pub fn update_device_location(
        ctx: Context<UpdateDeviceLocation>,
        device_idx: u64,
        location: Pubkey,
    ) -> Result<()> {
        crate::instructions::device::update_device_location(ctx, device_idx, location)
    }

    pub fn update_device_oracle(
        ctx: Context<UpdateDeviceOracle>,
        device_idx: u64,
        oracle_authority: Pubkey,
    ) -> Result<()> {
        crate::instructions::device::update_device_oracle(ctx, device_idx, oracle_authority)
    }

    pub fn set_device_status(
        ctx: Context<SetDeviceStatus>,
        device_idx: u64,
        status: DeviceStatus,
    ) -> Result<()> {
        crate::instructions::device::set_device_status(ctx, device_idx, status)
    }

    pub fn report_device_metrics(
        ctx: Context<ReportDeviceMetrics>,
        device_idx: u64,
        views: u64,
        impressions: u64,
    ) -> Result<()> {
        crate::instructions::device::report_device_metrics(
            ctx,
            device_idx,
            views,
            impressions,
        )
    }
}
