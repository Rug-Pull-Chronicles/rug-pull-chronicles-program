#![allow(unexpected_cfgs)]
use crate::state::*;
use crate::utils::fees::calculate_mint_fees;
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::{AddPluginV1CpiBuilder, CreateV2CpiBuilder},
    types::{Attribute, Attributes, Plugin},
};

#[derive(Accounts)]
#[instruction(name: String, uri: String, scam_year: String, usd_amount_stolen: String, platform_category: String, type_of_attack: String)]
pub struct MintStandardNft<'info> {
    #[account(mut)]
    pub user: Signer<'info>,

    /// CHECK: MPL Core will initialize this account as an asset
    #[account(mut)]
    pub rugged_nft_mint: Signer<'info>,

    /// CHECK: This is the update authority PDA for the collection
    /// Required to sign when adding an asset to a collection
    #[account(seeds = [b"upd_auth"], bump)]
    pub update_authority_pda: UncheckedAccount<'info>,

    /// The standard collection account
    /// When adding an asset to a collection, the collection becomes the asset's update authority
    /// CHECK: This is verified against the config account
    #[account(
      mut,
      constraint = standard_collection.key() == config.standard_collection
    )]
    pub standard_collection: AccountInfo<'info>,

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

    /// Simple tracker to prevent duplicate mints - acts as a flag
    #[account(
        init,
        payer = user,
        space = MintTracker::INIT_SPACE,
        seeds = [b"mint_tracker", rugged_nft_mint.key().as_ref()],
        bump
    )]
    pub mint_tracker: Account<'info, MintTracker>,

    pub system_program: Program<'info, System>,
    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    /// Config account to store the collection address
    #[account(mut)]
    pub config: Account<'info, Config>,
}

impl<'info> MintStandardNft<'info> {
    pub fn mint_core_asset(
        &mut self,
        name: String,
        uri: String,
        scam_year: String,
        usd_amount_stolen: String,
        platform_category: String,
        type_of_attack: String,
    ) -> Result<()> {
        // Check if the program is paused
        require!(
            !self.config.paused,
            crate::error::RuggedError::ProgramPaused
        );

        // Check if we've reached the max supply limit for this collection
        if self.config.standard_collection_has_master_edition {
            if let Some(max_supply) = self.config.standard_collection_max_supply {
                require!(
                    self.config.total_minted_standard < max_supply as u64,
                    crate::error::RuggedError::MaxSupplyExceeded
                );

                // If we're close to hitting the max supply, log a warning
                let remaining = max_supply as u64 - self.config.total_minted_standard;
                if remaining <= 5 {
                    msg!(
                        "WARNING: Only {} editions remaining out of max supply {}",
                        remaining,
                        max_supply
                    );
                }
            }
        }

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

        // Get the account infos first
        let collection_account = &self.standard_collection;
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

        // Add the attributes plugin with scam details and minting metadata
        let timestamp = Clock::get()?.unix_timestamp;
        let attributes = Attributes {
            attribute_list: vec![
                // Scam details
                Attribute {
                    key: "id".to_string(),
                    value: (self.config.total_minted_standard + 1).to_string(),
                },
                Attribute {
                    key: "scam_year".to_string(),
                    value: scam_year,
                },
                Attribute {
                    key: "usd_amount_stolen".to_string(),
                    value: usd_amount_stolen,
                },
                Attribute {
                    key: "platform_category".to_string(),
                    value: platform_category,
                },
                Attribute {
                    key: "type_of_attack".to_string(),
                    value: type_of_attack,
                },
                Attribute {
                    key: "minted_by".to_string(),
                    value: self.user.key().to_string(),
                },
                Attribute {
                    key: "minted_at".to_string(),
                    value: timestamp.to_string(),
                },
            ],
        };

        // Add the plugin with all attributes
        AddPluginV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
            .asset(&self.rugged_nft_mint.to_account_info())
            .authority(Some(&self.update_authority_pda.to_account_info()))
            .collection(Some(&self.standard_collection))
            .payer(&self.user.to_account_info())
            .system_program(&self.system_program.to_account_info())
            .plugin(Plugin::Attributes(attributes))
            .invoke_signed(&[&[b"upd_auth", &[bump]]])?;

        // Set the mint tracker flag to true to prevent duplicate mints
        self.mint_tracker.is_minted = true;

        // Increment the total minted counter
        self.config.total_minted_standard = self
            .config
            .total_minted_standard
            .checked_add(1)
            .ok_or(ProgramError::ArithmeticOverflow)?;

        Ok(())
    }
}
