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
      {/* Expanded Menu */}
      <div
        className={`absolute bottom-full right-0 mb-4 flex flex-col gap-2 overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 translate-y-4 pointer-events-none"
        }`}
      >
        <div
          className="backdrop-blur-md rounded-2xl p-5 flex flex-col gap-3 min-w-[220px]"
          style={{
            backgroundColor: 'var(--surface-card)',
            border: '1px solid var(--border-alpha-10)',
            boxShadow: '0 8px 32px var(--shadow-subtle)',
          }}
        >
          <h4
            className="text-[10px] font-bold uppercase tracking-widest pb-3 mb-1"
            style={{ color: 'var(--accent-brand)', borderBottom: '1px solid var(--border-alpha-10)' }}
          >
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
                className="flex items-center gap-3 text-xs font-semibold transition-colors group py-2"
                data-cursor-text={link.platform}
                style={{ color: 'var(--content-body)' }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-brand)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-body)'}
              >
                <span
                  className="p-2 rounded-full transition-colors shadow-inner"
                  style={{ backgroundColor: 'var(--hover-bg)' }}
                >
                  {getIcon(link.platform)}
                </span>
                <span className="tracking-wide">
                  {link.platform.toLowerCase() === 'email' || link.platform.toLowerCase() === 'phone' 
                    ? link.url 
                    : link.platform}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Avatar Trigger */}
      <button
        onClick={() => setIsClicked(!isClicked)}
        onMouseEnter={() => setIsHovered(true)}
        className="relative w-14 h-14 rounded-full border-2 overflow-visible shadow-2xl hover:scale-110 transition-all duration-300 focus:outline-none group"
        style={{
          borderColor: 'var(--border-subtle)',
          backgroundColor: 'var(--surface-card)',
        }}
        onMouseEnter2={null}
        aria-label="Contact and Social Links"
        data-cursor-text="Connect"
      >
        <div
          className="w-full h-full rounded-full overflow-hidden flex items-center justify-center"
          style={{
            color: 'var(--accent-brand)',
            backgroundColor: 'var(--interactive-base-10)',
            border: '1px solid var(--interactive-base-20)',
          }}
        >
          <User size={28} strokeWidth={2.5} />
        </div>

        {/* Online Indicator */}
        <span
          className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full animate-pulse"
          style={{
            backgroundColor: 'var(--status-success)',
            border: '2px solid var(--surface-card)',
            boxShadow: '0 0 10px rgba(34,197,94,0.8)',
          }}
        ></span>
      </button>
      
      {/* Global CSS for custom scrollbar in this widget */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: var(--hover-bg);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--interactive-base-30);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--accent-brand);
        }
      `}</style>
    </div>
  );
};

export default FloatingContact;
