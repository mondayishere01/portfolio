import { motion } from "framer-motion";
import { sectionVariants } from "../utils/animations";
import SectionHeader from "../components/SectionHeader";

const AboutSection = ({ about, loading }) => (
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
      {/* Profile Image (Optional but restored if exists) */}
      {about?.imageUrl && (
        <div className="shrink-0 group/img relative">
          <div className="absolute -inset-2 rounded-xl bg-[#ffeb00]/10 opacity-0 group-hover/img:opacity-100 transition-opacity blur-xl"></div>
          <img
            src={about.imageUrl}
            alt="Profile"
            className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover border-2 border-slate-700/50 grayscale hover:grayscale-0 transition-all duration-500 relative z-10"
          />
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

            {/* Resume Button */}
            {about?.resumeUrl && (
              <div className="mt-6">
                <a
                  href={about.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-[#ffeb00]/30 px-5 py-2 text-sm font-bold uppercase tracking-widest text-[#ffeb00] hover:bg-[#ffeb00]/10 hover:border-[#ffeb00] transition-all"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download CV
                </a>
              </div>
            )}
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
  </motion.section>
);

export default AboutSection;
