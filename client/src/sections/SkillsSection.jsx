import { useState } from "react";
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
  const [activeCategory, setActiveCategory] = useState(SKILL_CATEGORIES[0]);

  const groupedSkills = SKILL_CATEGORIES.map((cat) => ({
    category: cat,
    items: skills.filter((s) => s.category === cat),
  })).filter((g) => g.items.length > 0);

  const activeGroup = groupedSkills.find((g) => g.category === activeCategory) || groupedSkills[0];

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
        <div className="space-y-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
            {groupedSkills.map((group) => (
              <button
                key={group.category}
                onClick={() => setActiveCategory(group.category)}
                className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all duration-200 ${
                  activeCategory === group.category
                    ? "bg-[#ffeb00] text-slate-900"
                    : "text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
                }`}
              >
                {group.category}
              </button>
            ))}
          </div>

          {/* Active Category Content */}
          {activeGroup && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
            >
              {activeGroup.items.map((skill) => (
                <div
                  key={skill._id}
                  className="group flex flex-col items-center gap-2 rounded-xl border border-slate-700/50 bg-slate-800/30 p-4 text-center transition-all duration-300 hover:border-[#ffeb00]/30 hover:bg-[#111111] hover:shadow-xl"
                >
                  {skill.imageUrl ? (
                    <div className="w-12 h-12 rounded-lg bg-white p-2 group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg">
                      <img
                        src={skill.imageUrl}
                        alt={skill.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center text-xl font-bold text-[#ffeb00]">
                      {skill.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-slate-200 transition-colors leading-tight">
                    {skill.name}
                  </span>
                  <ProficiencyDots level={skill.proficiency} />
                </div>
              ))}
            </motion.div>
          )}
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
