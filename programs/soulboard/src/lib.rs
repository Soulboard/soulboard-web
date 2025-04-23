use anchor_lang::prelude::*;
pub mod constant;
pub mod context;
pub mod states;

use context::*;
use constant::CAMPAIGN_KEY;
declare_id!("61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQ");

#[program]
pub mod soulboard {

    use anchor_lang::solana_program::{program::{invoke, invoke_signed}, system_instruction::transfer, program_error::ProgramError};

    use super::*;

    pub fn create_advertiser(ctx: Context<CreateAdvertiser>) -> Result<()> {
        let advertiser = &mut ctx.accounts.advertiser;
        advertiser.authority = ctx.accounts.authority.key();
        advertiser.last_campaign_id = 0;
        advertiser.campaign_count = 0;
        Ok(())
    }

    pub fn create_campaign(
        ctx: Context<CreateCampaign>,
        campaign_name: String,
        campaign_description: String,
        campaign_image_url: String,
        budget: u64,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let advertiser = &mut ctx.accounts.advertiser;

        campaign.authority = ctx.accounts.authority.key();
        campaign.campaign_name = campaign_name;
        campaign.campaign_idx = advertiser.last_campaign_id;
        campaign.campaign_description = campaign_description;
        campaign.campaign_image_url = campaign_image_url;

        advertiser.last_campaign_id = advertiser.last_campaign_id.checked_add(1).unwrap();

        advertiser.campaign_count = advertiser.campaign_count.checked_add(1).unwrap();

        if budget > 0 {
           let ix = transfer(&ctx.accounts.authority.key(), &ctx.accounts.campaign.key(), budget);

           invoke(&ix, &[ctx.accounts.authority.to_account_info(), ctx.accounts.campaign.to_account_info(), ctx.accounts.system_program.to_account_info()])?;
        }

        Ok(())
    }

    pub fn add_budget(ctx: Context<AddBudget>, budget: u64, campaign_idx: u8) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        let advertiser = &mut ctx.accounts.advertiser;

        if budget > 0 {
            let ix = transfer(&ctx.accounts.authority.key(), &ctx.accounts.campaign.key(), budget);

            invoke(&ix, &[ctx.accounts.authority.to_account_info(), ctx.accounts.campaign.to_account_info(), ctx.accounts.system_program.to_account_info()])?;
        }

        Ok(())
    }

    pub fn withdraw_amount(ctx: Context<WithdrawBudget>, campaign_idx: u8 , amount: u64) -> Result<()> {
        let campaign_info = ctx.accounts.campaign.to_account_info();
        let authority_info = ctx.accounts.authority.to_account_info();

        // Transfer lamports directly from campaign to authority
        **authority_info.try_borrow_mut_lamports()? = authority_info.lamports()
            .checked_add(amount)
            .ok_or(ProgramError::ArithmeticOverflow)?;
        
        **campaign_info.try_borrow_mut_lamports()? = campaign_info.lamports()
            .checked_sub(amount)
            .ok_or(ProgramError::InsufficientFunds)?;

        Ok(())
    }

    pub fn close_campaign(ctx: Context<CloseCampaign>, campaign_idx: u8) -> Result<()> {
        let advertiser = &mut ctx.accounts.advertiser;

        advertiser.campaign_count = advertiser.campaign_count.checked_sub(1).unwrap();
        Ok(())
    }
}
