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
    <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4">
      <div
        className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[12px] border border-transparent transition-all duration-300 lg:block lg:group-hover:shadow-2xl lg:group-hover:-inset-x-0"
        style={{ '--tw-shadow-color': 'var(--shadow-subtle)' }}
        onMouseEnter={null}
      >
        <style>{`.group:hover > div:first-child { background: var(--surface-card) !important; border-color: var(--border-alpha-15) !important; }`}</style>
      </div>
      <header
        className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide sm:col-span-2 transition-all duration-300 lg:group-hover:pl-4"
        style={{ color: 'var(--content-tertiary)' }}
        aria-label={date}
      >
        {imageUrl && !imageError ? (
          <div
            className="w-20 h-20 rounded-lg p-2 mb-3 flex items-center justify-center overflow-hidden"
            style={{ backgroundColor: 'var(--surface-accent)', border: '1px solid var(--border-subtle)' }}
          >
            <img
              src={imageUrl}
              alt={company}
              onError={() => setImageError(true)}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className="w-20 h-20 rounded-lg p-2 mb-3 flex items-center justify-center overflow-hidden relative z-10"
            style={{ backgroundColor: 'var(--skeleton)', border: '1px solid var(--border-subtle)', color: 'var(--content-tertiary)' }}
          >
            <Briefcase size={32} />
          </div>
        )}
        {date}
      </header>
      <div className="z-10 sm:col-span-6 transition-all duration-300 lg:group-hover:pr-4">
        <h3 className="font-medium leading-snug" style={{ color: 'var(--content-body)' }}>
          <div>
            <a
              className="inline-flex items-baseline font-medium leading-tight group/link text-base transition-colors"
              href={companyUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${title} at ${company}`}
              style={{ color: 'var(--content-body)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-body)'}
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
        <ul className="mt-2 flex flex-wrap" aria-label="Technologies used">
          {tags &&
            tags.map((tag, index) => (
              <li key={index} className="mr-1.5 mt-2">
                <div
                  className="flex items-center rounded-full px-3 py-1 text-xs font-medium leading-5"
                  style={{ backgroundColor: 'var(--interactive-base-10)', color: 'var(--accent-brand)' }}
                >
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
