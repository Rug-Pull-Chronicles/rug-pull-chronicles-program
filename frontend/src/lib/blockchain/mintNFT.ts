import { PublicKey } from "@solana/web3.js";
import { mintStandardCollectionNFT } from "../program";

export const mintNft = async (
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

    const result = await mintStandardCollectionNFT(
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
