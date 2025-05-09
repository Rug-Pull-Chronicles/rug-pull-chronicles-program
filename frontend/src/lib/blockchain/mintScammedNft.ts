import { PublicKey } from "@solana/web3.js";
import { mintScammedNFT } from "../program";

export const mintSNFT = async (
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

    const result = await mintScammedNFT(
      wallet,
      connection,
      pubkey,
      nftName,
      nftUri,
      "details"
    );

    return result;
  } catch (err) {
    console.error("Error minting NFT:", err);
    throw err;
  }
};
