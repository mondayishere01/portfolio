import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import SectionHeader from "../components/SectionHeader";
import { sectionVariants, staggerContainer } from "../utils/animations";

const ProjectsSection = ({ projects, loading }) => (
  <motion.section
    id="projects"
    className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    aria-label="Selected projects"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    variants={sectionVariants}
  >
    <SectionHeader label="Projects" />
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {loading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="grid sm:grid-cols-8 gap-4 animate-pulse">
              <div className="sm:col-span-2 h-24 rounded bg-slate-700/50" />
              <div className="sm:col-span-6 space-y-2">
                <div className="h-5 w-48 rounded bg-slate-700/50" />
                <div className="h-4 w-full rounded bg-slate-700/50" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length > 0 ? (
        projects.map((proj) => (
          <motion.div
            key={proj._id}
            variants={sectionVariants}
            className="mb-12"
          >
            <ProjectCard
              title={proj.title}
              description={proj.description}
              imageUrl={proj.imageUrl || ""}
              link={proj.link || "#"}
              githubUrl={proj.githubUrl || ""}
              tags={proj.tags || []}
            />
          </motion.div>
        ))
      ) : (
        <ProjectCard
          title="Portfolio Website"
          description="A modern, dark-mode portfolio built with the MERN stack, featuring an admin panel for content management."
          link="#"
          imageUrl=""
          tags={["React", "Express", "MongoDB", "Tailwind"]}
        />
      )}
    </motion.div>

    <div className="mt-12">
      <Link
        to="/archive"
        className="inline-flex items-center font-medium leading-tight text-slate-200 hover:text-teal-300 group"
      >
        View Full Project Archive
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-2"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </div>
  </motion.section>
);

export default ProjectsSection;
