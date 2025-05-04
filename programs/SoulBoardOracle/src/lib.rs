use anchor_lang::prelude::*;
pub mod errors;
pub mod states;
pub mod constants;
pub mod context;

use context::*;
use states::*;
declare_id!("9hpXQKdSM4gJLa37Lb259dNJ5J2d6wA2sy2sAzni5nNF");

#[program]
pub mod soul_board_oracle {
    use super::*;

    pub fn initialize(ctx: Context<Initialize> , location : Pubkey) -> Result<()> {
        let device = &mut ctx.accounts.device;
        device.authority = ctx.accounts.authority.key();
        device.device_id = 0;
        device.device_metrics = DeviceMetrics {
            device_id: 0,
            location: location.key()   ,
            metrics: vec![],
        };
        Ok(())
    }

    //updates the device metrics for a location 
    pub fn update_device_metrics(ctx: Context<UpdateDeviceMetrics>) -> Result<()> {
        let device = &mut ctx.accounts.device;
        let device_metrics = &mut device.device_metrics;
        device_metrics.metrics.push(DeviceMetric {
            timestamp: Clock::get()?.unix_timestamp,
            views: 0,
            impressions: 0,
        });

        Ok(())
    }

    //adds a device to the location 
    pub fn add_device(ctx: Context<AddDevice>) -> Result<()> {
        let device = &mut ctx.accounts.device;
        device.device_id = device.device_id + 1;
        Ok(())
    }
}


