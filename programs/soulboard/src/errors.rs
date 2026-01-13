use anchor_lang::prelude::*;

#[error_code]
pub enum SoulboardError {
    #[msg("Invalid authority")]
    InvalidAuthority,

    #[msg("Oracle authority not configured")]
    OracleNotConfigured,

    #[msg("Invalid oracle authority")]
    InvalidOracleAuthority,

    #[msg("Unauthorized operation")]
    Unauthorized,

    #[msg("Campaign is not active")]
    CampaignNotActive,

    #[msg("Campaign has active bookings")]
    CampaignHasActiveBookings,

    #[msg("Insufficient campaign budget")]
    InsufficientBudget,

    #[msg("Location is unavailable")]
    LocationUnavailable,

    #[msg("Location is inactive")]
    LocationInactive,

    #[msg("Location already booked")]
    LocationAlreadyBooked,

    #[msg("Invalid time range")]
    InvalidTimeRange,

    #[msg("Slot overlaps with existing slot")]
    SlotOverlap,

    #[msg("Slot is unavailable")]
    SlotUnavailable,

    #[msg("No slots found in range")]
    SlotNotFound,

    #[msg("Slot time is in the past")]
    SlotInPast,

    #[msg("Schedule has reached maximum slots")]
    ScheduleFull,

    #[msg("Invalid oracle device")]
    InvalidOracleDevice,

    #[msg("Oracle device inactive")]
    OracleDeviceInactive,

    #[msg("Booking already exists")]
    BookingAlreadyExists,

    #[msg("Booking not active")]
    BookingNotActive,

    #[msg("Settlement amount exceeds escrow")]
    SettlementTooHigh,

    #[msg("Invalid parameters")]
    InvalidParameters,

    #[msg("Invalid string length")]
    InvalidStringLength,

    #[msg("Insufficient rent-exempt balance")]
    InsufficientRent,

    #[msg("Insufficient earnings")]
    InsufficientEarnings,

    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,

    #[msg("Arithmetic underflow")]
    ArithmeticUnderflow,
}
