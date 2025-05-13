"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { SelectScam } from "./_components/SelectScam";
import ShowScammedNft from "./_components/ShowScammedNft";
import { uploadMetadataToIPFS } from "@/lib/storage/uploadData";

export default function Home() {
  const { publicKey } = useWallet();

  const handleUploadMetadata = async () => {
    const metadata = await uploadMetadataToIPFS({
      name: "test",
      description: "test",
    });
    console.log(metadata);
  };

  return (
    <main className="flex flex-col p-6 bg-custom-beige/50 h-[calc(100vh-70px)]">
      <div>
        <button onClick={handleUploadMetadata}>Upload Metadata</button>
      </div>
      <div className="mt-8 flex-grow flex justify-center items-center">
        {!publicKey ? <ShowScammedNft /> : <SelectScam />}
      </div>
    </main>
  );
}
