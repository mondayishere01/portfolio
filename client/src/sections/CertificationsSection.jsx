import { motion } from "framer-motion";
import { ExternalLink, Award } from "lucide-react";
import SectionHeader from "../components/SectionHeader";
import { sectionVariants, staggerContainer } from "../utils/animations";

const CertificationsSection = ({ certifications, loading }) => (
  <section
    id="certifications"
    className="mb-12 scroll-mt-16 md:mb-16 lg:mb-24 lg:scroll-mt-24"
    aria-label="Certifications"
  >
    <SectionHeader label="Certifications" />
    {loading ? (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-6 w-3/4 rounded animate-pulse"
            style={{ backgroundColor: 'var(--skeleton)' }}
          />
        ))}
      </div>
    ) : certifications.length > 0 ? (
      <div className="flex flex-col gap-6">
        {certifications.map((cert) => (
          <div key={cert._id} className="group relative flex items-center gap-4 transition-all">
            {cert.imageUrl ? (
              <div className="w-10 h-10 rounded p-1 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-105" style={{ backgroundColor: 'var(--surface-accent)' }}>
                <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div
                className="w-10 h-10 rounded flex items-center justify-center shrink-0 transition-colors"
                style={{ backgroundColor: 'var(--interactive-base-05)', color: 'var(--content-faint)' }}
              >
                <Award size={18} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3
                className="text-sm font-medium transition-colors leading-snug"
                style={{ color: 'var(--content-body)' }}
              >
                {cert.title}
              </h3>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 mt-1 text-[9px] font-bold uppercase tracking-wider transition-colors"
                  style={{ color: 'var(--content-tertiary)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-tertiary)'}
                >
                  Verify <ExternalLink size={9} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-sm" style={{ color: 'var(--content-tertiary)' }}>
        Certifications will appear here once added via the admin panel.
      </p>
    )}
  </section>
);

export default CertificationsSection;
