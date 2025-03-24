import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function GET(request, { params }) {
  try {
    const { postId } = params;

    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Error fetching post:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching the post" },
      { status: 500 }
    );
  }
}

// Update a post
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to update a post" },
        { status: 401 }
      );
    }

    const { postId } = params;

    // Get the post to check ownership
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
        slug: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the user is the author of the post
    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only update your own posts" },
        { status: 403 }
      );
    }

    // Get updated data
    const { title, content, slug, featuredImage } = await request.json();

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

    // Check if slug is already used by another post
    if (slug && slug !== existingPost.slug) {
      const slugPost = await prisma.post.findUnique({
        where: { slug },
      });

      if (slugPost && slugPost.id !== postId) {
        return NextResponse.json(
          {
            error:
              "This URL slug is already in use. Please choose another one.",
          },
          { status: 400 }
        );
      }
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        content,
        ...(slug && { slug }),
        ...(featuredImage !== undefined && { featuredImage }),
      },
    });

    // Revalidate paths
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");

    // Revalidate both the old and new slug paths if slug changed
    if (slug && slug !== existingPost.slug) {
      revalidatePath(`/blog/${existingPost.slug}`);
      revalidatePath(`/blog/${slug}`);
    } else {
      revalidatePath(`/blog/${existingPost.slug}`);
    }

    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error("Error updating post:", error);
    return NextResponse.json(
      { error: "An error occurred while updating the post" },
      { status: 500 }
    );
  }
}

// Delete a post
export async function DELETE(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to delete a post" },
        { status: 401 }
      );
    }

    const { postId } = params;

    // Get the post to check ownership and get the slug
    const existingPost = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      select: {
        authorId: true,
        slug: true,
      },
    });

    if (!existingPost) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // Check if the user is the author of the post
    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    // Delete the post
    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    // Revalidate paths after deletion
    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");
    revalidatePath(`/blog/${existingPost.slug}`);

    return NextResponse.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    return NextResponse.json(
      { error: "An error occurred while deleting the post" },
      { status: 500 }
    );
  }
}
