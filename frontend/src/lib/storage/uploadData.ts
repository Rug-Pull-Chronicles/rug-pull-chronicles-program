import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import { CID } from "multiformats/cid";

interface MetadataInput {
  name: string;
  description: string;
}

export const uploadMetadataToIPFS = async (
  metadata: object
): Promise<string> => {
  const helia = await createHelia();
  const fs = unixfs(helia);

  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });
  const metadataBuffer = await metadataBlob.arrayBuffer();
  const metadataCid = await fs.addBytes(new Uint8Array(metadataBuffer));

  await helia.stop();

  return `https://ipfs.io/ipfs/${metadataCid.toString()}`;
};

export const uploadToIPFS = async (
  image: File,
  meta: MetadataInput
): Promise<string> => {
  const helia = await createHelia();
  const fs = unixfs(helia);

  // Convert image to Buffer
  const imageBuffer = await image.arrayBuffer();
  const imageCid = await fs.addBytes(new Uint8Array(imageBuffer));

  // Create metadata with IPFS URI
  const metadata = {
    name: meta.name,
    description: meta.description,
    image: `ipfs://${imageCid.toString()}`,
  };

  const metadataBlob = new Blob([JSON.stringify(metadata)], {
    type: "application/json",
  });
  const metadataBuffer = await metadataBlob.arrayBuffer();
  const metadataCid = await fs.addBytes(new Uint8Array(metadataBuffer));

  await helia.stop();

  return `https://ipfs.io/ipfs/${metadataCid.toString()}`;
};
