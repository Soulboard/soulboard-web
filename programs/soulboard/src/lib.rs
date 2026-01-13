use anchor_lang::prelude::*;
pub mod constant;
pub mod context;
pub mod errors;
pub mod instructions;
pub mod states;
pub mod utils;

use context::*;
use states::{LocationStatus, PricingModel};
declare_id!("915wZsHsUJ7Pdei1XUY8jtdfia7D8t4r9XkhGD3TvrDV");

#[program]
pub mod soulboard {
    use super::*;

    pub fn create_advertiser(ctx: Context<CreateAdvertiser>) -> Result<()> {
        crate::instructions::advertiser::create_advertiser(ctx)
    }

    pub fn initialize_config(ctx: Context<InitializeConfig>, treasury: Pubkey) -> Result<()> {
        crate::instructions::slot::initialize_config(ctx, treasury)
    }

    pub fn create_provider(ctx: Context<CreateProvider>) -> Result<()> {
        crate::instructions::advertiser::create_provider(ctx)
    }

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        campaign_name: String,
        campaign_description: String,
        campaign_image_url: String,
        budget: u64,
    ) -> Result<()> {
        crate::instructions::campaign::create_campaign(
            ctx,
            campaign_name,
            campaign_description,
            campaign_image_url,
            budget,
        )
    }

    pub fn update_campaign(
        ctx: Context<UpdateCampaign>,
        campaign_idx: u64,
        campaign_name: Option<String>,
        campaign_description: Option<String>,
        campaign_image_url: Option<String>,
    ) -> Result<()> {
        crate::instructions::campaign::update_campaign(
            ctx,
            campaign_idx,
            campaign_name,
            campaign_description,
            campaign_image_url,
        )
    }

    pub fn add_budget(ctx: Context<AddBudget>, campaign_idx: u64, amount: u64) -> Result<()> {
        crate::instructions::budget::add_budget(ctx, campaign_idx, amount)
    }

    pub fn withdraw_budget(
        ctx: Context<WithdrawBudget>,
        campaign_idx: u64,
        amount: u64,
    ) -> Result<()> {
        crate::instructions::budget::withdraw_budget(ctx, campaign_idx, amount)
    }

    pub fn close_campaign(ctx: Context<CloseCampaign>, campaign_idx: u64) -> Result<()> {
        crate::instructions::campaign::close_campaign(ctx, campaign_idx)
    }

    pub fn register_location(
        ctx: Context<RegisterLocation>,
        location_name: String,
        location_description: String,
        price: u64,
        oracle_authority: Pubkey,
    ) -> Result<()> {
        crate::instructions::location::register_location(
            ctx,
            location_name,
            location_description,
            price,
            oracle_authority,
        )
    }

    pub fn create_location_schedule(
        ctx: Context<CreateLocationSchedule>,
        location_idx: u64,
        max_slots: u32,
    ) -> Result<()> {
        crate::instructions::slot::create_location_schedule(ctx, location_idx, max_slots)
    }

    pub fn add_location_slot(
        ctx: Context<AddLocationSlot>,
        location_idx: u64,
        start_ts: i64,
        end_ts: i64,
        price: u64,
    ) -> Result<()> {
        crate::instructions::slot::add_location_slot(ctx, location_idx, start_ts, end_ts, price)
    }

    pub fn book_location_range(
        ctx: Context<BookLocationRange>,
        campaign_idx: u64,
        location_idx: u64,
        range_start_ts: i64,
        range_end_ts: i64,
        device_idx: u64,
        pricing_model: PricingModel,
    ) -> Result<()> {
        crate::instructions::slot::book_location_range(
            ctx,
            campaign_idx,
            location_idx,
            range_start_ts,
            range_end_ts,
            device_idx,
            pricing_model,
        )
    }

    pub fn cancel_location_booking(
        ctx: Context<CancelLocationBooking>,
        campaign_idx: u64,
        location_idx: u64,
        range_start_ts: i64,
        range_end_ts: i64,
    ) -> Result<()> {
        crate::instructions::slot::cancel_location_booking(
            ctx,
            campaign_idx,
            location_idx,
            range_start_ts,
            range_end_ts,
        )
    }

    pub fn settle_location_booking(
        ctx: Context<SettleLocationBooking>,
        campaign_idx: u64,
        location_idx: u64,
        range_start_ts: i64,
        range_end_ts: i64,
        campaign_authority: Pubkey,
        provider_authority: Pubkey,
    ) -> Result<()> {
        crate::instructions::slot::settle_location_booking(
            ctx,
            campaign_idx,
            location_idx,
            range_start_ts,
            range_end_ts,
            campaign_authority,
            provider_authority,
        )
    }

    pub fn update_location_details(
        ctx: Context<UpdateLocationDetails>,
        location_idx: u64,
        location_name: Option<String>,
        location_description: Option<String>,
    ) -> Result<()> {
        crate::instructions::location::update_location_details(
            ctx,
            location_idx,
            location_name,
            location_description,
        )
    }

    pub fn update_location_price(
        ctx: Context<UpdateLocationPrice>,
        location_idx: u64,
        price: u64,
    ) -> Result<()> {
        crate::instructions::location::update_location_price(ctx, location_idx, price)
    }

    pub fn set_location_status(
        ctx: Context<SetLocationStatus>,
        location_idx: u64,
        status: LocationStatus,
    ) -> Result<()> {
        crate::instructions::location::set_location_status(ctx, location_idx, status)
    }

    pub fn add_campaign_location(
        ctx: Context<AddCampaignLocation>,
        campaign_idx: u64,
        location_idx: u64,
    ) -> Result<()> {
        crate::instructions::booking::add_campaign_location(ctx, campaign_idx, location_idx)
    }

    pub fn remove_campaign_location(
        ctx: Context<RemoveCampaignLocation>,
        campaign_idx: u64,
        location_idx: u64,
    ) -> Result<()> {
        crate::instructions::booking::remove_campaign_location(ctx, campaign_idx, location_idx)
    }

    pub fn settle_campaign_location(
        ctx: Context<SettleCampaignLocation>,
        campaign_idx: u64,
        location_idx: u64,
        campaign_authority: Pubkey,
        provider_authority: Pubkey,
        settlement_amount: u64,
    ) -> Result<()> {
        crate::instructions::booking::settle_campaign_location(
            ctx,
            campaign_idx,
            location_idx,
            campaign_authority,
            provider_authority,
            settlement_amount,
        )
    }
}
