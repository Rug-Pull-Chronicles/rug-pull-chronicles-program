"use client";

import React, { useState } from "react";
import Image from "next/image";

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

function ShowScammedNft() {
  const [selectedNft, setSelectedNft] = useState<number | null>(null);

  const handleSelectNft = (id: number) => {
    setSelectedNft(id);
  };

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <h2 className="text-xl font-bold mb-6 text-center">
        Select one of the lost NFTs
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {placeholderNfts.map((nft) => (
          <div
            key={nft.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              selectedNft === nft.id
                ? "border-blue-500 shadow-lg bg-blue-50 dark:bg-blue-900/20"
                : "hover:shadow-md"
            }`}
            onClick={() => handleSelectNft(nft.id)}
          >
            <div className="aspect-square relative mb-3 overflow-hidden rounded-md">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <img src={nft.image} alt={nft.name} className="object-cover" />
                <span className="text-gray-500">NFT {nft.id}</span>
              </div>
            </div>

            <h3 className="font-medium">{nft.name}</h3>

            {selectedNft === nft.id && (
              <div className="mt-2 text-blue-600 text-sm font-medium">
                Selected
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedNft && (
        <div className="mt-6 text-center">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Continue with selected NFT
          </button>
        </div>
      )}
    </div>
  );
}

export default ShowScammedNft;
