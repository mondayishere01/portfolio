import React, { useState } from 'react';
import { Github, Folder, ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ title, description, imageUrl, link, githubUrl, tags, year }) => {
    const [imageError, setImageError] = useState(false);
    return (
        <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
            <div
                className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[12px] border border-transparent transition-all duration-300 lg:block lg:group-hover:shadow-2xl lg:group-hover:inset-x-0"
                style={{ '--tw-shadow-color': 'var(--shadow-subtle)' }}
            >
                <style>{`.group:hover > div:first-child { background: var(--surface-card) !important; border-color: var(--border-alpha-15) !important; }`}</style>
            </div>
            <div className="z-10 sm:order-2 sm:col-span-6 transition-all duration-300 lg:group-hover:pr-4 lg:group-hover:pl-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--content-tertiary)' }}>{year}</span>
                </div>
                <h3>
                    <a
                        className="inline-flex items-baseline font-medium leading-tight group/link text-base transition-colors"
                        href={link} target="_blank" rel="noreferrer" aria-label={title}
                        style={{ color: 'var(--content-body)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-body)'}
                    >
                        <span className="absolute -inset-x-4 -inset-y-4 hidden rounded transition-all duration-300 lg:block lg:group-hover:inset-x-0"></span>
                        <span>{title} <ArrowUpRight size={16} className="inline-block ml-1 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" /></span>
                    </a>
                </h3>
                <p className="mt-2 text-sm leading-normal" style={{ color: 'var(--content-muted)' }}>
                    {description ? (
                        description.split("\n").map((line, i) => (
                            <span key={i} className="block">
                                {line}
                            </span>
                        ))
                    ) : (
                        <span>No description provided.</span>
                    )}
                </p>
                {githubUrl && (
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="relative z-10 mt-2 inline-flex items-center gap-1.5 text-xs font-medium transition"
                        aria-label={`${title} GitHub repository`}
                        style={{ color: 'var(--content-muted)' }}
                        onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
                        onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-muted)'}
                    >
                        <Github size={14} />
                        <span>Source Code</span>
                    </a>
                )}
                <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                    {tags && tags.map((tag, index) => (
                        <li key={index} className="mr-1.5 mt-2">
                            <div
                                className="flex items-center rounded-md px-3 py-1 text-xs font-medium leading-5"
                                style={{ backgroundColor: 'var(--interactive-base-10)', border: '1px solid var(--interactive-base-20)', color: 'var(--accent-brand)' }}
                            >{tag}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="z-10 sm:order-1 sm:col-span-2 transition-all duration-300 lg:group-hover:pl-4">
                {imageUrl && !imageError ? (
                    <img alt={title} loading="lazy" width="200" height="48" decoding="async" data-nimg="1"
                        onError={() => setImageError(true)}
                        className="rounded transition sm:order-1 sm:col-span-2 sm:translate-y-1 w-full aspect-video object-cover"
                        style={{ color: 'transparent', border: '2px solid var(--border-alpha-10)' }} src={imageUrl} />
                ) : (
                    <div
                        className="rounded w-full h-24 flex items-center justify-center sm:translate-y-1 transition"
                        style={{ border: '2px solid var(--border-alpha-10)', backgroundColor: 'var(--skeleton)', color: 'var(--content-tertiary)' }}
                    >
                        <Folder size={32} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
