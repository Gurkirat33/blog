"use client";

import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ShareButton({ url, title }) {
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title || document.title,
        url: url || window.location.href,
      });
    } else {
      navigator.clipboard.writeText(url || window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleShare}
      className="flex items-center gap-2"
    >
      <Share2 className="h-4 w-4" />
      Share
    </Button>
  );
}
