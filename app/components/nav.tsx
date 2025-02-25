"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <header className="top-0 w-full z-10 mb-10">
      <div className="flex justify-center py-2">
        <nav className="flex items-center bg-zinc-900/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg ring-1 ring-zinc-800">
          {Object.entries(navItems).map(([path, { name, icon }]) => {
            const isActive = pathname === path;

            return (
              <Link
                key={path}
                href={path}
                className={`
                  relative flex items-center gap-2 px-4 py-2 text-sm font-medium transition-all duration-200
                  ${isActive
                    ? "text-white"
                    : "text-zinc-400 hover:text-zinc-200"
                  }
                `}
              >
                <span
                  className={`${isActive ? "text-white" : "text-zinc-300"} ${icon ? "" : "hidden"}`}
                >
                  {icon}
                </span>
                {name}

                {/* Background highlight for active item */}
                {isActive && (
                  <span className="absolute inset-0 bg-zinc-700/50 rounded-full -z-10"></span>
                )}

                {/* Hover background highlight */}
                <span className="absolute inset-0 bg-zinc-700/30 rounded-full opacity-0 hover:opacity-100 transition-opacity -z-10"></span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
