#![allow(unexpected_cfgs)]
use crate::state::*;
use crate::utils::fees::calculate_mint_fees;
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::{AddPluginV1CpiBuilder, CreateV2CpiBuilder},
    types::{Attribute, Attributes, Plugin},
};

#[derive(Accounts)]
#[instruction(name: String, uri: String, scam_details: String)]
pub struct MintScammedNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: MPL Core will initialize this account as an asset
    #[account(mut)]
    pub rugged_nft_mint: Signer<'info>,

    /// CHECK: This is the update authority PDA for the collection
    /// Required to sign when adding an asset to a collection
    #[account(seeds = [b"upd_auth"], bump)]
    pub update_authority_pda: UncheckedAccount<'info>,

    /// The scammed collection account
    /// When adding an asset to a collection, the collection becomes the asset's update authority
    /// CHECK: This is verified against the config account
    #[account(
      mut,
      constraint = scammed_collection.key() == config.scammed_collection
    )]
    pub scammed_collection: AccountInfo<'info>,

    /// Treasury account for collecting platform fees
    /// CHECK: This is verified against the config account
    #[account(
        mut,
        constraint = treasury.key() == config.treasury
    )]
    pub treasury: UncheckedAccount<'info>,

    /// Anti-scam treasury for collecting donation fees
    /// CHECK: This is verified against the config account
    #[account(
        mut,
        constraint = antiscam_treasury.key() == config.antiscam_treasury
    )]
    pub antiscam_treasury: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    /// Config account to store the collection address
    #[account(mut)]
    pub config: Account<'info, Config>,
}

impl<'info> MintScammedNft<'info> {
    pub fn mint_core_asset(
        &mut self,
        name: String,
        uri: String,
        scam_details: String,
    ) -> Result<()> {
        // Calculate the fees first
        let (treasury_amount, antiscam_amount) = calculate_mint_fees(&self.config)?;

        // Transfer to main treasury
        anchor_lang::system_program::transfer(
            CpiContext::new(
                self.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: self.user.to_account_info(),
                    to: self.treasury.to_account_info(),
                },
            ),
            treasury_amount,
        )?;

        // Transfer to anti-scam treasury
        anchor_lang::system_program::transfer(
            CpiContext::new(
                self.system_program.to_account_info(),
                anchor_lang::system_program::Transfer {
                    from: self.user.to_account_info(),
                    to: self.antiscam_treasury.to_account_info(),
                },
            ),
            antiscam_amount,
        )?;

        msg!("Fees paid successfully");

        // Get the account infos first
        let collection_account = &self.scammed_collection;
        let payer_account = &self.user.to_account_info();
        let owner_account = &self.user.to_account_info();
        let system_program_account = &self.system_program.to_account_info();
        let asset_account = &self.rugged_nft_mint.to_account_info();
        let mpl_program_account = &self.mpl_core_program.to_account_info();
        let update_authority_account = &self.update_authority_pda.to_account_info();

        // Find the PDA bump for the collection's update authority
        let (_, bump) = Pubkey::find_program_address(&[b"upd_auth"], &crate::ID);

        // Create the asset using V2 builder with collection's update authority signing
        // When we specify a collection, the collection becomes the update authority
        // and we need the collection's update authority to approve this operation
        CreateV2CpiBuilder::new(mpl_program_account)
            .asset(asset_account)
            .collection(Some(collection_account))
            .authority(Some(update_authority_account))
            .payer(payer_account)
            .owner(Some(owner_account))
            .system_program(system_program_account)
            .name(name)
            .uri(uri)
            .invoke_signed(&[&[b"upd_auth", &[bump]]])?;

        // Add the scam attributes plugin
        self.add_attributes_plugin(scam_details, bump)?;

        Ok(())
    }

    pub fn add_attributes_plugin(&self, scam_details: String, bump: u8) -> Result<()> {
        // Create attributes list with the scam details
        let attributes = Attributes {
            attribute_list: vec![Attribute {
                key: "scam_details".to_string(),
                value: scam_details,
            }],
        };

        // Add the plugin using CPI
        // For plugins, we need to pass the collection information
        // and the update authority needs to sign
        AddPluginV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
            .asset(&self.rugged_nft_mint.to_account_info())
            .authority(Some(&self.update_authority_pda.to_account_info()))
            .collection(Some(&self.scammed_collection))
            .payer(&self.user.to_account_info())
            .system_program(&self.system_program.to_account_info())
            .plugin(Plugin::Attributes(attributes))
            .invoke_signed(&[&[b"upd_auth", &[bump]]])?;

        msg!(
            "Added attributes plugin to asset {}",
            self.rugged_nft_mint.key()
        );

        Ok(())
    }
}
