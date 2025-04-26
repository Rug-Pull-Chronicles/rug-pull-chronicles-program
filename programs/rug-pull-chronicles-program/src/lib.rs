use anchor_lang::prelude::*;
pub mod constants;
pub mod cpi;
pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;
use instructions::*;

declare_id!("AisPtd8Pkci6V6x38MeZHBd5i7riJU8jCuHKtLLThCNM");

#[program]
pub mod rugged_nft {
    use super::*;

    pub fn mint_rugged_nft(
        ctx: Context<MintRuggedNft>,
        traits: Vec<u8>,
        dest_wallet: Pubkey,
    ) -> Result<()> {
        instructions::mint_rugged_nft::handler(ctx, traits, dest_wallet)
    }

    pub fn mint_standard_nft(ctx: Context<MintStandardNft>, traits: Vec<u8>) -> Result<()> {
        instructions::mint_standard_nft::handler(ctx, traits)
    }

    pub fn update_traits(ctx: Context<UpdateTraits>, new_traits: Vec<u8>) -> Result<()> {
        instructions::update_traits::handler(ctx, new_traits)
    }

    pub fn verify_rugged_user(ctx: Context<VerifyRuggedUser>) -> Result<()> {
        instructions::verify_rugged_user::handler(ctx)
    }
}
