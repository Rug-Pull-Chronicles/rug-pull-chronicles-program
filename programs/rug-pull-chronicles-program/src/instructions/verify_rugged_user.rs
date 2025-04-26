// use crate::{constants::*, state::*};
// use anchor_lang::prelude::*;

// #[derive(Accounts)]
// pub struct VerifyRuggedUser<'info> {
//     #[account(init, payer = payer,
//       seeds = [VERIFICATION_SEED, payer.key().as_ref()],
//       bump,
//       space = 8 + std::mem::size_of::<RuggedUser>()
//     )]
//     pub rugged_user: Box<Account<'info, RuggedUser>>,
//     #[account(mut)]
//     pub payer: Signer<'info>,
//     pub system_program: Program<'info, System>,
// }

// pub fn handler(ctx: Context<VerifyRuggedUser>) -> Result<()> {
//     let user = &mut ctx.accounts.rugged_user;
//     user.owner = *ctx.accounts.payer.key;
//     user.compromised_wallet = Pubkey::default(); // to be filled by front-end
//     user.is_verified = true; // marked as true by default for MVP
//     Ok(())
// }
