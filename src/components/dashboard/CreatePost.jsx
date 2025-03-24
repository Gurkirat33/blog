"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
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

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);
  const router = useRouter();

  const generateSlug = (text) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
  };

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    setSlug(generateSlug(newTitle));
  };

  const handleSlugChange = (e) => {
    setSlug(generateSlug(e.target.value));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setTitle("");
    setSlug("");
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (editorRef.current) {
      editorRef.current.setContent("");
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
        // If we have an image preview (base64), use it directly
        ...(imagePreview && { featuredImage: imagePreview }),
      };

      console.log("Submitting post:", postData);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error creating post");
      }

      setSuccess("Post created successfully!");
      resetForm();

      // After a short delay, redirect to the posts tab
      setTimeout(() => {
        router.push(`/dashboard?tab=posts`);
        router.refresh();
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setSuccess(""); // Ensure success message is cleared when there's an error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h2 className="text-xl font-semibold mb-6">Create New Post</h2>

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
                  src={imagePreview}
                  alt="Featured image preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setImagePreview(null);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
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
          <Editor
            apiKey="yqt6hs2mp9adp5m9nm2e6xprqfxr6y856jed3orx1qfamny6"
            onInit={(evt, editor) => (editorRef.current = editor)}
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
        </div>

        <div className="pt-4">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white w-full py-2"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish Post"}
          </Button>
        </div>
      </form>
    </div>
  );
}
