use anchor_lang::prelude::*;

use crate::constant::{
    MAX_CAMPAIGN_DESC_LEN, MAX_CAMPAIGN_IMAGE_URL_LEN, MAX_CAMPAIGN_NAME_LEN,
};
use crate::context::{CloseCampaign, CreateCampaign, UpdateCampaign};
use crate::errors::SoulboardError;
use crate::states::{CampaignCreated, CampaignStatus, CampaignUpdated, CampaignClosed};
use crate::utils::{ensure_string_len, require_campaign_active, set_optional_string, transfer_from_signer};

pub fn create_campaign(
    ctx: Context<CreateCampaign>,
    campaign_name: String,
    campaign_description: String,
    campaign_image_url: String,
    budget: u64,
) -> Result<()> {
    ensure_string_len(&campaign_name, MAX_CAMPAIGN_NAME_LEN)?;
    ensure_string_len(&campaign_description, MAX_CAMPAIGN_DESC_LEN)?;
    ensure_string_len(&campaign_image_url, MAX_CAMPAIGN_IMAGE_URL_LEN)?;

    if budget > 0 {
        transfer_from_signer(
            &ctx.accounts.authority.to_account_info(),
            &ctx.accounts.campaign.to_account_info(),
            &ctx.accounts.system_program.to_account_info(),
            budget,
        )?;
    }

    let campaign = &mut ctx.accounts.campaign;
    let advertiser = &mut ctx.accounts.advertiser;

    campaign.authority = ctx.accounts.authority.key();
    campaign.campaign_name = campaign_name;
    campaign.campaign_idx = advertiser.last_campaign_id;
    campaign.campaign_description = campaign_description;
    campaign.campaign_image_url = campaign_image_url;
    campaign.status = CampaignStatus::Active;
    campaign.available_budget = budget;
    campaign.reserved_budget = 0;

    advertiser.last_campaign_id = advertiser
        .last_campaign_id
        .checked_add(1)
        .ok_or(SoulboardError::ArithmeticOverflow)?;
    advertiser.campaign_count = advertiser
        .campaign_count
        .checked_add(1)
        .ok_or(SoulboardError::ArithmeticOverflow)?;

    emit!(CampaignCreated {
        campaign: campaign.key(),
        authority: ctx.accounts.authority.key(),
        campaign_idx: campaign.campaign_idx,
    });

    Ok(())
}

pub fn update_campaign(
    ctx: Context<UpdateCampaign>,
    _campaign_idx: u64,
    campaign_name: Option<String>,
    campaign_description: Option<String>,
    campaign_image_url: Option<String>,
) -> Result<()> {
    let campaign = &mut ctx.accounts.campaign;
    require_campaign_active(campaign)?;

    set_optional_string(&mut campaign.campaign_name, campaign_name, MAX_CAMPAIGN_NAME_LEN)?;
    set_optional_string(
        &mut campaign.campaign_description,
        campaign_description,
        MAX_CAMPAIGN_DESC_LEN,
    )?;
    set_optional_string(
        &mut campaign.campaign_image_url,
        campaign_image_url,
        MAX_CAMPAIGN_IMAGE_URL_LEN,
    )?;

    emit!(CampaignUpdated {
        campaign: campaign.key(),
    });

    Ok(())
}

pub fn close_campaign(ctx: Context<CloseCampaign>, _campaign_idx: u64) -> Result<()> {
    let advertiser = &mut ctx.accounts.advertiser;
    let campaign = &mut ctx.accounts.campaign;

    require_campaign_active(campaign)?;
    require!(
        campaign.reserved_budget == 0,
        SoulboardError::CampaignHasActiveBookings
    );

    campaign.status = CampaignStatus::Closed;
    advertiser.campaign_count = advertiser
        .campaign_count
        .checked_sub(1)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;

    emit!(CampaignClosed {
        campaign: campaign.key(),
        authority: ctx.accounts.authority.key(),
    });

    Ok(())
}
