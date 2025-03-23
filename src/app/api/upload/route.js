import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
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

    // Convert the file to a Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get the file extension
    const originalFilename = file.name;
    const fileExtension = originalFilename.split(".").pop().toLowerCase();

    // Only allow image file types
    const allowedTypes = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!allowedTypes.includes(fileExtension)) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Create a unique filename
    const filename = `${uuidv4()}.${fileExtension}`;

    // Create the uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), "public", "uploads");
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      console.error("Failed to create upload directory:", error);
    }

    // Write the file to the uploads directory
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Return the path to the uploaded file (relative to the public directory)
    const imagePath = `/uploads/${filename}`;

    return NextResponse.json({
      success: true,
      imagePath,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 }
    );
  }
}
