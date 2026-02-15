"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isArticlesActive =
    pathname === "/blog" || pathname.startsWith("/blog/articles");
  const isReviewsActive = pathname.startsWith("/blog/reviews");

  return (
    <div className="relative">
      {/* Fixed Sidebar - positioned relative to viewport */}
      <div className="fixed left-0 top-0 bottom-0 w-12 bg-black z-0">
        {/* Push content down to account for navbar */}
        <div className="h-full flex flex-col">
          <Link
            href="/blog/articles"
            className={`flex-1 flex items-center justify-center relative group overflow-hidden ${
              isArticlesActive ? "active-section" : ""
            }`}
          >
            {/* Animated background that fills from left on hover/active */}
            <div
              className={`absolute inset-0 bg-white transform transition-transform duration-300 ease-in-out ${
                isArticlesActive
                  ? "translate-x-0"
                  : "-translate-x-full group-hover:translate-x-0"
              }`}
            ></div>

            {/* Text that changes color based on hover/active state */}
            <span
              className={`rotate-90 transform origin-center whitespace-nowrap font-medium relative z-10 transition-colors duration-300 ${
                isArticlesActive
                  ? "text-black"
                  : "text-white group-hover:text-black"
              }`}
            >
              Articles
            </span>
          </Link>
          <Link
            href="/blog/reviews"
            className={`flex-1 flex items-center justify-center relative group overflow-hidden ${
              isReviewsActive ? "active-section" : ""
            }`}
          >
            {/* Animated background that fills from left on hover/active */}
            <div
              className={`absolute inset-0 bg-white transform transition-transform duration-300 ease-in-out ${
                isReviewsActive
                  ? "translate-x-0"
                  : "-translate-x-full group-hover:translate-x-0"
              }`}
            ></div>

            {/* Text that changes color based on hover/active state */}
            <span
              className={`rotate-90 transform origin-center whitespace-nowrap font-medium relative z-10 transition-colors duration-300 ${
                isReviewsActive
                  ? "text-black"
                  : "text-white group-hover:text-black"
              }`}
            >
              Book Reviews
            </span>
          </Link>
        </div>
      </div>

      {/* Main content with padding for sidebar */}
      <div className="pl-12">
        <div className="antialiased max-w-xl md:max-w-4xl mx-4 md:mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
