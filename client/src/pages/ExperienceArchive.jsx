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
        <div className="min-h-screen bg-black px-6 py-12 md:px-12 md:py-20 lg:pl-3 lg:pr-12">
            <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl mt-8">Full Experience Archive</h1>

            <table className="mt-12 w-full border-collapse text-left">
                <thead className="sticky top-0 z-10 border-b border-slate-300/10 bg-black/75 px-6 py-5 backdrop-blur">
                    <tr>
                        <th className="py-4 pr-8 text-sm font-semibold text-slate-200">Date</th>
                        <th className="py-4 pr-8 text-sm font-semibold text-slate-200">Role & Company</th>
                        <th className="hidden py-4 pr-8 text-sm font-semibold text-slate-200 lg:table-cell">Technologies</th>
                        <th className="hidden py-4 pr-8 text-sm font-semibold text-slate-200 sm:table-cell">Link</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <tr key={i} className="border-b border-slate-300/10 animate-pulse">
                                <td className="py-4 pr-8"><div className="h-4 w-24 rounded bg-slate-700/50" /></td>
                                <td className="py-4 pr-8"><div className="h-4 w-40 rounded bg-slate-700/50" /></td>
                                <td className="hidden py-4 pr-8 lg:table-cell"><div className="h-4 w-32 rounded bg-slate-700/50" /></td>
                                <td className="hidden py-4 sm:table-cell"><div className="h-4 w-20 rounded bg-slate-700/50" /></td>
                            </tr>
                        ))
                    ) : experiences.length > 0 ? (
                        experiences.map((exp, index) => (
                            <motion.tr
                                key={exp._id}
                                className="border-b border-slate-300/10 last:border-none"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <td className="py-4 pr-8 align-top text-sm text-slate-400">
                                    {exp.date}
                                </td>
                                <td className="py-4 pr-8 align-top">
                                    <div className="font-semibold leading-snug text-slate-200">{exp.title}</div>
                                    <div className="text-sm text-slate-500 mt-1">{exp.company}</div>
                                    {exp.description && (
                                        <div className="mt-2 text-xs leading-relaxed text-slate-400 space-y-1">
                                            {exp.description.split("\n").map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))}
                                        </div>
                                    )}
                                </td>
                                <td className="hidden py-4 pr-8 align-top lg:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {exp.tags?.map((tag, i) => (
                                            <span key={i} className="rounded-full bg-[#ffeb00]/10 px-3 py-1 text-xs font-medium text-[#ffeb00]">
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
                                            className="text-sm text-slate-400 hover:text-[#ffeb00] transition"
                                        >
                                            Link ↗
                                        </a>
                                    )}
                                </td>
                            </motion.tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="py-8 text-center text-slate-500">
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
