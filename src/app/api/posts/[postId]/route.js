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

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to update a post" },
        { status: 401 }
      );
    }

    const { postId } = params;

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

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only update your own posts" },
        { status: 403 }
      );
    }

    const { title, content, slug, featuredImage } = await request.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }

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

    revalidatePath("/blog");
    revalidatePath("/blog/[slug]", "page");

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

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "You must be signed in to delete a post" },
        { status: 401 }
      );
    }

    const { postId } = params;

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

    if (existingPost.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "You can only delete your own posts" },
        { status: 403 }
      );
    }

    await prisma.post.delete({
      where: {
        id: postId,
      },
    });

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
