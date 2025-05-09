"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { uploadMetadata } from "@/lib/blockchain/uploadMetadata";
import { generateImage } from "@/lib/generateImage";
import { mintStandardNFT } from "@/lib/program";

const STANDARD_COLLECTION = process.env.NEXT_PUBLIC_STANDARD_COLLECTION;
const SCAMMED_COLLECTION = process.env.NEXT_PUBLIC_SCAMMED_COLLECTION;

interface MintNFTProps {
  year: number;
  amount: string;
  category: string;
  typeOfAttack: string;
  title: string;
  description: string;
}

export default function MintNFT({
  year,
  amount,
  category,
  typeOfAttack,
  title,
  description,
}: MintNFTProps) {
  const wallet = useWallet();
  const connectionToUse = useConnection();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    signature: string;
    nftAddress: string;
  } | null>(null);

  const [collectionAddress, setCollectionAddress] =
    useState(STANDARD_COLLECTION);

  const handleMint = async () => {
    if (!wallet.publicKey) {
      setError("Please connect your wallet first");
      return;
    }

    if (!collectionAddress) {
      setError("Please enter a collection address");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);
      setResult(null);

      // Parse collection address
      let pubkey: PublicKey;
      try {
        pubkey = new PublicKey(collectionAddress);
      } catch (e) {
        throw new Error("Invalid collection address");
      }

      const imageFile = await generateImage({
        headline: title,
        type_of_attack: typeOfAttack,
        category,
        amount_usd: amount,
        year: year.toString(),
      });

      console.log("imageFile", imageFile);

      // const nftUri = await uploadMetadata(
      //   {
      //     name: title,
      //     description: description,
      //   },
      //   imageFile
      // );

      // Use the connection from our provider
      const result = await mintStandardNFT(
        wallet,
        connectionToUse.connection,
        pubkey,
        title,
        "https://arweave.net/123",
        year.toString(),
        amount,
        category,
        typeOfAttack
      );

      setSuccess(true);
      setResult(result);
    } catch (err) {
      console.error("Error minting NFT:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  // Usage example
  async function example() {
    // Load your wallet JSON file
    const metadata = {
      name: "NFT test",
      description: "This is my NFT with permanent storage on Arweave",
      attributes: [{ trait_type: "Collection", value: "Demo" }],
    };

    const minimalPngBuffer = Buffer.from([
      0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d,
      0x49, 0x48, 0x44, 0x52, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x01,
      0x08, 0x06, 0x00, 0x00, 0x00, 0x1f, 0x15, 0xc4, 0x89, 0x00, 0x00, 0x00,
      0x0a, 0x49, 0x44, 0x41, 0x54, 0x78, 0x9c, 0x63, 0x00, 0x01, 0x00, 0x00,
      0x05, 0x00, 0x01, 0x0d, 0x0a, 0x2d, 0xb4, 0x00, 0x00, 0x00, 0x00, 0x49,
      0x45, 0x4e, 0x44, 0xae, 0x42, 0x60, 0x82,
    ]);

    try {
      const { metadataUri, imageUri } = await uploadMetadata(
        metadata,
        minimalPngBuffer,
        "image/png"
      );

      console.log("Image uploaded to:", imageUri);
      console.log("Metadata uploaded to:", metadataUri);

      // Return the metadata URI to your Solana program
      return metadataUri;
    } catch (error) {
      console.error("Upload failed:", error);
      throw error;
    }
  }

  return (
    <div className="bg-black/90 rounded-lg p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Mint Rug Pull Chronicles NFT
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <button onClick={example}>Example</button>
          <label className="block text-sm font-medium text-gray-300 mb-1">
            Collection Address
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={collectionAddress}
              onChange={(e) => setCollectionAddress(e.target.value)}
              placeholder="Enter collection address (required)"
              className="flex-1 px-3 py-2 bg-gray-800 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={() => setCollectionAddress(STANDARD_COLLECTION)}
              className="px-2 py-1 bg-purple-700 text-white text-xs rounded hover:bg-purple-600"
              title="Use the Standard Collection from tests"
            >
              Standard
            </button>
            <button
              onClick={() => setCollectionAddress(SCAMMED_COLLECTION)}
              className="px-2 py-1 bg-purple-700 text-white text-xs rounded hover:bg-purple-600"
              title="Use the Scammed Collection from tests"
            >
              Scammed
            </button>
          </div>
        </div>

        <button
          onClick={handleMint}
          disabled={loading || !wallet.publicKey || !collectionAddress}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            !wallet.publicKey || !collectionAddress
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : loading
              ? "bg-purple-700 text-white cursor-wait"
              : "bg-purple-600 hover:bg-purple-700 text-white"
          }`}
        >
          {loading
            ? "Minting..."
            : !wallet.publicKey
            ? "Connect Wallet to Mint"
            : "Mint NFT"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-md text-red-200">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-900/50 border border-green-700 rounded-md text-green-200">
          <h3 className="font-medium text-lg mb-2">NFT Minted Successfully!</h3>
          {result ? (
            <div className="space-y-2 text-sm">
              <p className="break-all">
                <span className="font-semibold">NFT Address:</span>{" "}
                {result.nftAddress}
              </p>
              <p className="break-all">
                <span className="font-semibold">Transaction:</span>{" "}
                {result.signature}
              </p>
              <div className="flex justify-between mt-2">
                <a
                  href={`https://explorer.solana.com/address/${result.nftAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:text-green-200 underline text-xs"
                >
                  View NFT on Explorer
                </a>
                <a
                  href={`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-300 hover:text-green-200 underline text-xs"
                >
                  View Transaction
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm">
              NFT minted successfully, but result details are not available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
