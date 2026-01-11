use anchor_lang::prelude::*;
pub mod constant;
pub mod context;
pub mod errors;
pub mod instructions;
pub mod states;
pub mod utils;

use context::*;
use states::LocationStatus;
declare_id!("AiQgeLV5m6kdQsU8A4wFh2zBpzd6D21seseR2SUgQDKB");

#[program]
pub mod soulboard {
    use super::*;

    pub fn create_advertiser(ctx: Context<CreateAdvertiser>) -> Result<()> {
        crate::instructions::advertiser::create_advertiser(ctx)
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
        settlement_amount: u64,
    ) -> Result<()> {
        crate::instructions::booking::settle_campaign_location(
            ctx,
            campaign_idx,
            location_idx,
            settlement_amount,
        )
    }
}
