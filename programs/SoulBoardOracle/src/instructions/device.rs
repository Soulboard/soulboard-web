use anchor_lang::prelude::*;

use crate::context::{
    RegisterDevice, ReportDeviceMetrics, SetDeviceStatus, UpdateDeviceLocation, UpdateDeviceOracle,
};
use crate::errors::OracleError;
use crate::states::{
    DeviceLocationUpdated, DeviceMetrics, DeviceMetricsReported, DeviceOracleUpdated,
    DeviceRegistered, DeviceStatus, DeviceStatusUpdated,
};

pub fn register_device(
    ctx: Context<RegisterDevice>,
    location: Pubkey,
    oracle_authority: Pubkey,
) -> Result<()> {
    let registry = &mut ctx.accounts.registry;
    let device = &mut ctx.accounts.device;

    device.authority = ctx.accounts.authority.key();
    device.device_idx = registry.last_device_id;
    device.location = location;
    device.oracle_authority = oracle_authority;
    device.status = DeviceStatus::Active;
    device.metrics = DeviceMetrics {
        total_views: 0,
        total_impressions: 0,
        last_reported_at: 0,
    };

    registry.last_device_id = registry
        .last_device_id
        .checked_add(1)
        .ok_or(OracleError::ArithmeticOverflow)?;
    registry.device_count = registry
        .device_count
        .checked_add(1)
        .ok_or(OracleError::ArithmeticOverflow)?;

    emit!(DeviceRegistered {
        device: device.key(),
        authority: device.authority,
        device_idx: device.device_idx,
        location: device.location,
        oracle_authority: device.oracle_authority,
    });

    Ok(())
}

pub fn update_device_location(
    ctx: Context<UpdateDeviceLocation>,
    _device_idx: u64,
    location: Pubkey,
) -> Result<()> {
    let device = &mut ctx.accounts.device;
    device.location = location;

    emit!(DeviceLocationUpdated {
        device: device.key(),
        location: device.location,
    });

    Ok(())
}

pub fn update_device_oracle(
    ctx: Context<UpdateDeviceOracle>,
    _device_idx: u64,
    oracle_authority: Pubkey,
) -> Result<()> {
    let device = &mut ctx.accounts.device;
    device.oracle_authority = oracle_authority;

    emit!(DeviceOracleUpdated {
        device: device.key(),
        oracle_authority: device.oracle_authority,
    });

    Ok(())
}

pub fn set_device_status(
    ctx: Context<SetDeviceStatus>,
    _device_idx: u64,
    status: DeviceStatus,
) -> Result<()> {
    let device = &mut ctx.accounts.device;
    device.status = status.clone();

    emit!(DeviceStatusUpdated {
        device: device.key(),
        status,
    });

    Ok(())
}

pub fn report_device_metrics(
    ctx: Context<ReportDeviceMetrics>,
    _device_idx: u64,
    views: u64,
    impressions: u64,
) -> Result<()> {
    require!(
        views > 0 || impressions > 0,
        OracleError::InvalidParameters
    );

    let device = &mut ctx.accounts.device;
    require!(device.status == DeviceStatus::Active, OracleError::DeviceInactive);
    require_keys_eq!(
        device.authority,
        ctx.accounts.device_authority.key(),
        OracleError::InvalidAuthority
    );
    require_keys_eq!(
        device.oracle_authority,
        ctx.accounts.oracle_authority.key(),
        OracleError::InvalidOracleAuthority
    );

    device.metrics.total_views = device
        .metrics
        .total_views
        .checked_add(views)
        .ok_or(OracleError::ArithmeticOverflow)?;
    device.metrics.total_impressions = device
        .metrics
        .total_impressions
        .checked_add(impressions)
        .ok_or(OracleError::ArithmeticOverflow)?;
    device.metrics.last_reported_at = Clock::get()?.unix_timestamp;

    emit!(DeviceMetricsReported {
        device: device.key(),
        views,
        impressions,
        total_views: device.metrics.total_views,
        total_impressions: device.metrics.total_impressions,
        reported_at: device.metrics.last_reported_at,
    });

    Ok(())
}
