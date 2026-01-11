use anchor_lang::prelude::*;

use crate::context::{CreateAdvertiser, CreateProvider};

pub fn create_advertiser(ctx: Context<CreateAdvertiser>) -> Result<()> {
    let advertiser = &mut ctx.accounts.advertiser;
    advertiser.authority = ctx.accounts.authority.key();
    advertiser.last_campaign_id = 0;
    advertiser.campaign_count = 0;
    Ok(())
}

pub fn create_provider(ctx: Context<CreateProvider>) -> Result<()> {
    let provider = &mut ctx.accounts.provider;
    provider.authority = ctx.accounts.authority.key();
    provider.last_location_id = 0;
    provider.location_count = 0;
    Ok(())
}
