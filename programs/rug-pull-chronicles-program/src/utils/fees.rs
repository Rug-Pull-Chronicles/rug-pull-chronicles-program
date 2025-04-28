use crate::state::config::Config;
use anchor_lang::prelude::*;

/// Calculates and transfers mint fees to the treasury accounts
pub fn transfer_mint_fees(
    config: &Account<Config>,
    payer: &AccountInfo,
    treasury: &AccountInfo,
    antiscam_treasury: &AccountInfo,
    system_program: &AccountInfo,
) -> Result<()> {
    // Calculate total fee amount based on basis points (1 SOL minimum payment)
    let minimum_payment = 1_000_000_000; // 1 SOL in lamports
    let fee_rate = config.mint_fee_basis_points as u64;
    let fee_amount = minimum_payment.saturating_mul(fee_rate) / 10_000;

    // Calculate split based on percentages
    let treasury_amount = fee_amount.saturating_mul(config.treasury_fee_percent as u64) / 100;
    let antiscam_amount = fee_amount.saturating_mul(config.antiscam_fee_percent as u64) / 100;

    // Log the fee breakdown
    msg!("Minting fee: {} lamports", fee_amount);
    msg!("Treasury fee: {} lamports", treasury_amount);
    msg!("Anti-scam fee: {} lamports", antiscam_amount);

    // Transfer to main treasury
    anchor_lang::system_program::transfer(
        CpiContext::new(
            system_program.clone(),
            anchor_lang::system_program::Transfer {
                from: payer.clone(),
                to: treasury.clone(),
            },
        ),
        treasury_amount,
    )?;

    // Transfer to anti-scam treasury
    anchor_lang::system_program::transfer(
        CpiContext::new(
            system_program.clone(),
            anchor_lang::system_program::Transfer {
                from: payer.clone(),
                to: antiscam_treasury.clone(),
            },
        ),
        antiscam_amount,
    )?;

    msg!("Fees paid successfully");
    Ok(())
}
