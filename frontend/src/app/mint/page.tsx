"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { useState } from "react";
import { PublicKey } from "@solana/web3.js";
import { generateImage } from "@/lib/generateImage";
import { mintStandardNFT } from "@/lib/program";
import { useSearchParams } from "next/navigation";
import scamsData from "@/lib/scams.json";

const STANDARD_COLLECTION = process.env.NEXT_PUBLIC_STANDARD_COLLECTION;
const SCAMMED_COLLECTION = process.env.NEXT_PUBLIC_SCAMMED_COLLECTION;

function MintPage() {
  const wallet = useWallet();
  const { connection } = useConnection();

  const searchParams = useSearchParams();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collectionAddress, setCollectionAddress] =
    useState(STANDARD_COLLECTION);
  const [result, setResult] = useState<{
    signature: string;
    nftAddress: string;
  } | null>(null);

  const scamId = searchParams.get("id");
  const scam = scamsData.scams.find((s: any) => s.id === scamId);

  if (!scam) {
    return (
      <div>Scam not found. Please select a valid scam from the gallery.</div>
    );
  }

  const { year, amount_usd, category, type_of_attack, headline, description } =
    scam;

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
        headline,
        type_of_attack,
        category,
        amount_usd,
        year: year.toString(),
      });

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
        connection,
        pubkey,
        headline,
        "https://arweave.net/123",
        year.toString(),
        amount_usd,
        category,
        type_of_attack
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

  // Calculate a random date for the rekt news article based on year
  const randomDate = () => {
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    return `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
  };

  // Generate fake rekt.news article URL
  const rektNewsUrl = "https://rekt.news/dystopian-diaries";

  return (
    <div className="bg-black/90 rounded-lg p-6 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">
          Mint Rug Pull Chronicles NFT
        </h2>
      </div>

      <div className="mb-6 border border-purple-700 rounded-lg p-4 bg-gray-900">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-white">{headline}</h3>
          <span className="bg-red-700 text-white text-xs px-2 py-1 rounded">
            {amount_usd} LOST
          </span>
        </div>

        <p className="text-gray-300 mb-4">{description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-gray-400">Category:</span>
            <span className="text-white ml-1 font-medium">{category}</span>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-gray-400">Attack Type:</span>
            <span className="text-white ml-1 font-medium">
              {type_of_attack}
            </span>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-gray-400">Year:</span>
            <span className="text-white ml-1 font-medium">{year}</span>
          </div>
          <div className="bg-gray-800 p-2 rounded">
            <span className="text-gray-400">Date:</span>
            <span className="text-white ml-1 font-medium">{randomDate()}</span>
          </div>
        </div>

        <div className="bg-black p-3 rounded border border-gray-700 mb-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <h4 className="text-white text-sm font-bold">REKT News</h4>
          </div>
          <p className="text-gray-400 text-xs mt-2">
            &quot;Another day, another rug pull. The {category} space has been
            hit with yet another {type_of_attack.toLowerCase()} as {headline}
            developers vanish with investor funds...&quot;
          </p>
          <a
            href={rektNewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 text-xs mt-2 inline-block"
          >
            Read the full rekt.news article →
          </a>
        </div>
      </div>

      <div className="space-y-4">
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

export default MintPage;
