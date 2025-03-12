"use client";
import { FaReact } from "react-icons/fa";
import { SiPostgresql } from "react-icons/si";
import { FaPython } from "react-icons/fa";
import { FaLinux } from "react-icons/fa";
import { FaRust } from "react-icons/fa";
import { RiSvelteLine } from "react-icons/ri";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";

export default function ProjectCards() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const openModal = (e, project) => {
    e.preventDefault(); // Prevent Link navigation
    setSelectedProject(project);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };
  // Sample project data - replace with your actual projects
  const projects = [
    {
      idx: 0,
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
      idx: 1,
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
      idx: 2,
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
                         w-[90%] max-w-[750px] sm:w-[80%] h-[90vh] sm:h-[500px] rounded-xl shadow-2xl overflow-hidden"
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
                  className={`absolute bottom-4 ${selectedProject.idx % 2 == 0 ? "text-left left-4" : "text-right right-4"}`}
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
                    className={`absolute ${selectedProject.idx % 2 === 0 ? "-right-48" : "-left-48"} top-0 bottom-0 h-full overflow-hidden`}
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
                    <ul className="list-disc pl-5 space-y-1">
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

                  {/* Action buttons */}
                  <div className="flex space-x-4 mt-6">
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
