"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import Link from "next/link";
import Image from "next/image";

// Dynamically import TinyMCE to avoid SSR issues
const Editor = dynamic(
  () => import("@tinymce/tinymce-react").then((mod) => mod.Editor),
  {
    ssr: false,
    loading: () => (
      <p className="text-center p-4 border rounded-md bg-gray-50">
        Loading editor...
      </p>
    ),
  }
);

export default function EditPost({ params }) {
  const postId = params.postId;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [post, setPost] = useState(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [currentImage, setCurrentImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  // Check authentication and fetch post data
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
      return;
    }

    if (status === "authenticated" && postId) {
      fetchPost();
    }
  }, [status, postId, router]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${postId}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Post not found");
        }
        throw new Error("Failed to fetch post");
      }

      const data = await response.json();

      // Check if the current user is the author
      if (data.author.id !== session.user.id) {
        router.push("/dashboard");
        return;
      }

      // Set form values
      setPost(data);
      setTitle(data.title);
      setSlug(data.slug);
      if (data.featuredImage) {
        setCurrentImage(data.featuredImage);
        setImagePreview(data.featuredImage);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      setError(error.message || "Failed to load the post");
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    // Only auto-generate slug if it hasn't been manually edited
    if (slug === post.slug) {
      setSlug(generateSlug(newTitle));
    }
  };

  const handleSlugChange = (e) => {
    setSlug(generateSlug(e.target.value));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setCurrentImage(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setCurrentImage(null);
    setNewImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setError("Title is required!");
      setSuccess("");
      return;
    }

    if (!slug) {
      setError("Slug is required!");
      setSuccess("");
      return;
    }

    if (!editorRef.current) {
      setError("Content is required!");
      setSuccess("");
      return;
    }

    const content = editorRef.current.getContent();

    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      // Prepare data for the API
      const postData = {
        title,
        slug,
        content,
        // If we have a new image (imagePreview has changed), use it directly
        ...(imagePreview && imagePreview !== post.featuredImage
          ? { featuredImage: imagePreview }
          : {}),
      };

      const response = await fetch(`/api/posts/${post.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error updating post");
      }

      setSuccess("Post updated successfully!");
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (error && !post) {
    return (
      <div className="min-h-[80vh] max-w-84rem mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error}</p>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] max-w-84rem mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Post</h1>
        <Link href="/dashboard?tab=posts">
          <Button variant="outline">Cancel</Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-600 rounded-md text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Post Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={handleTitleChange}
              placeholder="Enter post title"
              className="w-full"
              required
            />
          </div>

          <div>
            <label
              htmlFor="slug"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              URL Slug
            </label>
            <Input
              id="slug"
              value={slug}
              onChange={handleSlugChange}
              placeholder="post-url-slug"
              className="w-full"
              required
            />
            <p className="mt-1 text-sm text-slate-500">
              This will be the URL of your post: yourblog.com/blog/{slug}
            </p>
          </div>

          <div>
            <label
              htmlFor="featured-image"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Featured Image
            </label>
            <div className="mt-1 flex flex-col space-y-4">
              <input
                type="file"
                id="featured-image"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100"
              />

              {imagePreview && (
                <div className="relative w-full h-48 mt-2 border rounded-md overflow-hidden">
                  <Image
                    src={
                      currentImage && !newImage ? currentImage : imagePreview
                    }
                    alt="Featured image preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="content"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Content
            </label>
            {post && (
              <Editor
                apiKey="yqt6hs2mp9adp5m9nm2e6xprqfxr6y856jed3orx1qfamny6"
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue={post.content}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    "advlist",
                    "autolink",
                    "lists",
                    "link",
                    "image",
                    "charmap",
                    "preview",
                    "anchor",
                    "searchreplace",
                    "visualblocks",
                    "code",
                    "fullscreen",
                    "insertdatetime",
                    "media",
                    "table",
                    "code",
                    "help",
                    "wordcount",
                  ],
                  toolbar:
                    "undo redo | blocks | " +
                    "bold italic forecolor | alignleft aligncenter " +
                    "alignright alignjustify | bullist numlist outdent indent | " +
                    "removeformat | help",
                  content_style:
                    "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
                }}
              />
            )}
          </div>

          <div className="pt-4 flex space-x-4">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white flex-grow"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
            <Link href={`/blog/${slug}`} passHref>
              <Button
                type="button"
                variant="outline"
                className="text-slate-700 flex-shrink-0"
              >
                Preview
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
