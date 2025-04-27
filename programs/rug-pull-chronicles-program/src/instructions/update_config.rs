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

    pub fn update_rugged_collection(&mut self, collection_address: Pubkey) -> Result<()> {
        // Update the config with the rugged collection address
        self.config.rugged_collection = collection_address;

        msg!(
            "Updated config with rugged collection: {}",
            collection_address
        );
        Ok(())
    }
}
