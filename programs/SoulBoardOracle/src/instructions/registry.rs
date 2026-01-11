use anchor_lang::prelude::*;

use crate::context::CreateDeviceRegistry;
use crate::states::DeviceRegistryCreated;

pub fn create_device_registry(ctx: Context<CreateDeviceRegistry>) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    registry.authority = ctx.accounts.authority.key();
    registry.last_device_id = 0;
    registry.device_count = 0;

    emit!(DeviceRegistryCreated {
        registry: registry.key(),
        authority: ctx.accounts.authority.key(),
    });

    Ok(())
}
