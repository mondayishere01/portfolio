import { motion } from "framer-motion";
import { sectionVariants } from "../utils/animations";
import SectionHeader from "../components/SectionHeader";
import { User, Download } from "lucide-react";
import { useState } from "react";

const AboutSection = ({ about, loading }) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.section
      id="about"
      className="mb-12 scroll-mt-16 md:mb-16 lg:mb-24 lg:scroll-mt-24"
      aria-label="About me"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <SectionHeader label="About" />
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Profile Image with Fallback */}
      {about?.imageUrl && !imageError ? (
        <div className="shrink-0 group/img relative">
          <div className="absolute -inset-2 rounded-xl bg-[#ffeb00]/10 opacity-0 group-hover/img:opacity-100 transition-opacity blur-xl"></div>
          <img
            src={about.imageUrl}
            alt="Profile"
            onError={() => setImageError(true)}
            className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover border-2 border-slate-700/50 grayscale hover:grayscale-0 transition-all duration-500 relative z-10"
          />
        </div>
      ) : (
        <div className="shrink-0 w-32 h-32 md:w-40 md:h-40 rounded-xl bg-slate-800/50 border-2 border-slate-700/50 flex items-center justify-center text-slate-500 relative z-10">
          <User size={48} />
        </div>
      )}

      <div className="flex-1 text-slate-400 leading-relaxed">
        {loading ? (
          <div className="space-y-3">
            <div className="h-4 w-full rounded bg-slate-700/50 animate-pulse" />
            <div className="h-4 w-5/6 rounded bg-slate-700/50 animate-pulse" />
            <div className="h-4 w-4/6 rounded bg-slate-700/50 animate-pulse" />
          </div>
        ) : about?.bio ? (
          <>
            {about.bio.split("\n").map((paragraph, i) => (
              <p key={i} className="mb-4">
                {paragraph}
              </p>
            ))}
          </>
        ) : (
          <p className="mb-4">
            I'm a passionate full-stack developer who loves building things for
            the web. I focus on creating accessible, performant, and beautifully
            crafted digital experiences.
          </p>
        )}
      </div>
    </div>
    {/* Download CV below bio, aligned to section header */}
    {about?.resumeUrl && !loading && (
      <div className="mt-8 flex justify-start">
        <a
          className="inline-flex items-center gap-2 rounded-md bg-[#ffeb00] px-8 py-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:bg-[#ffdb00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffeb00]/10"
          href={about.resumeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Download CV"
        >
          Download CV
          <Download size={16} />
        </a>
      </div>
    )}
    </motion.section>
  );
};

export default AboutSection;
