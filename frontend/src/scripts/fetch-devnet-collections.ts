import { Connection, PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";
import rawIdl from "../../../target/idl/rug_pull_chronicles_program.json";

// Program ID
const PROGRAM_ID = new PublicKey(process.env.NEXT_PUBLIC_PROGRAM_ID as string);

// PDA seeds
const CONFIG_SEED = "config";
const DEFAULT_SEED = 9876; // Same as in program.ts

async function main() {
  console.log("Connecting to Solana devnet...");
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  try {
    // Derive all the PDAs we will need
    console.log("Finding PDAs...");

    const [configPDA] = PublicKey.findProgramAddressSync(
      [
        Buffer.from(CONFIG_SEED),
        new anchor.BN(DEFAULT_SEED).toArrayLike(Buffer, "le", 8),
      ],
      PROGRAM_ID
    );
    console.log("Config PDA:", configPDA.toString());

    // Check if config already exists
    const configAccount = await connection.getAccountInfo(configPDA);
    if (!configAccount) {
      console.error(
        "Config account not found on devnet. Program needs to be initialized first."
      );
      return;
    }

    console.log(
      "Config account found with data size:",
      configAccount.data.length
    );

    // Create a provider with no wallet (read-only)
    const provider = new anchor.AnchorProvider(
      connection,
      // @ts-ignore - using null wallet for read-only operations
      {
        publicKey: PublicKey.default,
        signTransaction: async () => {},
        signAllTransactions: async () => {},
      },
      { commitment: "confirmed", skipPreflight: false }
    );

    // Create program with IDL
    const program = new anchor.Program(rawIdl, provider);

    // Fetch and decode the config account
    console.log("Fetching config account data...");
    // @ts-ignore - TypeScript doesn't know about the config account in the IDL
    const config = await program.account.config.fetch(configPDA);

    console.log("\nDEVNET COLLECTION ADDRESSES:");
    console.log("---------------------------");
    console.log("Standard Collection:", config.standardCollection.toString());
    console.log("Scammed Collection:", config.scammedCollection.toString());

    // Suggest adding these to the frontend code
    console.log("\nAdd these constants to your MintNFT.tsx:");
    console.log(
      `const STANDARD_COLLECTION = '${config.standardCollection.toString()}';`
    );
    console.log(
      `const SCAMMED_COLLECTION = '${config.scammedCollection.toString()}';`
    );
  } catch (error) {
    console.error("Error fetching config account:", error);
  }
}

main().catch(console.error);
