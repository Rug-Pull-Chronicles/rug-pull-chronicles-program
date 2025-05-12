import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Connection, Keypair, PublicKey } from "@solana/web3.js";
import fs from "fs";
import path from "path";

// Import the program type
import { RugPullChroniclesProgram } from "../target/types/rug_pull_chronicles_program";

// Get the program ID from the command line or use the one from Anchor.toml
const PROGRAM_ID = new PublicKey("Fhpi7Xfc6eYZxy5ENLeW4vmRbkWfNZpeFC4Btiqf7sR8");
const MPL_CORE_PROGRAM_ID = new PublicKey("CoREENxT6tW1HoK8ypY1SxRMZTcVPm7R94rH4PZNhX7d");

// Get seed from command line
const seedArg = process.argv[2];
if (!seedArg) {
    console.error("ERROR: Please provide the seed used during initialization as a command-line argument.");
    console.error("Example: npx ts-node create-collections.ts 754717");
    process.exit(1);
}

// Use the provided seed
const SEED = new anchor.BN(seedArg);
console.log(`Using seed: ${SEED.toString()}`);

async function main() {
    try {
        // Setup connection and wallet
        const connection = new Connection("https://api.devnet.solana.com", "confirmed");

        const keypairPath = process.env.KEYPAIR_PATH || path.join(process.env.HOME || "", ".config/solana/id.json");
        const secretKey = new Uint8Array(JSON.parse(fs.readFileSync(keypairPath, "utf-8")));
        const wallet = new anchor.Wallet(Keypair.fromSecretKey(secretKey));

        console.log("Wallet public key:", wallet.publicKey.toString());

        // Setup provider and program
        const provider = new anchor.AnchorProvider(
            connection,
            wallet,
            { commitment: "confirmed" }
        );

        anchor.setProvider(provider);

        // Get the program
        const program = anchor.workspace.RugPullChroniclesProgram as Program<RugPullChroniclesProgram>;

        // Derive PDAs
        const [configPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("config"), SEED.toArrayLike(Buffer, "le", 8)],
            PROGRAM_ID
        );

        const [updateAuthorityPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("upd_auth")],
            PROGRAM_ID
        );

        // Create collection keypairs
        const standardKeypair = Keypair.generate();
        const scammedKeypair = Keypair.generate();

        console.log("Standard Collection Address:", standardKeypair.publicKey.toString());
        console.log("Scammed Collection Address:", scammedKeypair.publicKey.toString());

        // Create Standard Collection
        console.log("\nCreating Standard Collection...");
        try {
            const tx1 = await program.methods
                .createCollection("Rug Pull Chronicles - NFT Collection", "https://rugpullchronicles.io/collection-metadata.json", 100, "Rug Pull Chronicles - Limited Edition", "https://rugpullchronicles.io/master-edition.json")
                .accounts({
                    collection: standardKeypair.publicKey,
                    updateAuthority: updateAuthorityPDA,
                    payer: wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    mplCoreProgram: MPL_CORE_PROGRAM_ID,
                    config: configPDA
                } as any)
                .signers([standardKeypair])
                .rpc();

            console.log("Standard Collection Created! Tx:", tx1);
            console.log(`Explorer: https://explorer.solana.com/tx/${tx1}?cluster=devnet`);

            // Update config with standard collection
            const tx2 = await program.methods
                .updateConfigCollection(standardKeypair.publicKey)
                .accounts({
                    admin: wallet.publicKey,
                    config: configPDA,
                })
                .rpc();

            console.log("Standard Collection Set in Config! Tx:", tx2);
            console.log(`Explorer: https://explorer.solana.com/tx/${tx2}?cluster=devnet`);
        } catch (error) {
            console.error("Error creating standard collection:", error);
            return;
        }

        // Create Scammed Collection
        console.log("\nCreating Scammed Collection...");
        try {
            const tx1 = await program.methods
                .createCollection("Rug Pull Chronicles - Scammed NFT Collection", "https://rugpullchronicles.io/scammed-collection-metadata.json", 50, "Rug Pull Chronicles - Scammed Edition", "https://rugpullchronicles.io/scammed-master-edition.json")
                .accounts({
                    collection: scammedKeypair.publicKey,
                    updateAuthority: updateAuthorityPDA,
                    payer: wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    mplCoreProgram: MPL_CORE_PROGRAM_ID,
                    config: configPDA
                } as any)
                .signers([scammedKeypair])
                .rpc();

            console.log("Scammed Collection Created! Tx:", tx1);
            console.log(`Explorer: https://explorer.solana.com/tx/${tx1}?cluster=devnet`);

            // Update config with scammed collection
            const tx2 = await program.methods
                .updateConfigRuggedCollection(scammedKeypair.publicKey)
                .accounts({
                    admin: wallet.publicKey,
                    config: configPDA,
                })
                .rpc();

            console.log("Scammed Collection Set in Config! Tx:", tx2);
            console.log(`Explorer: https://explorer.solana.com/tx/${tx2}?cluster=devnet`);
        } catch (error) {
            console.error("Error creating scammed collection:", error);
            return;
        }

        // Display the final configuration
        const config = await program.account.config.fetch(configPDA);
        console.log("\nFinal Configuration:");
        console.log("Standard Collection:", config.standardCollection.toString());
        console.log("Scammed Collection:", config.scammedCollection.toString());

        console.log("\nUse these values in your frontend:");
        console.log(`const STANDARD_COLLECTION = '${config.standardCollection.toString()}';`);
        console.log(`const SCAMMED_COLLECTION = '${config.scammedCollection.toString()}';`);

    } catch (error) {
        console.error("Uncaught error:", error);
    }
}

main(); 