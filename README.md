# Rug Pull Chronicles


# Security enhancements

## Security Issues

### 1. Missing Access Controls in Update Config

In `update_config.rs`, there are no access control checks on who can update the configuration. The current implementation allows any signer to:
- Update the standard collection address
- Update the scammed collection address
- Update fee settings

**Issue**: Anyone can change the collection addresses or fee settings.

**Fix**: Add a constraint to verify the admin is an authorized account:
```rust
#[derive(Accounts)]
pub struct UpdateConfig<'info> {
    /// The admin that can update the config
    #[account(constraint = admin.key() == some_admin_authority @ RuggedError::Unauthorized)]
    pub admin: Signer<'info>,
    // ...
}
```

### 2. No Admin Key Storage

There's no record of who is authorized to update the configuration or collections.

**Issue**: No way to properly implement access controls.

**Fix**: Add an admin field to the Config struct:
```rust
pub struct Config {
    // ...existing fields
    pub admin: Pubkey,
    // ...
}
```

And initialize it in the initialize function:
```rust
self.config.admin = self.admin.key();
```

### 3. Integer Overflow in Fee Calculations

The fee calculation in `fees.rs` could potentially overflow:
```rust
let fee_amount = minimum_payment.checked_mul(fee_rate).unwrap_or(u64::MAX) / 10_000;
```

**Issue**: While `checked_mul` prevents panics, falling back to u64::MAX could lead to unexpected behavior if an overflow occurs.

**Fix**: Use checked operations throughout and return an error on overflow:
```rust
let fee_amount = minimum_payment
    .checked_mul(fee_rate)
    .ok_or(ProgramError::ArithmeticOverflow)?
    .checked_div(10_000)
    .ok_or(ProgramError::ArithmeticOverflow)?;
```

### 4. Lack of Input Validation

For example, in `update_fee_settings`, you check if percentages add up to 100, but you don't validate `mint_fee_basis_points` to ensure it's within a reasonable range.

**Issue**: Extremely high mint fees could be set.

**Fix**: Add validation for mint fees:
```rust
require!(
    mint_fee_basis_points <= 10000, // 100% max
    CustomError::InvalidFeeAmount
);
```

### 5. No Checks on Mint Functions for Duplicate Collection Assets

In the `mint_standard_nft` and `mint_scammed_nft` functions, there's no check to prevent duplicate assets.

**Issue**: Multiple assets could be minted with the same metadata.

**Fix**: Consider implementing a uniqueness check or nonce mechanism.

### 6. No Record of Minted Assets

The program doesn't keep track of which assets have been minted.

**Issue**: No way to enumerate or verify minted assets on-chain.

**Fix**: Consider adding a mapping of minted assets and counts in your Config.

### 7. Hardcoded Minimum Payment

The fee calculation uses a hardcoded 1 SOL minimum payment.

**Issue**: This value can't be adjusted without updating the code.

**Fix**: Store the minimum payment value in the Config.

### 8. No Time-Based Controls or Circuit Breakers

The program lacks mechanisms to pause functionality in case of emergencies.

**Issue**: If a vulnerability is discovered, there's no way to pause minting.

**Fix**: Add a pause flag to the Config and checks in critical functions.

### 9. Collection Creation Without Checks

Anyone can create a collection with the `create_collection` instruction.

**Issue**: There's no verification that the collection creator is authorized.

**Fix**: Add a constraint to verify the payer is authorized.

### 10. Limited Error Handling

The error handling in the program is minimal, with only a few error types defined.

**Issue**: This can make it harder to debug issues and provide clear feedback.

**Fix**: Expand error types to cover more specific failure cases.

## Recommendations

1. **Implement Access Controls**: Create a proper admin system with the admin Pubkey stored in Config.

2. **Add Collection Metadata Validation**: Validate the metadata provided for NFTs.

3. **Implement a Circuit Breaker**: Add a mechanism to pause functions in emergencies.

4. **Add Program Version**: Store a version number in Config to help with upgrades.

5. **Enhanced Logging**: Add more detailed logging for important state changes.

6. **More Comprehensive Error Types**: Expand error types for better diagnostics.

7. **Consider Fee Recipient Changes**: Add a mechanism to update the fee recipients.

8. **Security Tests**: Add specific tests for security-related functionality.

The most critical issue is the lack of access controls in update functions, which could allow anyone to change your program's configuration, potentially redirecting fees or replacing collections.


A Solana program for creating and managing NFTs related to crypto scams ("rug pulls"). This project allows users to mint NFTs documenting notable crypto scams and contributes to anti-scam awareness.

## Project Overview

Rug Pull Chronicles is a Solana-based NFT platform that:

1. Creates collections of NFTs documenting crypto scams
2. Enables minting of standard NFTs with detailed scam attributes
3. Allows minting of special "scammed" NFTs with specific scam details
4. Implements royalties and fee mechanisms that contribute to anti-scam initiatives
5. Leverages Metaplex's MPL-Core for NFT creation and management

## Core Components

### Smart Contract Architecture

- **Config**: Central configuration storing collection addresses, treasury accounts, and fee settings
- **Collections**: Two separate NFT collections - standard and scammed
- **Fees**: Split between platform treasury and anti-scam initiatives
- **Metaplex Integration**: Uses MPL-Core for NFT operations

### Key Features

