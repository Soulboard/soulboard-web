use anchor_lang::prelude::*;
use anchor_lang::AccountDeserialize;
use soul_board_oracle::constants::DEVICE_KEY as ORACLE_DEVICE_KEY;
use soul_board_oracle::states::{Device as OracleDevice, DeviceStatus as OracleDeviceStatus};

use crate::constant::{BPS_DENOMINATOR, MAX_SLOTS_PER_SCHEDULE, PLATFORM_FEE_BPS};
use crate::context::{
    AddLocationSlot, BookLocationRange, CancelLocationBooking, CreateLocationSchedule,
    InitializeConfig, SettleLocationBooking,
};
use crate::errors::SoulboardError;
use crate::states::{
    BookingStatus, CampaignBookingCancelled, CampaignBookingCreated, CampaignBookingSettled,
    LocationScheduleCreated, LocationSlot, LocationSlotAdded, LocationStatus, PricingModel,
    SlotStatus, SoulboardConfigInitialized,
};
use crate::utils::{ensure_rent_exempt_after_withdraw, move_lamports, require_campaign_active};

fn load_oracle_device(
    device_info: &AccountInfo,
    device_authority: &AccountInfo,
    device_idx: u64,
) -> Result<OracleDevice> {
    require_keys_eq!(
        *device_info.owner,
        soul_board_oracle::ID,
        SoulboardError::InvalidOracleDevice
    );

    let (expected, _) = Pubkey::find_program_address(
        &[
            ORACLE_DEVICE_KEY,
            device_authority.key().as_ref(),
            &device_idx.to_le_bytes(),
        ],
        &soul_board_oracle::ID,
    );
    require_keys_eq!(expected, device_info.key(), SoulboardError::InvalidOracleDevice);

    let mut data: &[u8] = &device_info.data.borrow();
    let device = OracleDevice::try_deserialize(&mut data)
        .map_err(|_| SoulboardError::InvalidOracleDevice)?;
    require!(
        device.status == OracleDeviceStatus::Active,
        SoulboardError::OracleDeviceInactive
    );
    require_keys_eq!(
        device.authority,
        device_authority.key(),
        SoulboardError::InvalidOracleDevice
    );
    require!(
        device.device_idx == device_idx,
        SoulboardError::InvalidOracleDevice
    );

    Ok(device)
}

pub fn initialize_config(ctx: Context<InitializeConfig>, treasury: Pubkey) -> Result<()> {
    require!(
        treasury != Pubkey::default(),
        SoulboardError::InvalidParameters
    );

    let config = &mut ctx.accounts.config;
    config.authority = ctx.accounts.authority.key();
    config.treasury = treasury;
    config.fee_bps = PLATFORM_FEE_BPS as u16;

    emit!(SoulboardConfigInitialized {
        config: config.key(),
        authority: config.authority,
        treasury: config.treasury,
        fee_bps: config.fee_bps,
    });

    Ok(())
}

pub fn create_location_schedule(
    ctx: Context<CreateLocationSchedule>,
    _location_idx: u64,
    max_slots: u32,
) -> Result<()> {
    require!(max_slots > 0, SoulboardError::InvalidParameters);
    require!(
        max_slots <= MAX_SLOTS_PER_SCHEDULE,
        SoulboardError::InvalidParameters
    );

    let schedule = &mut ctx.accounts.schedule;
    schedule.location = ctx.accounts.location.key();
    schedule.authority = ctx.accounts.authority.key();
    schedule.max_slots = max_slots;
    schedule.slot_count = 0;
    schedule.slots = Vec::new();

    emit!(LocationScheduleCreated {
        schedule: schedule.key(),
        location: schedule.location,
        authority: schedule.authority,
        max_slots,
    });

    Ok(())
}

