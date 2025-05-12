use crate::state::config::Config;
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::UpdatePluginV1CpiBuilder,
    types::{FreezeDelegate, Plugin},
};

#[derive(Accounts)]
pub struct ThawAsset<'info> {
    /// The authorized delegate who can thaw the asset
    #[account(mut)]
    pub delegate: Signer<'info>,

    /// The program's config account
    #[account(
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
    pub config: Account<'info, Config>,

    /// The NFT to thaw
    /// CHECK: Will be validated by the MPL Core program
    #[account(mut)]
    pub asset: UncheckedAccount<'info>,

    /// The collection the asset belongs to
    /// CHECK: Will be validated by the MPL Core program
    #[account(mut)]
    pub collection: UncheckedAccount<'info>,

    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> ThawAsset<'info> {
    pub fn thaw_asset(&self) -> Result<()> {
        // Create the thaw asset CPI - we update the FreezeDelegate plugin to set frozen = false
        UpdatePluginV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
            .asset(&self.asset.to_account_info())
            .authority(Some(&self.delegate.to_account_info()))
            .collection(Some(&self.collection.to_account_info()))
            .payer(&self.delegate.to_account_info())
            .system_program(&self.system_program.to_account_info())
            .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: false }))
            .invoke()?;

        Ok(())
    }
}
