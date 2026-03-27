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
      {about?.tagline && !loading && (
        <h3 className="mb-4 text-2xl font-black uppercase tracking-tighter text-white sm:text-3xl lg:text-4xl">
            {about.tagline}
        </h3>
      )}
    <div className="flex flex-col md:flex-row gap-8 items-start">
      {/* Image removed as requested */}

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
          className="group inline-flex items-center gap-2 rounded-md bg-[#ffeb00] px-8 py-3 text-sm font-bold uppercase tracking-widest text-slate-900 hover:bg-[#ffdb00] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#ffeb00]/10"
          href={about.resumeUrl?.includes('cloudinary.com') 
            ? about.resumeUrl.replace('/upload/', '/upload/fl_attachment/') 
            : about.resumeUrl
          }
          download="Devesh_Pandey_Resume_2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
          type="application/pdf"
          aria-label="Download CV"
        >
          Download CV
          <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
        </a>
      </div>
    )}
    </motion.section>
  );
};

export default AboutSection;
