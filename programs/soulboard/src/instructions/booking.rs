use anchor_lang::prelude::*;

use crate::context::{AddCampaignLocation, RemoveCampaignLocation, SettleCampaignLocation};
use crate::errors::SoulboardError;
use crate::states::{
    CampaignLocationBooked, CampaignLocationCancelled, CampaignLocationSettled, CampaignLocationStatus,
    LocationStatus,
};
use crate::utils::{ensure_rent_exempt_after_withdraw, move_lamports, require_campaign_active};

pub fn add_campaign_location(
    ctx: Context<AddCampaignLocation>,
    _campaign_idx: u64,
    _location_idx: u64,
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let location = &mut ctx.accounts.location;
    let campaign_location = &mut ctx.accounts.campaign_location;

    require_campaign_active(campaign)?;
    require_keys_eq!(
        ctx.accounts.provider.authority,
        location.authority,
        SoulboardError::InvalidAuthority
    );

    require!(
        location.oracle_authority != Pubkey::default(),
        SoulboardError::OracleNotConfigured
    );

    match location.location_status {
        LocationStatus::Available => {}
        LocationStatus::Booked { .. } => return Err(SoulboardError::LocationAlreadyBooked.into()),
        LocationStatus::Inactive => return Err(SoulboardError::LocationInactive.into()),
    }

    let price = location.price;
    require!(
        campaign.available_budget >= price,
        SoulboardError::InsufficientBudget
    );
    ensure_rent_exempt_after_withdraw(&campaign.to_account_info(), price)?;

    campaign.available_budget = campaign
        .available_budget
        .checked_sub(price)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    campaign.reserved_budget = campaign
        .reserved_budget
        .checked_add(price)
        .ok_or(SoulboardError::ArithmeticOverflow)?;

    move_lamports(
        &campaign.to_account_info(),
        &campaign_location.to_account_info(),
        price,
    )?;

    location.location_status = LocationStatus::Booked {
        campaign: campaign.key(),
    };

    let now = Clock::get()?.unix_timestamp;
    campaign_location.campaign = campaign.key();
    campaign_location.location = location.key();
    campaign_location.advertiser = campaign.authority;
    campaign_location.provider = location.authority;
    campaign_location.oracle_authority = location.oracle_authority;
    campaign_location.price = price;
    campaign_location.status = CampaignLocationStatus::Active;
    campaign_location.created_at = now;
    campaign_location.updated_at = now;
    campaign_location.settled_amount = 0;

    emit!(CampaignLocationBooked {
        campaign: campaign.key(),
        location: location.key(),
        price,
    });

    Ok(())
}

pub fn remove_campaign_location(
    ctx: Context<RemoveCampaignLocation>,
    _campaign_idx: u64,
    _location_idx: u64,
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let location = &mut ctx.accounts.location;
    let campaign_location = &mut ctx.accounts.campaign_location;

    require_keys_eq!(
        ctx.accounts.provider.authority,
        location.authority,
        SoulboardError::InvalidAuthority
    );
    require!(
        campaign_location.status == CampaignLocationStatus::Active,
        SoulboardError::BookingNotActive
    );
    match location.location_status {
        LocationStatus::Booked { campaign: booked_campaign } => {
            require_keys_eq!(booked_campaign, campaign.key(), SoulboardError::InvalidParameters);
        }
        _ => return Err(SoulboardError::LocationUnavailable.into()),
    }

    let price = campaign_location.price;
    ensure_rent_exempt_after_withdraw(&campaign_location.to_account_info(), price)?;

    campaign.available_budget = campaign
        .available_budget
        .checked_add(price)
        .ok_or(SoulboardError::ArithmeticOverflow)?;
    campaign.reserved_budget = campaign
        .reserved_budget
        .checked_sub(price)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;

    move_lamports(
        &campaign_location.to_account_info(),
        &campaign.to_account_info(),
        price,
    )?;

    location.location_status = LocationStatus::Available;
    campaign_location.status = CampaignLocationStatus::Cancelled;
    campaign_location.updated_at = Clock::get()?.unix_timestamp;

    emit!(CampaignLocationCancelled {
        campaign: campaign.key(),
        location: location.key(),
        price,
    });

    Ok(())
}

pub fn settle_campaign_location(
    ctx: Context<SettleCampaignLocation>,
    _campaign_idx: u64,
    _location_idx: u64,
    settlement_amount: u64,
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let location = &mut ctx.accounts.location;
    let campaign_location = &mut ctx.accounts.campaign_location;

    require_keys_eq!(
        ctx.accounts.provider.authority,
        location.authority,
        SoulboardError::InvalidAuthority
    );
    require!(
        campaign_location.status == CampaignLocationStatus::Active,
        SoulboardError::BookingNotActive
    );
    require_keys_eq!(
        campaign_location.oracle_authority,
        ctx.accounts.oracle_authority.key(),
        SoulboardError::InvalidOracleAuthority
    );
    require_keys_eq!(
        location.oracle_authority,
        campaign_location.oracle_authority,
        SoulboardError::InvalidOracleAuthority
    );
    require_keys_eq!(
        ctx.accounts.location_authority.key(),
        location.authority,
        SoulboardError::InvalidAuthority
    );

    match location.location_status {
        LocationStatus::Booked { campaign: booked_campaign } => {
            require_keys_eq!(booked_campaign, campaign.key(), SoulboardError::InvalidParameters);
        }
        _ => return Err(SoulboardError::LocationUnavailable.into()),
    }

    let price = campaign_location.price;
    require!(settlement_amount <= price, SoulboardError::SettlementTooHigh);
    let refund = price
        .checked_sub(settlement_amount)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    ensure_rent_exempt_after_withdraw(&campaign_location.to_account_info(), price)?;

    move_lamports(
        &campaign_location.to_account_info(),
        &ctx.accounts.location_authority.to_account_info(),
        settlement_amount,
    )?;
    move_lamports(
        &campaign_location.to_account_info(),
        &campaign.to_account_info(),
        refund,
    )?;

    campaign.reserved_budget = campaign
        .reserved_budget
        .checked_sub(price)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    campaign.available_budget = campaign
        .available_budget
        .checked_add(refund)
        .ok_or(SoulboardError::ArithmeticOverflow)?;

    location.location_status = LocationStatus::Available;
    campaign_location.status = CampaignLocationStatus::Settled;
    campaign_location.updated_at = Clock::get()?.unix_timestamp;
    campaign_location.settled_amount = settlement_amount;

    emit!(CampaignLocationSettled {
        campaign: campaign.key(),
        location: location.key(),
        settled_amount: settlement_amount,
        refunded_amount: refund,
    });

    Ok(())
}
