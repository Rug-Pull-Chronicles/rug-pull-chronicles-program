use anchor_lang::prelude::*;

/// Handy wrapper for a Collection/Edition pair if you need to
/// do MasterEdition or verify approvals on a collection later.
#[derive(AnchorSerialize, AnchorDeserialize, Clone)]
pub struct CollectionInfo {
    pub mint:    Pubkey,
    pub edition: Pubkey,
}