pub fn add_location_slot(
    ctx: Context<AddLocationSlot>,
    _location_idx: u64,
    start_ts: i64,
    end_ts: i64,
    price: u64,
) -> Result<()> {
    require!(start_ts < end_ts, SoulboardError::InvalidTimeRange);
    require!(price > 0, SoulboardError::InvalidParameters);

    let schedule = &mut ctx.accounts.schedule;
    require!(
        schedule.location == ctx.accounts.location.key(),
        SoulboardError::InvalidParameters
    );
    require!(
        schedule.authority == ctx.accounts.authority.key(),
        SoulboardError::InvalidAuthority
    );
    require!(
        schedule.slot_count < schedule.max_slots,
        SoulboardError::ScheduleFull
    );

    for slot in schedule.slots.iter() {
        if matches!(slot.status, SlotStatus::Available | SlotStatus::Booked) {
            let overlaps = start_ts < slot.end_ts && end_ts > slot.start_ts;
            require!(!overlaps, SoulboardError::SlotOverlap);
        }
    }

    schedule.slots.push(LocationSlot {
        start_ts,
        end_ts,
        price,
        status: SlotStatus::Available,
        booking: Pubkey::default(),
    });
    schedule.slot_count = schedule
        .slot_count
        .checked_add(1)
        .ok_or(SoulboardError::ArithmeticOverflow)?;

    emit!(LocationSlotAdded {
        schedule: schedule.key(),
        start_ts,
        end_ts,
        price,
    });

    Ok(())
}

pub fn book_location_range(
    ctx: Context<BookLocationRange>,
    _campaign_idx: u64,
    _location_idx: u64,
    range_start_ts: i64,
    range_end_ts: i64,
    device_idx: u64,
    pricing_model: PricingModel,
) -> Result<()> {
    require!(range_start_ts < range_end_ts, SoulboardError::InvalidTimeRange);
    if let PricingModel::PerImpression { price } | PricingModel::Cpm { price } = &pricing_model {
        require!(*price > 0, SoulboardError::InvalidParameters);
    }

    let campaign = &mut ctx.accounts.campaign;
    let location = &mut ctx.accounts.location;
    let schedule = &mut ctx.accounts.schedule;
    let booking = &mut ctx.accounts.booking;

    let device = load_oracle_device(
        &ctx.accounts.oracle_device,
        &ctx.accounts.device_authority,
        device_idx,
    )?;

    require_keys_eq!(device.location, location.key(), SoulboardError::InvalidOracleDevice);
    require_keys_eq!(
        device.oracle_authority,
        location.oracle_authority,
        SoulboardError::InvalidOracleAuthority
    );

    require_campaign_active(campaign)?;
    require!(
        location.location_status != LocationStatus::Inactive,
        SoulboardError::LocationInactive
    );
    require!(
        schedule.location == location.key(),
        SoulboardError::InvalidParameters
    );
    require!(
        schedule.authority == location.authority,
        SoulboardError::InvalidAuthority
    );
    require!(
        schedule.authority == location.authority,
        SoulboardError::InvalidAuthority
    );
    require!(
        location.oracle_authority != Pubkey::default(),
        SoulboardError::OracleNotConfigured
    );

    let now = Clock::get()?.unix_timestamp;
    let mut total_price: u64 = 0;
    let mut slot_count: u32 = 0;

    for slot in schedule.slots.iter() {
        if slot.start_ts >= range_start_ts && slot.end_ts <= range_end_ts {
            require!(
                slot.start_ts > now,
                SoulboardError::SlotInPast
            );
            require!(slot.status == SlotStatus::Available, SoulboardError::SlotUnavailable);
            total_price = total_price
                .checked_add(slot.price)
                .ok_or(SoulboardError::ArithmeticOverflow)?;
            slot_count = slot_count
                .checked_add(1)
                .ok_or(SoulboardError::ArithmeticOverflow)?;
        }
    }

    require!(slot_count > 0, SoulboardError::SlotNotFound);
    require!(
        campaign.available_budget >= total_price,
        SoulboardError::InsufficientBudget
    );
    ensure_rent_exempt_after_withdraw(&campaign.to_account_info(), total_price)?;

    campaign.available_budget = campaign
        .available_budget
        .checked_sub(total_price)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    campaign.reserved_budget = campaign
        .reserved_budget
        .checked_add(total_price)
        .ok_or(SoulboardError::ArithmeticOverflow)?;

    move_lamports(
        &campaign.to_account_info(),
        &booking.to_account_info(),
        total_price,
    )?;

    for slot in schedule.slots.iter_mut() {
        if slot.start_ts >= range_start_ts && slot.end_ts <= range_end_ts {
            slot.status = SlotStatus::Booked;
            slot.booking = booking.key();
        }
    }

    let now = Clock::get()?.unix_timestamp;
    booking.campaign = campaign.key();
    booking.location = location.key();
    booking.advertiser = campaign.authority;
    booking.provider = location.authority;
    booking.oracle_authority = location.oracle_authority;
    booking.device = ctx.accounts.oracle_device.key();
    booking.device_authority = ctx.accounts.device_authority.key();
    booking.device_idx = device_idx;
    booking.range_start_ts = range_start_ts;
    booking.range_end_ts = range_end_ts;
    booking.slot_count = slot_count;
    booking.total_price = total_price;
    booking.pricing_model = pricing_model;
    booking.start_impressions = device.metrics.total_impressions;
    booking.status = BookingStatus::Active;
    booking.created_at = now;
    booking.updated_at = now;
    booking.impressions = 0;
    booking.settled_amount = 0;
    booking.fee_amount = 0;

    emit!(CampaignBookingCreated {
        booking: booking.key(),
        campaign: campaign.key(),
        location: location.key(),
        slot_count,
        total_price,
    });

    Ok(())
}

