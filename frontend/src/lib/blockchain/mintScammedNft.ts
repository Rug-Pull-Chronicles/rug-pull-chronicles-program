import { PublicKey } from "@solana/web3.js";
import { mintScammedCollectionNFT } from "../program";

const PROGRAM_ID = process.env.NEXT_PUBLIC_PROGRAM_ID;

export const mintScammedNft = async (
  wallet: any,
  connection: any,
  collectionAddress: PublicKey,
  nftName: string,
  nftUri: string
) => {
  if (!wallet.publicKey) {
    throw new Error("Please connect your wallet first");
  }

  if (!collectionAddress) {
    throw new Error("Please enter a collection address");
  }

  try {
    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(collectionAddress);
    } catch (e) {
      throw new Error("Invalid collection address");
    }

    // TODO: attributes for scammed nft is scam_details which is equal to
    // the (name of the nft + number) + "Rugged"

    const [mintTrackerPDA] = PublicKey.findProgramAddressSync(
      [Buffer.from("mint_tracker"), wallet.publicKey.toBuffer()],
      new PublicKey(PROGRAM_ID as string)
    );

    const result = await mintScammedCollectionNFT(
      wallet,
      connection,
      pubkey,
      "NFT Name", // nftName
      "https://your-metadata-uri.com", // nftUri
      "Scam details here"
    );

    return result;
  } catch (err) {
    console.error("Error minting NFT:", err);
    throw err;
  }
};
