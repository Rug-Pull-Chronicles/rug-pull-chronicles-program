use crate::error::CustomError;
use crate::state::config::Config;
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    /// The admin that can update the config
    pub admin: Signer<'info>,

    /// The config account to update
    #[account(mut)]
    pub config: Account<'info, Config>,
}

impl<'info> UpdateConfig<'info> {
    pub fn update_collection(&mut self, collection_address: Pubkey) -> Result<()> {
        // Update the config with the collection address
        self.config.standard_collection = collection_address;

        msg!(
            "Updated config with standard collection: {}",
            collection_address
        );
        Ok(())
    }

    pub fn update_scammed_collection(&mut self, collection_address: Pubkey) -> Result<()> {
        // Update the config with the rugged collection address
        self.config.scammed_collection = collection_address;

        msg!(
            "Updated config with scammed collection: {}",
            collection_address
        );
        Ok(())
    }

    pub fn update_fee_settings(
        &mut self,
        mint_fee_basis_points: u16,
        treasury_fee_percent: u8,
        antiscam_fee_percent: u8,
    ) -> Result<()> {
        // Validate the fee percentages add up to 100
        require!(
            treasury_fee_percent + antiscam_fee_percent == 100,
            CustomError::InvalidFeeDistribution
        );

        // Update the fee settings
        self.config.mint_fee_basis_points = mint_fee_basis_points;
        self.config.treasury_fee_percent = treasury_fee_percent;
        self.config.antiscam_fee_percent = antiscam_fee_percent;

        msg!("Updated fee settings:");
        msg!("Mint fee: {} basis points", mint_fee_basis_points);
        msg!("Treasury fee: {}%", treasury_fee_percent);
        msg!("Anti-scam treasury fee: {}%", antiscam_fee_percent);

        Ok(())
    }
}
