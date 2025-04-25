use anchor_lang::prelude::*;
pub mod errors;
pub mod states;
pub mod constants;
pub mod context;

use context::*;

declare_id!("9hpXQKdSM4gJLa37Lb259dNJ5J2d6wA2sy2sAzni5nNF");

#[program]
pub mod soul_board_oracle {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    //updates the device metrics for a location 
    pub fn update_device_metrics(ctx: Context<UpdateDeviceMetrics>) -> Result<()> {
        Ok(())
    }

    //adds a device to the location 
    pub fn add_device(ctx: Context<AddDevice>) -> Result<()> {
        Ok(())
    }

    
}


