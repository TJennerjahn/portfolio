"use client";
import { FaReact } from "react-icons/fa";
import { SiPostgresql } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { FaLinux } from "react-icons/fa";
import { FaRust } from "react-icons/fa";
import { RiSvelteLine } from "react-icons/ri";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState, ReactNode } from "react";

interface Project {
  idx: number;
  id: string;
  title: string;
  subtitle: string;
  description: string;
  features?: string[];
  color: string;
  textColor: string;
  techStack: ReactNode[];
  image?: string;
  project_url?: string;
  backgroundColor?: string;
}

export default function ProjectCards() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const openModal = (e: React.MouseEvent, project: Project) => {
    e.preventDefault(); // Prevent Link navigation
    setSelectedProject(project);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "scroll";
    return () => { };
  }, [isOpen]);

  // Sample project data - replace with your actual projects
  const projects = [
    {
      idx: 0,
      id: "I",
      title: "Increader",
      subtitle: "Incremental Reading Platform",
      description:
        "Increader is an all-in-one reading-platform that aims to offer the best reading experience for all text-based content, including Books, Articles and Papers. I've written extensively about my rationale behind its featureset and design, but it's also free to try.",
      features: [
        "Built around incremental reading techniques",
        "Easy annotations and highlights across all document types",
        "Deeply integrated spaced-repetition support",
      ],
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
      idx: 1,
      id: "II",
      title: "EyeSight",
      subtitle: "Timed Screensaver promoting Eye Health",
      description:
        "EyeSight is a minimal tray application that uses evidence-based techniques to reduce eye-strain during prolonged screen usage by forcing the user to take short 30 second breaks every 30 minutes.",
      features: [
        "Cross-platform support",
        "Integrates with Polybar and other status bars",
        "Extremely light-weight",
      ],
      color: "#f5f5f0",
      textColor: "#0f1d40",
      techStack: [
        <FaPython size="2em" color="#0f1d40" />,
        <FaLinux size="2em" color="#0f1d40" />,
      ],
      image: "hero_image_2.png",
    },
    {
      idx: 2,
      id: "III",
      title: "Palette",
      subtitle: "Keyboard-based Application Quicklauncher",
      description:
        "Palette is a fast, beautiful application launcher that focuses on keyboard-based workflows. Oh and it's written in Rust.",
      features: [
        "Fuzzy search to minimize necessary key-strokes",
        "Doubles as switcher between applications and windows",
        "Works on Linux and MacOs",
      ],
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
    <div className="w-full max-w-4xl mx-auto py-8 relative">
      <div className="flex flex-col space-y-6">
        {projects.map((project, idx) => (
          <div
            key={project.id}
            className="w-full"
            onClick={(e) => openModal(e, project)}
          >
            <motion.div
              layoutId={`card-container-${project.id}`}
              className="relative flex flex-col rounded-xl shadow-lg mx-auto cursor-pointer"
              style={{
                maxWidth: "640px",
                height: "320px",
                backgroundColor: project.color,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Card Number */}
              <motion.div
                layoutId={`card-number-${project.id}`}
                className={`absolute ${idx % 2 == 0 ? "right-4" : "left-4"} top-4 text-5xl font-serif z-2`}
                style={{
                  color: project.textColor,
                }}
              >
                {project.id}
              </motion.div>

              {/* Tech Stack Icons */}
              <motion.div
                layoutId={`tech-stack-${project.id}`}
                className={`absolute top-8 ${idx % 2 == 0 ? "left-4" : "right-4"} grid grid-cols-2 gap-2`}
              >
                {project.techStack.map((icon, i) => (
                  <div className="z-2" key={i}>
                    {icon}
                  </div>
                ))}
              </motion.div>

              {/* Background Image (if provided) */}
              {project.image && (
                <motion.div
                  layoutId={`image-container-${project.id}`}
                  className={`absolute ${idx % 2 == 0 ? "right-0 top-0" : "left-0 top-0"} bottom-0 overflow-hidden`}
                >
                  <motion.img
                    layoutId={`image-${project.id}`}
                    src={`/${project.image}`}
                    alt={`${project.title} illustration`}
                    className="h-full rounded-xl object-cover object-left opacity-80"
                  />
                </motion.div>
              )}

              {/* Project Title & Subtitle */}
              <motion.div
                layoutId={`content-container-${project.id}`}
                className={`absolute ${idx % 2 == 0 ? "left-0 text-left" : "right-0 text-right"} bottom-0 flex-1 p-6 mb-4`}
              >
                <motion.h3
                  layoutId={`title-${project.id}`}
                  className="text-xl font-serif"
                  style={{ color: project.textColor }}
                >
                  {project.title}
                </motion.h3>
                <motion.p
                  layoutId={`subtitle-${project.id}`}
                  className="text-xs tracking-wider mt-1"
                  style={{ color: project.textColor }}
                >
                  {project.subtitle}
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && selectedProject && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
            />

            <motion.div
              layoutId={`card-container-${selectedProject.id}`}
              className="fixed z-50 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                         w-[90%] max-w-[750px] sm:w-[80%] h-[600px] sm:h-[500px] rounded-xl shadow-2xl overflow-hidden"
              style={{
                backgroundColor: selectedProject.backgroundColor || "#f1f1f1",
              }}
            >
              <div className="relative h-full">
                {/* Tech Stack Icons - Preserve position from card */}
                <motion.div
                  layoutId={`tech-stack-${selectedProject.id}`}
                  className={`absolute top-4 ${selectedProject.idx % 2 == 0 ? "left-4" : "right-4"} flex space-x-2`}
                >
                  {selectedProject.techStack &&
                    selectedProject.techStack.map((icon, i) => (
                      <div className="z-10" key={i}>
                        {icon}
                      </div>
                    ))}
                </motion.div>

                {/* Card Number - Preserve position from card */}
                <motion.div
                  layoutId={`card-number-${selectedProject.id}`}
                  className={`absolute top-4 ${selectedProject.idx % 2 == 0 ? "right-4" : "left-4"} text-3xl font-serif text-navy z-2`}
                >
                  {selectedProject.id}
                </motion.div>

                {/* Project Title & Subtitle - Preserve position from card */}
                <motion.div
                  layoutId={`content-container-${selectedProject.id}`}
                  className={`absolute top-16 ${selectedProject.idx % 2 == 0 ? "text-left left-4" : "text-right right-4"} z-2`}
                >
                  <motion.h3
                    layoutId={`title-${selectedProject.id}`}
                    className="text-xl font-serif text-navy"
                  >
                    {selectedProject.title}
                  </motion.h3>
                  <motion.p
                    layoutId={`subtitle-${selectedProject.id}`}
                    className="text-sm text-navy mt-1"
                  >
                    {selectedProject.subtitle}
                  </motion.p>
                </motion.div>

                {/* Background Image - Preserve position from card */}
                {selectedProject.image && (
                  <motion.div
                    layoutId={`image-container-${selectedProject.id}`}
                    className={`absolute ${selectedProject.idx % 2 === 0 ? "right-0" : "left-0"} blur-xl top-0 bottom-0 h-full overflow-hidden`}
                  >
                    <motion.img
                      layoutId={`image-${selectedProject.id}`}
                      src={selectedProject.image}
                      alt={`${selectedProject.title} illustration`}
                      className="h-full w-full object-cover"
                    />
                  </motion.div>
                )}

                {/* Additional modal content */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`absolute ${selectedProject.idx % 2 === 0 ? "text-left left-4" : "text-right right-4"} top-32 max-w-md pr-4 text-navy`}
                >
                  <p className="mb-4">
                    {selectedProject.description ||
                      "This project aims to solve real-world problems through innovative technology solutions..."}
                  </p>

                  {/* Features list */}
                  <div className="mb-6">
                    <h4 className="text-lg font-medium mb-2">Key Features:</h4>
                    <ul
                      dir={selectedProject.idx % 2 == 0 ? "ltr" : "rtl"}
                      className="list-disc pl-5 space-y-1"
                    >
                      {selectedProject.features ? (
                        selectedProject.features.map((feature, idx) => (
                          <li key={idx}>{feature}</li>
                        ))
                      ) : (
                        <>
                          <li>Intuitive user interface</li>
                          <li>Cross-platform compatibility</li>
                          <li>Advanced data processing</li>
                        </>
                      )}
                    </ul>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`absolute ${selectedProject.idx % 2 === 0 ? "text-left left-4" : "text-right right-4"} bottom-4 max-w-md text-navy`}
                >
                  {/* Action buttons */}
                  <div
                    className={`flex space-x-4 mt-6 ${selectedProject.idx % 2 == 0 ? "justify-start" : "justify-end"} z-2`}
                  >
                    <Link href={selectedProject.project_url || "#"}>
                      <motion.button
                        className="px-4 py-2 bg-navy text-white rounded-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View Project
                      </motion.button>
                    </Link>
                    <motion.button
                      onClick={closeModal}
                      className="px-4 py-2 rounded-lg border border-navy text-navy"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Close
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
