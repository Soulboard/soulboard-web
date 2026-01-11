use anchor_lang::prelude::*;
use crate::states::*;
use crate::constants::*;

#[derive(Accounts)]
pub struct CreateDeviceRegistry<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,

    #[account(
        init,
        payer = authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + DeviceRegistry::INIT_SPACE,
        seeds = [DEVICE_REGISTRY_KEY, authority.key().as_ref()],
        bump,
    )]
    pub registry: Account<'info, DeviceRegistry>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RegisterDevice<'info> {
    #[account(
        mut,
        seeds = [DEVICE_REGISTRY_KEY, authority.key().as_ref()],
        bump,
        has_one = authority,
    )]
    pub registry: Account<'info, DeviceRegistry>,

    #[account(
        init,
        payer = authority,
        space = ANCHOR_DISCRIMINATOR_SIZE + Device::INIT_SPACE,
        seeds = [DEVICE_KEY, authority.key().as_ref(), &registry.last_device_id.to_le_bytes()],
        bump,
    )]
    pub device: Account<'info, Device>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(device_idx: u64)]
pub struct UpdateDeviceLocation<'info> {
    #[account(
        mut,
        seeds = [DEVICE_KEY, authority.key().as_ref(), &device_idx.to_le_bytes()],
        bump,
        has_one = authority,
    )]
    pub device: Account<'info, Device>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(device_idx: u64)]
pub struct UpdateDeviceOracle<'info> {
    #[account(
        mut,
        seeds = [DEVICE_KEY, authority.key().as_ref(), &device_idx.to_le_bytes()],
        bump,
        has_one = authority,
    )]
    pub device: Account<'info, Device>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(device_idx: u64)]
pub struct SetDeviceStatus<'info> {
    #[account(
        mut,
        seeds = [DEVICE_KEY, authority.key().as_ref(), &device_idx.to_le_bytes()],
        bump,
        has_one = authority,
    )]
    pub device: Account<'info, Device>,

    pub authority: Signer<'info>,
}

#[derive(Accounts)]
#[instruction(device_idx: u64)]
pub struct ReportDeviceMetrics<'info> {
    #[account(
        mut,
        seeds = [DEVICE_KEY, device_authority.key().as_ref(), &device_idx.to_le_bytes()],
        bump,
    )]
    pub device: Account<'info, Device>,

    /// CHECK: used for PDA seeds and ownership verification
    pub device_authority: AccountInfo<'info>,

    pub oracle_authority: Signer<'info>,
}
