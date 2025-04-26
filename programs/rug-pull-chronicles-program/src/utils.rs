use crate::error::RuggedError;
use anchor_lang::prelude::*;

pub fn validate_traits(traits: &[u8]) -> Result<()> {
    if traits.is_empty() {
        return Err(RuggedError::InvalidTraits.into());
    }

    // Check if traits length is within expected range
    if traits.len() > 32 {
        return Err(RuggedError::InvalidTraits.into());
    }

    Ok(())
}
