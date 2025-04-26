// use anchor_lang::prelude::*;

// #[account]
// pub struct RuggedNft {
//     /// Who minted/owns the “rugged” NFT
//     pub owner:          Pubkey,
//     /// Your trait‐by‐byte encoding
//     pub traits:         Vec<u8>,
//     /// Link back to the original stolen asset’s Pubkey
//     pub original_asset: Pubkey,
// }

// impl Space for RuggedNft {
//     // 8   (discriminator)
//     // 32  (owner)
//     // 4+M (traits vector; choose a max M)
//     // 32  (original_asset)
//     const INIT_SPACE: usize = 8 + 32 + (4 + /* e.g. */ 64) + 32;
// }
