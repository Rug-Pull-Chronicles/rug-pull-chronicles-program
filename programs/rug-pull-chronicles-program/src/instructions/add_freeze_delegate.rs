use crate::state::config::Config;
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::AddPluginV1CpiBuilder,
    types::{FreezeDelegate, Plugin, PluginAuthority},
};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AddFreezePluginArgs {
    pub frozen: bool,
    /// Optional delegate address - if not provided, the owner will be the authority
    pub delegate: Option<Pubkey>,
}

#[derive(Accounts)]
pub struct AddFreezePlugin<'info> {
    /// The user adding the freeze delegate plugin - must be the owner of the asset
    #[account(mut)]
    pub user: Signer<'info>,

    /// The program's config account
    #[account(
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
    pub config: Account<'info, Config>,

    /// The NFT to add the freeze delegate to
    /// CHECK: Will be validated by the MPL Core program
    #[account(mut)]
    pub asset: UncheckedAccount<'info>,

    /// The owner of the asset - must sign the transaction
    /// This is required for Owner Managed Plugins like Freeze Delegate
    #[account(mut)]
    pub owner: Signer<'info>,

    /// The collection the asset belongs to
    /// CHECK: Will be validated by the MPL Core program
    #[account(mut)]
    pub collection: UncheckedAccount<'info>,

    /// The program's update authority PDA
    /// CHECK: This is a PDA that only this program can sign for
    #[account(
        seeds = [b"upd_auth"],
        bump = config.update_authority_bump,
    )]
    pub update_authority_pda: UncheckedAccount<'info>,

    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> AddFreezePlugin<'info> {
    pub fn add_freeze_delegate(&self, args: AddFreezePluginArgs) -> Result<()> {
        // Determine the authority type
        let authority = if let Some(delegate) = args.delegate {
            msg!("Adding Freeze Delegate plugin with authority: {}", delegate);
            PluginAuthority::Address { address: delegate }
        } else {
            msg!("Adding Freeze Delegate plugin with Owner authority");
            PluginAuthority::Owner
        };

        // Log current state
        msg!(
            "Adding Freeze Delegate plugin. Initial frozen state: {}",
            args.frozen
        );

        // Create the plugin add CPI
        // For Owner Managed Plugins, we must use the owner as the authority, not the update_authority
        AddPluginV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
            .asset(&self.asset.to_account_info())
            .authority(Some(&self.owner.to_account_info())) // Owner signs, not update_authority
            .collection(Some(&self.collection.to_account_info()))
            .payer(&self.user.to_account_info())
            .system_program(&self.system_program.to_account_info())
            .plugin(Plugin::FreezeDelegate(FreezeDelegate {
                frozen: args.frozen,
            }))
            .init_authority(authority)
            .invoke()?; // No need for signed, owner is already a signer

        msg!("Freeze Delegate plugin added successfully");
        Ok(())
    }
}