pub fn cancel_location_booking(
    ctx: Context<CancelLocationBooking>,
    _campaign_idx: u64,
    _location_idx: u64,
    _range_start_ts: i64,
    _range_end_ts: i64,
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let location = &mut ctx.accounts.location;
    let schedule = &mut ctx.accounts.schedule;
    let booking = &mut ctx.accounts.booking;

    require!(
        booking.status == BookingStatus::Active,
        SoulboardError::BookingNotActive
    );
    require_keys_eq!(booking.campaign, campaign.key(), SoulboardError::InvalidParameters);
    require_keys_eq!(booking.location, location.key(), SoulboardError::InvalidParameters);
    require!(
        schedule.location == location.key(),
        SoulboardError::InvalidParameters
    );
    require!(
        schedule.authority == location.authority,
        SoulboardError::InvalidAuthority
    );

    let total_price = booking.total_price;
    ensure_rent_exempt_after_withdraw(&booking.to_account_info(), total_price)?;

    move_lamports(
        &booking.to_account_info(),
        &campaign.to_account_info(),
        total_price,
    )?;

    campaign.reserved_budget = campaign
        .reserved_budget
        .checked_sub(total_price)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    campaign.available_budget = campaign
        .available_budget
        .checked_add(total_price)
        .ok_or(SoulboardError::ArithmeticOverflow)?;

    for slot in schedule.slots.iter_mut() {
        if slot.booking == booking.key() {
            slot.status = SlotStatus::Available;
            slot.booking = Pubkey::default();
        }
    }

    booking.status = BookingStatus::Cancelled;
    booking.updated_at = Clock::get()?.unix_timestamp;

    emit!(CampaignBookingCancelled {
        booking: booking.key(),
        campaign: campaign.key(),
        location: location.key(),
        refunded_amount: total_price,
    });

    Ok(())
}

