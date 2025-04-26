use crate::constants::*;
use crate::state::config::Config;
use anchor_lang::prelude::*;
use mpl_core::{instructions::CreateV1CpiBuilder, types::DataState, ID as CORE_ID};

#[derive(Accounts)]
pub struct Initialize<'info> {
    /// The payer for all PDAs and collection-mint accounts
    #[account(mut)]
    pub payer: Signer<'info>,

    /// Our on-chain config record
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [CONFIG_SEED],
        bump,
        payer = payer,
        space = Config::INIT_SPACE,
    )]
    pub config: Account<'info, Config>,

    /// PDA that will become update_authority on both collections
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [UPDATE_AUTH_SEED],
        bump,
        payer = payer,
        space = 0,
    )]
    pub update_authority_pda: UncheckedAccount<'info>,

    /// General‐ops treasury PDA
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [TREASURY_SEED],
        bump,
        payer = payer,
        space = 0,
    )]
    pub treasury_pda: UncheckedAccount<'info>,

    /// Anti‐scam treasury PDA
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [TREASURY_SEED, ANTISCAM_SEED],
        bump,
        payer = payer,
        space = 0,
    )]
    pub anti_scam_treasury_pda: UncheckedAccount<'info>,

    /// Pre-funded mint keypair to become our "Rugged" collection
    #[account(mut)]
    pub rugged_collection_mint: Signer<'info>,

    /// Pre-funded mint keypair to become our "Standard" collection
    #[account(mut)]
    pub standard_collection_mint: Signer<'info>,

    /// The MPL-Core program
    /// CHECK: This is the MPL-Core program ID
    #[account(address = CORE_ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    /// DRY helper: CPI-mint a collection via mpl-core
    fn mint_collection(&self, mint: &Signer<'info>, name: &str, uri: &str) -> Result<()> {
        let mpl_program_info = &self.mpl_core_program.to_account_info();
        let mint_info = &mint.to_account_info();
        let authority_info = &self.update_authority_pda.to_account_info();
        let payer_info = &self.payer.to_account_info();
        let system_program_info = &self.system_program.to_account_info();

        CreateV1CpiBuilder::new(mpl_program_info)
            .asset(mint_info)
            .collection(None)
            .authority(Some(authority_info))
            .payer(payer_info)
            .owner(Some(authority_info))
            .update_authority(Some(authority_info))
            .system_program(system_program_info)
            .data_state(DataState::AccountState)
            .name(name.to_string())
            .uri(uri.to_string())
            .invoke()?;
        Ok(())
    }
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    // 1) Mint the two collections
    ctx.accounts.mint_collection(
        &ctx.accounts.rugged_collection_mint,
        "Rugged Collection",
        "https://.../rugged-collection.json",
    )?;

    ctx.accounts.mint_collection(
        &ctx.accounts.standard_collection_mint,
        "Standard Collection",
        "https://.../standard-collection.json",
    )?;

    // 2) Persist all PDAs and mints into on-chain Config
    let config = &mut ctx.accounts.config;

    // Store bump values
    config.update_authority_bump = ctx.bumps.update_authority_pda;
    config.treasury_bump = ctx.bumps.treasury_pda;
    config.antiscam_treasury_bump = ctx.bumps.anti_scam_treasury_pda;

    // Store pubkeys
    config.update_authority = ctx.accounts.update_authority_pda.key();
    config.treasury = ctx.accounts.treasury_pda.key();
    config.antiscam_treasury = ctx.accounts.anti_scam_treasury_pda.key();
    config.rugged_collection = ctx.accounts.rugged_collection_mint.key();
    config.standard_collection = ctx.accounts.standard_collection_mint.key();

    Ok(())
}
