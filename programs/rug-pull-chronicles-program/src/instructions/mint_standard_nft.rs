// programs/rugged-nft/src/instructions/mint_standard_nft.rs
use crate::{constants::*, cpi, state::*, utils};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct MintStandardNft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(init, payer = payer,
      seeds = [STANDARD_NFT_SEED, payer.key().as_ref()],
      bump,
      space = 8 + std::mem::size_of::<StandardNft>() + 64
    )]
    pub standard_nft: Box<Account<'info, StandardNft>>,

    /// Config account with collection addresses
    #[account(
      seeds = [CONFIG_SEED],
      bump
    )]
    pub config: Account<'info, Config>,

    /// The standard collection account
    /// CHECK: This is verified against the config account
    #[account(
      mut,
      constraint = standard_collection.key() == config.standard_collection
    )]
    pub standard_collection: AccountInfo<'info>,

    /// Update authority PDA for NFT metadata
    /// CHECK: This is a PDA owned by the program
    #[account(
      seeds = [UPDATE_AUTH_SEED],
      bump
    )]
    pub update_authority_pda: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<MintStandardNft>, traits: Vec<u8>) -> Result<()> {
    utils::validate_traits(&traits)?;
    // call MPL-CORE CPI to mint an asset in the standard collection
    cpi::mint_standard(
        &ctx.accounts.standard_nft,
        &ctx.accounts.payer.to_account_info(),
        &ctx.accounts.system_program.to_account_info(),
        traits,
        &ctx.accounts.standard_collection,
        &ctx.accounts.update_authority_pda.to_account_info(),
    )?;
    Ok(())
}
