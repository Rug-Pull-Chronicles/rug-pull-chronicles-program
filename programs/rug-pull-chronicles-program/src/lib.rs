// pub mod constants;
// pub mod error;
// pub mod instructions;
// pub mod state;

// use anchor_lang::prelude::*;

// pub use constants::*;
// pub use instructions::*;
// pub use state::*;

// declare_id!("AisPtd8Pkci6V6x38MeZHBd5i7riJU8jCuHKtLLThCNM");

// #[program]
// pub mod rug_pull_chronicles_program {
//     use super::*;

//     pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
//         initialize::handler(ctx)
//     }
// }

use anchor_lang::prelude::*;

declare_id!("9Tc3PoSyNr8JJ2Q47AyovJiihSwXQM2eKTAUf4szziMu");

mod instructions;
use instructions::*;

#[program]
pub mod metaplex_core_example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }

    pub fn mint_asset(ctx: Context<MintAsset>) -> Result<()> {
        ctx.accounts.mint_core_asset()
    }
}

#[derive(Accounts)]
pub struct Initialize {}