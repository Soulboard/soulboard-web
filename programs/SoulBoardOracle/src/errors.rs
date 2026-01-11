use anchor_lang::prelude::*;

#[error_code]
pub enum OracleError {
    #[msg("Invalid authority")]
    InvalidAuthority,

    #[msg("Unauthorized operation")]
    Unauthorized,

    #[msg("Device is inactive")]
    DeviceInactive,

    #[msg("Invalid parameters")]
    InvalidParameters,

    #[msg("Invalid oracle authority")]
    InvalidOracleAuthority,

    #[msg("Arithmetic overflow")]
    ArithmeticOverflow,

    #[msg("Arithmetic underflow")]
    ArithmeticUnderflow,
}
