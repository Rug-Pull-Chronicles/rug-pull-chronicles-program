use anchor_lang::prelude::*;

#[account]
pub struct RuggedUser {
    /// The wallet that owns this record
    pub owner:              Pubkey,
    /// The compromised address from which they were rugged
    pub compromised_wallet: Pubkey,
    /// Only set to true once we’ve verified on-chain evidence of a scam
    pub is_verified:        bool,
}

impl Space for RuggedUser {
    // 8  (discriminator)
    // 32 (owner)
    // 32 (compromised_wallet)
    // 1  (bool)
    const INIT_SPACE: usize = 8 + 32 + 32 + 1;
}
