import React from "react";

const ExperienceCard = ({
  date,
  title,
  company,
  companyUrl,
  description,
  tags,
  imageUrl,
}) => {
  return (
    <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-[12px] transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-[#111111] lg:group-hover:border lg:group-hover:border-white/15 lg:group-hover:shadow-2xl"></div>
      <header
        className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2"
        aria-label={date}
      >
        {imageUrl && (
          <div className="w-12 h-12 rounded-lg bg-white p-1.5 mb-3 border border-slate-700/50 flex items-center justify-center overflow-hidden">
            <img
              src={imageUrl}
              alt={company}
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
        )}
        {date}
      </header>
      <div className="z-10 sm:col-span-6">
        <h3 className="font-medium leading-snug text-slate-200">
          <div>
            <a
              className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-[#ffeb00] focus-visible:text-[#ffeb00] border-b border-transparent hover:border-[#ffeb00] group/link text-base"
              href={companyUrl}
              target="_blank"
              rel="noreferrer"
              aria-label={`${title} at ${company}`}
            >
              <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
              <span>
                {title} ·{" "}
                <span className="inline-block">
                  {company}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
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
