use anchor_lang::prelude::*;

/// Holds all of the "global" PDAs for Rug Pull Chronicles:
///   – update authority  
///   – fee treasuries  
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
    /// Config account's own bump
    pub config_bump: u8,
    /// PDA that becomes MPL-Core's update authority
    pub update_authority: Pubkey,
    /// Where we collect platform fees
    pub treasury: Pubkey,
    /// Where we send anti-scam donations
    pub antiscam_treasury: Pubkey,
}

impl Space for Config {
    // 8   — Anchor discriminator
    // 8   — seed (u64)
    // 4   — four bumps (u8 × 4)
    // 3×32— three Pubkeys
    const INIT_SPACE: usize = 8 + 8 + 4 + 3 * 32;
}
