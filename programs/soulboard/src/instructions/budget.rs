use anchor_lang::prelude::*;

use crate::context::{AddBudget, WithdrawBudget};
use crate::errors::SoulboardError;
use crate::states::{BudgetAdded, BudgetWithdrawn};
use crate::utils::{
    ensure_rent_exempt_after_withdraw, move_lamports, require_campaign_active, transfer_from_signer,
};

pub fn add_budget(ctx: Context<AddBudget>, _campaign_idx: u64, amount: u64) -> Result<()> {
    require!(amount > 0, SoulboardError::InvalidParameters);
    require_campaign_active(&ctx.accounts.campaign)?;

    transfer_from_signer(
        &ctx.accounts.authority.to_account_info(),
        &ctx.accounts.campaign.to_account_info(),
        &ctx.accounts.system_program.to_account_info(),
        amount,
    )?;

    let campaign = &mut ctx.accounts.campaign;
    campaign.available_budget = campaign
        .available_budget
        .checked_add(amount)
        .ok_or(SoulboardError::ArithmeticOverflow)?;

    emit!(BudgetAdded {
        campaign: campaign.key(),
        amount,
        available_budget: campaign.available_budget,
    });

    Ok(())
}

pub fn withdraw_budget(ctx: Context<WithdrawBudget>, _campaign_idx: u64, amount: u64) -> Result<()> {
    require!(amount > 0, SoulboardError::InvalidParameters);
    require_campaign_active(&ctx.accounts.campaign)?;
    require!(
        ctx.accounts.campaign.available_budget >= amount,
        SoulboardError::InsufficientBudget
    );
    ensure_rent_exempt_after_withdraw(&ctx.accounts.campaign.to_account_info(), amount)?;

    let new_available = ctx
        .accounts
        .campaign
        .available_budget
        .checked_sub(amount)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;

    {
        let campaign = &mut ctx.accounts.campaign;
        campaign.available_budget = new_available;
    }

    move_lamports(
        &ctx.accounts.campaign.to_account_info(),
        &ctx.accounts.authority.to_account_info(),
        amount,
    )?;

    emit!(BudgetWithdrawn {
        campaign: ctx.accounts.campaign.key(),
        amount,
        available_budget: new_available,
    });

    Ok(())
}
