use anchor_lang::prelude::*;
use crate::states::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}


#[derive(Accounts)]
pub struct AddDevice {

}

#[derive(Accounts)]
pub struct UpdateDeviceMetrics {

}



