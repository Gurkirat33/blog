"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

const placeholderImage =
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

export default function SearchBar({ blogs }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    // Handle search when searchTerm changes
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filteredBlogs = blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredBlogs.slice(0, 5)); // Limit to top 5 results
  }, [searchTerm, blogs]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowResults(true);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };

  return (
    <div className="relative">
      <div className="flex">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Search articles..."
            className="pl-10 pr-4 py-6 rounded-full"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setShowResults(true)}
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search results dropdown */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 overflow-hidden">
          <div className="max-h-[400px] overflow-y-auto p-2">
            <div className="flex justify-between items-center p-2 border-b border-slate-100 mb-2">
              <p className="text-sm font-medium text-slate-700">
                {searchResults.length} results found
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowResults(false)}
                className="text-slate-500 hover:text-slate-700"
              >
                Close
              </Button>
            </div>
            <div className="space-y-2">
              {searchResults.map((blog) => (
                <Link
                  key={blog.id}
                  href={`/blog/${blog.slug}`}
                  className="flex gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                  onClick={() => setShowResults(false)}
                >
                  <div className="h-16 w-16 relative flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={blog.featuredImage || placeholderImage}
                      alt={blog.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow min-w-0">
                    <h4 className="font-medium text-slate-800 line-clamp-1">
                      {blog.title}
                    </h4>
                    <p className="text-sm text-slate-500 line-clamp-1 mt-1">
                      {blog.content.replace(/<[^>]*>/g, "").substring(0, 80)}...
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {formatDate(blog.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
            {searchResults.length > 3 && (
              <div className="p-2 text-center border-t border-slate-100 mt-2">
                <Link
                  href={`/blog?search=${encodeURIComponent(searchTerm)}`}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  onClick={() => setShowResults(false)}
                >
                  View all results
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* No results message */}
      {showResults && searchTerm && searchResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 p-4 text-center">
          <p className="text-slate-600 mb-2">No matching articles found</p>
          <Button
            variant="outline"
            size="sm"
            onClick={clearSearch}
            className="text-sm"
          >
            Clear search
          </Button>
        </div>
      )}
    </div>
  );
}
