# Rug Pull Chronicles

A Solana program that enables the creation and minting of NFTs documenting cryptocurrency scams and rug pulls, contributing to anti-scam awareness and education.

## Program Overview

Rug Pull Chronicles allows users to:
1. Create and manage collections of scam-related NFTs
2. Mint "standard" NFTs with detailed scam attributes
3. Mint "scammed" NFTs with comprehensive scam documentation
4. Generate fees that are split between platform operations and anti-scam initiatives
5. Apply Metaplex's features including Master Editions and Freeze Delegate plugins

**Program ID:** `Fhpi7Xfc6eYZxy5ENLeW4vmRbkWfNZpeFC4Btiqf7sR8`

## Technical Stack

- Solana Blockchain (v1.18.8)
- Anchor Framework (v0.30.1)
- Rust Programming Language (v1.86.0)
- Metaplex MPL-Core (for NFT creation and management)
- TypeScript/JavaScript (for client integration and testing)

## Architecture

### Core Account Structure

1. **Config Account**:
   - Tracks program settings, treasury addresses, and collection information
   - Stores fee rates, admin authority, and mint counters
   - Includes circuit breaker (pause) functionality
   - Maintains program version for future upgrades

2. **Collections**:
   - Standard Collection (for regular NFTs documenting scams)
   - Scammed Collection (for NFTs with specific scam details)
   - Both support Metaplex Master Edition for limited supply

3. **Treasury Accounts**:
   - Main Treasury (operations): Receives a configurable portion of minting fees
   - Anti-Scam Treasury: Receives the remaining portion for scam education initiatives

4. **MintTracker PDAs**:
   - Lightweight PDAs to prevent duplicate mints
   - Uses the NFT mint address as seed
   - Minimal storage footprint

### Key Instructions

1. **Initialize**:
   - Creates program config account with initial settings
   - Sets up treasury PDAs and update authority PDA

2. **Create Collections**:
   - Creates Metaplex Core collections
   - Supports Master Edition plugin for limited editions
   - Updates config with collection addresses

3. **Mint NFTs**:
   - `mint_standard_nft`: Creates NFTs with scam attributes (year, amount stolen, platform, attack type)
   - `mint_scammed_nft`: Creates NFTs with detailed scam documentation
   - Both collect fees split between treasuries
   - Both include timestamp and minter data

4. **Administration**:
   - Update fee settings
   - Update minimum payment
   - Toggle program pause state
   - Add collection royalties

5. **Security Operations**:
   - Add freeze delegate to NFTs
   - Freeze/thaw assets when needed

## Security Considerations

The program implements several security enhancements:

1. **Access Controls**:
   - Admin-only configuration updates
   - Proper authority verification for critical operations

2. **Duplicate NFT Prevention**:
   - MintTracker PDAs ensure each NFT mint address is used only once
   - Atomic transaction guarantees for mint operations

3. **Circuit Breaker Pattern**:
   - Program-wide pause capability for emergency shutdown
   - Admin-controlled toggle to resume operations

4. **Edition Limits**:
   - Master Edition support to enforce maximum NFT supply
   - Supply verification during minting

5. **Asset Protection**:
   - Freeze delegate integration for temporary asset locking
   - Supports escrow-less staking, marketplace integrations

6. **Fee Safeguards**:
   - Input validation for fee percentages (must sum to 100%)
   - Maximum fee rate checks (≤ 50%)
   - Minimum payment threshold
   - Safe arithmetic operations to prevent overflow

## Implementation Decisions

### Why MintTracker PDAs?
Rather than storing all NFT data on-chain, we use lightweight MintTracker PDAs that:
- Serve as a flag to prevent duplicate minting
- Minimize storage costs
- Provide atomic validation within the same transaction
- Complement Metaplex's off-chain metadata approach

### Why Separate Collections?
We maintain two distinct collections to:
- Differentiate between standard informational NFTs and specific scam documentation
- Allow separate styling, royalties, and discovery
- Provide clear categorization for marketplaces and wallets

### Fee Structure Design
The dual-treasury model:
- Creates sustainable economics (operations treasury)
- Directly supports anti-scam initiatives (anti-scam treasury)
- Allows configurable fee distribution without redeployment
- Maintains reasonable minting costs with minimum payment threshold

## Setup and Deployment

### Development Environment

```bash
# Install Rust 1.86.0
rustup install 1.86.0
rustup default 1.86.0

# Install Solana CLI 1.18.8
sh -c "$(curl -sSfL https://release.anza.xyz/v1.18.8/install)"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc

# Create a Solana wallet if needed
solana-keygen new
```

### Build and Deploy

```bash
# Clone and enter the repository
git clone https://github.com/yourusername/rug-pull-chronicles-program.git
cd rug-pull-chronicles-program

# Install dependencies
yarn install

# Build the program
anchor build

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Initialize the program with a seed value
npx ts-node scripts/initialize-devnet.ts 123456

# Create collections
npx ts-node scripts/create-collections.ts 123456
```

### Testing

The program includes a comprehensive test suite covering:
- Collection creation and management
- NFT minting with various attributes
- Fee calculations and treasury distribution
- Security aspects (access control, pause functionality)
- Edge cases (duplicate prevention, invalid inputs)

To run tests:

```bash
# First, import the MPL Core program
solana program dump -u mainnet-beta CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d target/deploy/mpl_core.so

# Start a test validator with MPL Core
solana-test-validator --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d target/deploy/mpl_core.so --reset

# Run the tests (in another terminal)
anchor test --skip-local-validator
```

## Code Structure

```
rug-pull-chronicles-program/
├── programs/
│   └── rug-pull-chronicles-program/
│       ├── src/
│       │   ├── instructions/
│       │   │   ├── add_collection_royalties.rs
│       │   │   ├── add_freeze_delegate.rs
│       │   │   ├── create_collection.rs
│       │   │   ├── freeze_asset.rs
│       │   │   ├── initialize.rs
│       │   │   ├── mint_scammed_nft.rs
│       │   │   ├── mint_standard_nft.rs
│       │   │   ├── mod.rs
│       │   │   ├── thaw_asset.rs
│       │   │   ├── toggle_paused.rs
│       │   │   ├── update_config_collection.rs
│       │   │   ├── update_fee_settings.rs
│       │   │   └── update_minimum_payment.rs
│       │   ├── state/
│       │   │   ├── config.rs
│       │   │   ├── mint_tracker.rs
│       │   │   ├── mod.rs
│       │   │   └── rugged_nft.rs
│       │   ├── utils/
│       │   │   ├── fees.rs
│       │   │   └── mod.rs
│       │   ├── error.rs
│       │   └── lib.rs
├── scripts/
│   ├── create-collections.ts
│   └── initialize-devnet.ts
├── tests/
│   └── rug-pull-chronicles-program.ts
├── Anchor.toml
└── package.json
```

## Future Improvements

1. **Frontend Integration**: Create a user-friendly interface for minting and viewing NFTs
2. **Enhanced Metadata**: Support additional scam details and recovery resources
3. **DAO Governance**: Move admin control to a community-governed DAO
4. **Analytics Dashboard**: Track scam types, amounts, and trends over time
5. **Recovery Resources**: Link NFTs to resources for scam victims

## Known Issues and Limitations

1. The program currently relies on Metaplex's original Attributes plugin, which may evolve in the future
2. Treasury funds require manual distribution to anti-scam initiatives
3. Royalties enforcement depends on marketplace compliance with the Metaplex standard