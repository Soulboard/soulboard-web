use anchor_lang::prelude::*;
pub mod constant;
pub mod context;
pub mod states;
pub mod errors;

use context::*;
use states::TimeSlot;
use constant::CAMPAIGN_KEY;
use errors::SoulboardError;
declare_id!("61yLHnb8vjRGzkKUPGjN4zviBfsy7wHmwwnZpNP8SfcQ");

#[program]
pub mod soulboard {
    //TODO : add payment logic 
    //TODO : code refactoring 
    //TODO : add device logic 

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

        advertiser.last_campaign_id = advertiser.last_campaign_id.checked_add(1).unwrap();

        advertiser.campaign_count = advertiser.campaign_count.checked_add(1).unwrap();
        campaign.booked_locations = vec![];

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

        if amount > campaign_info.lamports() {
            return Err(SoulboardError::InsufficientBudget.into());
        }
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

    pub fn book_location(ctx: Context<BookLocation>, campaign_idx: u8,  location_idx: u8, slot_id: u64) -> Result<()> {
        let location = &mut ctx.accounts.location;
        let campaign = &mut ctx.accounts.campaign;
        let location_info = location.to_account_info();
        let campaign_info = campaign.to_account_info();

        // Store location key before mutable borrow
        let location_key = location.key();
        
        // Use iter_mut() to get mutable references to elements
        for slot in location.slots.iter_mut() {
            if slot.slot_id == slot_id {
                if slot.status == SlotStatus::Available {

                    //move lamports from campaign PDA to loaction PDA
                    **location_info.try_borrow_mut_lamports()? = location_info.lamports()
                    .checked_add(slot.price)
                    .ok_or(ProgramError::ArithmeticOverflow)?;
                
                **campaign_info.try_borrow_mut_lamports()? = campaign_info.lamports()
                    .checked_sub(slot.price)
                    .ok_or(ProgramError::InsufficientFunds)?;

                    slot.status = SlotStatus::Booked { 
                        campaign_id : campaign.key(),
                    };
                    campaign.booked_locations.push(LocationBooking {
                        location: location_key,
                        slot_id: slot_id,
                    });
                }
                else {
                    return Err(SoulboardError::SlotAlreadyBooked.into());
                }
            }
            else {
                return Err(SoulboardError::SlotNotFound.into());
            }
        }

        Ok(())
    }


    //TODO : add payment logic 
    //TODO : add checking if the slot is actually booked 
    pub fn cancel_booking(ctx: Context<CancelBooking>, campaign_idx: u8, location_idx: u8, slot_id: u64) -> Result<()> {
        let location = &mut ctx.accounts.location;
        let campaign = &mut ctx.accounts.campaign;
        // let location_info = location.to_account_info();
        // let campaign_info = campaign.to_account_info();
        
        for slot in location.slots.iter_mut() {
            if slot.slot_id == slot_id {
                // Check if the slot is booked BY THIS campaign
                if let SlotStatus::Booked { campaign_id } = slot.status {
                    if campaign_id == campaign.key() {
                         slot.status = SlotStatus::Available;
                        
                    } else {
                        return Err(SoulboardError::Unauthorized.into());
                    }

                } else {
                    // Slot wasn't booked in the first place
                    return Err(SoulboardError::SlotNotBooked.into());
                }
            }
            else {
                return Err(SoulboardError::SlotNotFound.into());
            }
        }

        Ok(())
    }

    pub fn add_time_slot(ctx: Context<AddTimeSlot>, location_idx: u8, slot: TimeSlot) -> Result<()> {
        let location = &mut ctx.accounts.location;
        location.slots.push(slot);
        Ok(())
    }
    
}
