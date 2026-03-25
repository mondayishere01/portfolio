import { motion } from "framer-motion";
import { sectionVariants } from "../utils/animations";
import SectionHeader from "../components/SectionHeader";

const AboutSection = ({ about, loading }) => (
  <motion.section
    id="about"
    className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    aria-label="About me"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.3 }}
    variants={sectionVariants}
  >
    <SectionHeader label="About" />
    <div className="text-slate-400 leading-relaxed">
      {loading ? (
        <div className="space-y-3">
          <div className="h-4 w-full rounded bg-slate-700/50 animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-slate-700/50 animate-pulse" />
          <div className="h-4 w-4/6 rounded bg-slate-700/50 animate-pulse" />
        </div>
      ) : about?.bio ? (
        about.bio.split("\n").map((paragraph, i) => (
          <p key={i} className="mb-4">
            {paragraph}
          </p>
        ))
      ) : (
        <p className="mb-4">
          I'm a passionate full-stack developer who loves building things for
          the web. I focus on creating accessible, performant, and beautifully
          crafted digital experiences.
        </p>
      )}
    </div>
  </motion.section>
);

export default AboutSection;
