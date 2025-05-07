pub mod collection;
pub mod config;
pub mod rugged_nft;
pub use collection::*;
pub use config::*;
pub use rugged_nft::*;

use anchor_lang::prelude::*;

/// Simple tracker to prevent duplicate minting of NFTs
/// Instead of storing redundant information, we just use this as a
/// flag to indicate that an NFT mint has already been processed
#[account]
pub struct MintTracker {
    /// Flag indicating this mint has been processed
    pub is_minted: bool,
}

impl Space for MintTracker {
    // 8 - Anchor discriminator
    // 1 - is_minted (bool)
    const INIT_SPACE: usize = 8 + 1;
}
