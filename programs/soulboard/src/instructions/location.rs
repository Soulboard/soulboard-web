use anchor_lang::prelude::*;

use crate::constant::{MAX_LOCATION_DESC_LEN, MAX_LOCATION_NAME_LEN};
use crate::context::{RegisterLocation, SetLocationStatus, UpdateLocationDetails, UpdateLocationPrice};
use crate::errors::SoulboardError;
use crate::states::{LocationRegistered, LocationStatus, LocationUpdated};
use crate::utils::{ensure_string_len, set_optional_string};

pub fn register_location(
    ctx: Context<RegisterLocation>,
    location_name: String,
    location_description: String,
    price: u64,
    oracle_authority: Pubkey,
) -> Result<()> {
    let provider = &mut ctx.accounts.provider;
    let location = &mut ctx.accounts.location;

    ensure_string_len(&location_name, MAX_LOCATION_NAME_LEN)?;
    ensure_string_len(&location_description, MAX_LOCATION_DESC_LEN)?;
    require!(
        oracle_authority != Pubkey::default(),
        SoulboardError::OracleNotConfigured
    );

    location.authority = provider.authority;
    location.location_name = location_name;
    location.location_description = location_description;
    location.location_idx = provider.last_location_id;
    location.price = price;
    location.oracle_authority = oracle_authority;
    location.location_status = LocationStatus::Available;

    provider.last_location_id = provider
        .last_location_id
        .checked_add(1)
        .ok_or(SoulboardError::ArithmeticOverflow)?;
    provider.location_count = provider
        .location_count
        .checked_add(1)
        .ok_or(SoulboardError::ArithmeticOverflow)?;

    emit!(LocationRegistered {
        location: location.key(),
        authority: ctx.accounts.authority.key(),
        location_idx: location.location_idx,
    });

    Ok(())
}

pub fn update_location_details(
    ctx: Context<UpdateLocationDetails>,
    _location_idx: u64,
    location_name: Option<String>,
    location_description: Option<String>,
) -> Result<()> {
    let location = &mut ctx.accounts.location;

    set_optional_string(&mut location.location_name, location_name, MAX_LOCATION_NAME_LEN)?;
    set_optional_string(
        &mut location.location_description,
        location_description,
        MAX_LOCATION_DESC_LEN,
    )?;

    emit!(LocationUpdated {
        location: location.key(),
    });

    Ok(())
}

pub fn update_location_price(
    ctx: Context<UpdateLocationPrice>,
    _location_idx: u64,
    price: u64,
) -> Result<()> {
    let location = &mut ctx.accounts.location;
    location.price = price;

    emit!(LocationUpdated {
        location: location.key(),
    });

    Ok(())
}

pub fn set_location_status(
    ctx: Context<SetLocationStatus>,
    _location_idx: u64,
    status: LocationStatus,
) -> Result<()> {
    let location = &mut ctx.accounts.location;
    require!(
        !matches!(status, LocationStatus::Booked { .. }),
        SoulboardError::InvalidParameters
    );
    require!(
        !matches!(location.location_status, LocationStatus::Booked { .. }),
        SoulboardError::LocationAlreadyBooked
    );
    location.location_status = status;

    emit!(LocationUpdated {
        location: location.key(),
    });

    Ok(())
}
