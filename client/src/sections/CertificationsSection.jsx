import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { sectionVariants, staggerContainer } from "../utils/animations";

const CertificationsSection = ({ certifications, loading }) => (
  <motion.section
    id="certifications"
    className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
    aria-label="Certifications"
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.2 }}
    variants={sectionVariants}
  >
    <SectionHeader label="Certifications" />
    {loading ? (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-3/4 rounded bg-slate-700/50 animate-pulse"
          />
        ))}
      </div>
    ) : certifications.length > 0 ? (
      <motion.ul
        className="space-y-3"
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {certifications.map((cert) => (
          <motion.li key={cert._id} variants={sectionVariants}>
            {cert.credentialUrl ? (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-2 text-slate-300 hover:text-[#ffeb00] transition"
              >
                <span className="text-sm font-medium">{cert.title}</span>
                <ExternalLink
                  size={14}
                  className="text-slate-500 group-hover:text-[#ffeb00] transition"
                />
              </a>
            ) : (
              <span className="text-sm font-medium text-slate-300">
                {cert.title}
              </span>
            )}
          </motion.li>
        ))}
      </motion.ul>
    ) : (
      <p className="text-slate-500 text-sm">
        Certifications will appear here once added via the admin panel.
      </p>
    )}
  </motion.section>
);

export default CertificationsSection;
