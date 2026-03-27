import React, { useState } from "react";
import { Briefcase, ArrowUpRight, User } from "lucide-react";

const ExperienceCard = ({
  date,
  title,
  company,
  companyUrl,
  description,
  tags,
  imageUrl,
}) => {
  const [imageError, setImageError] = useState(false);
  return (
    <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[12px] border border-transparent transition-all duration-300 lg:block lg:group-hover:bg-[#111111] lg:group-hover:border-white/15 lg:group-hover:shadow-2xl lg:group-hover:-inset-x-0"></div>
      <header
        className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2 transition-all duration-300 lg:group-hover:pl-4"
        aria-label={date}
      >
        {imageUrl && !imageError ? (
          <div className="w-20 h-20 rounded-lg bg-white p-2 mb-3 border border-slate-700/50 flex items-center justify-center overflow-hidden">
            <img
              src={imageUrl}
              alt={company}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-lg bg-slate-800/50 p-2 mb-3 border border-slate-700/50 flex items-center justify-center overflow-hidden text-slate-500 relative z-10">
            <Briefcase size={32} />
          </div>
        )}
        {date}
      </header>
      <div className="z-10 sm:col-span-6 transition-all duration-300 lg:group-hover:pr-4">
        <h3 className="font-medium leading-snug text-slate-200">
          <div>
            <a
              className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-[#ffeb00] focus-visible:text-[#ffeb00] group/link text-base"
              href={companyUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${title} at ${company}`}
            >
              <span className="absolute -inset-x-4 -inset-y-4 hidden rounded transition-all duration-300 lg:block lg:group-hover:-inset-x-0"></span>
              <span>
                {title} ·{" "}
                <span className="inline-block">
                  {company}
                  <ArrowUpRight
                    size={16}
                    className="inline-block ml-1 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1"
                  />
                </span>
              </span>
            </a>
          </div>
        </h3>
        <p className="mt-2 text-sm leading-normal">
          {description.split("\n").map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </p>
        <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
          {tags &&
            tags.map((tag, index) => (
              <li key={index} className="mr-1.5 mt-2">
                <div className="flex items-center rounded-full bg-[#ffeb00]/10 px-3 py-1 text-xs font-medium leading-5 text-[#ffeb00]">
                  {tag}
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default ExperienceCard;
