import Arweave from "arweave";
import wallet from "../../../ar-wallet.json";

/**
 * Uploads NFT metadata and image to Arweave using a central wallet
 * @param metadata - The NFT metadata object (without the image field)
 * @param image - The image buffer to upload
 * @param wallet - The Arweave JWK wallet
 * @param imageType - The MIME type of the image (default: 'image/png')
 * @returns Promise with both the metadata URI and image URI
 */
async function uploadMetadata(
  metadata: Record<string, any>,
  image: Buffer,
  imageType: string = "image/png"
): Promise<{ metadataUri: string; imageUri: string }> {
  // Initialize Arweave
  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });

  try {
    // 1. Upload the image first
    const imageTransaction = await arweave.createTransaction(
      {
        data: image,
      },
      wallet
    );

    // Add image tags
    imageTransaction.addTag("Content-Type", imageType);
    imageTransaction.addTag("App-Name", "Solana-NFT");
    imageTransaction.addTag("Type", "image");

    // Sign the image transaction
    await arweave.transactions.sign(imageTransaction, wallet);

    // Submit the image transaction
    const imageUploadResponse = await arweave.transactions.post(
      imageTransaction
    );

    if (
      imageUploadResponse.status !== 200 &&
      imageUploadResponse.status !== 202
    ) {
      throw new Error(
        `Failed to upload image: ${imageUploadResponse.statusText}`
      );
    }

    const imageId = imageTransaction.id;
    const imageUri = `https://arweave.net/${imageId}`;

    // 2. Create the complete metadata with the image URI
    const completeMetadata = {
      ...metadata,
      image: imageUri,
    };

    // 3. Upload the metadata
    const metadataTransaction = await arweave.createTransaction(
      {
        data: JSON.stringify(completeMetadata),
      },
      wallet
    );

    // Add metadata tags
    metadataTransaction.addTag("Content-Type", "application/json");
    metadataTransaction.addTag("App-Name", "Solana-NFT");
    metadataTransaction.addTag("Type", "metadata");

    // Sign the metadata transaction
    await arweave.transactions.sign(metadataTransaction, wallet);

    // Submit the metadata transaction
    const metadataUploadResponse = await arweave.transactions.post(
      metadataTransaction
    );

    if (
      metadataUploadResponse.status !== 200 &&
      metadataUploadResponse.status !== 202
    ) {
      throw new Error(
        `Failed to upload metadata: ${metadataUploadResponse.statusText}`
      );
    }

    const metadataId = metadataTransaction.id;
    const metadataUri = `https://arweave.net/${metadataId}`;

    // Return both URIs
    return {
      metadataUri,
      imageUri,
    };
  } catch (error) {
    console.error("Error uploading to Arweave:", error);
    throw error;
  }
}

/**
 * Utility function to check the status of a transaction
 * @param arweave - Arweave instance
 * @param txId - Transaction ID to check
 * @returns Promise resolving to the transaction status
 */
async function checkTransactionStatus(
  arweave: Arweave,
  txId: string
): Promise<string> {
  try {
    const status = await arweave.transactions.getStatus(txId);

    if (status.status === 200 || status.status === 202) {
      const transaction = await arweave.transactions.get(txId);
      return transaction ? "Confirmed" : "Pending";
    } else {
      return "Failed";
    }
  } catch (error) {
    console.error(`Error checking transaction ${txId}:`, error);
    return "Unknown";
  }
}

/**
 * Waits for a transaction to be confirmed
 * @param arweave - Arweave instance
 * @param txId - Transaction ID to wait for
 * @param retries - Number of retry attempts
 * @param delay - Delay between retries in milliseconds
 * @returns Promise resolving when transaction is confirmed
 */
async function waitForConfirmation(
  arweave: Arweave,
  txId: string,
  retries: number = 10,
  delay: number = 10000
): Promise<boolean> {
  for (let i = 0; i < retries; i++) {
    const status = await checkTransactionStatus(arweave, txId);

    if (status === "Confirmed") {
      return true;
    }

    console.log(`Transaction ${txId} is still pending. Waiting...`);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return false;
}

export { uploadMetadata, checkTransactionStatus, waitForConfirmation };
