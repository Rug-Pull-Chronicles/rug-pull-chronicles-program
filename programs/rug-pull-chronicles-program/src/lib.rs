#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::add_collection_plugin::*;
use instructions::add_freeze_delegate::*;
use instructions::create_collection::*;
use instructions::freeze_asset::*;
use instructions::initialize::*;
use instructions::mint_scammed_nft::*;
use instructions::mint_standard_nft::*;
use instructions::thaw_asset::*;
use instructions::update_config::*;

declare_id!("Fhpi7Xfc6eYZxy5ENLeW4vmRbkWfNZpeFC4Btiqf7sR8");

#[program]
pub mod rug_pull_chronicles_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64, bumps: BumpSeeds) -> Result<()> {
        ctx.accounts.initialize(seed, &bumps)
    }

    pub fn create_collection(
        ctx: Context<CreateCollection>,
        name: String,
        uri: String,
        max_supply: Option<u32>,
        edition_name: Option<String>,
        edition_uri: Option<String>,
    ) -> Result<()> {
        let args = CreateCollectionArgs {
            name,
            uri,
            max_supply,
            edition_name,
            edition_uri,
        };
        ctx.accounts.create_core_collection(args)
    }

    pub fn update_config_collection(
        ctx: Context<UpdateConfig>,
        collection_address: Pubkey,
    ) -> Result<()> {
        ctx.accounts.update_collection(collection_address)
    }

    pub fn update_config_rugged_collection(
        ctx: Context<UpdateConfig>,
        collection_address: Pubkey,
    ) -> Result<()> {
        ctx.accounts.update_scammed_collection(collection_address)
    }

    pub fn update_fee_settings(
        ctx: Context<UpdateConfig>,
        mint_fee_basis_points: u16,
        treasury_fee_percent: u8,
        antiscam_fee_percent: u8,
    ) -> Result<()> {
        ctx.accounts.update_fee_settings(
            mint_fee_basis_points,
            treasury_fee_percent,
            antiscam_fee_percent,
        )
    }

    pub fn update_minimum_payment(ctx: Context<UpdateConfig>, minimum_payment: u64) -> Result<()> {
        ctx.accounts.update_minimum_payment(minimum_payment)
    }

    pub fn toggle_paused(ctx: Context<UpdateConfig>) -> Result<()> {
        ctx.accounts.toggle_paused()
    }

    pub fn add_collection_royalties(
        ctx: Context<AddCollectionPlugin>,
        basis_points: u16,
        creators: Vec<CreatorInput>,
    ) -> Result<()> {
        let args = AddCollectionPluginArgs {
            basis_points,
            creators,
        };
        ctx.accounts.add_collection_royalties(args)
    }

    pub fn add_freeze_delegate(
        ctx: Context<AddFreezePlugin>,
        frozen: bool,
        delegate: Option<Pubkey>,
    ) -> Result<()> {
        let args = AddFreezePluginArgs { frozen, delegate };
        ctx.accounts.add_freeze_delegate(args)
    }

    pub fn freeze_asset(ctx: Context<FreezeAsset>) -> Result<()> {
        ctx.accounts.freeze_asset()
    }

    pub fn thaw_asset(ctx: Context<ThawAsset>) -> Result<()> {
        ctx.accounts.thaw_asset()
    }

    pub fn mint_standard_nft(
        ctx: Context<MintStandardNft>,
        name: String,
        uri: String,
        scam_year: String,
        usd_amount_stolen: String,
        platform_category: String,
        type_of_attack: String,
    ) -> Result<()> {
        ctx.accounts.mint_core_asset(
            name,
            uri,
            scam_year,
            usd_amount_stolen,
            platform_category,
            type_of_attack,
        )
    }

    pub fn mint_scammed_nft(
        ctx: Context<MintScammedNft>,
        name: String,
        uri: String,
        scam_details: String,
    ) -> Result<()> {
        ctx.accounts.mint_core_asset(name, uri, scam_details)
    }
}
