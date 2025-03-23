"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export default function UserPosts() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!session?.user?.id) return;

        const response = await fetch(`/api/users/${session.user.id}/posts`);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch posts");
        }

        const data = await response.json();
        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setError(error.message || "Could not load your posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [session]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Posts</h2>
        </div>
        <div className="p-4 text-center text-slate-500">Loading posts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Your Posts</h2>
        </div>
        <div className="p-4 text-center text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Your Posts</h2>
      </div>

      {!posts || posts.length === 0 ? (
        <div className="p-4 text-center text-slate-500">
          You haven't created any posts yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-slate-700 w-16">
                  Image
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">
                  Title
                </th>
                <th className="text-left py-3 px-4 font-medium text-slate-700">
                  Date
                </th>
                <th className="text-right py-3 px-4 font-medium text-slate-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {posts.map((post) => (
                <tr key={post.id}>
                  <td className="py-3 px-4">
                    {post.featuredImage ? (
                      <div className="relative w-12 h-12 rounded-md overflow-hidden border border-slate-200">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-md bg-slate-100 flex items-center justify-center text-slate-400">
                        No img
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{post.title}</td>
                  <td className="py-3 px-4 text-slate-500">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        View
                      </Link>
                      <Link
                        href={`/dashboard/edit/${post.id}`}
                        className="text-slate-600 hover:text-slate-800 text-sm"
                      >
                        Edit
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
