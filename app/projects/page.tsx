"use client";
import { FaReact } from "react-icons/fa";
import { SiPostgresql } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { FaLinux } from "react-icons/fa";
import { FaRust } from "react-icons/fa";
import { RiSvelteLine } from "react-icons/ri";
import Link from "next/link";

export default function ProjectCards() {
  // Sample project data - replace with your actual projects
  const projects = [
    {
      id: "I",
      title: "Increader",
      subtitle: "Incremental Reading Platform",
      color: "#f5f5f0",
      textColor: "#0f1d40",
      techStack: [
        <FaReact size="2em" color="#0f1d40" />,
        <SiPostgresql size="2em" color="#0f1d40" />,
      ],
      image: "hero_image.png",
      project_url: "https://increader.com",
    },
    {
      id: "II",
      title: "EyeSight",
      subtitle: "Timed Screensaver promoting Eye Health",
      color: "#f5f5f0",
      textColor: "#0f1d40",
      techStack: [
        <FaPython size="2em" color="#0f1d40" />,
        <FaLinux size="2em" color="#0f1d40" />,
      ],
      image: "hero_image_2.png",
    },
    {
      id: "III",
      title: "Palette",
      subtitle: "Keyboard-based Application Quicklauncher",
      color: "#f5f5f0",
      textColor: "#0f1d40",
      techStack: [
        <FaRust size="2em" color="#0f1d40" />,
        <RiSvelteLine size="2em" color="#0f1d40" />,
      ],
      image: "hero_image_4.png",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex flex-col space-y-6">
        {projects.map((project, idx) => (
          <Link href={project.project_url || "#"}>
            <div key={project.id} className="w-full">
              <div
                className="relative flex flex-col rounded-xl shadow-lg mx-auto"
                style={{
                  maxWidth: "640px",
                  height: "320px",
                  backgroundColor: project.color,
                }}
              >
                {/* Card Number */}
                <div
                  className={`absolute ${idx % 2 == 0 ? "right-4" : "left-4"} top-4 text-5xl font-serif z-2`}
                  style={{
                    color: project.textColor,
                  }}
                >
                  {project.id}
                </div>
                {/* Tech Stack Icons */}
                <div
                  className={`absolute top-8 ${idx % 2 == 0 ? "left-4" : "right-4"} grid grid-cols-2 gap-2`}
                >
                  {project.techStack.map((icon, i) => (
                    <div className="z-2" key={i}>
                      {icon}
                    </div>
                  ))}
                </div>
                {/* Background Image (if provided) */}
                {project.image && (
                  <div
                    className={`absolute ${idx % 2 == 0 ? "right-0 top-0" : "left-0 top-0"} bottom-0 overflow-hidden`}
                  >
                    <img
                      src={`/${project.image}`}
                      alt={`${project.title} illustration`}
                      className="h-full rounded-xl object-cover object-left opacity-80"
                    />
                  </div>
                )}

                {/* Project Title & Subtitle */}
                <div
                  className={`absolute ${idx % 2 == 0 ? "left-0 text-left" : "right-0 text-right"} bottom-0 flex-1 p-6 mb-4`}
                >
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
          </Link>
        ))}
      </div>
    </div>
  );
}
