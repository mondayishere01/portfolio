import { motion } from "framer-motion";
import ExperienceCard from "../components/ExperienceCard";
import SectionHeader from "../components/SectionHeader";
import { sectionVariants, staggerContainer } from "../utils/animations";

const ExperienceSection = ({ experiences, loading }) => (
  <motion.section
    id="experience"
    className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
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
          {experiences.map((exp) => (
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
              />
            </motion.div>
          ))}
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
