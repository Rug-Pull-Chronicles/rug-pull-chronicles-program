## Questions

. Should we set an .update_authority(None) when initializing the collections?



# Rug Pull Chronicles Program Overview

This project is a Solana program built with the Anchor framework that appears to be creating an NFT ecosystem for users who have experienced crypto scams ("rug pulls"). Here's a breakdown of each file and its relationship to others:

## Main Files

### `lib.rs`
- **Purpose**: Entry point for the Solana program
- **Contents**:
  - Declares program ID with `declare_id!("AisPtd8Pkci6V6x38MeZHBd5i7riJU8jCuHKtLLThCNM")`
  - Imports and exposes all modules
  - Defines the program's public instructions like `mint_rugged_nft`, `mint_standard_nft`, `update_traits`, and `verify_rugged_user`
- **Relationships**: Controls which instruction handlers are exposed to external callers

### `constants.rs`
- **Purpose**: Central location for program constants
- **Contents**:
  - Seed values for PDAs (Program Derived Addresses): `RUGGED_NFT_SEED`, `STANDARD_NFT_SEED`, etc.
  - Fee values like `FEE_BASIS_POINTS`
  - Program IDs like `MPL_CORE_PROGRAM_ID`
- **Relationships**: Used throughout the program to ensure consistent values

### `error.rs`
- **Purpose**: Define custom error types
- **Contents**: 
  - Error enum `RuggedError` with variants like `RuggedUserNotVerified`, `InvalidDestination`, `InvalidTraits`, and `Unauthorized`
- **Relationships**: Used by instruction handlers to return specific error codes

### `cpi.rs`
- **Purpose**: Cross-Program Invocation functions
- **Contents**:
  - `mint_rugged`: CPI to mint NFTs for users who have been "rugged"
  - `mint_standard`: CPI to mint standard NFTs
- **Relationships**: Used by instruction handlers to interact with MPL-Core (Metaplex) for NFT operations

### `utils.rs`
- **Purpose**: Utility functions used across the program
- **Contents**:
  - `validate_traits`: Validates NFT trait data
- **Relationships**: Called by instruction handlers before processing NFT operations

## Directories

### `state/`
- **Purpose**: Account structure definitions
- **Likely Files**:
  - `config.rs`: Program configuration account
  - `rugged_nft.rs`: Structure for "rugged" NFTs (for scam victims)
  - `standard_nft.rs`: Structure for standard NFTs
  - `rugged_user.rs`: User verification account for scam victims
- **Relationships**: These structures define the data schema for on-chain accounts

### `instructions/`
- **Purpose**: Program instruction handlers
- **Files Include**:
  - `initialize.rs`: Sets up program configuration
  - `mint_rugged_nft.rs`: Creates NFTs for verified scam victims
  - `mint_standard_nft.rs`: Creates regular NFTs
  - `update_traits.rs`: Updates NFT metadata
  - `verify_rugged_user.rs`: Verifies a user as a scam victim
- **Relationships**: Each handler defines account validation and processing logic

## Program Flow

1. Program is initialized with `initialize` instruction
2. Users can be verified as scam victims with `verify_rugged_user`
3. Verified users can mint "rugged" NFTs with `mint_rugged_nft`
4. Anyone can mint standard NFTs with `mint_standard_nft`
5. NFT traits can be updated with `update_traits`

The program integrates with Metaplex's MPL-Core to handle the actual on-chain NFT creation and management, while focusing on the verification and business logic of the "rug pull" concept.


# Metaplex Core Example

