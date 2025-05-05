import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
const IDL = require("../target/idl/rug_pull_chronicles_program.json");

// Program ID - must match the one in Anchor.toml
const PROGRAM_ID = new PublicKey("6cfjRrqry3MFPH9L7r2A44iCnCuoin6dauAwv1xa1Sc9");

// Use default seed for consistent PDAs
const SEED = new anchor.BN(9876);

async function main() {
    try {
        console.log("Connecting to Solana devnet...");
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        // Load keypair from file - assumes it's been created and has devnet SOL
        const keypairPath = process.env.KEYPAIR_PATH || path.join(process.env.HOME || "", ".config/solana/id.json");
        console.log(`Using keypair from ${keypairPath}`);

        let secretKey;
        try {
            secretKey = new Uint8Array(JSON.parse(fs.readFileSync(keypairPath, "utf-8")));
        } catch (e) {
            console.error(`Error loading keypair from ${keypairPath}:`, e);
            console.log("\nMake sure you have a Solana keypair with devnet SOL.");
            console.log("Set KEYPAIR_PATH environment variable or place it at ~/.config/solana/id.json");
            return;
        }

        const keypair = Keypair.fromSecretKey(secretKey);
        console.log("Wallet public key:", keypair.publicKey.toString());

        // Check wallet balance
        const balance = await connection.getBalance(keypair.publicKey);
        console.log(`Wallet balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);

        if (balance < anchor.web3.LAMPORTS_PER_SOL * 0.05) {
            console.error("Insufficient balance. Need at least 0.05 SOL for initialization.");
            console.log("Get devnet SOL at https://faucet.solana.com");
            return;
        }

        // Derive all the PDAs we will need
        const [configPDA, configBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("config"), SEED.toArrayLike(Buffer, "le", 8)],
            PROGRAM_ID
        );

        const [updateAuthorityPDA, updateAuthorityBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("upd_auth")],
            PROGRAM_ID
        );

        const [treasuryPDA, treasuryBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("treasury")],
            PROGRAM_ID
        );

        const [antiScamTreasuryPDA, antiScamTreasuryBump] = PublicKey.findProgramAddressSync(
            [Buffer.from("treasury_anti_scam")],
            PROGRAM_ID
        );

        console.log("PDAs:");
        console.log("Config PDA:", configPDA.toString());
        console.log("Update Authority PDA:", updateAuthorityPDA.toString());
        console.log("Treasury PDA:", treasuryPDA.toString());
        console.log("Anti-Scam Treasury PDA:", antiScamTreasuryPDA.toString());

        // Check if config already exists
        const configAccount = await connection.getAccountInfo(configPDA);
        if (configAccount) {
            console.log("Config account already exists on devnet!");
            return;
        }

        // Setup wallet and provider
        const wallet = new anchor.Wallet(keypair);
        const provider = new anchor.AnchorProvider(
            connection,
            wallet,
            { commitment: "confirmed" }
        );

        // Create program instance
        const program = new anchor.Program(IDL, provider);

        // Prepare the bumps object
        const bumps = {
            config: configBump,
            updateAuthorityPda: updateAuthorityBump,
            treasuryPda: treasuryBump,
            antiScamTreasuryPda: antiScamTreasuryBump
        };

        console.log("\nInitializing program on devnet...");
        console.log("This will create config and PDAs with the following bumps:", bumps);

        // Call the initialize instruction
        const tx = await program.methods
            .initialize(SEED, bumps)
            .accounts({
                admin: wallet.publicKey,
                config: configPDA,
                updateAuthorityPda: updateAuthorityPDA,
                treasuryPda: treasuryPDA,
                antiScamTreasuryPda: antiScamTreasuryPDA,
                mplCoreProgram: new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d"),
                systemProgram: anchor.web3.SystemProgram.programId,
            })
            .rpc();

        console.log("Initialization transaction submitted:", tx);
        console.log(`View on explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

        console.log("\nWaiting for confirmation...");

        // Wait for transaction confirmation
        const latestBlockhash = await connection.getLatestBlockhash();
        await connection.confirmTransaction({
            signature: tx,
            blockhash: latestBlockhash.blockhash,
            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
        });

        console.log("Program initialization completed successfully!");
        console.log("Next step: Create collections using 'anchor test' or another script");

    } catch (error) {
        console.error("Error initializing program:", error);
    }
}

main(); 