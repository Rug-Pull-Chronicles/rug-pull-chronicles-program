use crate::state::config::Config;
use anchor_lang::prelude::*;
use mpl_core;

#[derive(Accounts)]
#[instruction(seed: u64)]
pub struct Initialize<'info> {
    /// The payer for all PDAs and collection-mint accounts
    #[account(mut)]
    pub admin: Signer<'info>,

    /// Our on-chain config record
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [b"config", seed.to_le_bytes().as_ref()],
        bump,
        payer = admin,
        space = Config::INIT_SPACE,
    )]
    pub config: Account<'info, Config>,

    /// PDA that will become update_authority on both collections
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [b"upd_auth"],
        bump,
        payer = admin,
        space = 0,
    )]
    pub update_authority_pda: UncheckedAccount<'info>,

    /// General‐ops treasury PDA
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [b"treasury"],
        bump,
        payer = admin,
        space = 0,
    )]
    pub treasury_pda: UncheckedAccount<'info>,

    /// Anti‐scam treasury PDA
    /// CHECK: This is a PDA that only the program can sign for, created in this instruction
    #[account(
        init,
        seeds = [b"treasury_anti_scam"],
        bump,
        payer = admin,
        space = 0,
    )]
    pub anti_scam_treasury_pda: UncheckedAccount<'info>,

    /// CHECK: This is the ID of the Metaplex Core program
    #[account(address = mpl_core::ID)]
    pub mpl_core_program: UncheckedAccount<'info>,

    pub system_program: Program<'info, System>,
}

impl<'info> Initialize<'info> {
    pub fn initialize(&mut self, seed: u64, bumps: &BumpSeeds) -> Result<()> {
        // Set a default Pubkey for collections
        // These will be updated later when the collections are created
        let default_collection = Pubkey::default();

        // Default fee settings: 5% mint fee, split 60/40 between treasury and anti-scam treasury
        let mint_fee_basis_points = 500; // 5%
        let treasury_fee_percent = 60; // 60% to regular treasury
        let antiscam_fee_percent = 40; // 40% to anti-scam treasury

        // Default minimum payment (0.01 SOL in lamports)
        let minimum_payment = 10_000_000;

        // Collection supply limits
        let standard_max_supply = Some(100);
        let scammed_max_supply = Some(50);

        self.config.set_inner(Config {
            admin: self.admin.key(),
            seed,
            update_authority_bump: bumps.update_authority_pda,
            treasury_bump: bumps.treasury_pda,
            antiscam_treasury_bump: bumps.anti_scam_treasury_pda,
            standard_collection_bump: 0, // Default bump, will be updated later
            scammed_collection_bump: 0,  // Default bump, will be updated later
            config_bump: bumps.config,
            update_authority: self.update_authority_pda.key(),
            treasury: self.treasury_pda.key(),
            antiscam_treasury: self.anti_scam_treasury_pda.key(),
            standard_collection: default_collection,
            scammed_collection: default_collection,
            mint_fee_basis_points,
            treasury_fee_percent,
            antiscam_fee_percent,
            minimum_payment,                                     // New field
            paused: false,                                       // Initialize as not paused
            total_minted_standard: 0,                            // No NFTs minted yet
            total_minted_scammed: 0,                             // No NFTs minted yet
            version: 1,                                          // Initial version
            standard_collection_has_master_edition: true,        // Initialize as true
            standard_collection_max_supply: standard_max_supply, // Limit to 100 editions
            scammed_collection_has_master_edition: true,         // Initialize as true
            scammed_collection_max_supply: scammed_max_supply,   // Limit to 50 editions
        });

        msg!("Initialized with Master Edition support:");
        msg!("  Standard Collection Max Supply: 100");
        msg!("  Scammed Collection Max Supply: 50");

        Ok(())
    }
}

/// Bumps for the PDAs created in the initialize instruction
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct BumpSeeds {
    pub config: u8,
    pub update_authority_pda: u8,
    pub treasury_pda: u8,
    pub anti_scam_treasury_pda: u8,
}
