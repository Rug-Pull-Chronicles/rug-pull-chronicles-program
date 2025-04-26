use anchor_lang::prelude::*;

/// Holds all of the “global” PDAs for Rug Pull Chronicles:
///   – update authority  
///   – fee treasuries  
///   – the two collection mints
#[account]
pub struct Config {
    /// bump seed for the `upd_auth` PDA
    pub update_authority_bump:    u8,
    /// bump seed for the general-ops treasury PDA
    pub treasury_bump:    u8,
    /// bump seed for the anti-scam treasury PDA
    pub antiscam_treasury_bump:    u8,

    /// PDA that becomes MPL-Core’s update authority
    pub update_authority: Pubkey,
    /// Where we collect platform fees
    pub treasury:         Pubkey,
    /// Where we send anti-scam donations
    pub antiscam_treasury: Pubkey,

    /// The two collection mint accounts we CPI-created
    // pub rugged_collection:   Pubkey,
    pub standard_collection: Pubkey,
}

impl Space for Config {
    // 8   — Anchor discriminator
    // 3   — three bumps (u8 × 3)
    // 6×32— six Pubkeys
    const INIT_SPACE: usize = 8 + 3 + 6 * 32;
}
