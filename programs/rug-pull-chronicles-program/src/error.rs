use anchor_lang::prelude::*;

#[error_code]
pub enum RuggedError {
    #[msg("User wallet is not verified as rugged.")]
    RuggedUserNotVerified,
    #[msg("Destination wallet must not match the compromised address.")]
    InvalidDestination,
    #[msg("Trait selection invalid.")]
    InvalidTraits,
    #[msg("Unauthorized to perform this action.")]
    Unauthorized,
    // add more as needed...
}

#[error_code]
pub enum CustomError {
    #[msg("The provided fee distribution is invalid. Treasury and anti-scam fee percentages must sum to 100")]
    InvalidFeeDistribution,
}
