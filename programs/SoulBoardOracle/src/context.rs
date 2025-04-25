use anchor_lang::prelude::*;
use crate::states::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

    #[account(
        init,
        payer = authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + Device::INIT_SPACE,
        seeds = [DEVICE_KEY, authority.key().as_ref()],
        bump,
    )]
    pub device: Account<'info, Device>,
    
}


#[derive(Accounts)]
pub struct AddDevice<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

    #[account(mut, seeds = [DEVICE_KEY, authority.key().as_ref()], bump)]
    pub device: Account<'info, Device>,

}

#[derive(Accounts)]
pub struct UpdateDeviceMetrics<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,

    #[account(mut)]
    pub device: Account<'info, Device>,

}



