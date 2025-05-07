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
    #[msg("Program is currently paused for maintenance or security reasons.")]
    ProgramPaused,
    #[msg("Operation failed due to a duplicate NFT mint attempt.")]
    DuplicateNFTMint,
    // add more as needed...
}

#[error_code]
pub enum CustomError {
    #[msg("The provided fee distribution is invalid. Treasury and anti-scam fee percentages must sum to 100")]
    InvalidFeeDistribution,

    #[msg("The provided fee amount is too high. Maximum allowed is 50%")]
    InvalidFeeAmount,

    #[msg("The provided minimum payment is too low. Minimum allowed is 0.01 SOL")]
    InvalidMinimumPayment,

    #[msg("Arithmetic operation resulted in overflow")]
    ArithmeticOverflow,

    #[msg("The requested operation cannot be performed when the program is paused")]
    OperationNotAllowedWhenPaused,
}
