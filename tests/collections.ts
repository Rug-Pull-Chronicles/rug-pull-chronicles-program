import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

describe("Initialize Collections Test", () => {
    // Configure the client to use the local cluster
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    // Get program ID from the workspace
    const programId = new PublicKey("AisPtd8Pkci6V6x38MeZHBd5i7riJU8jCuHKtLLThCNM");

    // Load the program
    const program = anchor.workspace.RugPullChroniclesProgram;

    // Wallet for signing transactions
    const wallet = provider.wallet;

    // Seed constants - must match those in the program
    const CONFIG_SEED = Buffer.from("config");
    const UPDATE_AUTH_SEED = Buffer.from("upd_auth");
    const TREASURY_SEED = Buffer.from("treasury");
    const ANTISCAM_SEED = Buffer.from("antiscam");

    // PDAs
    let configPDA: PublicKey;
    let updateAuthorityPDA: PublicKey;
    let treasuryPDA: PublicKey;
    let antiScamTreasuryPDA: PublicKey;

    // Collection mint keypairs
    const ruggedCollectionMint = Keypair.generate();
    const standardCollectionMint = Keypair.generate();

    // Bumps
    let configBump: number;
    let updateAuthorityBump: number;
    let treasuryBump: number;
    let antiScamTreasuryBump: number;

    before(async () => {
        // Find PDAs
        [configPDA, configBump] = await PublicKey.findProgramAddressSync(
            [CONFIG_SEED],
            programId
        );

        [updateAuthorityPDA, updateAuthorityBump] = await PublicKey.findProgramAddressSync(
            [UPDATE_AUTH_SEED],
            programId
        );

        [treasuryPDA, treasuryBump] = await PublicKey.findProgramAddressSync(
            [TREASURY_SEED],
            programId
        );

        [antiScamTreasuryPDA, antiScamTreasuryBump] = await PublicKey.findProgramAddressSync(
            [TREASURY_SEED, ANTISCAM_SEED],
            programId
        );

        // Fund the collection mint keypairs
        await provider.connection.requestAirdrop(
            ruggedCollectionMint.publicKey,
            LAMPORTS_PER_SOL
        );
        await provider.connection.requestAirdrop(
            standardCollectionMint.publicKey,
            LAMPORTS_PER_SOL
        );
    });

    it("Initializes the program with collections", async () => {
        console.log("Initializing program with collections...");

        try {
            // Call the initialize instruction
            const tx = await program.methods
                .initialize()
                .accounts({
                    payer: wallet.publicKey,
                    config: configPDA,
                    updateAuthorityPda: updateAuthorityPDA,
                    treasuryPda: treasuryPDA,
                    antiScamTreasuryPda: antiScamTreasuryPDA,
                    ruggedCollectionMint: ruggedCollectionMint.publicKey,
                    standardCollectionMint: standardCollectionMint.publicKey,
                    mplCoreProgram: new PublicKey("core1111111111111111111111111111111111111111"),
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .signers([ruggedCollectionMint, standardCollectionMint])
                .rpc();

            console.log("Transaction signature:", tx);

            // Fetch config account data
            const configAccount = await program.account.config.fetchNullable(configPDA);
            if (!configAccount) {
                throw new Error("Config account not found");
            }

            // Access the config fields
            console.log("Configuration:");
            console.log("- Update Authority:", configAccount.updateAuthority.toBase58());
            console.log("- Treasury:", configAccount.treasury.toBase58());
            console.log("- Anti-Scam Treasury:", configAccount.antiscamTreasury.toBase58());
            console.log("- Rugged Collection:", configAccount.ruggedCollection.toBase58());
            console.log("- Standard Collection:", configAccount.standardCollection.toBase58());

            // Verify the values (using string comparison to avoid type issues)
            assert.equal(
                configAccount.updateAuthority.toBase58(),
                updateAuthorityPDA.toBase58(),
                "Update authority mismatch"
            );
            assert.equal(
                configAccount.treasury.toBase58(),
                treasuryPDA.toBase58(),
                "Treasury mismatch"
            );
            assert.equal(
                configAccount.antiscamTreasury.toBase58(),
                antiScamTreasuryPDA.toBase58(),
                "Anti-scam treasury mismatch"
            );
            assert.equal(
                configAccount.ruggedCollection.toBase58(),
                ruggedCollectionMint.publicKey.toBase58(),
                "Rugged collection mismatch"
            );
            assert.equal(
                configAccount.standardCollection.toBase58(),
                standardCollectionMint.publicKey.toBase58(),
                "Standard collection mismatch"
            );

            console.log("Initialization successful!");
        } catch (error) {
            console.error("Error initializing collections:", error);
            throw error;
        }
    });
});
