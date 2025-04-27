use anchor_lang::prelude::*;

#[account]
pub struct RuggedNft {
    /// Who owns this “rugged” mint record
    pub owner: Pubkey,
    /// Simple byte-vector for whatever trait encoding you choose
    pub traits: Vec<u8>,
}

impl Space for RuggedNft {
    // 8    (discriminator)
    // 32   (owner)
    // 4+N  (vector: 4-byte length + actual bytes)
    //     — we don’t know N at compile time, but Anchor will allocate enough
    const INIT_SPACE: usize = 8 + 32 + (4 +  // trait vector prefix
        /* you can decide a max, e.g. */ 32  
    );
}
