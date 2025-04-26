use crate::{constants::*, cpi, error::*, state::*, utils};
use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct MintRuggedNft<'info> {
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Check and mark this user as rugged
    #[account(
      mut,
      seeds = [VERIFICATION_SEED, payer.key().as_ref()],
      bump,
      constraint = rugged_user.owner == payer.key() @ RuggedError::RuggedUserNotVerified
    )]
    pub rugged_user: Box<Account<'info, RuggedUser>>,

    /// BaseAssetV1 account via CPL to mpl-core
    /// CHECK: This is the asset account that will be initialized by MPL-Core
    #[account(mut)]
    pub asset_account: AccountInfo<'info>,

    /// Config account with collection addresses
    #[account(
      seeds = [CONFIG_SEED],
      bump
    )]
    pub config: Account<'info, Config>,

    /// The rugged collection account
    /// CHECK: This is verified against the config account
    #[account(
      mut,
      constraint = rugged_collection.key() == config.rugged_collection
    )]
    pub rugged_collection: AccountInfo<'info>,

    /// Update authority PDA for NFT metadata
    /// CHECK: This is a PDA owned by the program
    #[account(
      seeds = [UPDATE_AUTH_SEED],
      bump
    )]
    pub update_authority_pda: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
    /// MPL Core program for NFT minting
    /// CHECK: This is the MPL-Core program ID
    pub mpl_core_program: UncheckedAccount<'info>,
}

pub fn handler(ctx: Context<MintRuggedNft>, traits: Vec<u8>, dest_wallet: Pubkey) -> Result<()> {
    // ---- verification stub ----
    #[cfg(feature = "scam_verification")]
    {
        // real logic: require RuggedUser.is_verified == true
        let user = &ctx.accounts.rugged_user;
        if !user.is_verified {
            return err!(RuggedError::RuggedUserNotVerified);
        }
        if dest_wallet == user.compromised_wallet {
            return err!(RuggedError::InvalidDestination);
        }
    }
    #[cfg(not(feature = "scam_verification"))]
    {
        // no-op / default stub for MVP
    }
    // ----------------------------

    // validate traits
    utils::validate_traits(&traits)?;
    // finally, mint via mpl-core CPI
    cpi::mint_rugged(
        &ctx.accounts.rugged_user,
        &ctx.accounts.payer.to_account_info(),
        &ctx.accounts.system_program.to_account_info(),
        &ctx.accounts.mpl_core_program.to_account_info(),
        &ctx.accounts.asset_account,
        traits,
        dest_wallet,
        &ctx.accounts.rugged_collection,
        &ctx.accounts.update_authority_pda.to_account_info(),
    )?;
    Ok(())
}
