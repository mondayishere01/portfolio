import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAbout, getSkills, getFeaturedProjects } from "../../api";

const ProfileSummary = () => {
  const [about, setAbout] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [aboutRes, skillRes, projRes] = await Promise.all([
          getAbout().catch(() => ({ data: null })),
          getSkills().catch(() => ({ data: [] })),
          getFeaturedProjects().catch(() => ({ data: [] })),
        ]);
        setAbout(aboutRes.data);
        setSkills(Array.isArray(skillRes.data) ? skillRes.data.slice(0, 8) : []);
        setProjects(Array.isArray(projRes.data) ? projRes.data.slice(0, 3) : []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-4 p-1">
        <div className="h-5 w-24 rounded bg-white/5" />
        <div className="h-3 w-full rounded bg-white/5" />
        <div className="h-3 w-3/4 rounded bg-white/5" />
        <div className="flex flex-wrap gap-1.5 mt-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-5 w-14 rounded-full bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  // Get first 2 sentences of bio
  const shortBio = about?.bio
    ? about.bio.split(/(?<=[.!?])\s+/).slice(0, 2).join(" ")
    : "Full Stack Developer passionate about building great web experiences.";

  return (
    <div className="space-y-5">
      {/* Name & Title */}
      <Link to="/" className="block group" data-cursor-text="Home">
        <h3 className="text-lg font-bold text-white group-hover:text-[#ffeb00] transition-colors leading-tight">
          {about?.name || "Devesh"}
        </h3>
        <p className="text-xs text-white/50 mt-0.5">
          {about?.title || "Full Stack Developer"}
        </p>
      </Link>

      {/* Short Bio */}
      <p className="text-xs text-white/40 leading-relaxed">
        {shortBio}
      </p>

      {/* Skills */}
      {skills.length > 0 && (
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">
            Skills
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {skills.map((skill) => (
              <span
                key={skill._id}
                className="rounded-full bg-teal-400/10 px-2 py-0.5 text-[10px] font-medium text-teal-300/80"
              >
                {skill.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {projects.length > 0 && (
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">
            Projects
          </h4>
          <div className="space-y-1.5">
            {projects.map((proj) => (
              <a
                key={proj._id}
                href={proj.link || "#"}
                target="_blank"
                rel="noreferrer"
                className="block text-xs text-white/60 hover:text-teal-300 transition-colors truncate"
                data-cursor-text="Visit"
              >
                {proj.title}
                <span className="text-white/20 ml-1">↗</span>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Social Links */}
      {about?.socialLinks?.length > 0 && (
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-2">
            Links
          </h4>
          <div className="flex flex-wrap gap-3">
            {about.socialLinks.map((link, i) => (
              <a
                key={i}
                href={link.platform?.toLowerCase() === "email" ? `mailto:${link.url}` : link.url}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] font-medium text-white/40 hover:text-white uppercase tracking-wider transition-colors"
              >
                {link.platform}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSummary;
