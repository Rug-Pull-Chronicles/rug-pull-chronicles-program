use crate::state::config::Config;
use anchor_lang::prelude::*;

/// Calculates mint fees based on the config settings
pub fn calculate_mint_fees(config: &Account<Config>) -> (u64, u64) {
    // Calculate total fee amount based on basis points (1 SOL minimum payment)
    let minimum_payment: u64 = 1_000_000_000; // 1 SOL in lamports
    let fee_rate = config.mint_fee_basis_points as u64;
    let fee_amount = minimum_payment.checked_mul(fee_rate).unwrap_or(u64::MAX) / 10_000;

    // Calculate split based on percentages
    let treasury_amount = fee_amount
        .checked_mul(config.treasury_fee_percent as u64)
        .unwrap_or(u64::MAX)
        / 100;
    let antiscam_amount = fee_amount
        .checked_mul(config.antiscam_fee_percent as u64)
        .unwrap_or(u64::MAX)
        / 100;

    // Log the fee breakdown
    msg!("Minting fee: {} lamports", fee_amount);
    msg!("Treasury fee: {} lamports", treasury_amount);
    msg!("Anti-scam fee: {} lamports", antiscam_amount);

    (treasury_amount, antiscam_amount)
}
