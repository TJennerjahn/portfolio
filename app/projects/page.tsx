"use client";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaReact } from "react-icons/fa";
import { SiPostgresql } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { FaLinux } from "react-icons/fa";
import { FaRust } from "react-icons/fa";
import { RiSvelteLine } from "react-icons/ri";
import { useRef, useEffect, useState } from "react";

export default function ProjectCards() {
  const [activeIndex, setActiveIndex] = useState(0);

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

  // Scroll to first card on initial load and handle wheel events
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (scrollContainer) {
      // Small timeout to ensure the DOM is fully rendered
      setTimeout(() => {
        scrollContainer.scrollLeft = 0;
      }, 100);

      // Handle vertical wheel scroll for horizontal scrolling
      const handleWheel = (e: WheelEvent) => {
        if (e.deltaY !== 0) {
          e.preventDefault();
          scrollContainer.scrollLeft += e.deltaY;
        }
      };

      // Add event listener to the scroll container
      scrollContainer.addEventListener("wheel", handleWheel, {
        passive: false,
      });

      // Cleanup event listener on unmount
      return () => {
        scrollContainer.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  // Separate effect to track active index without affecting scroll behavior
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const cardWidth = 320; // Width of each card
      const spacing = 24; // Approximate spacing
      const itemWidth = cardWidth + spacing;

      const scrollPosition = scrollContainer.scrollLeft;
      const itemIndex = Math.round(scrollPosition / itemWidth);

      setActiveIndex(Math.min(Math.max(itemIndex, 0), projects.length - 1));
    };

    scrollContainer.addEventListener("scroll", handleScroll);

    return () => {
      scrollContainer.removeEventListener("scroll", handleScroll);
    };
  }, [projects.length]);

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
        }}
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

      {/* Scroll Indicators - Only visible on smaller screens */}
      <div className="mt-4 flex flex-col items-center">
        {/* Dot indicators */}
        <div className="flex space-x-2 mb-2">
          {projects.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                const scrollContainer = scrollContainerRef.current;
                if (scrollContainer) {
                  const cardWidth = 320;
                  const spacing = 24;
                  scrollContainer.scrollTo({
                    left: index * (cardWidth + spacing),
                    behavior: "smooth",
                  });
                }
              }}
              className={`w-2.5 h-2.5 rounded-full cursor-pointer transition-all duration-300 ${activeIndex === index ? "bg-gray-800 w-5" : "bg-gray-300"
                }`}
              aria-label={`Go to project ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
