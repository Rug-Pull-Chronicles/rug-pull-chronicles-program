use crate::state::config::Config;
use anchor_lang::prelude::*;
use mpl_core::instructions::CreateCollectionV2CpiBuilder;
use mpl_core::types::{MasterEdition, Plugin, PluginAuthorityPair};

#[derive(AnchorDeserialize, AnchorSerialize)]
pub struct CreateCollectionArgs {
    pub name: String,
    pub uri: String,
    // Add optional Master Edition parameters
    pub max_supply: Option<u32>,
    pub edition_name: Option<String>,
    pub edition_uri: Option<String>,
}

#[derive(Accounts)]
pub struct CreateCollection<'info> {
    #[account(mut)]
    pub collection: Signer<'info>,
    /// CHECK: this account will be checked by the mpl_core program
    pub update_authority: Option<UncheckedAccount<'info>>,
    #[account(mut, constraint = payer.key() == config.admin @ crate::error::RuggedError::Unauthorized)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    /// Config account to store the collection address
    #[account(mut)]
    pub config: Account<'info, Config>,
}

impl<'info> CreateCollection<'info> {
    pub fn create_core_collection(&mut self, args: CreateCollectionArgs) -> Result<()> {
        // Create the Master Edition plugin if max_supply is provided
        let plugins = if args.max_supply.is_some()
            || args.edition_name.is_some()
            || args.edition_uri.is_some()
        {
            // Create the Master Edition plugin
            let master_edition = MasterEdition {
                max_supply: args.max_supply,
                name: args.edition_name,
                uri: args.edition_uri,
            };

            // Create a vector with the Master Edition plugin using PluginAuthorityPair
            vec![PluginAuthorityPair {
                plugin: Plugin::MasterEdition(master_edition),
                authority: None, // Use default authority
            }]
        } else {
            // No plugins
            vec![]
        };

        let collection_info = self.collection.to_account_info();
        let payer_info = self.payer.to_account_info();
        let system_program_info = self.system_program.to_account_info();
        let core_program_info = self.mpl_core_program.to_account_info();

        // Get update authority if it exists
        let update_authority_info = self
            .update_authority
            .as_ref()
            .map(|auth| auth.to_account_info());

        // Build the instruction step by step
        let mut builder = CreateCollectionV2CpiBuilder::new(&core_program_info);
        let builder = builder.collection(&collection_info);
        let builder = builder.payer(&payer_info);
        let builder = builder.system_program(&system_program_info);
        let builder = builder.name(args.name);
        let mut builder = builder.uri(args.uri);

        // Add update_authority if it exists
        if let Some(auth_info) = update_authority_info.as_ref() {
            builder = builder.update_authority(Some(auth_info));
        }

        // Add plugins if any
        if !plugins.is_empty() {
            builder = builder.plugins(plugins);
        }

        // Invoke the instruction
        builder.invoke()?;

        // Update the config to track Master Edition status
        if args.max_supply.is_some() {
            if self.config.standard_collection == self.collection.key() {
                self.config.standard_collection_has_master_edition = true;
                self.config.standard_collection_max_supply = args.max_supply;
            } else if self.config.scammed_collection == self.collection.key() {
                self.config.scammed_collection_has_master_edition = true;
                self.config.scammed_collection_max_supply = args.max_supply;
            }
        }

        // Return success
        Ok(())
    }
}
