use anchor_lang::prelude::*;

/// Holds all of the "global" PDAs for Rug Pull Chronicles:
///   – update authority  
///   – fee treasuries  
///   – collection details
///
/// admin authority
#[account]
pub struct Config {
    /// Admin authority that can update config and create collections
    pub admin: Pubkey,
    /// Seed used to generate the config PDA
    pub seed: u64,
    /// bump seed for the `upd_auth` PDA
    pub update_authority_bump: u8,
    /// bump seed for the general-ops treasury PDA
    pub treasury_bump: u8,
    /// bump seed for the anti-scam treasury PDA
    pub antiscam_treasury_bump: u8,
    /// bump seed for standard_collection
    pub standard_collection_bump: u8,
    /// bump seed for scammed_collection
    pub scammed_collection_bump: u8,
    /// Config account's own bump
    pub config_bump: u8,
    /// PDA that becomes MPL-Core's update authority
    pub update_authority: Pubkey,
    /// Where we collect platform fees
    pub treasury: Pubkey,
    /// Where we send anti-scam donations
    pub antiscam_treasury: Pubkey,
    /// The standard collection mint address
    pub standard_collection: Pubkey,
    /// The rugged collection mint address
    pub scammed_collection: Pubkey,
    /// Mint fee in basis points (e.g., 500 = 5%)
    pub mint_fee_basis_points: u16,
    /// Percentage of fee that goes to treasury (0-100)
    pub treasury_fee_percent: u8,
    /// Percentage of fee that goes to anti-scam treasury (0-100)
    pub antiscam_fee_percent: u8,
}

impl Space for Config {
    // 8   — Anchor discriminator
    // 8   — seed (u64)
    // 7   — seven bumps (u8 × 7)
    // 6×32— six Pubkeys (5 original + admin)
    // 2   - mint_fee_basis_points (u16)
    // 2   - treasury_fee_percent and antiscam_fee_percent (u8 × 2)
    const INIT_SPACE: usize = 8 + 8 + 7 + 6 * 32 + 2 + 2;
}
