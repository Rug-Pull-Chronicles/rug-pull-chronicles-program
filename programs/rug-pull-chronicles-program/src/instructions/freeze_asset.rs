use crate::state::config::Config;
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::UpdatePluginV1CpiBuilder,
    types::{FreezeDelegate, Plugin},
};

#[derive(Accounts)]
pub struct FreezeAsset<'info> {
    /// The authorized delegate who can freeze the asset
    #[account(mut)]
    pub delegate: Signer<'info>,

    /// The program's config account
    #[account(
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
    pub config: Account<'info, Config>,

    /// The NFT to freeze
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

impl<'info> FreezeAsset<'info> {
    pub fn freeze_asset(&self) -> Result<()> {
        // Get the accounts
        let freeze_delegate_program_account = &self.mpl_core_program.to_account_info();
        let asset_account = &self.asset.to_account_info();
        let delegate_account = &self.delegate.to_account_info();

        // Create and invoke the freeze instruction
        UpdatePluginV1CpiBuilder::new(freeze_delegate_program_account)
            .asset(asset_account)
            .authority(Some(delegate_account))
            .collection(Some(&self.collection.to_account_info()))
            .payer(delegate_account)
            .system_program(&self.system_program.to_account_info())
            .plugin(Plugin::FreezeDelegate(FreezeDelegate { frozen: true }))
            .invoke()?;

        Ok(())
    }
}
