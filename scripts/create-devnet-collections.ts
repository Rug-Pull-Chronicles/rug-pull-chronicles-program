import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Connection, Keypair } from "@solana/web3.js";
import fs from "fs";
import path from "path";
const IDL = require("../target/idl/rug_pull_chronicles_program.json");

// Program ID - must match the one in Anchor.toml
const PROGRAM_ID = new PublicKey("6cfjRrqry3MFPH9L7r2A44iCnCuoin6dauAwv1xa1Sc9");
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

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

        const wallet = new anchor.Wallet(Keypair.fromSecretKey(secretKey));
        console.log("Wallet public key:", wallet.publicKey.toString());

        // Check wallet balance
        const balance = await connection.getBalance(wallet.publicKey);
        console.log(`Wallet balance: ${balance / anchor.web3.LAMPORTS_PER_SOL} SOL`);

        if (balance < anchor.web3.LAMPORTS_PER_SOL * 0.1) {
            console.error("Insufficient balance. Need at least 0.1 SOL for collection creation.");
            console.log("Get devnet SOL at https://faucet.solana.com");
            return;
        }

        // Calculate PDAs
        const [configPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("config"), SEED.toArrayLike(Buffer, "le", 8)],
            PROGRAM_ID
        );

        const [updateAuthorityPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("upd_auth")],
            PROGRAM_ID
        );

        // Setup provider
        const provider = new anchor.AnchorProvider(
            connection,
            wallet,
            { commitment: "confirmed" }
        );

        // Create program instance
        const program = new anchor.Program(IDL, provider);

        // Check if config exists
        try {
            // @ts-ignore - TypeScript doesn't know about the config account in the IDL
            const config = await program.account.config.fetch(configPDA);
            console.log("Found config. Update authority:", config.updateAuthority.toString());
        } catch (e) {
            console.error("Config not found on devnet. Please run initialize-devnet.ts first.");
            return;
        }

        // Create keypairs for both collections
        console.log("Generating keypairs for collections...");
        const standardCollectionKeypair = Keypair.generate();
        const scammedCollectionKeypair = Keypair.generate();

        console.log("Standard collection address:", standardCollectionKeypair.publicKey.toString());
        console.log("Scammed collection address:", scammedCollectionKeypair.publicKey.toString());

        // 1. Create Standard Collection
        console.log("\nCreating standard collection...");

        try {
            // Collection metadata
            const name = "Rug Pull Chronicles - NFT Collection";
            const uri = "https://rugpullchronicles.io/collection-metadata.json";

            // Call the create_collection instruction
            const tx = await program.methods
                .createCollection(name, uri)
                .accounts({
                    collection: standardCollectionKeypair.publicKey,
                    updateAuthority: updateAuthorityPDA,
                    payer: wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    mplCoreProgram: MPL_CORE_PROGRAM_ID,
                    config: configPDA
                })
                .signers([standardCollectionKeypair])
                .rpc();

            console.log("Standard collection creation tx:", tx);
            console.log(`View on explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

            // Wait for confirmation
            const latestBlockhash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                signature: tx,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
            });

            // Update the config with the collection address
            console.log("Updating config with standard collection...");
            const updateTx = await program.methods
                .updateConfigCollection(standardCollectionKeypair.publicKey)
                .accounts({
                    admin: wallet.publicKey,
                    config: configPDA,
                })
                .rpc();

            console.log("Config update tx:", updateTx);
            console.log(`View on explorer: https://explorer.solana.com/tx/${updateTx}?cluster=devnet`);

            console.log("Standard collection created and config updated successfully.");
        } catch (error) {
            console.error("Error creating standard collection:", error);
            return;
        }

        // 2. Create Scammed Collection
        console.log("\nCreating scammed collection...");

        try {
            // Collection metadata
            const name = "Rug Pull Chronicles - Scammed NFT Collection";
            const uri = "https://rugpullchronicles.io/scammed-collection-metadata.json";

            // Call the create_collection instruction
            const tx = await program.methods
                .createCollection(name, uri)
                .accounts({
                    collection: scammedCollectionKeypair.publicKey,
                    updateAuthority: updateAuthorityPDA,
                    payer: wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    mplCoreProgram: MPL_CORE_PROGRAM_ID,
                    config: configPDA
                })
                .signers([scammedCollectionKeypair])
                .rpc();

            console.log("Scammed collection creation tx:", tx);
            console.log(`View on explorer: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

            // Wait for confirmation
            const latestBlockhash = await connection.getLatestBlockhash();
            await connection.confirmTransaction({
                signature: tx,
                blockhash: latestBlockhash.blockhash,
                lastValidBlockHeight: latestBlockhash.lastValidBlockHeight
            });

            // Update the config with the scammed collection address
            console.log("Updating config with scammed collection...");
            const updateTx = await program.methods
                .updateConfigRuggedCollection(scammedCollectionKeypair.publicKey)
                .accounts({
                    admin: wallet.publicKey,
                    config: configPDA,
                })
                .rpc();

            console.log("Config update tx:", updateTx);
            console.log(`View on explorer: https://explorer.solana.com/tx/${updateTx}?cluster=devnet`);

            console.log("Scammed collection created and config updated successfully.");
        } catch (error) {
            console.error("Error creating scammed collection:", error);
            return;
        }

        // Display final configuration
        try {
            // @ts-ignore - TypeScript doesn't know about the config account in the IDL
            const config = await program.account.config.fetch(configPDA);
            console.log("\nFinal Configuration:");
            console.log("Standard Collection:", config.standardCollection.toString());
            console.log("Scammed Collection:", config.scammedCollection.toString());

            console.log("\nAdd these to your frontend MintNFT.tsx component:");
            console.log(`const STANDARD_COLLECTION = '${config.standardCollection.toString()}';`);
            console.log(`const SCAMMED_COLLECTION = '${config.scammedCollection.toString()}';`);
        } catch (e) {
            console.error("Error fetching final config:", e);
        }

    } catch (error) {
        console.error("Uncaught error:", error);
    }
}

main(); 