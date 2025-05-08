import { PublicKey } from "@solana/web3.js";
import { mintStandardNFT } from "../program";

export const mintNFT = async (
  wallet: any,
  connection: any,
  collectionAddress: PublicKey,
  nftName: string,
  nftUri: string,
  year: string,
  amount: string,
  category: string,
  typeOfAttack: string
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

    const result = await mintStandardNFT(
      wallet,
      connection,
      pubkey,
      nftName,
      nftUri,
      year.toString(),
      amount,
      category,
      typeOfAttack
    );

    return result;
  } catch (err) {
    console.error("Error minting NFT:", err);
    throw err;
  }
};
