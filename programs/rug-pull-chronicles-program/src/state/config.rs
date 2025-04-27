use anchor_lang::prelude::*;

/// Holds all of the "global" PDAs for Rug Pull Chronicles:
///   – update authority  
///   – fee treasuries  
///   – collection details
#[account]
pub struct Config {
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
    /// Config account's own bump
    pub config_bump: u8,
    /// PDA that becomes MPL-Core's update authority
    pub update_authority: Pubkey,
    /// Where we collect platform fees
    pub treasury: Pubkey,
    /// Where we send anti-scam donations
    pub antiscam_treasury: Pubkey,
    /// The collection mint address
    pub standard_collection: Pubkey,
}

impl Space for Config {
    // 8   — Anchor discriminator
    // 8   — seed (u64)
    // 6   — six bumps (u8 × 6)
    // 4×32— four Pubkeys
    const INIT_SPACE: usize = 8 + 8 + 6 + 4 * 32;
}