pub fn settle_location_booking(
    ctx: Context<SettleLocationBooking>,
    _campaign_idx: u64,
    _location_idx: u64,
    _range_start_ts: i64,
    _range_end_ts: i64,
    campaign_authority: Pubkey,
    provider_authority: Pubkey,
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    let location = &mut ctx.accounts.location;
    let schedule = &mut ctx.accounts.schedule;
    let booking = &mut ctx.accounts.booking;
    let config = &ctx.accounts.config;

    let device = load_oracle_device(
        &ctx.accounts.oracle_device,
        &ctx.accounts.device_authority,
        booking.device_idx,
    )?;

    require_keys_eq!(campaign.authority, campaign_authority, SoulboardError::InvalidAuthority);
    require_keys_eq!(location.authority, provider_authority, SoulboardError::InvalidAuthority);
    require!(
        booking.status == BookingStatus::Active,
        SoulboardError::BookingNotActive
    );
    require_keys_eq!(booking.campaign, campaign.key(), SoulboardError::InvalidParameters);
    require_keys_eq!(booking.location, location.key(), SoulboardError::InvalidParameters);
    require!(
        schedule.location == location.key(),
        SoulboardError::InvalidParameters
    );
    require!(
        schedule.authority == location.authority,
        SoulboardError::InvalidAuthority
    );
    require_keys_eq!(
        booking.oracle_authority,
        ctx.accounts.oracle_authority.key(),
        SoulboardError::InvalidOracleAuthority
    );
    require_keys_eq!(
        location.oracle_authority,
        booking.oracle_authority,
        SoulboardError::InvalidOracleAuthority
    );
    require_keys_eq!(
        booking.device,
        ctx.accounts.oracle_device.key(),
        SoulboardError::InvalidOracleDevice
    );
    require_keys_eq!(
        booking.device_authority,
        ctx.accounts.device_authority.key(),
        SoulboardError::InvalidOracleDevice
    );
    require_keys_eq!(
        device.location,
        location.key(),
        SoulboardError::InvalidOracleDevice
    );
    require_keys_eq!(
        device.oracle_authority,
        booking.oracle_authority,
        SoulboardError::InvalidOracleAuthority
    );
    require_keys_eq!(
        ctx.accounts.location_authority.key(),
        location.authority,
        SoulboardError::InvalidAuthority
    );
    require_keys_eq!(
        ctx.accounts.treasury.key(),
        config.treasury,
        SoulboardError::InvalidAuthority
    );

    let impressions = device
        .metrics
        .total_impressions
        .checked_sub(booking.start_impressions)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;

    let gross_raw = match booking.pricing_model {
        PricingModel::TimeSlot => booking.total_price,
        PricingModel::PerImpression { price } => price
            .checked_mul(impressions)
            .ok_or(SoulboardError::ArithmeticOverflow)?,
        PricingModel::Cpm { price } => {
            let numerator = price
                .checked_mul(impressions)
                .ok_or(SoulboardError::ArithmeticOverflow)?;
            numerator
                .checked_div(1_000)
                .ok_or(SoulboardError::ArithmeticUnderflow)?
        }
    };
    let gross = if gross_raw > booking.total_price {
        booking.total_price
    } else {
        gross_raw
    };
    let fee_amount = gross
        .checked_mul(config.fee_bps as u64)
        .ok_or(SoulboardError::ArithmeticOverflow)?
        .checked_div(BPS_DENOMINATOR)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    let net_amount = gross
        .checked_sub(fee_amount)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    let refund = booking
        .total_price
        .checked_sub(gross)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;

    ensure_rent_exempt_after_withdraw(&booking.to_account_info(), booking.total_price)?;

    move_lamports(
        &booking.to_account_info(),
        &ctx.accounts.location_authority.to_account_info(),
        net_amount,
    )?;
    if fee_amount > 0 {
        move_lamports(
            &booking.to_account_info(),
            &ctx.accounts.treasury.to_account_info(),
            fee_amount,
        )?;
    }
    if refund > 0 {
        move_lamports(
            &booking.to_account_info(),
            &campaign.to_account_info(),
            refund,
        )?;
    }

    campaign.reserved_budget = campaign
        .reserved_budget
        .checked_sub(booking.total_price)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    campaign.available_budget = campaign
        .available_budget
        .checked_add(refund)
        .ok_or(SoulboardError::ArithmeticOverflow)?;

    for slot in schedule.slots.iter_mut() {
        if slot.booking == booking.key() {
            slot.status = SlotStatus::Settled;
        }
    }

    booking.status = BookingStatus::Settled;
    booking.updated_at = Clock::get()?.unix_timestamp;
    booking.impressions = impressions;
    booking.settled_amount = gross;
    booking.fee_amount = fee_amount;

    emit!(CampaignBookingSettled {
        booking: booking.key(),
        campaign: campaign.key(),
        location: location.key(),
        impressions,
        settled_amount: gross,
        fee_amount,
        refunded_amount: refund,
    });

    Ok(())
}
