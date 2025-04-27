// use anchor_lang::prelude::*;
// use crate::{constants::*, state::*};
// use mpl_core::{instructions::CreateV1CpiBuilder, types::{Attribute, Attributes, DataState, PluginAuthorityPair}};

// #[derive(Accounts)]
// pub struct MintStandardNft<'info> {
//     #[account(mut)]
//     pub user: Signer<'info>,
//     #[account(init, payer = user,
//       seeds = [STANDARD_NFT_SEED, user.key().as_ref()],
//       bump,
//       space = 8 + std::mem::size_of::<StandardNft>() + 64
//     )]
//     pub standard_nft_mint: Box<Account<'info, StandardNft>>,

//     /// Config account with collection addresses
//     #[account(
//       seeds = [CONFIG_SEED],
//       bump
//     )]
//     pub config: Account<'info, Config>,

//     /// The standard collection account
//     /// CHECK: This is verified against the config account
//     #[account(
//       mut,
//       constraint = standard_collection.key() == config.standard_collection
//     )]
//     pub standard_collection: AccountInfo<'info>,

//     /// Update authority PDA for NFT metadata
//     /// CHECK: This is a PDA owned by the program
//     #[account(
//       seeds = [UPDATE_AUTH_SEED],
//       bump
//     )]
//     pub update_authority_pda: UncheckedAccount<'info>,

//     /// CHECK: This is the ID of the Metaplex Core program
//     #[account(address = mpl_core::ID)]
//     pub mpl_core_program: UncheckedAccount<'info>,

//     pub system_program: Program<'info, System>,
// }

// impl<'info> MintStandardNft<'info> {
//     pub fn mint_core_asset(&mut self) -> Result<()> {
//         CreateV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
//             .asset(&self.standard_nft_mint.to_account_info())
//             .collection(Some(&self.standard_collection.to_account_info()))
//             .authority(Some(&self.user.to_account_info()))
//             .payer(&self.user.to_account_info())
//             .owner(Some(&self.user.to_account_info()))
//             .update_authority(Some(&self.update_authority_pda.to_account_info()))
//             .system_program(&self.system_program.to_account_info())
//             .data_state(DataState::AccountState)
//             .name("My Asset".to_string())
//             .uri("https://myasset.com".to_string())
//             .plugins(vec![PluginAuthorityPair {
//                 plugin: mpl_core::types::Plugin::Attributes(Attributes { attribute_list: 
//                     vec![
//                         Attribute { 
//                             key: "key".to_string(), 
//                             value: "value".to_string() 
//                         }
//                     ]
//                 }), 
//                 authority: None
//             }])
//             .invoke()?;
        
//         Ok(())
//     }
// }