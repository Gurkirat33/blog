// components/HeroSection.jsx
import { Button } from "@/components/ui/button";
import Image from "next/image";

const HeroSection = () => {
  const imageGallery = [
    {
      src: "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1064&q=80",
      alt: "Person writing in journal",
    },
    {
      src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
      alt: "Laptop with code",
    },
    {
      src: "https://images.unsplash.com/photo-1606761568499-6d2451b23c66?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      alt: "Creative workspace",
    },
    {
      src: "https://images.unsplash.com/photo-1542435503-956c469947f6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80",
      alt: "Reading blog on tablet",
    },
    {
      src: "https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alt: "Design thinking",
    },
  ];

  return (
    <section className="pt-24 pb-16 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1429&q=80')] bg-cover opacity-5"></div>

      <div className="max-w-84rem mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight  leading-tight mb-8">
            Discover Insights That <span className="text-blue-600">Matter</span>
          </h1>
          <p className="text-xl text-slate-600 mb-10">
            Explore thought-provoking articles on design, technology, and
            creative thinking that will inspire your next big idea.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="rounded-full px-10 py-6 text-base font-medium"
            >
              Explore Articles
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-full px-10 py-6 text-base font-medium border-2"
            >
              Subscribe Now
            </Button>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-5 gap-4 mt-16 relative">
          {imageGallery.map((image, index) => (
            <div
              key={index}
              className="relative h-64 md:h-80 rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Background decoration */}
        <div className="absolute top-40 -left-16 w-32 h-32 bg-blue-50 rounded-full opacity-70"></div>
        <div className="absolute bottom-16 -right-16 w-64 h-64 bg-blue-50 rounded-full opacity-70"></div>
      </div>
    </section>
  );
};

export default HeroSection;
