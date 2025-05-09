use crate::state::config::Config;
use anchor_lang::prelude::*;
use mpl_core::{
    instructions::AddCollectionPluginV1CpiBuilder,
    types::{Creator, Plugin, Royalties, RuleSet},
};

#[derive(AnchorSerialize, AnchorDeserialize)]
pub struct AddCollectionPluginArgs {
    pub basis_points: u16,
    pub creators: Vec<CreatorInput>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CreatorInput {
    pub address: Pubkey,
    pub percentage: u8,
}

#[derive(Accounts)]
pub struct AddCollectionPlugin<'info> {
    /// The admin who can add collection royalties
    #[account(mut, constraint = admin.key() == config.admin @ crate::error::RuggedError::Unauthorized)]
    pub admin: Signer<'info>,

    /// The program's config account
    #[account(
        seeds = [b"config", config.seed.to_le_bytes().as_ref()],
        bump = config.config_bump,
    )]
    pub config: Account<'info, Config>,

    /// The collection to update
    /// CHECK: Validated through the constraint with config.standard_collection
    #[account(
        mut,
        constraint = collection.key() == config.standard_collection
    )]
    pub collection: UncheckedAccount<'info>,

    /// The program's update authority PDA
    /// CHECK: This is a PDA that only this program can sign for
    #[account(
        seeds = [b"upd_auth"],
        bump = config.update_authority_bump,
    )]
    pub update_authority_pda: UncheckedAccount<'info>,

    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> AddCollectionPlugin<'info> {
    pub fn add_collection_royalties(&self, args: AddCollectionPluginArgs) -> Result<()> {
        // Get PDA signer seeds for update_authority_pda
        let auth_seeds = &[b"upd_auth".as_ref(), &[self.config.update_authority_bump]];

        // Convert CreatorInput to mpl_core Creator type
        let creators = args
            .creators
            .iter()
            .map(|c| Creator {
                address: c.address,
                percentage: c.percentage,
            })
            .collect::<Vec<Creator>>();

        // Create the plugin add CPI
        AddCollectionPluginV1CpiBuilder::new(&self.mpl_core_program.to_account_info())
            .collection(&self.collection.to_account_info())
            .authority(Some(&self.update_authority_pda.to_account_info()))
            .payer(&self.admin.to_account_info())
            .system_program(&self.system_program.to_account_info())
            .plugin(Plugin::Royalties(Royalties {
                basis_points: args.basis_points,
                creators,
                rule_set: RuleSet::None,
            }))
            .invoke_signed(&[auth_seeds])?;
        Ok(())
    }
}
