// use crate::{error::*, state::*, utils};
// use anchor_lang::prelude::*;

// #[derive(Accounts)]
// pub struct UpdateTraits<'info> {
//     #[account(mut, has_one = owner @ RuggedError::Unauthorized)]
//     pub rugged_nft: Box<Account<'info, RuggedNft>>,
//     pub owner: Signer<'info>,
// }

// pub fn handler(ctx: Context<UpdateTraits>, new_traits: Vec<u8>) -> Result<()> {
//     utils::validate_traits(&new_traits)?;
//     ctx.accounts.rugged_nft.traits = new_traits;
//     Ok(())
// }
