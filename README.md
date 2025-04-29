# Rug Pull Chronicles

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
