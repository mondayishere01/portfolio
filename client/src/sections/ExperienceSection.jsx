import { motion } from "framer-motion";
import ExperienceCard from "../components/ExperienceCard";
import SectionHeader from "../components/SectionHeader";
import { sectionVariants, staggerContainer } from "../utils/animations";

const ExperienceSection = ({ experiences, loading }) => (
  <motion.section
    id="experience"
    className="mb-12 scroll-mt-16 md:mb-16 lg:mb-24 lg:scroll-mt-24"
    aria-label="Work experience"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.1 }}
    variants={sectionVariants}
  >
    <SectionHeader label="Experience" />
    <motion.div
      key={`exp-${experiences.length}`}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false }}
    >
      {loading ? (
        <div className="space-y-8">
          {[1, 2].map((i) => (
            <div key={i} className="grid sm:grid-cols-8 gap-4 animate-pulse">
              <div className="sm:col-span-2 h-4 w-24 rounded bg-slate-700/50" />
              <div className="sm:col-span-6 space-y-2">
                <div className="h-5 w-48 rounded bg-slate-700/50" />
                <div className="h-4 w-full rounded bg-slate-700/50" />
                <div className="h-4 w-3/4 rounded bg-slate-700/50" />
              </div>
            </div>
          ))}
        </div>
      ) : experiences.length > 0 ? (
        <div className="group/list">
          {experiences.slice(0, 4).map((exp) => (
            <motion.div
              key={exp._id}
              variants={sectionVariants}
              className="mb-12"
            >
              <ExperienceCard
                date={exp.date}
                title={exp.title}
                company={exp.company}
                companyUrl={exp.companyUrl || "#"}
                description={exp.description}
                tags={exp.tags || []}
                imageUrl={exp.imageUrl}
              />
            </motion.div>
          ))}

          {experiences.length > 4 && (
            <div className="mt-8 flex justify-start">
              <a
                href="/experience-archive"
                className="inline-flex items-center gap-2 rounded-md bg-[#ffeb00] px-8 py-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:bg-[#ffdb00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffeb00]/10"
              >
                View Full Experience
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      ) : (
        <ExperienceCard
          date="2024 — Present"
          title="Full Stack Developer"
          company="Freelance"
          companyUrl="#"
          description="Building accessible, performant, and beautifully crafted web applications for diverse clients."
          tags={["React", "Node.js", "MongoDB", "Express"]}
        />
      )}
    </motion.div>
  </motion.section>
);

export default ExperienceSection;
