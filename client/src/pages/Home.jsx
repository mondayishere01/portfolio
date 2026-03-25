import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import ContactForm from "../components/ContactForm";
import AboutSection from "../sections/AboutSection";
import ExperienceSection from "../sections/ExperienceSection";
import SkillsSection from "../sections/SkillsSection";
import ProjectsSection from "../sections/ProjectsSection";
import CertificationsSection from "../sections/CertificationsSection";
import {
  getAbout,
  getExperiences,
  getFeaturedProjects,
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
            getFeaturedProjects().catch(() => ({ data: [] })),
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
      <ExperienceSection experiences={experiences} loading={loading} />
      <SkillsSection skills={skills} loading={loading} />
      <ProjectsSection projects={projects} loading={loading} />
      <CertificationsSection
        certifications={certifications}
        loading={loading}
      />

      {/* ─── Contact ─────────────────────────────── */}
      <motion.section
        id="contact"
        className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
        aria-label="Contact"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={sectionVariants}
      >
        <SectionHeader label="Contact" />
        <p className="mb-6 text-slate-400 leading-relaxed">
          Have a question or want to work together? Drop me a message and I'll
          get back to you.
        </p>
        <ContactForm />
      </motion.section>

      {/* ─── Footer ──────────────────────────────── */}
      <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0">
        <p>
          Designed in{" "}
          <a
            className="font-medium text-slate-400 hover:text-teal-300"
            href="https://www.figma.com/"
            target="_blank"
            rel="noreferrer"
          >
            Figma
          </a>{" "}
          and coded in{" "}
          <a
            className="font-medium text-slate-400 hover:text-teal-300"
            href="https://code.visualstudio.com/"
            target="_blank"
            rel="noreferrer"
          >
            VS Code
          </a>
          . Built with{" "}
          <a
            className="font-medium text-slate-400 hover:text-teal-300"
            href="https://react.dev/"
            target="_blank"
            rel="noreferrer"
          >
            React
          </a>{" "}
          and{" "}
          <a
            className="font-medium text-slate-400 hover:text-teal-300"
            href="https://tailwindcss.com/"
            target="_blank"
            rel="noreferrer"
          >
            Tailwind CSS
          </a>
          .
        </p>
      </footer>
    </Layout>
  );
};

export default Home;
