"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { Send, MessageCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDate } from "@/lib/utils";

const userPlaceholder =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80";

export default function CommentSection({ postId }) {
  const { data: session } = useSession();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [apiIssue, setApiIssue] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    if (!postId) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/posts/${postId}/comments`);

      if (response.status === 500) {
        // Likely a server-side issue with the comments API
        setApiIssue(true);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch comments");
      }

      const data = await response.json();
      setComments(data);
      setApiIssue(false);
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError(error.message);
      // Determine if there's a likely API implementation issue
      if (
        error.message.includes("undefined") ||
        error.message.includes("null")
      ) {
        setApiIssue(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();

    if (apiIssue) {
      setError("Comments are currently unavailable. Please try again later.");
      return;
    }

    if (!session) {
      setError("You must be signed in to comment");
      return;
    }

    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
        }),
      });

      if (response.status === 500) {
        setApiIssue(true);
        throw new Error("Comments service is temporarily unavailable");
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit comment");
      }

      await fetchComments();
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If there's an API issue, show a more friendly message
  if (apiIssue) {
    return (
      <div className="mt-12">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Comments
        </h2>

        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <AlertCircle className="h-12 w-12 text-amber-500" />
          </div>
          <h3 className="text-lg font-medium text-amber-800 mb-2">
            Comments are currently unavailable
          </h3>
          <p className="text-amber-700 mb-4">
            We're working on getting the comments feature up and running. Please
            check back later.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-amber-600 hover:bg-amber-700 text-white"
          >
            Refresh page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <MessageCircle className="h-5 w-5" />
        Comments {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Comment form */}
      <div className="mb-8">
        {session ? (
          <form onSubmit={handleSubmitComment}>
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full overflow-hidden relative flex-shrink-0">
                <Image
                  src={session.user.image || userPlaceholder}
                  alt={session.user.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <Textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="resize-none"
                  rows={3}
                />
                {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
                <div className="mt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isSubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Post Comment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-slate-50 rounded-lg p-6 text-center">
            <p className="text-slate-600 mb-4">
              You need to be signed in to comment on this post.
            </p>
            <Link href="/signin">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Sign In
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Comments list */}
      <div className="space-y-8">
        {isLoading ? (
          <div className="animate-pulse space-y-6">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex gap-4">
                <div className="h-10 w-10 bg-slate-200 rounded-full flex-shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-slate-200 rounded"></div>
                  <div className="h-3 w-1/6 bg-slate-200 rounded"></div>
                  <div className="h-4 bg-slate-200 rounded"></div>
                  <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="h-10 w-10 rounded-full overflow-hidden relative flex-shrink-0">
                <Image
                  src={comment.author?.image || userPlaceholder}
                  alt={comment.author?.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium">
                    {comment.author?.name || "Anonymous"}
                  </span>
                  <span className="text-xs text-slate-500">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-slate-700">{comment.content}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p>No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}
