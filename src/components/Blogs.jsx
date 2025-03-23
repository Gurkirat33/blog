"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

const placeholderImage =
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80";

const BlogCard = ({ blog }) => {
  const readTime = Math.max(1, Math.ceil(blog.content?.length / 1000)) || 3;

  return (
    <Card className="group h-full flex flex-col overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 rounded-2xl">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={blog.featuredImage || placeholderImage}
          alt={blog.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex gap-2 mb-2">
          {blog?.categories?.map((category) => (
            <Badge
              key={category}
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-100 font-medium rounded-full px-3 py-1"
            >
              {category}
            </Badge>
          ))}
        </div>
        <Link href={`/blog/${blog.slug}`}>
          <h3 className="text-xl font-bold line-clamp-2 hover:text-blue-600 transition-colors">
            {blog.title}
          </h3>
        </Link>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-slate-600 line-clamp-3">
          {blog.content.substring(0, 150).replace(/<[^>]*>/g, "")}...
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-slate-500 pt-4 border-t border-slate-100">
        <span className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          {formatDate(blog.createdAt)}
        </span>
        <span className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          {readTime} min read
        </span>
      </CardFooter>
    </Card>
  );
};

const FeaturedBlogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("/api/posts?limit=3");

        if (!response.ok) {
          throw new Error("Failed to fetch blogs");
        }

        const data = await response.json();
        setBlogs(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-84rem mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-4">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold relative">
              Latest Blogs
              <span className="absolute -bottom-3 left-0 w-20 h-1.5 bg-blue-600 rounded-full"></span>
            </h2>
            <p className="text-slate-600 mt-6 max-w-2xl">
              Discover our most recent articles and insights from our community.
            </p>
          </div>
          <Link href="/blog">
            <Button
              variant="outline"
              className="group rounded-full border-2 border-slate-200 px-8 py-6 text-base"
            >
              View all blogs
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[400px] rounded-2xl bg-slate-100 animate-pulse"
              ></div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-xl text-slate-600">
              No blogs published yet. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedBlogs;
