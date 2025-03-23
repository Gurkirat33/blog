import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to view posts" },
        { status: 401 }
      );
    }

    const paramsId = await params;

    const userId = paramsId.userId;

    // Verify user is viewing their own posts or is an admin
    if (session.user.id !== userId) {
      return NextResponse.json(
        { error: "You can only view your own posts" },
        { status: 403 }
      );
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        slug: true,
        featuredImage: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/users/[userId]/posts error:", error);
    return NextResponse.json(
      { error: "Error fetching user posts" },
      { status: 500 }
    );
  }
}
