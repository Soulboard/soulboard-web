use anchor_lang::prelude::*;

#[error_code]
pub enum SoulboardError {
    #[msg("Invalid authority")]
    InvalidAuthority,
    
    #[msg("Unauthorized operation")]
    Unauthorized,
    
    #[msg("Campaign not found")]
    CampaignNotFound,
    
    #[msg("Campaign already exists")]
    CampaignAlreadyExists,
    
    #[msg("Insufficient campaign budget")]
    InsufficientBudget,
    
    #[msg("Location not found")]
    LocationNotFound,
    
    #[msg("Location already exists")]
    LocationAlreadyExists,
    
    #[msg("Slot not found")]
    SlotNotFound,
    
    #[msg("Slot already booked")]
    SlotAlreadyBooked,
    
    #[msg("Slot already exists")]
    SlotAlreadyExists,
    
    #[msg("Slot is unavailable")]
    SlotUnavailable,
    
    #[msg("Invalid slot status")]
    InvalidSlotStatus,
    
    #[msg("Maximum number of slots reached")]
    MaxSlotsReached,
    
    #[msg("Booking not found")]
    BookingNotFound,
    
    #[msg("Invalid booking")]
    InvalidBooking,
    
    #[msg("Transfer failed")]
    TransferFailed,
    
    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,
    
    #[msg("Arithmetic underflow")]
    ArithmeticUnderflow,
    
    #[msg("Invalid parameters")]
    InvalidParameters,

    #[msg("Slot not booked")]
    SlotNotBooked,
}
