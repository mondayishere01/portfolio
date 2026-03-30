import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ContactForm from "../components/ContactForm";
import AboutSection from "../sections/AboutSection";
import ExperienceSection from "../sections/ExperienceSection";
import SkillsSection from "../sections/SkillsSection";
import ProjectsSection from "../sections/ProjectsSection";
import CertificationsSection from "../sections/CertificationsSection";
import Footer from "../components/Footer";
import {
  getAbout,
  getExperiences,
  getProjects,
  getSkills,
  getCertifications,
} from "../api";
import { motion } from "framer-motion";
import { sectionVariants } from "../utils/animations";
import SectionHeader from "../components/SectionHeader";

const Home = () => {
  const [about, setAbout] = useState(null);
  const [experiences, setExperiences] = useState([]);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [certifications, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, expRes, projRes, skillRes, certRes] =
          await Promise.all([
            getAbout().catch(() => ({ data: null })),
            getExperiences().catch(() => ({ data: [] })),
            getProjects().catch(() => ({ data: [] })),
            getSkills().catch(() => ({ data: [] })),
            getCertifications().catch(() => ({ data: [] })),
          ]);
        setAbout(aboutRes.data);
        setExperiences(Array.isArray(expRes.data) ? expRes.data : []);
        setProjects(Array.isArray(projRes.data) ? projRes.data : []);
        setSkills(Array.isArray(skillRes.data) ? skillRes.data : []);
        setCerts(Array.isArray(certRes.data) ? certRes.data : []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <Layout>
      <AboutSection about={about} loading={loading} />
      <ExperienceSection
        experiences={experiences}
        loading={loading}
      />

      <SkillsSection
        skills={skills}
        loading={loading}
      />

      <ProjectsSection
        projects={projects}
        loading={loading}
      />

      <CertificationsSection
        certifications={certifications}
        loading={loading}
      />

      {/* ─── Contact ─────────────────────────────── */}
      <motion.section
        id="contact"
        className="mb-12 scroll-mt-16 md:mb-16 lg:mb-24 lg:scroll-mt-24"
        aria-label="Contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <SectionHeader label="Contact" />
        <p className="mb-6 leading-relaxed" style={{ color: 'var(--content-muted)' }}>
          Have a question or want to work together? Drop me a message and I'll
          get back to you.
        </p>
        <ContactForm />
      </motion.section>

      <Footer />
    </Layout>
  );
};

export default Home;
