#![allow(unexpected_cfgs)]
use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use instructions::add_collection_plugin::*;
use instructions::create_collection::*;
use instructions::initialize::*;
use instructions::update_config::*;

declare_id!("6cfjRrqry3MFPH9L7r2A44iCnCuoin6dauAwv1xa1Sc9");

#[program]
pub mod rug_pull_chronicles_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, seed: u64, bumps: BumpSeeds) -> Result<()> {
        msg!(
            "Initializing Rug Pull Chronicles Program: {:?}",
            ctx.program_id
        );
        ctx.accounts.initialize(seed, &bumps)
    }

    pub fn create_collection(
        ctx: Context<CreateCollection>,
        name: String,
        uri: String,
    ) -> Result<()> {
        let args = CreateCollectionArgs { name, uri };
        ctx.accounts.create_core_collection(args)
    }

    pub fn update_config_collection(
        ctx: Context<UpdateConfig>,
        collection_address: Pubkey,
    ) -> Result<()> {
        ctx.accounts.update_collection(collection_address)
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

    // pub fn mint_standard_nft(ctx: Context<MintStandardNft>) -> Result<()> {
    //     ctx.accounts.mint_core_asset()
    // }
}
