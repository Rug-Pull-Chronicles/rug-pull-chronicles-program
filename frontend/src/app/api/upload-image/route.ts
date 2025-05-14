import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as Blob;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert blob to buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create unique filename
    const fileName = `nft-${Date.now()}.webp`;

    // Ensure the directory exists
    const uploadDir = join(process.cwd(), "public", "nft-images");
    await writeFile(join(uploadDir, fileName), buffer);

    // Return the public URL
    return NextResponse.json({
      url: `/nft-images/${fileName}`,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Error uploading image" },
      { status: 500 }
    );
  }
}
