"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

const NewsletterSection = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: null, message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      setStatus({
        type: "error",
        message: "Please provide both name and email.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus({
        type: "success",
        message: "Thank you for subscribing to our newsletter!",
      });
      setName("");
      setEmail("");
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Failed to subscribe. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1606857521015-7f9fcf423740?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80')] bg-cover bg-center bg-fixed"></div>
      <div className="absolute inset-0 bg-blue-800/35"></div>

      <div className="max-w-84rem mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-100 text-blue-600 mb-6">
                <Mail className="h-6 w-6" />
              </div>

              <h2 className="text-3xl md:text-[32px] font-semibold mb-4">
                Join Our Weekly Digest
              </h2>

              <p className="tracking-wide text-slate-600 mb-8">
                Get exclusive insights, expert tips, and curated content
                delivered straight to your inbox. No spam, just valuable content
                that matters.
              </p>

              {status.type === "success" ? (
                <div className="bg-green-50 border border-green-100 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-green-800">{status.message}</p>
                  </div>
                </div>
              ) : null}

              {status.type === "error" ? (
                <div className="bg-red-50 border border-red-100 rounded-xl p-4 mb-6">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                    <p className="text-red-800">{status.message}</p>
                  </div>
                </div>
              ) : null}

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Your name"
                    className="rounded-xl border-slate-300 py-6 px-4 focus:border-blue-500 focus:ring-blue-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Input
                    type="email"
                    placeholder="Your email address"
                    className="rounded-xl border-slate-300 py-6 px-4 focus:border-blue-500 focus:ring-blue-500"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  className="w-full rounded-xl py-6 text-base font-medium bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Subscribing..." : "Subscribe Now"}
                </Button>

                <p className="text-xs tracking-wide text-slate-600 text-center">
                  By subscribing, you agree to our Privacy Policy and Terms of
                  Service.
                </p>
              </form>
            </div>

            <div className="relative hidden md:block">
              <div className="absolute inset-0">
                <Image
                  src="https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
                  alt="Newsletter signup"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
