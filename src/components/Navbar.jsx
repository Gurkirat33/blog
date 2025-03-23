"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { data: session, status } = useSession();
  const isAuthenticated = status === "authenticated";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // We still need this for mobile navigation
  const navLinks = [{ name: "Blogs", href: "/blog" }];

  return (
    <header
      className={`w-full bg-white sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "shadow-md py-3" : "py-5"
      }`}
    >
      <div className="max-w-84rem mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-1">
          <span className="font-bold text-2xl">
            Mindful<span className="text-blue-600">Blog</span>
          </span>
        </Link>

        {/* Desktop Navigation - removed as we're moving Blogs to the right */}

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Link
            href="/blog"
            className="font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            Blogs
          </Link>

          {isAuthenticated ? (
            <>
              <Button
                variant="default"
                className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white"
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-6 border-slate-300 hover:bg-slate-100"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                Sign Out
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                className="rounded-full px-6 border-slate-300 hover:bg-slate-100"
                asChild
              >
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button
                variant="default"
                className="rounded-full px-6 bg-blue-600 hover:bg-blue-700 text-white"
                asChild
              >
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="flex md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="rounded-full">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="border-l border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <span className="font-bold text-xl ">
                  Mindful<span className="text-blue-600">Blog</span>
                </span>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex flex-col space-y-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-lg font-medium text-slate-800 hover:text-blue-600 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard"
                      className="text-lg font-medium text-slate-800 hover:text-blue-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Button
                      variant="default"
                      className="mt-4 rounded-full py-6 bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setIsOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                    >
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/signin"
                      className="text-lg font-medium text-slate-800 hover:text-blue-600 transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Button
                      variant="default"
                      className="mt-4 rounded-full py-6 bg-blue-600 hover:bg-blue-700"
                      asChild
                    >
                      <Link href="/signup" onClick={() => setIsOpen(false)}>
                        Sign Up
                      </Link>
                    </Button>
                  </>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
