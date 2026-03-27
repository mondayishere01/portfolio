import React, { useState } from 'react';
import { Github, Folder, ArrowUpRight } from 'lucide-react';

const ProjectCard = ({ title, description, imageUrl, link, githubUrl, tags, year }) => {
    const [imageError, setImageError] = useState(false);
    return (
        <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
            <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[12px] border border-transparent transition-all duration-300 lg:block lg:group-hover:bg-[#111111] lg:group-hover:border-white/15 lg:group-hover:shadow-2xl lg:group-hover:inset-x-0"></div>
            <div className="z-10 sm:order-2 sm:col-span-6 transition-all duration-300 lg:group-hover:pr-4 lg:group-hover:pl-4">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{year}</span>
                </div>
                <h3>
                    <a className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-[#ffeb00] focus-visible:text-[#ffeb00]  group/link text-base" href={link} target="_blank" rel="noreferrer" aria-label={title}>
                        <span className="absolute -inset-x-4 -inset-y-4 hidden rounded transition-all duration-300 lg:block lg:group-hover:inset-x-0"></span>
                        <span>{title} <ArrowUpRight size={16} className="inline-block ml-1 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1" /></span>
                    </a>
                </h3>
                <p className="mt-2 text-sm leading-normal text-slate-400">
                    {description}
                </p>
                {githubUrl && (
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="relative z-10 mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 hover:text-[#ffeb00] transition"
                        aria-label={`${title} GitHub repository`}
                    >
                        <Github size={14} />
                        <span>Source Code</span>
                    </a>
                )}
                <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
                    {tags && tags.map((tag, index) => (
                        <li key={index} className="mr-1.5 mt-2">
                            <div className="flex items-center rounded-md border border-[#ffeb00]/20 bg-[#ffeb00]/10 px-3 py-1 text-xs font-medium leading-5 text-[#ffeb00]">{tag}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="z-10 sm:order-1 sm:col-span-2 transition-all duration-300 lg:group-hover:pl-4">
                {imageUrl && !imageError ? (
                    <img alt={title} loading="lazy" width="200" height="48" decoding="async" data-nimg="1" 
                        onError={() => setImageError(true)}
                        className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 sm:order-1 sm:col-span-2 sm:translate-y-1 w-full aspect-video object-cover" 
                        style={{ color: 'transparent' }} src={imageUrl} />
                ) : (
                    <div className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 w-full h-24 bg-slate-800/50 flex items-center justify-center text-slate-500 sm:translate-y-1">
                        <Folder size={32} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
