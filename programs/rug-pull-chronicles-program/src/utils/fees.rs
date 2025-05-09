use crate::state::config::Config;
use anchor_lang::prelude::*;

/// Calculates mint fees based on the config settings
pub fn calculate_mint_fees(config: &Account<Config>) -> Result<(u64, u64)> {
    // Calculate total fee amount based on basis points (use config minimum payment)
    let minimum_payment = config.minimum_payment;
    let fee_rate = config.mint_fee_basis_points as u64;
    let fee_amount = minimum_payment
        .checked_mul(fee_rate)
        .ok_or(ProgramError::ArithmeticOverflow)?
        .checked_div(10_000)
        .ok_or(ProgramError::ArithmeticOverflow)?;

    // Calculate split based on percentages
    let treasury_amount = fee_amount
        .checked_mul(config.treasury_fee_percent as u64)
        .ok_or(ProgramError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(ProgramError::ArithmeticOverflow)?;

    let antiscam_amount = fee_amount
        .checked_mul(config.antiscam_fee_percent as u64)
        .ok_or(ProgramError::ArithmeticOverflow)?
        .checked_div(100)
        .ok_or(ProgramError::ArithmeticOverflow)?;

    // Log the fee breakdown
    msg!("Minting fee: {} lamports", fee_amount);
    msg!("Treasury fee: {} lamports", treasury_amount);
    msg!("Anti-scam fee: {} lamports", antiscam_amount);

    Ok((treasury_amount, antiscam_amount))
}
