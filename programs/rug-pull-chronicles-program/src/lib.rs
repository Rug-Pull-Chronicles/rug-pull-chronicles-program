use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;
use crate::constants::*;
use crate::state::config::Config;
use mpl_core::{instructions::CreateV1CpiBuilder, types::DataState};

declare_id!("AisPtd8Pkci6V6x38MeZHBd5i7riJU8jCuHKtLLThCNM");

#[program]
pub mod rug_pull_chronicles_program {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn mint_standard_nft(ctx: Context<MintStandardNft>) -> Result<()> {
        ctx.accounts.mint_core_asset()
    }
}


#[derive(Accounts)]
pub struct Initialize<'info> {
    /// The payer for all PDAs and collection-mint accounts
    #[account(mut)]
    pub user: Signer<'info>,

    /// Our on-chain config record
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [CONFIG_SEED],
        bump,
        payer = user,
        space = Config::INIT_SPACE,
    )]
    pub config: Account<'info, Config>,

    /// PDA that will become update_authority on both collections
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [UPDATE_AUTH_SEED],
        bump,
        payer = user,
        space = 0,
    )]
    pub update_authority_pda: UncheckedAccount<'info>,

    /// General‐ops treasury PDA
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [TREASURY_SEED],
        bump,
        payer = user,
        space = 0,
    )]
    pub treasury_pda: UncheckedAccount<'info>,

    /// Anti‐scam treasury PDA
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [TREASURY_SEED, ANTISCAM_SEED],
        bump,
        payer = user,
        space = 0,
    )]
    pub anti_scam_treasury_pda: UncheckedAccount<'info>,

    /// Pre-funded mint keypair to become our "Standard" collection
    #[account(mut)]
    pub standard_collection_mint: Signer<'info>,

    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    /// DRY helper: CPI-mint a collection via mpl-core
    fn mint_collection(&mut self, mint: &Signer<'info>, name: &str, uri: &str) -> Result<()> {
        let mpl_program_info = &self.mpl_core_program.to_account_info();
        let mint_info = &mint.to_account_info();
        let authority_info = &self.update_authority_pda.to_account_info();
        let payer_info = &self.user.to_account_info();
        let system_program_info = &self.system_program.to_account_info();

        CreateV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
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
