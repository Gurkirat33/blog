"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CreatePost from "@/components/dashboard/CreatePost";
import UserPosts from "@/components/dashboard/UserPosts";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-700">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-[80vh] max-w-84rem mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2">
          Welcome, {session.user.name || session.user.email}
        </h1>
        <p className="text-slate-600">
          Manage your blog content and account settings
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8 border-b border-slate-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab("profile")}
            data-tab="profile"
            className={`pb-4 px-1 font-medium ${
              activeTab === "profile"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            data-tab="posts"
            className={`pb-4 px-1 font-medium ${
              activeTab === "posts"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            My Posts
          </button>
          <button
            onClick={() => setActiveTab("create")}
            data-tab="create"
            className={`pb-4 px-1 font-medium ${
              activeTab === "create"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Create Post
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "profile" && (
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
            <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
            <div className="space-y-3 mb-6">
              <div>
                <p className="text-sm text-slate-500">Email</p>
                <p className="font-medium">{session.user.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Name</p>
                <p className="font-medium">{session.user.name || "Not set"}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "posts" && <UserPosts userId={session.user.id} />}

        {activeTab === "create" && <CreatePost userId={session.user.id} />}
      </div>
    </div>
  );
}