- **Standard NFT Minting**: Create NFTs with scam attributes (year, amount stolen, platform, attack type)
- **Scammed NFT Minting**: Special NFTs with detailed scam documentation
- **Collection Management**: Create and configure NFT collections with royalties
- **Treasury Management**: Split fees between operations and anti-scam initiatives

## Getting Started

### Prerequisites

This project has specific version requirements:

- **Solana CLI**: Version 1.18.8 (compatibility with MPL-Core)
- **Rust**: Version 1.86.0
- **Anchor CLI**: Version 0.30.1

### Environment Setup

1. Install Rust 1.86.0:
```bash
rustup install 1.86.0
rustup default 1.86.0
```

2. Install Solana CLI 1.18.8:
```bash
sh -c "$(curl -sSfL https://release.anza.xyz/v1.18.8/install)"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

3. Create Solana wallet:
```bash
solana-keygen new
```

### Project Setup

1. Clone the repository:
```bash
git clone https://github.com/YourUsername/rug-pull-chronicles-program.git
cd rug-pull-chronicles-program
```

2. Install dependencies:
```bash
yarn install
```

3. Build the program:
```bash
anchor build
```

### Running Tests

1. First, dump the MPL Core program from mainnet:
```bash
solana program dump -u https://api.mainnet-beta.solana.com CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d target/deploy/mpl_core.so
```

2. Start a validator in a separate terminal:
```bash
COPYFILE_DISABLE=1 solana-test-validator --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d target/deploy/mpl_core.so --reset
```

3. Run the tests without starting another validator:
```bash
anchor test --skip-local-validator
```

### Deployment

1. Build the program:
```bash
anchor build
```

2. Get your program ID:
```bash
solana address -k target/deploy/rug_pull_chronicles_program-keypair.json
```

3. Update the program ID in:
   - `programs/rug-pull-chronicles-program/src/lib.rs`
   - `Anchor.toml`

4. Deploy to devnet:
```bash
anchor deploy --provider.cluster devnet
```

5. Upload the IDL:
```bash
anchor idl init --filepath target/idl/rug_pull_chronicles_program.json YOUR_PROGRAM_ID
```

## Program Flow

1. Initialize program with configuration
2. Create standard and scammed NFT collections
3. Set up royalties for collections
4. Mint standard NFTs with scam attributes
5. Mint scammed NFTs with detailed scam information
6. Collect and distribute fees between treasuries

## Troubleshooting

If you encounter issues with Rust dependencies, try:

```bash
cargo update solana-program@2.2.1 --precise 1.18.8
```

For problems with proc-macro2 errors, add this to your Cargo.toml:
```toml
proc-macro2 = "=1.0.94"
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Security Improvements

The following security improvements have been implemented to enhance the security and reliability of the program:

### 1. Duplicate NFT Prevention
- Added a lightweight `MintTracker` PDA that acts as a flag to prevent duplicate NFT minting
- Each mint operation creates a PDA with the mint address as a seed but stores minimal data (just a boolean flag)
- This approach prevents duplicates while avoiding redundant data storage

#### Why MintTracker is Necessary
The MintTracker serves multiple critical functions:
- **Explicit Validation**: Without it, there's no built-in mechanism in Solana or Metaplex that prevents trying to create multiple NFTs with the same mint address
- **Transaction Atomicity**: Ensures all program operations (fee collection, counter updates) only occur if the NFT hasn't been previously minted
- **Clean Error Handling**: Provides a clear, program-specific error instead of relying on Metaplex's initialization to fail
- **State Consistency**: Prevents scenarios where program state (like minting counters) could be updated even if the underlying NFT creation fails

Although Metaplex would eventually reject duplicate NFT creation attempts, this would happen after our program has already executed other operations, potentially leading to inconsistent state.

### 2. Asset Tracking and Metadata
- Added counters to the Config account to track total minted NFTs:
  - `total_minted_standard`: Tracks the total number of standard NFTs minted
  - `total_minted_scammed`: Tracks the total number of scammed NFTs minted
- Comprehensive metadata about each NFT is stored directly in the NFT's attributes, including:
  - All scam-specific details (year, amount, category, type)
  - Minting metadata (minter address, timestamp)
- This approach leverages the existing Metaplex NFT structure to store information efficiently

### 3. Configurable Minimum Payment
- The minimum payment value (previously hardcoded) is now configurable via the Config account
- Added the `update_minimum_payment` instruction to allow admins to modify this value
- Includes validation to ensure the minimum payment is not set too low (minimum 0.1 SOL)

### 4. Circuit Breaker / Pause Functionality
- Added a pause flag to the Config account that can be toggled by the admin
- Added the `toggle_paused` instruction to turn the pause state on or off
- All mint operations check the pause state before execution
- This provides emergency shutdown capability in case of vulnerabilities

### 5. Expanded Error Handling
- Added more specific error types for better error handling and user feedback:
  - `InvalidMinimumPayment`: Enforces minimum payment constraints
  - `ProgramPaused`: Returned when attempting operations while paused
  - `DuplicateNFTMint`: Used for duplicate NFT detection
  - `ArithmeticOverflow`: More precise overflow error handling
  - `OperationNotAllowedWhenPaused`: Clear indication that paused state prevents operations

### 6. Program Versioning
- Added a version field to the Config account to track program versions
- This facilitates future upgrades and migrations
- Initialized at version 1, with the ability to check and upgrade in the future

These improvements significantly strengthen the security posture of the application by adding circuit breakers, preventing duplicate NFT minting, enhancing error handling, and making critical values configurable rather than hardcoded.
