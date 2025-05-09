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
    /// Minimum payment required for minting (in lamports)
    pub minimum_payment: u64,
    /// Circuit breaker flag to pause all functionality in case of emergencies
    pub paused: bool,
    /// Total number of standard NFTs minted
    pub total_minted_standard: u64,
    /// Total number of scammed NFTs minted
    pub total_minted_scammed: u64,
    /// Program version for tracking upgrades
    pub version: u16,
    /// Flag indicating if standard collection has Master Edition plugin
    pub standard_collection_has_master_edition: bool,
    /// Max supply for standard collection (if Master Edition plugin applied)
    pub standard_collection_max_supply: Option<u32>,
    /// Flag indicating if scammed collection has Master Edition plugin
    pub scammed_collection_has_master_edition: bool,
    /// Max supply for scammed collection (if Master Edition plugin applied)
    pub scammed_collection_max_supply: Option<u32>,
}

impl Space for Config {
    // 8   — Anchor discriminator
    // 32  — admin (Pubkey)
    // 8   — seed (u64)
    // 7   — seven bumps (u8 × 7)
    // 5×32— five Pubkeys (update_authority, treasury, antiscam_treasury, standard_collection, scammed_collection)
    // 2   — mint_fee_basis_points (u16)
    // 2   — treasury_fee_percent and antiscam_fee_percent (u8 × 2)
    // 8   — minimum_payment (u64)
    // 1   — paused (bool)
    // 16  — total_minted_standard and total_minted_scammed (u64 × 2)
    // 2   — version (u16)
    // 2   — two booleans for master edition flags (bool × 2)
    // 10  — two Option<u32> fields (1 + 4 bytes each, where the 1 byte is for the option tag)
    const INIT_SPACE: usize = 8 + 32 + 8 + 7 + (5 * 32) + 2 + 2 + 8 + 1 + 16 + 2 + 2 + (2 * 5);
}
