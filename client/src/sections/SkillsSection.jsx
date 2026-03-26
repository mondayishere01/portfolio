import { motion } from "framer-motion";
import SectionHeader from "../components/SectionHeader";
import { sectionVariants, staggerContainer } from "../utils/animations";

const SKILL_CATEGORIES = [
  "Languages",
  "Frontend",
  "Backend",
  "Databases",
  "Cloud & DevOps",
  "Tools & Practices",
];

const ProficiencyDots = ({ level }) => (
  <div className="flex gap-1 mt-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        className={`inline-block w-2 h-2 rounded-full ${i <= level ? "bg-[#ffeb00]" : "bg-slate-600"}`}
      />
    ))}
  </div>
);

const SkillsSection = ({ skills, loading }) => {
  const groupedSkills = SKILL_CATEGORIES.map((cat) => ({
    category: cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <motion.section
      id="skills"
      className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
      aria-label="Skills"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={sectionVariants}
    >
      <SectionHeader label="Skills" />
      {loading ? (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-lg bg-slate-700/30 animate-pulse"
            />
          ))}
        </div>
      ) : groupedSkills.length > 0 ? (
        <div className="space-y-10">
          {groupedSkills.map((group) => (
            <div key={group.category}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
                {group.category}
              </h3>
              <motion.div
                className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {group.items.map((skill) => (
                  <motion.div
                    key={skill._id}
                    variants={sectionVariants}
                    className="group flex flex-col items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 text-center transition hover:border-[#ffeb00]/30 hover:bg-slate-800/60"
                  >
                    {skill.imageUrl ? (
                      <img
                        src={skill.imageUrl}
                        alt={skill.name}
                        className="w-10 h-10 object-contain"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded bg-slate-700/50 flex items-center justify-center text-lg font-bold text-[#ffeb00]">
                        {skill.name.charAt(0)}
                      </div>
                    )}
                    <span className="text-xs font-medium text-slate-300 leading-tight">
                      {skill.name}
                    </span>
                    <ProficiencyDots level={skill.proficiency} />
                  </motion.div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-slate-500 text-sm">
          Skills will appear here once added via the admin panel.
        </p>
      )}
    </motion.section>
  );
};

export default SkillsSection;
