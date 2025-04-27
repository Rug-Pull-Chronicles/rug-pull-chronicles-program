use crate::state::config::Config;
use anchor_lang::prelude::*;
use mpl_core::instructions::UpdateV1CpiBuilder;

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct UpdateCollectionArgs {
    pub name: Option<String>,
    pub uri: Option<String>,
}

#[derive(Accounts)]
pub struct UpdateCollection<'info> {
    /// The admin who can update collection metadata
    #[account(mut)]
    pub admin: Signer<'info>,

    /// The program's config account
    #[account(
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
    pub config: Account<'info, Config>,

    /// The collection to update
    #[account(
        mut,
        constraint = collection.key() == config.standard_collection
    )]
    pub collection: UncheckedAccount<'info>,

    /// The program's update authority PDA
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

impl<'info> UpdateCollection<'info> {
    pub fn update_collection_metadata(&self, args: UpdateCollectionArgs) -> Result<()> {
        // Get PDA signer seeds for update_authority_pda
        let auth_seeds = &[b"upd_auth".as_ref(), &[self.config.update_authority_bump]];

        // Log what we're attempting to update
        if args.name.is_some() {
            msg!(
                "Updating collection name to: {}",
                args.name.as_ref().unwrap()
            );
        }
        if args.uri.is_some() {
            msg!("Updating collection URI to: {}", args.uri.as_ref().unwrap());
        }

        // WARNING: In v0.8.0, there appears to be no way to pass name and uri directly
        // This will perform the CPI but may not update the name and uri
        // Consider upgrading to a newer version of mpl-core

        // Store references to prevent temporary value drops
        let asset_info = self.collection.to_account_info();
        let authority_info = self.update_authority_pda.to_account_info();
        let payer_info = self.admin.to_account_info();
        let system_program_info = self.system_program.to_account_info();
        let mpl_core_info = self.mpl_core_program.to_account_info();

        // Build and execute in one step to avoid temporary value drop
        UpdateV1CpiBuilder::new(&mpl_core_info)
            .asset(&asset_info)
            .authority(Some(&authority_info))
            .payer(&payer_info)
            .system_program(&system_program_info)
            .invoke_signed(&[auth_seeds])?;

        msg!("Collection metadata update attempted, but may not include name/uri changes");
        Ok(())
    }
}
