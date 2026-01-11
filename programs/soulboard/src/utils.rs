use anchor_lang::prelude::*;
use anchor_lang::solana_program::{program::invoke, system_instruction::transfer};

use crate::errors::SoulboardError;
use crate::states::{Campaign, CampaignStatus};

pub fn ensure_string_len(value: &str, max_len: usize) -> Result<()> {
    require!(value.len() <= max_len, SoulboardError::InvalidStringLength);
    Ok(())
}

pub fn set_optional_string(
    target: &mut String,
    value: Option<String>,
    max_len: usize,
) -> Result<()> {
    if let Some(value) = value {
        ensure_string_len(&value, max_len)?;
        *target = value;
    }
    Ok(())
}

pub fn require_campaign_active(campaign: &Campaign) -> Result<()> {
    require!(
        campaign.status == CampaignStatus::Active,
        SoulboardError::CampaignNotActive
    );
    Ok(())
}

pub fn ensure_rent_exempt_after_withdraw(account_info: &AccountInfo, amount: u64) -> Result<()> {
    let rent = Rent::get()?;
    let min_balance = rent.minimum_balance(account_info.data_len());
    let remaining = account_info
        .lamports()
        .checked_sub(amount)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    require!(remaining >= min_balance, SoulboardError::InsufficientRent);
    Ok(())
}

pub fn move_lamports(from: &AccountInfo, to: &AccountInfo, amount: u64) -> Result<()> {
    **from.try_borrow_mut_lamports()? = from
        .lamports()
        .checked_sub(amount)
        .ok_or(SoulboardError::ArithmeticUnderflow)?;
    **to.try_borrow_mut_lamports()? = to
        .lamports()
        .checked_add(amount)
        .ok_or(SoulboardError::ArithmeticOverflow)?;
    Ok(())
}

pub fn transfer_from_signer<'a>(
    from: &AccountInfo<'a>,
    to: &AccountInfo<'a>,
    system_program: &AccountInfo<'a>,
    amount: u64,
) -> Result<()> {
    let ix = transfer(from.key, to.key, amount);
    invoke(&ix, &[from.clone(), to.clone(), system_program.clone()])?;
    Ok(())
}
