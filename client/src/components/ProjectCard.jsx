import React from 'react';
import { Github } from 'lucide-react';

const ProjectCard = ({ title, description, imageUrl, link, githubUrl, tags, year }) => {
    return (
        <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
            <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[12px] transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-[#111111] lg:group-hover:border lg:group-hover:border-white/15 lg:group-hover:shadow-2xl"></div>
            <div className="z-10 sm:order-2 sm:col-span-6">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{year}</span>
                </div>
                <h3>
                    <a className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-[#ffeb00] focus-visible:text-[#ffeb00]  group/link text-base" href={link} target="_blank" rel="noreferrer" aria-label={title}>
                        <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
                        <span>{title} <span className="inline-block"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px" aria-hidden="true"><path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd"></path></svg></span></span>
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
                            <div className="flex items-center rounded-full bg-[#ffeb00]/10 px-3 py-1 text-xs font-medium leading-5 text-[#ffeb00]">{tag}</div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="z-10 sm:order-1 sm:col-span-2">
                {imageUrl ? (
                    <img alt={title} loading="lazy" width="200" height="48" decoding="async" data-nimg="1" className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 sm:order-1 sm:col-span-2 sm:translate-y-1" style={{ color: 'transparent' }} src={imageUrl} />
                ) : (
                    <div className="rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 w-full h-24 bg-slate-800/50"></div>
                )}
            </div>
        </div>
    );
};

export default ProjectCard;
