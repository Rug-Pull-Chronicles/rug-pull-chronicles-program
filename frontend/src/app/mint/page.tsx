"use client";

import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import { useSearchParams } from "next/navigation";

import scamsData from "@/lib/scams.json";
import { mintNft } from "@/lib/blockchain/mintNFT";
import { generateImage } from "@/lib/generateImage";

const STANDARD_COLLECTION = process.env.NEXT_PUBLIC_STANDARD_COLLECTION;

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
      const result = await mintNft(
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
    <div className="min-h-screen flex items-center justify-center bg-custom-beige/50 flex flex-col px-16">
      <div className="mb-6 rounded-lg p-4 bg-white shadow border border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-bold text-gray-900">{headline}</h3>
          <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded font-semibold">
            {amount_usd} LOST
          </span>
        </div>

        <p className="text-gray-700 mb-4">{description}</p>

        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="bg-gray-100 p-2 rounded">
            <span className="text-gray-500">Category:</span>
            <span className="text-gray-900 ml-1 font-medium">{category}</span>
          </div>
          <div className="bg-gray-100 p-2 rounded">
            <span className="text-gray-500">Attack Type:</span>
            <span className="text-gray-900 ml-1 font-medium">
              {type_of_attack}
            </span>
          </div>
          <div className="bg-gray-100 p-2 rounded">
            <span className="text-gray-500">Year:</span>
            <span className="text-gray-900 ml-1 font-medium">{year}</span>
          </div>
          <div className="bg-gray-100 p-2 rounded">
            <span className="text-gray-500">Date:</span>
            <span className="text-gray-900 ml-1 font-medium">
              {randomDate()}
            </span>
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-4">
          <div className="flex items-center">
            <div className="w-6 h-6 bg-red-400 rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-xs font-bold">R</span>
            </div>
            <h4 className="text-gray-900 text-sm font-bold">REKT News</h4>
          </div>
          <p className="text-gray-600 text-xs mt-2">
            &quot;Another day, another rug pull. The {category} space has been
            hit with yet another {type_of_attack.toLowerCase()} as {headline}
            developers vanish with investor funds...&quot;
          </p>
          <a
            href={rektNewsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-700 hover:text-purple-900 text-xs mt-2 inline-block"
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
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : loading
              ? "bg-purple-200 text-purple-900 cursor-wait"
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
        <div className="mt-4 p-3 bg-red-100 border border-red-200 rounded-md text-red-700">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mt-4 p-4 bg-green-100 border border-green-200 rounded-md text-green-800">
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
                  className="text-green-700 hover:text-green-900 underline text-xs"
                >
                  View NFT on Explorer
                </a>
                <a
                  href={`https://explorer.solana.com/tx/${result.signature}?cluster=devnet`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:text-green-900 underline text-xs"
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
