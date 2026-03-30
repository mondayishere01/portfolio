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
        <h3 className="mb-4 text-2xl font-black uppercase tracking-tighter sm:text-3xl lg:text-4xl" style={{ color: 'var(--content-primary)' }}>
          {about.tagline}
        </h3>
      )}
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex-1 leading-relaxed" style={{ color: 'var(--content-muted)' }}>
          {loading ? (
            <div className="space-y-3">
              <div className="h-4 w-full rounded animate-pulse" style={{ backgroundColor: 'var(--skeleton)' }} />
              <div className="h-4 w-5/6 rounded animate-pulse" style={{ backgroundColor: 'var(--skeleton)' }} />
              <div className="h-4 w-4/6 rounded animate-pulse" style={{ backgroundColor: 'var(--skeleton)' }} />
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
      {about?.resumeUrl && !loading && (
        <div className="mt-8 flex justify-start">
          <button
            className="group inline-flex items-center gap-2 rounded-md px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer"
            style={{
              backgroundColor: 'var(--interactive-base)',
              color: 'var(--content-primary-inv)',
              boxShadow: '0 10px 15px -3px var(--interactive-base-10)',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--interactive-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--interactive-base)'}
            onClick={async () => {
              try {
                const response = await fetch(about.resumeUrl);
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Devesh_Pandey_Resume.pdf';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
              } catch {
                window.open(about.resumeUrl, '_blank');
              }
            }}
            aria-label="Download CV"
          >
            Download CV
            <Download size={16} className="transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>
      )}
    </motion.section>
  );
};

export default AboutSection;
