import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Get the file type
    const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop().toLowerCase();
    const mimeType = file.type;

    // Only allow image file types
    const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Convert the file to a Buffer then to Base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64String = buffer.toString("base64");

    // Create a data URL
    const dataUrl = `data:${mimeType};base64,${base64String}`;

    return NextResponse.json({
      success: true,
      imagePath: dataUrl,
    });
  } catch (error) {
    console.error("Error processing image:", error);
    return NextResponse.json(
      { error: "Failed to process image" },
      { status: 500 }
    );
  }
}
