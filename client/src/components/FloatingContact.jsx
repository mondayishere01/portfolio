import React, { useState, useEffect, useRef } from "react";
import { getAbout } from "../api";
import {
  Mail,
  Phone,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Globe,
  User,
} from "lucide-react";

const FloatingContact = () => {
  const [about, setAbout] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const containerRef = useRef(null);

  const isOpen = isHovered || isClicked;

  useEffect(() => {
    getAbout()
      .then((res) => setAbout(res.data))
      .catch((err) => console.log("Failed to load about for contact", err));
  }, []);

  // Close on outside click for mobile and to clear "clicked" state
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsClicked(false);
        setIsHovered(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!about) return null;

  const socialLinks = about.socialLinks || [];
  if (socialLinks.length === 0) return null;

  const getIcon = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes("mail")) return <Mail size={16} />;
    if (p.includes("phone") || p.includes("call")) return <Phone size={16} />;
    if (p.includes("location") || p.includes("address"))
      return <MapPin size={16} />;
    if (p.includes("github")) return <Github size={16} />;
    if (p.includes("linkedin")) return <Linkedin size={16} />;
    if (p.includes("twitter") || p.includes("x")) return <Twitter size={16} />;
    return <Globe size={16} />;
  };

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Expanded Menu - Absolutely positioned to not affect parent layout when closed */}
      <div
        className={`absolute bottom-full right-0 mb-4 flex flex-col gap-2 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-[#111111]/90 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] flex flex-col gap-3 min-w-[220px]">
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#ffeb00] border-b border-white/10 pb-3 mb-1">
            Contact & Links
          </h4>

          <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {socialLinks.map((link, idx) => (
              <a
                key={idx}
                href={
                  link.platform.toLowerCase() === "email" && !link.url.startsWith("mailto:")
                    ? `mailto:${link.url}`
                    : link.url
                }
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 text-xs font-semibold text-slate-300 hover:text-[#ffeb00] transition-colors group py-2"
                data-cursor-text={link.platform}
              >
                <span className="p-2 rounded-full bg-white/5 group-hover:bg-[#ffeb00]/10 transition-colors shadow-inner">
                  {getIcon(link.platform)}
                </span>
                <span className="tracking-wide">{link.platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Avatar Trigger */}
      <button
        onClick={() => setIsClicked(!isClicked)}
        onMouseEnter={() => setIsHovered(true)}
        className="relative w-14 h-14 rounded-full border-2 border-slate-700 overflow-visible shadow-2xl hover:border-[#ffeb00] hover:scale-110 transition-all duration-300 focus:outline-none group bg-slate-800"
        aria-label="Contact and Social Links"
        data-cursor-text="Connect"
      >
        <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center text-slate-400">
          {about.imageUrl ? (
            <img
              src={about.imageUrl}
              alt="Profile"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <User size={24} />
          )}
        </div>

        {/* Online Indicator */}
        <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-[#111111] rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)] animate-pulse"></span>
      </button>
      
      {/* Global CSS for custom scrollbar in this widget */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 235, 0, 0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 235, 0, 0.6);
        }
      `}</style>
    </div>
  );
};

export default FloatingContact;
