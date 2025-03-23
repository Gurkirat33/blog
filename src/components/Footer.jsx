// components/Footer.jsx
import Link from "next/link";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ChevronRight,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Content",
      links: [
        { name: "Articles", href: "/articles" },
        { name: "Tutorials", href: "/tutorials" },
        { name: "Guides", href: "/guides" },
        { name: "Resources", href: "/resources" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About Us", href: "/about" },
        { name: "Our Team", href: "/team" },
        { name: "Careers", href: "/careers" },
        { name: "Contact", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms of Use", href: "/terms" },
        { name: "Cookie Policy", href: "/cookies" },
        { name: "Disclaimer", href: "/disclaimer" },
      ],
    },
  ];

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "https://twitter.com" },
    { name: "Facebook", icon: Facebook, href: "https://facebook.com" },
    { name: "Instagram", icon: Instagram, href: "https://instagram.com" },
    { name: "LinkedIn", icon: Linkedin, href: "https://linkedin.com" },
    { name: "YouTube", icon: Youtube, href: "https://youtube.com" },
  ];

  return (
    <footer className="bg-slate-900 text-white">
      <div className="">
        <div className="grid grid-cols-5">
          <div className="h-2 bg-blue-600"></div>
          <div className="h-2 bg-purple-600"></div>
          <div className="h-2 bg-emerald-600"></div>
          <div className="h-2 bg-amber-500"></div>
          <div className="h-2 bg-rose-600"></div>
        </div>

        <div className=" max-w-84rem mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand and description */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block">
                <span className="font-bold text-2xl text-white">
                  Mindful<span className="text-blue-400">Blog</span>
                </span>
              </Link>
              <p className="mt-6 text-slate-300 text-lg max-w-md">
                Thoughtful content that inspires creativity, enhances technical
                knowledge, and provides valuable insights for the modern digital
                landscape.
              </p>

              {/* Social links */}
              <div className="flex space-x-4 mt-8">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 hover:bg-blue-600 hover:text-white transition-colors"
                      aria-label={social.name}
                    >
                      <Icon className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Footer nav links */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {footerLinks.map((column) => (
                <div key={column.title}>
                  <h3 className="font-bold text-lg text-white mb-5">
                    {column.title}
                  </h3>
                  <ul className="space-y-4">
                    {column.links.map((link) => (
                      <li key={link.name}>
                        <Link
                          href={link.href}
                          className="text-slate-300 hover:text-blue-400 transition-colors flex items-center group"
                        >
                          <ChevronRight className="h-4 w-4 mr-1 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300" />
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Copyright bar */}
          <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-slate-400 text-sm">
            <p>© {currentYear} MindfulBlog. All rights reserved.</p>
            <p className="mt-4 sm:mt-0">Designed with care by Your Agency</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
