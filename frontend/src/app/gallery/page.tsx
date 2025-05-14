"use client";

import React, { useState } from "react";
import { fetchWalletNFTs } from "@/lib/blockchain/publicReadTest";

interface NFT {
  name: string;
  symbol: string;
  uri: string;
  json: any;
  image: string;
}

function Gallery() {
  const [nfts, setNfts] = useState<NFT[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAssets = async (address: string) => {
    setLoading(true);
    try {
      const assets = await fetchWalletNFTs(address);
      setNfts(assets);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">NFT Gallery</h1>

      <div className="mb-6">
        <label className="block mb-2">Wallet Address:</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          />
          <button
            onClick={() => fetchAssets(walletAddress)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Loading..." : "Fetch NFTs"}
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading NFTs...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <div key={index} className="border rounded p-4">
                <h2 className="font-bold">
                  {nft.name} - {nft.symbol}
                </h2>
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-40 object-cover rounded"
                />
                <pre className="mt-2 text-xs overflow-auto max-h-40">
                  {JSON.stringify(nft.json, null, 2)}
                </pre>
              </div>
            ))
          ) : (
            <div>No NFTs found for this wallet</div>
          )}
        </div>
      )}
    </div>
  );
}

export default Gallery;
