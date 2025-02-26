"use client";
import { FaReact } from "react-icons/fa";
import { SiPostgresql } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { FaLinux } from "react-icons/fa";
import { FaRust } from "react-icons/fa";
import { RiSvelteLine } from "react-icons/ri";
import { useRef, useEffect } from "react";

export default function ProjectCards() {
  // Sample project data - replace with your actual projects
  const projects = [
    {
      id: "I",
      title: "ReadIt",
      subtitle: "Incremental Reading Platform",
      color: "#0f1d40",
      textColor: "white",
      icon: "🔪", // Placeholder for your actual icon/image
      techStack: [<FaReact size="2em" />, <SiPostgresql size="2em" />],
    },
    {
      id: "II",
      title: "EyeSight",
      subtitle: "Timed Screensaver promoting Eye Health",
      color: "#f44336",
      textColor: "white",
      icon: "≡", // Placeholder for your actual icon/image
      techStack: [<FaPython size="2em" />, <FaLinux size="2em" />],
    },
    {
      id: "III",
      title: "Palette",
      subtitle: "Keyboard-based Application Quicklauncher",
      color: "#f5f5f0",
      textColor: "#0f1d40",
      icon: "⛵", // Placeholder for your actual icon/image
      techStack: [
        <FaRust size="2em" color="#f44336" />,
        <RiSvelteLine size="2em" color="#f44336" />,
      ],
    },
  ];

  const scrollContainerRef = useRef(null);

  // Scroll to first card on initial load
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      // Small timeout to ensure the DOM is fully rendered
      setTimeout(() => {
        scrollContainer.scrollLeft = 0;
      }, 100);
    }
  }, []);

  // Handle wheel events for horizontal scrolling
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) return;

    const handleWheel = (event: WheelEvent) => {
      const { deltaY } = event;

      // Only prevent default if we're scrolling the container
      if (scrollContainer.contains(event.target as Node)) {
        event.preventDefault();

        // Adjust the scroll amount for better UX
        const scrollAmount = deltaY * 0.75;
        scrollContainer.scrollBy({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    };

    // Use document level event listener to ensure it's captured
    document.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      document.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div className="relative w-full">
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
          paddingLeft: "max(1rem, calc(50% - 160px))", // Half card width
          paddingRight: "max(1rem, calc(50% - 160px))", // Half card width
          overflowY: "hidden", // Ensure no vertical scrolling
        }}
        data-testid="project-scroll-container"
      >
        {projects.map((project) => (
          <div
            key={project.id}
            className="snap-center flex-shrink-0 mx-3 first:ml-0 last:mr-0"
          >
            <div
              className="relative flex flex-col rounded-xl shadow-lg"
              style={{
                width: "320px",
                height: "480px",
                backgroundColor: project.color,
              }}
            >
              {/* Card Number */}
              <div
                className="absolute top-4 left-4 text-5xl font-serif"
                style={{
                  color: project.id === "III" ? "#f44336" : project.textColor,
                }}
              >
                {project.id}
              </div>
              {/* Tech Stack Icons */}
              <div className="absolute top-8 right-4 grid grid-cols-2 gap-2">
                {project.techStack.map((icon, i) => (
                  <div key={i}>{icon}</div>
                ))}
              </div>
              {/* Footer Content */}
              <div className="flex-1 flex items-center justify-center text-4xl">
                {/* {project.icon} */}{" "}
              </div>
              {/* Project Title & Subtitle */}
              <div className="flex-1 p-6 text-center mb-4">
                <h3
                  className="text-xl font-serif"
                  style={{ color: project.textColor }}
                >
                  {project.title}
                </h3>
                <p
                  className="text-xs tracking-wider mt-1"
                  style={{ color: project.textColor }}
                >
                  {project.subtitle}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
