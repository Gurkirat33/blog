import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import SearchBar from "@/components/blog/SearchBar";
import prisma from "@/lib/prisma";

const placeholderImage =
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

// This enables ISR - Incremental Static Regeneration
export const revalidate = 3600; // Revalidate at most every hour

// Calculate read time based on content length
function getReadTime(content) {
  return Math.max(1, Math.ceil((content?.length || 0) / 1000)) || 3;
}

async function getBlogs() {
  const blogs = await prisma.post.findMany({
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
  });

  return blogs;
}

export default async function BlogPage() {
  const blogs = await getBlogs();

  return (
    <main className="min-h-screen">
      <div className="bg-gradient-to-r from-blue-900 to-indigo-800 text-white py-24">
        <div className="max-w-84rem mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl text-blue-100 mb-8">
              Explore insights, tutorials, and stories from our community
            </p>
          </div>
        </div>
      </div>

      {/* Search and filter section */}
      <div className="max-w-84rem mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-12">
          <SearchBar blogs={blogs} />
        </div>
      </div>

      {/* Blog listing */}
      <div className="max-w-84rem mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {blogs.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">
              No blogs found
            </h3>
            <p className="text-slate-500 mb-8">
              Check back soon for new content.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <article
                key={blog.id}
                className="flex flex-col h-full rounded-xl overflow-hidden border border-slate-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <Link
                  href={`/blog/${blog.slug}`}
                  className="block relative aspect-[16/10] w-full overflow-hidden"
                >
                  <Image
                    src={blog.featuredImage || placeholderImage}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </Link>
                <div className="p-6 flex-grow flex flex-col">
                  <Link href={`/blog/${blog.slug}`}>
                    <h2 className="text-xl font-bold mb-3 hover:text-blue-600 transition-colors">
                      {blog.title}
                    </h2>
                  </Link>
                  <p className="text-slate-600 mb-4 line-clamp-3">
                    {blog.content.substring(0, 150).replace(/<[^>]*>/g, "")}...
                  </p>
                  <div className="mt-auto flex justify-between items-center text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(blog.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {getReadTime(blog.content)} min read
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
