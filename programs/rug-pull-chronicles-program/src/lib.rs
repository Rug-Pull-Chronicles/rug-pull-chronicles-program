use anchor_lang::prelude::*;
pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use instructions::initialize::*;

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

    // pub fn mint_standard_nft(ctx: Context<MintStandardNft>) -> Result<()> {
    //     ctx.accounts.mint_core_asset()
    // }
}
