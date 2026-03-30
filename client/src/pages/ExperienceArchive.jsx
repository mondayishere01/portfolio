import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getExperiences } from '../api';

const ExperienceArchive = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperiences = async () => {
            try {
                const res = await getExperiences();
                setExperiences(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Failed to fetch experiences:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchExperiences();
    }, []);

    return (
        <div className="min-h-screen px-6 py-12 md:px-12 md:py-20 lg:pl-3 lg:pr-12" style={{ backgroundColor: 'var(--surface-base)' }}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mt-8" style={{ color: 'var(--content-body)' }}>Full Experience Archive</h1>

            <table className="mt-12 w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 px-6 py-5 backdrop-blur" style={{ borderBottom: '1px solid var(--border-alpha-10)', backgroundColor: 'var(--surface-base-75)' }}>
                    <tr>
                        <th className="py-4 pr-8 text-sm font-semibold" style={{ color: 'var(--content-body)' }}>Date</th>
                        <th className="py-4 pr-8 text-sm font-semibold" style={{ color: 'var(--content-body)' }}>Role & Company</th>
                        <th className="hidden py-4 pr-8 text-sm font-semibold lg:table-cell" style={{ color: 'var(--content-body)' }}>Technologies</th>
                        <th className="hidden py-4 pr-8 text-sm font-semibold sm:table-cell" style={{ color: 'var(--content-body)' }}>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <tr key={i} className="animate-pulse" style={{ borderBottom: '1px solid var(--border-alpha-10)' }}>
                                <td className="py-4 pr-8"><div className="h-4 w-24 rounded" style={{ backgroundColor: 'var(--skeleton)' }} /></td>
                                <td className="py-4 pr-8"><div className="h-4 w-40 rounded" style={{ backgroundColor: 'var(--skeleton)' }} /></td>
                                <td className="hidden py-4 pr-8 lg:table-cell"><div className="h-4 w-32 rounded" style={{ backgroundColor: 'var(--skeleton)' }} /></td>
                                <td className="hidden py-4 sm:table-cell"><div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--skeleton)' }} /></td>
                            </tr>
                        ))
                    ) : experiences.length > 0 ? (
                        experiences.map((exp, index) => (
                            <motion.tr
                                key={exp._id}
                                className="last:border-none"
                                style={{ borderBottom: '1px solid var(--border-alpha-10)' }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <td className="py-4 pr-8 align-top text-sm" style={{ color: 'var(--content-muted)' }}>
                                    {exp.date}
                                </td>
                                <td className="py-4 pr-8 align-top">
                                    <div className="font-semibold leading-snug" style={{ color: 'var(--content-body)' }}>{exp.title}</div>
                                    <div className="text-sm mt-1" style={{ color: 'var(--content-tertiary)' }}>{exp.company}</div>
                                    {exp.description && (
                                        <div className="mt-2 text-xs leading-relaxed space-y-1" style={{ color: 'var(--content-muted)' }}>
                                            {exp.description.split("\n").map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="hidden py-4 pr-8 align-top lg:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {exp.tags?.map((tag, i) => (
                                            <span key={i} className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'var(--interactive-base-10)', color: 'var(--accent-brand)' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="hidden py-4 align-top sm:table-cell">
                                    {exp.companyUrl && exp.companyUrl !== "#" && (
                                        <a
                                            href={exp.companyUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-sm transition"
                                            style={{ color: 'var(--content-muted)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
                                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-muted)'}
                                        >
                                            Link ↗
                                        </a>
                                    )}
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-8 text-center" style={{ color: 'var(--content-tertiary)' }}>
                                No experience records found. Add some from the admin panel!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default ExperienceArchive;
