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
        className="inline-block w-2 h-2 rounded-full"
        style={{ backgroundColor: i <= level ? 'var(--interactive-base)' : 'var(--border-subtle)' }}
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
      className="mb-12 scroll-mt-16 md:mb-16 lg:mb-24 lg:scroll-mt-24"
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
              className="h-24 rounded-lg animate-pulse"
              style={{ backgroundColor: 'var(--skeleton)' }}
            />
          ))}
        </div>
      ) : groupedSkills.length > 0 ? (
        <div className="space-y-8">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 pb-4" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            {groupedSkills.map((group) => (
              <button
                key={group.category}
                onClick={() => setActiveCategory(group.category)}
                className="px-4 py-2 rounded-md text-xs font-bold uppercase tracking-widest transition-all duration-200"
                style={{
                  backgroundColor: activeCategory === group.category ? 'var(--interactive-base)' : 'transparent',
                  color: activeCategory === group.category ? 'var(--content-primary-inv)' : 'var(--content-tertiary)',
                }}
                onMouseEnter={(e) => {
                  if (activeCategory !== group.category) {
                    e.currentTarget.style.color = 'var(--content-body)';
                    e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== group.category) {
                    e.currentTarget.style.color = 'var(--content-tertiary)';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
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
                  className="group flex flex-col items-center gap-2 rounded-xl p-4 text-center transition-all duration-300 hover:shadow-xl"
                  style={{
                    border: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--surface-accent)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--interactive-base-30)';
                    e.currentTarget.style.backgroundColor = 'var(--surface-card)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.backgroundColor = 'var(--surface-accent)';
                  }}
                >
                  {skill.imageUrl ? (
                    <div className="w-12 h-12 rounded-lg p-2 group-hover:scale-110 transition-transform flex items-center justify-center shadow-lg" style={{ backgroundColor: 'var(--surface-base)' }}>
                      <img
                        src={skill.imageUrl}
                        alt={skill.name}
                        className="w-full h-full object-contain"
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold" style={{ backgroundColor: 'var(--skeleton)', color: 'var(--accent-brand)' }}>
                      {skill.name.charAt(0)}
                    </div>
                  )}
                  <span className="text-[11px] font-bold uppercase tracking-wider transition-colors leading-tight" style={{ color: 'var(--content-muted)' }}>
                    {skill.name}
                  </span>
                  <ProficiencyDots level={skill.proficiency} />
                </div>
              ))}
            </motion.div>
          )}
        </div>
      ) : (
        <p className="text-sm" style={{ color: 'var(--content-tertiary)' }}>
          Skills will appear here once added via the admin panel.
        </p>
      )}
    </motion.section>
  );
};

export default SkillsSection;
