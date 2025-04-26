use anchor_lang::prelude::*;

#[constant]
pub const RUGGED_NFT_SEED: &[u8] = b"rugged_nft";
pub const STANDARD_NFT_SEED: &[u8] = b"standard_nft";
pub const VERIFICATION_SEED: &[u8] = b"verify_user";
pub const FEE_BASIS_POINTS: u16 = 300; // e.g. 3% fee to charity
pub const MPL_CORE_PROGRAM_ID: Pubkey = mpl_core::ID; // imported in cpi.rs

// Initialize instruction seeds
pub const CONFIG_SEED: &[u8] = b"config";
pub const UPDATE_AUTH_SEED: &[u8] = b"upd_auth";
pub const TREASURY_SEED: &[u8] = b"treasury";
pub const ANTISCAM_SEED: &[u8] = b"antiscam";

// NFT metadata constants
pub const RUGGED_NFT_URI_BASE: &str = "https://ruggedcollection.io/";
pub const STANDARD_NFT_URI_BASE: &str = "https://standardcollection.io/";
pub const RUGGED_NFT_NAME: &str = "Rugged NFT";
pub const STANDARD_NFT_NAME: &str = "Standard NFT";
pub const RUGGED_NFT_SYMBOL: &str = "RUG";
pub const STANDARD_NFT_SYMBOL: &str = "STD";
