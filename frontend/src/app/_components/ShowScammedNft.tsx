"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCustomConnection } from "@/providers/ConnectionProvider";
import { PublicKey } from "@solana/web3.js";
import { mintScammedNft } from "@/lib/blockchain/mintScammedNft";
import { MintSuccessMessage } from "@/app/_components/MintSuccessMessage";

const placeholderNfts = [
  {
    id: 1,
    name: "NFT #1",
    image: "https://madlads.s3.us-west-2.amazonaws.com/images/8159.png",
  },
  {
    id: 2,
    name: "NFT #2",
    image: "https://madlads.s3.us-west-2.amazonaws.com/images/5886.png",
  },
  {
    id: 3,
    name: "NFT #3",
    image: "https://madlads.s3.us-west-2.amazonaws.com/images/4428.png",
  },
];

const SCAMMED_COLLECTION_ADDRESS = process.env.NEXT_PUBLIC_SCAMMED_COLLECTION;

function ShowScammedNft() {
  const [selectedNft, setSelectedNft] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txSuccess, setTxSuccess] = useState<boolean>(false);
  const [result, setResult] = useState<{
    signature: string;
    nftAddress: string;
  } | null>(null);

  const wallet = useWallet();
  const { connectionToUse } = useCustomConnection();

  const handleSelectNft = (id: number) => {
    setSelectedNft(id);
    setError(null);
    setTxSuccess(false);
  };

  const handleMintNft = async () => {
    if (!selectedNft) return;

    const nft = placeholderNfts.find((nft) => nft.id === selectedNft);
    if (!nft) return;

    const collectionAddress = new PublicKey(
      SCAMMED_COLLECTION_ADDRESS as string
    );

    setIsLoading(true);
    setError(null);

    try {
      const result = await mintScammedNft(
        wallet,
        connectionToUse,
        collectionAddress,
        nft.name,
        `${nft.name} Rugged` // this should be uri
      );

      console.log("Minting result:", result);
      setTxSuccess(true);
      setResult(result);
    } catch (err: any) {
      console.error("Error minting NFT:", err);
      setError(err.message || "Failed to mint NFT");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h2 className="text-xl font-bold mb-6 text-center">
        It looks like you lost the following NFTs.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {placeholderNfts.map((nft) => (
          <div
            key={nft.id}
            className={`border-2 p-4 cursor-pointer transition-all ${
              selectedNft === nft.id
                ? "border-tertiary-text shadow-lg bg-secondary-text"
                : "hover:shadow-md bg-secondary-text/50"
            }`}
            onClick={() => handleSelectNft(nft.id)}
          >
            <div className="aspect-square relative mb-3 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center">
                <Image
                  src={nft.image}
                  width={250}
                  height={250}
                  alt={nft.name}
                  className="object-cover"
                />
              </div>
            </div>

            <h3 className="font-medium">{nft.name}</h3>

            {selectedNft === nft.id && (
              <div className="mt-2 text-tertiary-text text-sm font-medium">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedNft && (
        <div className="mt-6 text-center">
          <button
            className={`px-4 py-2 bg-accent text-white ${
              isLoading ? "opacity-70 cursor-not-allowed" : "hover:bg-accent/80"
            }`}
            onClick={handleMintNft}
            disabled={isLoading}
          >
            {isLoading ? "Minting..." : "Continue with selected NFT"}
          </button>

          {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

          {txSuccess && <MintSuccessMessage result={result} />}
        </div>
      )}
    </div>
  );
}

export default ShowScammedNft;
