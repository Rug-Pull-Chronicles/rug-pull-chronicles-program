import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { RugPullChroniclesProgram } from "../target/types/rug_pull_chronicles   _program";
import { Keypair, PublicKey } from "@solana/web3.js";
import { assert } from "chai";

// Import Umi dependencies
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
    mplCore,
    createCollection,
    fetchAssetV1,
    MPL_CORE_PROGRAM_ID
} from "@metaplex-foundation/mpl-core";
import {
    generateSigner,
    publicKey,
    sol,
    keypairIdentity,
    signerIdentity,
    createSignerFromKeypair
} from "@metaplex-foundation/umi";
import wallet from "../Turbin3-wallet.json"
import { SYSTEM_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/native/system";
import { TOKEN_PROGRAM_ID } from "@coral-xyz/anchor/dist/cjs/utils/token";

const umi = createUmi("http://127.0.0.1:8899").use(mplCore());

let keypair = umi.eddsa.createKeypairFromSecretKey(new Uint8Array(wallet));
const signer = createSignerFromKeypair(umi, keypair);
umi.use(signerIdentity(signer));

const collectionAsset = generateSigner(umi);
const asset = generateSigner(umi);

describe("Rug Pull Chronicles Program", () => {

      // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RugPullChroniclesProgram as Program<RugPullChroniclesProgram>;

    // Collection signers
    const ruggedCollectionSigner = generateSigner(umi);
    const standardCollectionSigner = generateSigner(umi);

    // Seed constants
    const CONFIG_SEED = Buffer.from("config");
    const UPDATE_AUTH_SEED = Buffer.from("upd_auth");
    const TREASURY_SEED = Buffer.from("treasury");
    const ANTISCAM_SEED = Buffer.from("antiscam");

    // PDAs
    let configPDA: PublicKey;
    let updateAuthorityPDA: PublicKey;
    let treasuryPDA: PublicKey;
    let antiScamTreasuryPDA: PublicKey;

    before(async () => {
        // Find PDAs
        [configPDA] = PublicKey.findProgramAddressSync(
            [CONFIG_SEED],
            programId
        );

        [updateAuthorityPDA] = PublicKey.findProgramAddressSync(
            [UPDATE_AUTH_SEED],
            programId
        );

        [treasuryPDA] = PublicKey.findProgramAddressSync(
            [TREASURY_SEED],
            programId
        );

        [antiScamTreasuryPDA] = PublicKey.findProgramAddressSync(
            [TREASURY_SEED, ANTISCAM_SEED],
            programId
        );

        // Request airdrop to ensure we have enough SOL
        try {
            console.log("Requesting airdrop...");
            await umi.rpc.airdrop(umi.identity.publicKey, sol(2));
            console.log("Airdrop successful");
        } catch (error) {
            console.log("Airdrop failed, but continuing (might already have funds):", error.message);
        }
    });

    it("Creates collection NFTs", async () => {
        console.log("Creating Rugged Collection...");

        // Create the Rugged Collection
        await createCollection(umi, {
            collection: ruggedCollectionSigner,
            name: 'Rugged Collection',
            uri: 'https://ruggedcollection.io/metadata.json',
        }).sendAndConfirm(umi);

        console.log("Rugged Collection created");

        // Create the Standard Collection
        console.log("Creating Standard Collection...");
        await createCollection(umi, {
            collection: standardCollectionSigner,
            name: 'Standard Collection',
            uri: 'https://standardcollection.io/metadata.json',
        }).sendAndConfirm(umi);

        console.log("Standard Collection created");

        // Verify collections were created correctly
        const ruggedCollectionAsset = await fetchAssetV1(umi, ruggedCollectionSigner.publicKey);
        const standardCollectionAsset = await fetchAssetV1(umi, standardCollectionSigner.publicKey);

        console.log("Rugged Collection Asset:", ruggedCollectionAsset.name);
        console.log("Standard Collection Asset:", standardCollectionAsset.name);

        assert.equal(ruggedCollectionAsset.name, "Rugged Collection", "Rugged collection name mismatch");
        assert.equal(standardCollectionAsset.name, "Standard Collection", "Standard collection name mismatch");
    });

    it("Initializes the program with collections", async () => {
        console.log("Initializing program with collections...");

        // Load the program using Anchor
        const provider = anchor.AnchorProvider.env();
        anchor.setProvider(provider);
        const program = anchor.workspace.RugPullChroniclesProgram;

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
                    ruggedCollectionMint: ruggedCollectionSigner.publicKey,
                    standardCollectionMint: standardCollectionSigner.publicKey,
                    mplCoreProgram: MPL_CORE_PROGRAM_ID,
                    systemProgram: anchor.web3.SystemProgram.programId,
                })
                .rpc();

            console.log("Initialization transaction signature:", tx);

            // Fetch and verify config
            const configAccount = await program.account.config.fetchNullable(configPDA);
            if (!configAccount) {
                throw new Error("Config account not found");
            }

            console.log("Program initialized successfully!");
            console.log("Configuration:");
            console.log("- Update Authority:", configAccount.updateAuthority.toBase58());
            console.log("- Rugged Collection:", configAccount.ruggedCollection.toBase58());
            console.log("- Standard Collection:", configAccount.standardCollection.toBase58());

            // Verify config matches expected values
            assert.equal(
                configAccount.ruggedCollection.toBase58(),
                ruggedCollectionSigner.publicKey.toString(),
                "Rugged collection mismatch"
            );

            assert.equal(
                configAccount.standardCollection.toBase58(),
                standardCollectionSigner.publicKey.toString(),
                "Standard collection mismatch"
            );

        } catch (error) {
            console.error("Error initializing program:", error);
            throw error;
        }
    });
});
