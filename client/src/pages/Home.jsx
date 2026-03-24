import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import Layout from '../components/Layout';
import ExperienceCard from '../components/ExperienceCard';
import ProjectCard from '../components/ProjectCard';
import ContactForm from '../components/ContactForm';
import { getAbout, getExperiences, getFeaturedProjects, getSkills, getCertifications } from '../api';

const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1 } },
};

const SKILL_CATEGORIES = [
    'Languages',
    'Frontend',
    'Backend',
    'Databases',
    'Cloud & DevOps',
    'Tools & Practices',
];

const ProficiencyDots = ({ level }) => (
    <div className="flex gap-1 mt-1">
        {[1, 2, 3, 4, 5].map((i) => (
            <span
                key={i}
                className={`inline-block w-2 h-2 rounded-full ${
                    i <= level ? 'bg-teal-400' : 'bg-slate-600'
                }`}
            />
        ))}
    </div>
);

const Home = () => {
    const [about, setAbout] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certifications, setCertifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [aboutRes, expRes, projRes, skillRes, certRes] = await Promise.all([
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
                setCertifications(Array.isArray(certRes.data) ? certRes.data : []);
            } catch (err) {
                console.error('Failed to fetch data:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Group skills by category
    const groupedSkills = SKILL_CATEGORIES.map((cat) => ({
        category: cat,
        items: skills.filter((s) => s.category === cat),
    })).filter((g) => g.items.length > 0);

    return (
        <Layout>
            {/* ─── About ─────────────────────────────────── */}
            <motion.section
                id="about"
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                aria-label="About me"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">About</h2>
                </div>
                <div className="text-slate-400 leading-relaxed">
                    {loading ? (
                        <div className="space-y-3">
                            <div className="h-4 w-full rounded bg-slate-700/50 animate-pulse" />
                            <div className="h-4 w-5/6 rounded bg-slate-700/50 animate-pulse" />
                            <div className="h-4 w-4/6 rounded bg-slate-700/50 animate-pulse" />
                        </div>
                    ) : about?.bio ? (
                        about.bio.split('\n').map((paragraph, i) => (
                            <p key={i} className="mb-4">{paragraph}</p>
                        ))
                    ) : (
                        <p className="mb-4">
                            I'm a passionate full-stack developer who loves building things for the web.
                            I focus on creating accessible, performant, and beautifully crafted digital experiences.
                        </p>
                    )}
                </div>
            </motion.section>

            {/* ─── Experience ────────────────────────────── */}
            <motion.section
                id="experience"
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                aria-label="Work experience"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
            >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Experience</h2>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    {loading ? (
                        <div className="space-y-8">
                            {[1, 2].map((i) => (
                                <div key={i} className="grid sm:grid-cols-8 gap-4 animate-pulse">
                                    <div className="sm:col-span-2 h-4 w-24 rounded bg-slate-700/50" />
                                    <div className="sm:col-span-6 space-y-2">
                                        <div className="h-5 w-48 rounded bg-slate-700/50" />
                                        <div className="h-4 w-full rounded bg-slate-700/50" />
                                        <div className="h-4 w-3/4 rounded bg-slate-700/50" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : experiences.length > 0 ? (
                        experiences.map((exp) => (
                            <motion.div key={exp._id} variants={sectionVariants} className="mb-12">
                                <ExperienceCard
                                    date={exp.date}
                                    title={exp.title}
                                    company={exp.company}
                                    companyUrl={exp.companyUrl || '#'}
                                    description={exp.description}
                                    tags={exp.tags || []}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <ExperienceCard
                            date="2024 — Present"
                            title="Full Stack Developer"
                            company="Freelance"
                            companyUrl="#"
                            description="Building accessible, performant, and beautifully crafted web applications for diverse clients."
                            tags={['React', 'Node.js', 'MongoDB', 'Express']}
                        />
                    )}
                </motion.div>
            </motion.section>

            {/* ─── Skills ──────────────────────────────────── */}
            <motion.section
                id="skills"
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                aria-label="Skills"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
            >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Skills</h2>
                </div>
                {loading ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="h-24 rounded-lg bg-slate-700/30 animate-pulse" />
                        ))}
                    </div>
                ) : groupedSkills.length > 0 ? (
                    <div className="space-y-10">
                        {groupedSkills.map((group) => (
                            <div key={group.category}>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">{group.category}</h3>
                                <motion.div
                                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3"
                                    variants={staggerContainer}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                >
                                    {group.items.map((skill) => (
                                        <motion.div
                                            key={skill._id}
                                            variants={sectionVariants}
                                            className="group flex flex-col items-center gap-2 rounded-lg border border-slate-700/50 bg-slate-800/30 p-3 text-center transition hover:border-teal-400/30 hover:bg-slate-800/60"
                                        >
                                            {skill.imageUrl ? (
                                                <img
                                                    src={skill.imageUrl}
                                                    alt={skill.name}
                                                    className="w-10 h-10 object-contain"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded bg-slate-700/50 flex items-center justify-center text-lg font-bold text-teal-400">
                                                    {skill.name.charAt(0)}
                                                </div>
                                            )}
                                            <span className="text-xs font-medium text-slate-300 leading-tight">{skill.name}</span>
                                            <ProficiencyDots level={skill.proficiency} />
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-slate-500 text-sm">Skills will appear here once added via the admin panel.</p>
                )}
            </motion.section>

            {/* ─── Projects ──────────────────────────────── */}
            <motion.section
                id="projects"
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                aria-label="Selected projects"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                variants={sectionVariants}
            >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Projects</h2>
                </div>
                <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                    {loading ? (
                        <div className="space-y-8">
                            {[1, 2].map((i) => (
                                <div key={i} className="grid sm:grid-cols-8 gap-4 animate-pulse">
                                    <div className="sm:col-span-2 h-24 rounded bg-slate-700/50" />
                                    <div className="sm:col-span-6 space-y-2">
                                        <div className="h-5 w-48 rounded bg-slate-700/50" />
                                        <div className="h-4 w-full rounded bg-slate-700/50" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : projects.length > 0 ? (
                        projects.map((proj) => (
                            <motion.div key={proj._id} variants={sectionVariants} className="mb-12">
                                <ProjectCard
                                    title={proj.title}
                                    description={proj.description}
                                    imageUrl={proj.imageUrl || ''}
                                    link={proj.link || '#'}
                                    githubUrl={proj.githubUrl || ''}
                                    tags={proj.tags || []}
                                />
                            </motion.div>
                        ))
                    ) : (
                        <ProjectCard
                            title="Portfolio Website"
                            description="A modern, dark-mode portfolio built with the MERN stack, featuring an admin panel for content management."
                            link="#"
                            imageUrl=""
                            tags={['React', 'Express', 'MongoDB', 'Tailwind']}
                        />
                    )}
                </motion.div>

                <div className="mt-12">
                    <Link
                        to="/archive"
                        className="inline-flex items-center font-medium leading-tight text-slate-200 hover:text-teal-300 group"
                    >
                        View Full Project Archive
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-2" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
                        </svg>
                    </Link>
                </div>
            </motion.section>

            {/* ─── Certifications ───────────────────────────── */}
            <motion.section
                id="certifications"
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                aria-label="Certifications"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={sectionVariants}
            >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Certifications</h2>
                </div>
                {loading ? (
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-6 w-3/4 rounded bg-slate-700/50 animate-pulse" />
                        ))}
                    </div>
                ) : certifications.length > 0 ? (
                    <motion.ul className="space-y-3" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                        {certifications.map((cert) => (
                            <motion.li key={cert._id} variants={sectionVariants}>
                                {cert.credentialUrl ? (
                                    <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group inline-flex items-center gap-2 text-slate-300 hover:text-teal-300 transition"
                                    >
                                        <span className="text-sm font-medium">{cert.title}</span>
                                        <ExternalLink size={14} className="text-slate-500 group-hover:text-teal-400 transition" />
                                    </a>
                                ) : (
                                    <span className="text-sm font-medium text-slate-300">{cert.title}</span>
                                )}
                            </motion.li>
                        ))}
                    </motion.ul>
                ) : (
                    <p className="text-slate-500 text-sm">Certifications will appear here once added via the admin panel.</p>
                )}
            </motion.section>

            {/* ─── Contact ───────────────────────────────── */}
            <motion.section
                id="contact"
                className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
                aria-label="Contact"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={sectionVariants}
            >
                <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">Contact</h2>
                </div>
                <div>
                    <p className="mb-6 text-slate-400 leading-relaxed">
                        Have a question or want to work together? Drop me a message below and I'll get back to you as soon as possible.
                    </p>
                    <ContactForm />
                </div>
            </motion.section>

            {/* ─── Footer ────────────────────────────────── */}
            <footer className="max-w-md pb-16 text-sm text-slate-500 sm:pb-0">
                <p>
                    Loosely designed in{' '}
                    <a className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300" href="https://www.figma.com/" target="_blank" rel="noreferrer">Figma</a>
                    {' '}and coded in{' '}
                    <a className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300" href="https://code.visualstudio.com/" target="_blank" rel="noreferrer">Visual Studio Code</a>.
                    Built with{' '}
                    <a className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300" href="https://react.dev/" target="_blank" rel="noreferrer">React</a>
                    {' '}and{' '}
                    <a className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300" href="https://tailwindcss.com/" target="_blank" rel="noreferrer">Tailwind CSS</a>,
                    deployed with{' '}
                    <a className="font-medium text-slate-400 hover:text-teal-300 focus-visible:text-teal-300" href="https://vercel.com/" target="_blank" rel="noreferrer">Vercel</a>.
                </p>
            </footer>
        </Layout>
    );
};

export default Home;
