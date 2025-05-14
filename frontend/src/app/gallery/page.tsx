"use client";

import React, { useEffect, useState } from "react";

interface NFTAttribute {
  trait_type: string;
  value: string;
  count?: number;
  percentage?: string;
  price?: number;
  currency?: string;
}

interface NFTMetadata {
  attributes: NFTAttribute[];
}

function Gallery() {
  const [metadata, setMetadata] = useState<NFTMetadata | null>(null);

  useEffect(() => {
    // Fetch metadata for NFT #1 from the public folder
    fetch("/metadata/nft1.json")
      .then((res) => res.json())
      .then((data) => setMetadata(data));
  }, []);

  return (
    <div className="min-h-[calc(100vh-83px)] flex items-center justify-center bg-custom-beige/50 flex flex-col px-16">
      <img
        src="/images/nft-rugged-2.png"
        alt="NFT Rugged #2"
        className="w-full max-w-md h-auto shadow-lg mb-8 mt-6"
      />
      {metadata ? (
        <div className="w-full max-w-xl shadow p-6 mb-6 bg-secondary-text/40">
          <ul className="space-y-2">
            {metadata.attributes.map((attr, idx) => (
              <li key={idx} className="flex justify-between border-b pb-2">
                <span className="font-medium space-mono-regular">
                  {attr.trait_type}:
                </span>
                <span>
                  {attr.value}
                  {attr.percentage && (
                    <span className="ml-2 text-gray-500 text-xs">
                      ({attr.percentage})
                    </span>
                  )}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>Loading metadata...</div>
      )}
    </div>
  );
}

export default Gallery;