This is a step-by-step guide to build, test, and deploy [metaplex-core-example](https://github.com/ASCorreia/metaplex-core-example) by [ASCorreia](https://github.com/ASCorreia).

## Prerequisites & Compatibility Notes

**Important:** This project has specific version requirements due to compatibility issues:

- `metaplex-core` currently doesn't support `solana-cli` V2
- The latest Anchor version (0.31.1 as of April 2025) doesn't support `solana-cli` V1
- We need to use `anchor-cli 0.30.1` (compatible with `solana-cli 1.18.8`)
- The recommended version for Solana is `solana-cli 1.18.8` (compatible with `mpl-core = "0.8.0"`)
- Rust version 1.86.0 is recommended

## Environment Setup

### 1. Set up Rust

```bash
rustup install 1.86.0
rustup default 1.86.0
rustup override set 1.86.0
```

### 2. Clean Up Existing Solana Installations (Recommended)

Before installing, it's highly recommended to remove existing Solana CLI versions to avoid conflicts:

```bash
# Find all solana installations
sudo find / -type f -name "solana" 2>/dev/null

# Remove existing installations
rm -rf ~/.local/share/solana/install/

# Remove any solana PATH exports from your shell config
# Edit ~/.zshrc or ~/.bashrc and remove solana-related exports
```

### 3. Install Solana v1.18.8

```bash
sh -c "$(curl -sSfL https://release.anza.xyz/v1.18.8/install)"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### 4. Create a Solana Keypair

```bash
solana-keygen new
```

## Project Setup

1. Fork and clone the repository:
   ```bash
   git clone https://github.com/[YOUR-USERNAME]/metaplex-core-example.git
   cd metaplex-core-example
   ```

2. Delete existing lock files to ensure clean dependencies:
   ```bash
   rm -f Cargo.lock yarn.lock
   ```

3. Update dependencies:
   ```bash
   cargo update solana-program@2.2.1 --precise 1.18.8
   yarn install
   ```

## Common Rust Errors and Fixes

If you encounter the following error:
```
let source_path = proc_macro2::Span::call_site().source_file().path();
                                                             ^^^^^^^^^^^ method not found in `Span`
```

Try these fixes:

1. Find the file with the error:
   ```bash
   find ~/.cargo/registry/src -type f -name defined.rs
   ```

2. Edit line 499 and replace:
   ```rust
   let source_path = proc_macro2::Span::call_site().source_file().path();
   ```
   with:
   ```rust
   let source_path = proc_macro2::Span::call_site().file();
   ```

3. If that doesn't work, add this to your Cargo.toml dependencies:
   ```toml
   proc-macro2 = "=1.0.94"
   ```

## Running Tests

### Validator and Program Setup

Due to issues with the default anchor test validator, we need to run our own validator with the MPL Core program:

1. First, dump the MPL Core program from mainnet:
   ```bash
   solana program dump -u https://api.mainnet-beta.solana.com CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d target/deploy/mpl_core.so
   ```

2. Start a validator in a separate terminal window:
   ```bash
   COPYFILE_DISABLE=1 solana-test-validator --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d target/deploy/mpl_core.so --reset
   ```

3. Run the tests without starting another validator:
   ```bash
   anchor test --skip-local-validator
   ```

### Fixing Program ID Issues

If tests fail because of program ID mismatches:

1. Note the program ID displayed in the error message
2. Update the program ID in two places:
   - In `programs/metaplex-core-example/src/lib.rs`: `declare_id!("YOUR_PROGRAM_ID");`
   - In `Anchor.toml`: `metaplex_core_example = "YOUR_PROGRAM_ID"`

### MPL Core Asset Creation Error

If you see an error about conflicting authorities, you need to modify the test file:

1. Open `tests/metaplex-core-example.ts`
2. Find the "Create an Asset" test (around line 50)
3. Comment out or remove `updateAuthority: keypair.publicKey,`
4. This is necessary because MPL Core doesn't allow specifying both a collection and updateAuthority simultaneously

## Troubleshooting

- If you see "Error: Your configured rpc port: 8899 is already in use", ensure you've killed all running validator instances with `pkill -f solana-test-validator`
- If tests are failing with program ID errors, make sure you've updated both locations mentioned above
- "Account ... is not executable" errors indicate the MPL Core program wasn't properly loaded in the validator

## Additional Resources

- [Resolution to proc::macro error](https://solana.stackexchange.com/a/21560/40015)
- [Metaplex Core Documentation](https://docs.metaplex.com/programs/core/overview)
- [Anchor Documentation](https://www.anchor-lang.com/)

If you have issues you can contact me by email at mp.web3@gmail.com

Guide to metaplex-core example

# Step by Step Guide to build, test, and deploy [metaplex-core-example](https://github.com/ASCorreia/metaplex-core-example) by [ASCorreia](https://github.com/ASCorreia)
## Considerations
- `metaplex-core` at the moment doesn't support `solana-cli` V2
- The `latest` anchor version at the moment of writing this (23 April 2025) is 0.31.1 which doesn't support `solana-cli` V1
Therefore we'll need to use `anchor-cli 0.30.1` (compatible with `solana-cli 1.18.8`)
The recommended version for solana is `solana-cli 1.18.8` (compatible with `mpl-core = "0.8.0"`)

- rustup install 1.86.0
- rustup default 1.86.0
- rustup override set 1.86.0

> Note that this guide is focused on MacOS, if you are using windows or other OS you'll need to slightly change the commands
# Setup
metaplex-core at the moment is not compatible with Solana V2, so you'll need to install and use Solana V1. 
The recommended version is:
- 
to install it:
`sh -c "$(curl -sSfL https://release.anza.xyz/v1.18.8/install)"`
- echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.zshrc
- solana-keygen new

-


> RECOMMENDED
Before installing it is highly recommended to check for the `solana-cli` versions that you have alreasy installed to avoid clutter

## Optional but Recommended, clean your environment from existing `solana-cli` versions
1. Find all the solana versions installed in your computer
-   `sudo find / -type f -name "solana" 2>/dev/null`
2. Remove all the existing installation
-   `rm -rf ~/.local/share/solana/install/` and other paths
3. Remove the export from your `nano ~/.zshrc`

https://solana.stackexchange.com/a/21560/40015 (resolution to proc::macro error)


- Fork and Clone the repository
- Delete the cargo.lock and yarn.lock
If you get the follopwing error: 
```
let source_path = proc_macro2::Span::call_site().source_file().path();
    |                                                                  ^^^^^^^^^^^ method not found in `Span`
```
1. Click the file in the console that throws the error, or search through the terminal `find ~/.cargo/registry/src -type f -name defined.rs`
2. At 📝 Line 499 replace `let source_path = proc_macro2::Span::call_site().source_file().path();` with `let source_path = proc_macro2::Span::call_site().file();`
3. Try to build again
4. If even this doesn't work In the cargo.toml in `dependencies` add `proc-macro2 = "=1.0.94"`
- run `cargo update solana-program@2.2.1 --precise 1.18.8`
- Go into the `cargo.


# To run tests
If by running `anchor test` you get problems with the validator such as:

```
```

Start up your own local validator in a separate terminal and deploy a cloned version of mpl-core as seen in https://github.com/metaplex-foundation/mpl-core-appdata-example/commit/62b4542237f8f30b189f703212c4bba3ae61f71c:
`COPYFILE_DISABLE=1 solana-test-validator --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d target/deploy/mpl_core.so --reset`

Then run `anchor test --skip-local-validator`. 
It will probably fail at first because you are passing the wrong id. So check the program Id printed in the terminal where you have run anchor test
media/your-program-id.png 

In this case my program id is `9Tc3PoSyNr8JJ2Q47AyovJiihSwXQM2eKTAUf4szziMu`
Copy the program id and paste it `declare_id!("9Tc3PoSyNr8JJ2Q47AyovJiihSwXQM2eKTAUf4szziMu");` in "lib.rs" and in "anchor.toml" in `metaplex_core_example = "9Tc3PoSyNr8JJ2Q47AyovJiihSwXQM2eKTAUf4szziMu"`

Finally before running the tests again comment out or delete line 50 `updateAuthority: keypair.publicKey,` in "metaplex-core-example.ts"

The reason is that MPL Core program doesn't allow you to specify both a collection and an updateAuthority at the same time

Finally run again the tests `anchor test --skip-local-validator` and you should see all the tests passing!

If you have issues you can contact me by email at mp.web3@gmail.com



These two commands are performing a critical process to allow local testing with the actual Metaplex Core program:

### Command 1: Download the MPL Core Program Binary
```
solana program dump -u https://api.mainnet-beta.solana.com CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d target/deploy/mpl_core.so
```

This command:
1. Connects to Solana's mainnet (`-u https://api.mainnet-beta.solana.com`)
2. Locates the deployed Metaplex Core program by its address (`CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`)
3. Downloads the compiled program binary (the Berkley Packet Filter or BPF executable)
4. Saves it to your local machine at `target/deploy/mpl_core.so`

### Command 2: Start a Local Test Validator with the Downloaded Program
```
COPYFILE_DISABLE=1 solana-test-validator --bpf-program CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d target/deploy/mpl_core.so --reset
```

This command:
1. Sets `COPYFILE_DISABLE=1` environment variable (macOS specific) to prevent metadata files that cause issues with Solana program deployment
2. Starts a local Solana blockchain test environment (`solana-test-validator`)
3. Loads the downloaded MPL Core program binary into this local blockchain (`--bpf-program`)
4. Registers it under the same program ID as on mainnet (`CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d`)
5. Resets any previous validator state (`--reset`)

### Why This Is Necessary
- Your test code interacts with the MPL Core program to create NFT assets
- You need the actual program code running to test these interactions properly
- Anchor's default test setup doesn't properly load the MPL Core program
- By manually downloading and deploying the program to your test validator, you ensure the exact same behavior as on mainnet
- The validator acts as a local simulation of the Solana blockchain with the real MPL Core program deployed

This two-step process creates an isolated test environment that mimics mainnet behavior for accurate testing.
