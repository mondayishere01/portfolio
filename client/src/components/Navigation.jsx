import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const NAV_ITEMS = [
  { id: "about", label: "About", path: "/", isAnchor: true },
  { id: "experience", label: "Experience", path: "/", isAnchor: true },
  { id: "skills", label: "Skills", path: "/", isAnchor: true },
  { id: "projects", label: "Projects", path: "/", isAnchor: true },
  { id: "certifications", label: "Certifications", path: "/", isAnchor: true },
  { id: "contact", label: "Contact", path: "/", isAnchor: true },
  { id: "blog", label: "Blog", path: "/blog", isAnchor: false },
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
  const isBlogPost = location.pathname.startsWith("/blog/");
  const boxRef = useRef(null);
  const currentPage = PAGE_LABELS[location.pathname] ?? (isBlogPost ? "Blog" : "Page");

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
        className={`fixed inset-0 z-40 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen && isPill
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ backgroundColor: 'var(--overlay)' }}
        aria-hidden="true"
      />

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
          background: isPill ? "var(--surface-card)" : "transparent",
          border: isPill
            ? "1px solid var(--border-alpha-15)"
            : "1px solid transparent",
          transition:
            "right 500ms cubic-bezier(0.4,0,0.2,1), width 500ms cubic-bezier(0.4,0,0.2,1), background 500ms cubic-bezier(0.4,0,0.2,1), border-color 500ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {/* ── Header row ─────────────────────────────────────────── */}
        <button
          onClick={() => isPill && setIsOpen((v) => !v)}
          className={`w-full flex items-center px-5 h-[48px] ${isPill ? "cursor-pointer" : "cursor-default"}`}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Collapse menu" : "Expand menu"}
          tabIndex={isPill ? 0 : -1}
          style={{ height: "48px" }}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            className="font-black text-lg tracking-tight leading-none shrink-0 mr-4"
            style={{ color: 'var(--accent-brand)' }}
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
            <div className="flex items-center gap-7">
              {NAV_ITEMS.map((item) =>
                item.isAnchor ? (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAnchorClick(e, item);
                    }}
                    className="text-xs uppercase tracking-widest font-medium transition-colors duration-200 whitespace-nowrap"
                    style={{ color: 'var(--content-muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--content-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-muted)'}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    key={item.id}
                    to={item.path}
                    onClick={(e) => e.stopPropagation()}
                    className="text-xs uppercase tracking-widest font-medium transition-colors duration-200 whitespace-nowrap"
                    style={{ color: 'var(--content-muted)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--content-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--content-muted)'}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>
          </nav>

          {/* Full-bar: Theme toggle at far right */}
          <div
            style={{
              opacity: isPill ? 0 : 1,
              pointerEvents: isPill ? "none" : "auto",
              transition: "opacity 300ms ease",
            }}
          >
            <ThemeToggle />
          </div>

          {/* Pill: current page label + [theme toggle] + dot/dash indicator */}
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
            <span className="text-xs uppercase tracking-widest font-medium" style={{ color: 'var(--content-muted)' }}>
              {currentPage}
            </span>

            <div className="flex items-center gap-2">
              {/* Theme toggle — right next to the dot */}
              <ThemeToggle />

              {/* Dot → dash: fixed 6px wide, just height changes 6px circle → 2px bar */}
              <span
                style={{
                  display: "inline-block",
                  width: "6px",
                  height: isOpen ? "2px" : "6px",
                  borderRadius: isOpen ? "2px" : "50%",
                  backgroundColor: isOpen
                    ? "var(--accent-brand)"
                    : "var(--content-muted)",
                  transition:
                    "height 250ms ease, border-radius 250ms ease, background-color 250ms ease",
                  opacity: isOpen ? 0.9 : 0.4,
                }}
              />
            </div>
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
                        className="flex items-center justify-between w-full px-2 py-2 rounded-lg transition-all duration-200 text-base"
                        style={{ color: 'var(--content-body)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--content-primary)'; e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--content-body)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <Link
                        to={item.path}
                        className="flex items-center justify-between w-full px-2 py-2 rounded-lg transition-all duration-200 text-base"
                        style={{
                          color: isActive ? 'var(--content-primary)' : 'var(--content-body)',
                          backgroundColor: isActive ? 'var(--active-bg)' : 'transparent',
                        }}
                        onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.color = 'var(--content-primary)'; e.currentTarget.style.backgroundColor = 'var(--hover-bg)'; } }}
                        onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.color = 'var(--content-body)'; e.currentTarget.style.backgroundColor = 'transparent'; } }}
                      >
                        {item.label}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--accent-brand)' }} />
                        )}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </div>
      {/* ── Back to Portfolio Pill ─────────────────────────────────────────── */}
      {!isHome && !isMobile && (
        <Link
          to={isBlogPost ? "/blog" : "/"}
          className="fixed z-50 px-5 py-3 flex items-center gap-2 group transition-all duration-300"
          style={{
            top: "20px",
            left: "350px",
            background: "var(--surface-card)",
            border: "1px solid var(--border-alpha-15)",
            borderRadius: "12px",
            height: "48px",
          }}
          data-cursor-text={isBlogPost ? "Blog Hub" : "Home"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 transition-transform group-hover:-translate-x-1"
            style={{ color: 'var(--content-muted)' }}
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          <span className="text-sm font-semibold transition-colors" style={{ color: 'var(--content-body)' }}>
            {isBlogPost ? "Back to Blog Hub" : "Back to Portfolio"}
          </span>
        </Link>
      )}
    </>
  );
};

export default Navigation;
