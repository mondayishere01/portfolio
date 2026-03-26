import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { id: "about", label: "About", path: "/", isAnchor: true },
  { id: "experience", label: "Experience", path: "/", isAnchor: true },
  { id: "skills", label: "Skills", path: "/", isAnchor: true },
  { id: "projects", label: "Projects", path: "/", isAnchor: true },
  { id: "certifications", label: "Certifications", path: "/", isAnchor: true },
  { id: "contact", label: "Contact", path: "/", isAnchor: true },
  { id: "blog", label: "Blog", path: "/blog", isAnchor: false },
  { id: "archive", label: "Archive", path: "/archive", isAnchor: false },
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "Twitter", href: "https://twitter.com" },
];

const PAGE_LABELS = {
  "/": "Home",
  "/blog": "Blog",
  "/archive": "Archive",
};

const SCROLL_THRESHOLD = 60;

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const boxRef = useRef(null);

  const currentPage = PAGE_LABELS[location.pathname] ?? "Page";

  // pill mode = scrolled on home, any other page, OR mobile viewport
  const isPill = !isHome || scrolled || isMobile;

  // mobile detection
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (isOpen && boxRef.current && !boxRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  // lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleAnchorClick = (e, item) => {
    e.preventDefault();
    setIsOpen(false);
    if (isHome) {
      document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      sessionStorage.setItem("scrollTo", item.id);
      window.location.href = "/";
    }
  };

  return (
    <>
      {/* Blur backdrop — only when pill is open */}
      <div
        className={`fixed inset-0 z-40 backdrop-blur-sm bg-black/40 transition-opacity duration-500 ${
          isOpen && isPill
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/*
       * Single container that morphs between:
       *   full-bar  → top:0, left:0, right:0, no border, no bg, no radius
       *   pill      → top:20px, left:20px, dynamic width
       *
       * Mobile pill: calc(100% - 40px) — full width with margins
       * Desktop pill: 320px
       */}
      <div
        ref={boxRef}
        className="fixed z-50 overflow-hidden"
        style={{
          top: "20px",
          left: "20px",
          right: isPill ? "auto" : "20px",
          width: isPill
            ? isMobile
              ? "calc(100% - 40px)"
              : "320px"
            : "calc(100% - 40px)",
          borderRadius: "12px",
          background: isPill ? "#111111" : "transparent",
          border: isPill
            ? "1px solid rgba(255,255,255,0.15)"
            : "1px solid transparent",
          transition:
            "right 500ms cubic-bezier(0.4,0,0.2,1), width 500ms cubic-bezier(0.4,0,0.2,1), background 500ms cubic-bezier(0.4,0,0.2,1), border-color 500ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* ── Header row ─────────────────────────────────────────── */}
        <button
          onClick={() => isPill && setIsOpen((v) => !v)}
          className={`w-full flex items-center px-5 py-3 ${isPill ? "cursor-pointer" : "cursor-default"}`}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          tabIndex={isPill ? 0 : -1}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="text-[#ffeb00] font-black text-lg tracking-tight leading-none shrink-0 mr-4"
          >
            Devesh
          </Link>

          {/* Full-bar nav links — fade out as it becomes pill */}
          <nav
            className="flex items-center gap-7 flex-1"
            style={{
              opacity: isPill ? 0 : 1,
              pointerEvents: isPill ? "none" : "auto",
              transition: "opacity 300ms ease",
            }}
          >
            {NAV_ITEMS.map((item) =>
              item.isAnchor ? (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAnchorClick(e, item);
                  }}
                  className="text-white/60 hover:text-white text-xs uppercase tracking-widest font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.id}
                  to={item.path}
                  onClick={(e) => e.stopPropagation()}
                  className="text-white/60 hover:text-white text-xs uppercase tracking-widest font-medium transition-colors duration-200 whitespace-nowrap"
                >
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          {/* Pill: current page label + dot/dash indicator */}
          <div
            className="flex items-center justify-between flex-1"
            style={{
              opacity: isPill ? 1 : 0,
              pointerEvents: isPill ? "auto" : "none",
              transition: "opacity 300ms ease 200ms",
              position: "absolute",
              left: "100px",
              right: "16px",
            }}
          >
            <span className="text-white/50 text-xs uppercase tracking-widest font-medium">
              {currentPage}
            </span>

            {/* Dot → dash: fixed 6px wide, just height changes 6px circle → 2px bar */}
            <span
              style={{
                display: "inline-block",
                width: "6px",
                height: isOpen ? "2px" : "6px",
                borderRadius: isOpen ? "2px" : "50%",
                backgroundColor: isOpen
                  ? "rgba(255,235,0,0.9)"
                  : "rgba(255,255,255,0.4)",
                transition:
                  "height 250ms ease, border-radius 250ms ease, background-color 250ms ease",
              }}
            />
          </div>
        </button>

        {/* ── Expandable dropdown (pill only) ────────────────────── */}
        <div
          style={{
            maxHeight: isOpen && isPill ? "600px" : "0px",
            opacity: isOpen && isPill ? 1 : 0,
            overflow: "hidden",
            transition:
              "max-height 400ms cubic-bezier(0.4,0,0.2,1), opacity 300ms ease",
          }}
        >
          {/* Nav links */}
          <nav className="px-4 pb-2 pt-1">
            <ul className="space-y-0.5">
              {NAV_ITEMS.map((item) => {
                const isActive =
                  !item.isAnchor && location.pathname === item.path;
                return (
                  <li key={item.id}>
                    {item.isAnchor ? (
                      <a
                        href={`#${item.id}`}
                        onClick={(e) => handleAnchorClick(e, item)}
                        className="flex items-center justify-between w-full px-2 py-2 rounded-lg text-white/80 hover:text-white hover:bg-white/5 transition-all duration-200 text-base"
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        className={`flex items-center justify-between w-full px-2 py-2 rounded-lg transition-all duration-200 text-base ${
                          isActive
                            ? "text-white bg-white/10"
                            : "text-white/80 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {item.label}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ffeb00]" />
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Divider — only above social links */}
          <div className="border-t border-white/10 mx-4" />

          {/* Social links */}
          <div className="px-6 py-4">
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-semibold mb-3">
              Links
            </p>
            <ul className="space-y-1">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white/60 hover:text-white text-xs font-semibold uppercase tracking-wider transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
