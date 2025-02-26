"use client";
import { motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Github, Linkedin } from "lucide-react";
import { useRef, useState, useLayoutEffect } from "react";

const navItems = {
  "/": {
    name: "Home",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-5 h-5"
      >
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  "/projects": {
    name: "Projects",
  },
  "/blog": {
    name: "Blog",
  },
};

export function Navbar() {
  const pathname = usePathname();
  const [activeRect, setActiveRect] = useState({ left: 0, width: 0 });
  const navRefs = useRef(new Map());

  // Use useLayoutEffect to measure DOM elements after render but before paint
  useLayoutEffect(() => {
    // Find the active element and measure it
    const activeElement = navRefs.current.get(pathname);
    if (activeElement) {
      const rect = activeElement.getBoundingClientRect();
      const parentRect = activeElement.parentElement.getBoundingClientRect();

      // Calculate position relative to parent
      setActiveRect({
        left: rect.left - parentRect.left,
        width: rect.width,
      });
    }
  }, [pathname]);

  return (
    <header className="flex max-w-xl self-center justify-between top-0 w-full z-10 mb-10">
      <div>{/* Top Left Placeholder */}</div>
      <div className="flex justify-center py-2">
        <nav className="flex items-center relative bg-zinc-900/90 backdrop-blur-sm rounded-3xl p-1 shadow-lg ring-1 ring-zinc-800">
          {/* Animated background highlight */}
          <motion.span
            className="absolute inset-y-1 inset-x-1 bg-zinc-700/50 rounded-2xl -z-10"
            initial={false}
            animate={{
              left: activeRect.left,
              width: activeRect.width,
            }}
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 30,
            }}
          />

          {/* Nav links */}
          {Object.entries(navItems).map(
            ([path, { name, icon }]: [
              string,
              { name: string; icon?: React.ReactNode },
            ]) => {
              const isActive = pathname === path;
              return (
                <Link
                  key={path}
                  href={path}
                  ref={(el) => {
                    if (el) navRefs.current.set(path, el);
                  }}
                  className={`
                    relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200
                    ${isActive ? "text-white" : "text-zinc-400 hover:text-zinc-200"}
                  `}
                >
                  <span
                    className={`${isActive ? "text-white" : "text-zinc-300"} ${icon ? "" : "hidden"}`}
                  >
                    {icon}
                  </span>
                  {name}

                  {/* Hover highlight (independent of active highlight) */}
                  <span className="absolute inset-0 bg-zinc-700/30 rounded-2xl opacity-0 hover:opacity-100 transition-opacity -z-10"></span>
                </Link>
              );
            },
          )}
        </nav>
      </div>
      <div className="flex items-center justify-end gap-x-3">
        <Link href="https://www.github.com/TJennerjahn">
          <Github />
        </Link>
        <Link href="https://www.linkedin.com/in/tobias-jennerjahn-90b644160/">
          <Linkedin />
        </Link>
      </div>
    </header>
  );
}
