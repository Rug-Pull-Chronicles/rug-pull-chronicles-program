// programs/rugged-nft/src/cpi.rs
use crate::constants::*;
use crate::state::{Config, RuggedUser, StandardNft};
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::CreateV1CpiBuilder,
    types::{Attribute, Attributes, DataState, Plugin, PluginAuthorityPair},
};

pub fn mint_rugged<'info>(
    rugged_user: &Account<'info, RuggedUser>,
    payer: &AccountInfo<'info>,
    system_program: &AccountInfo<'info>,
    mpl_program: &AccountInfo<'info>,
    asset_account: &AccountInfo<'info>,
    traits: Vec<u8>,
    dest_wallet: Pubkey,
    collection_account: &AccountInfo<'info>,
    update_authority: &AccountInfo<'info>,
) -> Result<()> {
    // Convert trait bytes to string attributes
    let attribute_list = vec![
        Attribute {
            key: "traits".to_string(),
            value: format!("{:?}", traits),
        },
        Attribute {
            key: "original_asset".to_string(),
            value: rugged_user.compromised_wallet.to_string(),
        },
    ];

    CreateV1CpiBuilder::new(mpl_program)
        .asset(asset_account)
        .collection(Some(collection_account))
        .authority(Some(payer))
        .payer(payer)
        .owner(Some(payer)) // We'll transfer to dest_wallet after mint
        .update_authority(Some(update_authority))
        .system_program(system_program)
        .data_state(DataState::AccountState)
        .name(RUGGED_NFT_NAME.to_string())
        .uri(format!("{}{}.json", RUGGED_NFT_URI_BASE, rugged_user.key()))
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Attributes(Attributes { attribute_list }),
            authority: None,
        }])
        .invoke()?;

    msg!("Successfully minted rugged NFT for {}", dest_wallet);
    Ok(())
}

pub fn mint_standard<'info>(
    standard_account: &Account<'info, StandardNft>,
    payer: &AccountInfo<'info>,
    system_program: &AccountInfo<'info>,
    traits: Vec<u8>,
    collection_account: &AccountInfo<'info>,
    update_authority: &AccountInfo<'info>,
) -> Result<()> {
    // Convert trait bytes to string attributes
    let attribute_list = vec![Attribute {
        key: "traits".to_string(),
        value: format!("{:?}", traits),
    }];

    // For this example, we'll use the system_program as the MPL Core program
    // In a real implementation, you'd pass the actual MPL Core program account
    let mpl_program = system_program;

    CreateV1CpiBuilder::new(mpl_program)
        .asset(&standard_account.to_account_info())
        .collection(Some(collection_account))
        .authority(Some(payer))
        .payer(payer)
        .owner(Some(payer))
        .update_authority(Some(update_authority))
        .system_program(system_program)
        .data_state(DataState::AccountState)
        .name(STANDARD_NFT_NAME.to_string())
        .uri(format!(
            "{}{}.json",
            STANDARD_NFT_URI_BASE,
            standard_account.key()
        ))
        .plugins(vec![PluginAuthorityPair {
            plugin: Plugin::Attributes(Attributes { attribute_list }),
            authority: None,
        }])
        .invoke()?;

    msg!("Successfully minted standard NFT with traits");
    Ok(())
}
