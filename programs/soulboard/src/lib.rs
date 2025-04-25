use anchor_lang::prelude::*;
pub mod constant;
pub mod context;
pub mod states;
pub mod errors;

use context::*;
use states::{LocationBooking, SlotStatus, TimeSlot};
use constant::CAMPAIGN_KEY;
use errors::SoulboardError;
declare_id!("61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQ");

#[program]
pub mod soulboard {
    

    use anchor_lang::solana_program::{ program::invoke, program_error::ProgramError, system_instruction::transfer};

    use crate::states::TimeSlot;
    use crate::states::SlotStatus;
    use crate::states::LocationBooking;
    use super::*;

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
        campaign.booked_locations = vec![];

        advertiser.last_campaign_id = advertiser.last_campaign_id.checked_add(1)
            .ok_or(SoulboardError::ArithmeticOverflow)?;
        advertiser.campaign_count = advertiser.campaign_count.checked_add(1)
            .ok_or(SoulboardError::ArithmeticOverflow)?;

        if budget > 0 {
           let ix = transfer(&ctx.accounts.authority.key(), &campaign.key(), budget);

           invoke(&ix, &[ctx.accounts.authority.to_account_info(), ctx.accounts.campaign.to_account_info(), ctx.accounts.system_program.to_account_info()])?;
        }

        Ok(())
    }

    pub fn add_budget(ctx: Context<AddBudget>, _campaign_idx: u8, budget: u64) -> Result<()> {
        if budget > 0 {
            let ix = transfer(&ctx.accounts.authority.key(), &ctx.accounts.campaign.key(), budget);

            invoke(&ix, &[ctx.accounts.authority.to_account_info(), ctx.accounts.campaign.to_account_info(), ctx.accounts.system_program.to_account_info()])?;
        }

        Ok(())
    }

    pub fn withdraw_amount(ctx: Context<WithdrawBudget>, _campaign_idx: u8, amount: u64) -> Result<()> {
        let campaign_info = ctx.accounts.campaign.to_account_info();
        let authority_info = ctx.accounts.authority.to_account_info();

        require!(campaign_info.lamports() >= amount, SoulboardError::InsufficientBudget);
        
        **authority_info.try_borrow_mut_lamports()? = authority_info.lamports()
            .checked_add(amount)
            .ok_or(SoulboardError::ArithmeticOverflow)?;
        
        **campaign_info.try_borrow_mut_lamports()? = campaign_info.lamports()
            .checked_sub(amount)
            .ok_or(SoulboardError::ArithmeticUnderflow)?;

        Ok(())
    }


    pub fn close_campaign(ctx: Context<CloseCampaign>, _campaign_idx: u8) -> Result<()> {
        let advertiser = &mut ctx.accounts.advertiser;
        advertiser.campaign_count = advertiser.campaign_count.checked_sub(1)
            .ok_or(SoulboardError::ArithmeticUnderflow)?;
        Ok(())
    }

    //register a location by a provider
    pub fn register_location(ctx: Context<RegisterLocation> , location_name: String, location_description: String , slots :Vec<TimeSlot>) -> Result<()> {
        let provider = &mut ctx.accounts.provider;
        let location = &mut ctx.accounts.location;

        location.authority = provider.authority.key();
        location.location_name = location_name;
        location.location_description = location_description;
        location.slots = slots;
        location.location_idx = provider.last_location_id;
        provider.last_location_id = provider.last_location_id.checked_add(1).unwrap();
        provider.location_count = provider.location_count.checked_add(1).unwrap();

        if location.slots.len() > 10 {
            return Err(SoulboardError::MaxSlotsReached.into());
        }

        Ok(())
    }

    //TODO : add payment logic 

    pub fn book_location(ctx: Context<BookLocation>, _campaign_idx: u8,  location_idx: u8, slot_id: u64) -> Result<()> {
        let location = &mut ctx.accounts.location;
        let campaign = &mut ctx.accounts.campaign;
        let location_info = location.to_account_info();
        let campaign_info = campaign.to_account_info();

        let slot_index = location.slots.iter().position(|s| s.slot_id == slot_id)
            .ok_or(SoulboardError::SlotNotFound)?;

        let slot = &mut location.slots[slot_index];

        require!(slot.status == SlotStatus::Available, SoulboardError::SlotAlreadyBooked);

        let price = slot.price;
        require!(campaign_info.lamports() >= price, SoulboardError::InsufficientBudget);

        **campaign_info.try_borrow_mut_lamports()? = campaign_info.lamports()
            .checked_sub(price)
            .ok_or(SoulboardError::ArithmeticUnderflow)?;
        **location_info.try_borrow_mut_lamports()? = location_info.lamports()
            .checked_add(price)
            .ok_or(SoulboardError::ArithmeticOverflow)?;

        slot.status = SlotStatus::Booked { 
            campaign_id : campaign.key(),
        };
        campaign.booked_locations.push(LocationBooking {
            location: location.key(),
            slot_id: slot_id,
        });

        Ok(())
    }


  
    pub fn cancel_booking(ctx: Context<CancelBooking>, _campaign_idx: u8, location_idx: u8, slot_id: u64) -> Result<()> {
        let location = &mut ctx.accounts.location;
        let campaign = &mut ctx.accounts.campaign;
        
        let slot_index = location.slots.iter().position(|s| s.slot_id == slot_id)
            .ok_or(SoulboardError::SlotNotFound)?;

        let booked_campaign_id = match location.slots[slot_index].status {
            SlotStatus::Booked { campaign_id } => campaign_id,
            _ => return Err(SoulboardError::SlotNotBooked.into()),
        };
        require!(booked_campaign_id == campaign.key(), SoulboardError::Unauthorized);

        location.slots[slot_index].status = SlotStatus::Available;

        campaign.booked_locations.retain(|booking| 
            !(booking.location == location.key() && booking.slot_id == slot_id)
        );

        Ok(())
    }

    pub fn add_time_slot(ctx: Context<AddTimeSlot>, _location_idx: u8, slot: TimeSlot) -> Result<()> {
        let location = &mut ctx.accounts.location;

        require!(
            location.slots.iter().all(|s| s.slot_id != slot.slot_id),
            SoulboardError::SlotAlreadyExists
        );

        location.slots.push(slot);
        Ok(())
    }

    pub fn withdraw_earnings(ctx: Context<WithdrawEarnings>, _location_idx: u8, amount: u64) -> Result<()> {
        let location = &mut ctx.accounts.location;
        let location_info = location.to_account_info();
        let authority_info = ctx.accounts.authority.to_account_info();

        require!(location_info.lamports() >= amount, SoulboardError::InsufficientEarnings); 

        **location_info.try_borrow_mut_lamports()? = location_info.lamports()
            .checked_sub(amount)
            .ok_or(SoulboardError::ArithmeticUnderflow)?;

        **authority_info.try_borrow_mut_lamports()? = authority_info.lamports()
            .checked_add(amount)
            .ok_or(SoulboardError::ArithmeticOverflow)?;

        Ok(())
    }

    
    
}
