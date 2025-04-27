import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RugPullChroniclesProgram } from "../target/types/rug_pull_chronicles_program";
import { expect } from "chai";
import { PublicKey, Keypair } from "@solana/web3.js";
import wallet from "../Turbin3-wallet.json";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { createPluginV2, createV1, fetchAssetV1, mplCore, pluginAuthority, MPL_CORE_PROGRAM_ID, createCollection } from "@metaplex-foundation/mpl-core";
import { base58, createSignerFromKeypair, generateSigner, signerIdentity, sol } from "@metaplex-foundation/umi";
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

const umi = createUmi("http://127.0.0.1:8899").use(mplCore());

let walletKeypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, walletKeypair);
umi.use(signerIdentity(signer));

// Generate a new random KeypairSigner using the Eddsa interface
const collectionSigner = generateSigner(umi);

describe("Rug Pull Chronicles Program", () => {
    // Create a keypair from the imported wallet
    // const walletKeypair = Keypair.fromSecretKey(
    //     Uint8Array.from(wallet)
    // );

    // Create a Solana web3.js keypair for Anchor
    const walletKeypair = Keypair.fromSecretKey(new Uint8Array(wallet));

    // Configure the client with our custom wallet
    const provider = new anchor.AnchorProvider(
        anchor.AnchorProvider.env().connection,
        new anchor.Wallet(walletKeypair),
        { commitment: "confirmed" }
    );
    anchor.setProvider(provider);

    const program = anchor.workspace.RugPullChroniclesProgram as Program<RugPullChroniclesProgram>;

    // Generate seed for config PDA
    const seed = new anchor.BN(Math.floor(Math.random() * 1000000));

    // Store these for later validation
    let configPDA: PublicKey;
    let updateAuthorityPDA: PublicKey;
    let treasuryPDA: PublicKey;
    let antiScamTreasuryPDA: PublicKey;
    let configBump: number;
    let updateAuthorityBump: number;
    let treasuryBump: number;
    let antiScamTreasuryBump: number;

    before(async () => {
        // Ensure the wallet has enough SOL to pay for all the account initializations
        const walletBalance = await provider.connection.getBalance(provider.wallet.publicKey);
        console.log("Using wallet:", provider.wallet.publicKey.toString());

        if (walletBalance < 2 * anchor.web3.LAMPORTS_PER_SOL) {
            // Request airdrop if balance is low
            const signature = await provider.connection.requestAirdrop(
                provider.wallet.publicKey,
                2 * anchor.web3.LAMPORTS_PER_SOL
            );
            await provider.connection.confirmTransaction(signature);
            console.log("Airdropped 2 SOL to wallet for account creation");
        }

        // Find all PDAs we'll need
        const [configAddress, configBumpSeed] = await PublicKey.findProgramAddressSync(
            [Buffer.from("config"), seed.toArrayLike(Buffer, 'le', 8)],
            program.programId
        );
        configPDA = configAddress;
        configBump = configBumpSeed;

        const [updateAuthAddress, updateAuthBumpSeed] = await PublicKey.findProgramAddressSync(
            [Buffer.from("upd_auth")],
            program.programId
        );
        updateAuthorityPDA = updateAuthAddress;
        updateAuthorityBump = updateAuthBumpSeed;

        const [treasuryAddress, treasuryBumpSeed] = await PublicKey.findProgramAddressSync(
            [Buffer.from("treasury")],
            program.programId
        );
        treasuryPDA = treasuryAddress;
        treasuryBump = treasuryBumpSeed;

        const [antiScamAddress, antiScamBumpSeed] = await PublicKey.findProgramAddressSync(
            [Buffer.from("treasury_anti_scam")],
            program.programId
        );
        antiScamTreasuryPDA = antiScamAddress;
        antiScamTreasuryBump = antiScamBumpSeed;
    });

    it("Initializes all accounts correctly", async () => {
        try {
            // Log initial balances for debugging
            console.log("Admin wallet initial balance:", await provider.connection.getBalance(provider.wallet.publicKey) / anchor.web3.LAMPORTS_PER_SOL, "SOL");

            // Call the initialize instruction
            const tx = await program.methods
                .initialize(
                    seed,
                    {
                        config: configBump,
                        updateAuthorityPda: updateAuthorityBump,
                        treasuryPda: treasuryBump,
                        antiScamTreasuryPda: antiScamTreasuryBump,
                    }
                )
                .accounts({
                    admin: provider.wallet.publicKey,
                    config: configPDA,
                    updateAuthorityPda: updateAuthorityPDA,
                    treasuryPda: treasuryPDA,
                    antiScamTreasuryPda: antiScamTreasuryPDA,
                    mplCoreProgram: new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"),
                    systemProgram: anchor.web3.SystemProgram.programId,
                } as any)
                .rpc();

            console.log("Transaction signature", tx);

            // Fetch the created config account
            const configAccount = await program.account.config.fetch(configPDA);

            // Verify the config account data
            expect(configAccount.seed.toString()).to.equal(seed.toString());
            expect(configAccount.updateAuthorityBump).to.equal(updateAuthorityBump);
            expect(configAccount.treasuryBump).to.equal(treasuryBump);
            expect(configAccount.antiscamTreasuryBump).to.equal(antiScamTreasuryBump);
            expect(configAccount.configBump).to.equal(configBump);
            expect(configAccount.updateAuthority.toString()).to.equal(updateAuthorityPDA.toString());
            expect(configAccount.treasury.toString()).to.equal(treasuryPDA.toString());
            expect(configAccount.antiscamTreasury.toString()).to.equal(antiScamTreasuryPDA.toString());

            // Verify the PDAs exist on-chain by checking their SOL balances
            const updateAuthBalance = await provider.connection.getBalance(updateAuthorityPDA);
            const treasuryBalance = await provider.connection.getBalance(treasuryPDA);
            const antiScamTreasuryBalance = await provider.connection.getBalance(antiScamTreasuryPDA);

            console.log("Update Authority PDA balance:", updateAuthBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");
            console.log("Treasury PDA balance:", treasuryBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");
            console.log("Anti-Scam Treasury PDA balance:", antiScamTreasuryBalance / anchor.web3.LAMPORTS_PER_SOL, "SOL");

            expect(updateAuthBalance).to.be.greaterThan(0, "Update authority PDA should have a balance");
            expect(treasuryBalance).to.be.greaterThan(0, "Treasury PDA should have a balance");
            expect(antiScamTreasuryBalance).to.be.greaterThan(0, "Anti-scam treasury PDA should have a balance");

            console.log("All accounts were initialized successfully");
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    });

    // Add more tests for other functionality here
});
