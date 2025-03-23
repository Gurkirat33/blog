import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import CommentSection from "@/components/blog/CommentSection";
import ShareButton from "@/components/blog/ShareButton";
import prisma from "@/lib/prisma";

// Force static generation for this page
export const dynamic = "force-static";

// Revalidate this page every hour (3600 seconds)
export const revalidate = 3600;

const placeholderImage =
  "https://images.unsplash.com/photo-1583912086296-be5c8a898e18?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    select: {
      slug: true,
    },
  });

  return posts.map((post) => ({
    slug: post.slug,
  }));
}

// Get post data for a specific slug
async function getPost(slug) {
  const post = await prisma.post.findUnique({
    where: {
      slug: slug,
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

  return post;
}

// Default metadata
export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
  };
}

// Blog post page component
export default async function BlogPostPage({ params }) {
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link
          href="/blog"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to blogs
        </Link>
      </div>

      <article className="bg-white rounded-lg shadow-md overflow-hidden">
        {post.featuredImage && (
          <div className="w-full h-96 relative">
            <Image
              src={post.featuredImage || placeholderImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center mb-6">
            <div className="flex items-center">
              {post.author?.image ? (
                <Image
                  src={post.author.image}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full mr-3"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3 flex items-center justify-center">
                  <span className="text-gray-500 font-medium">
                    {post.author?.name?.charAt(0) || "U"}
                  </span>
                </div>
              )}
              <span className="text-gray-700 font-medium">
                {post.author?.name || "Unknown Author"}
              </span>
            </div>

            <div className="mx-4 text-gray-300">|</div>

            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{formatDate(post.createdAt)}</span>
            </div>

            <div className="mx-4 text-gray-300">|</div>

            <div className="flex items-center text-gray-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>
                {Math.ceil(post.content.split(" ").length / 200)} min read
              </span>
            </div>
          </div>

          <ShareButton url={`/blog/${post.slug}`} title={post.title} />

          <div
            className="prose prose-lg max-w-none mt-6"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>

      <div className="mt-8">
        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}
