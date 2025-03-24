import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to create a post" },
        { status: 401 }
      );
    }

    // Get post data
    const data = await request.json();
    const { title, content, slug, featuredImage } = data;

    // Validate required fields
    if (!title || !content || !slug) {
      return NextResponse.json(
        { error: "Title, content, and slug are required" },
        { status: 400 }
      );
    }

    // Check if slug is already used
    const existingPost = await prisma.post.findUnique({
      where: {
        slug,
      },
    });

    if (existingPost) {
      return NextResponse.json(
        {
          error: "This URL slug is already in use. Please choose another one.",
        },
        { status: 400 }
      );
    }

    // Create the post
    const post = await prisma.post.create({
      data: {
        title,
        content,
        slug,
        featuredImage: featuredImage || null,
        author: {
          connect: {
            id: session.user.id,
          },
        },
      },
    });

    // Revalidate paths
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error creating post:", error);
    return NextResponse.json(
      { error: "An error occurred while creating the post" },
      { status: 500 }
    );
  }
}

// Get all posts (for public consumption)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const limit = limitParam ? parseInt(limitParam, 10) : undefined;

    const posts = await prisma.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      ...(limit && { take: limit }),
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return NextResponse.json(
      { error: "Error fetching posts" },
      { status: 500 }
    );
  }
}
