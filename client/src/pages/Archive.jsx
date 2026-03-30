import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getProjects } from '../api';

const Archive = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await getProjects();
                setProjects(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error('Failed to fetch projects:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    return (
        <div className="min-h-screen px-6 py-12 md:px-12 md:py-20 lg:pl-3 lg:pr-12" style={{ backgroundColor: 'var(--surface-base)' }}>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mt-8" style={{ color: 'var(--content-body)' }}>All Projects</h1>

            <table className="mt-12 w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 px-6 py-5 backdrop-blur" style={{ borderBottom: '1px solid var(--border-alpha-10)', backgroundColor: 'var(--surface-base-75)' }}>
                    <tr>
                        <th className="py-4 pr-8 text-sm font-semibold" style={{ color: 'var(--content-body)' }}>Year</th>
                        <th className="py-4 pr-8 text-sm font-semibold" style={{ color: 'var(--content-body)' }}>Project</th>
                        <th className="hidden py-4 pr-8 text-sm font-semibold lg:table-cell" style={{ color: 'var(--content-body)' }}>Built with</th>
                        <th className="hidden py-4 pr-8 text-sm font-semibold sm:table-cell" style={{ color: 'var(--content-body)' }}>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <tr key={i} className="animate-pulse" style={{ borderBottom: '1px solid var(--border-alpha-10)' }}>
                                <td className="py-4 pr-8"><div className="h-4 w-12 rounded" style={{ backgroundColor: 'var(--skeleton)' }} /></td>
                                <td className="py-4 pr-8"><div className="h-4 w-40 rounded" style={{ backgroundColor: 'var(--skeleton)' }} /></td>
                                <td className="hidden py-4 pr-8 lg:table-cell"><div className="h-4 w-32 rounded" style={{ backgroundColor: 'var(--skeleton)' }} /></td>
                                <td className="hidden py-4 sm:table-cell"><div className="h-4 w-20 rounded" style={{ backgroundColor: 'var(--skeleton)' }} /></td>
                            </tr>
                        ))
                    ) : projects.length > 0 ? (
                        projects.map((proj, index) => (
                            <motion.tr
                                key={proj._id}
                                className="last:border-none"
                                style={{ borderBottom: '1px solid var(--border-alpha-10)' }}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <td className="py-4 pr-8 align-top text-sm" style={{ color: 'var(--content-muted)' }}>
                                    {proj.year || new Date(proj.createdAt).getFullYear()}
                                </td>
                                <td className="py-4 pr-8 align-top">
                                    <div className="font-semibold leading-snug" style={{ color: 'var(--content-body)' }}>
                                        {proj.title}
                                    </div>
                                    {proj.description && (
                                        <div className="mt-2 text-xs leading-relaxed space-y-1" style={{ color: 'var(--content-muted)' }}>
                                            {proj.description.split("\n").map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="hidden py-4 pr-8 align-top lg:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {proj.tags?.map((tag, i) => (
                                            <span key={i} className="rounded-full px-3 py-1 text-xs font-medium" style={{ backgroundColor: 'var(--interactive-base-10)', color: 'var(--accent-brand)' }}>
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="hidden py-4 align-top sm:table-cell">
                                    {proj.link && (
                                        <a
                                            href={proj.link}
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
                                No projects found. Add some from the admin panel!
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Archive;
