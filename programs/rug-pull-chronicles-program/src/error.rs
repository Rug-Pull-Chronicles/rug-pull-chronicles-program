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
