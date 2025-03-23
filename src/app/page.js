import HeroSection from "@/components/Hero";
import FeaturedBlogs from "@/components/Blogs";
import NewsletterSection from "@/components/NewsletterSection";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturedBlogs />
      <NewsletterSection />
    </main>
  );
}
