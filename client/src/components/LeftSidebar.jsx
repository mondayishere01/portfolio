import React from "react";
import { useLocation } from "react-router-dom";
import BlogFeed from "./sidebar/BlogFeed";
import ProfileSummary from "./sidebar/ProfileSummary";

const LeftSidebar = () => {
  const location = useLocation();
  const isBlogRoute =
    location.pathname === "/blog" || location.pathname.startsWith("/blog/");

  return (
    <aside
      className="fixed hidden lg:flex flex-col z-30"
      style={{
        top: "86px",
        left: "20px",
        width: "320px",
        bottom: "20px",
        background: "var(--surface-card)",
        border: "1px solid var(--border-alpha-15)",
        borderRadius: "12px",
      }}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-3 shrink-0" style={{ borderBottom: '1px solid var(--border-alpha-10)' }}>
        <h3 className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--content-faint)' }}>
          {isBlogRoute ? "About Me" : "Recent Posts"}
        </h3>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-3 py-3 sidebar-scroll">
        {isBlogRoute ? <ProfileSummary /> : <BlogFeed />}
      </div>
    </aside>
  );
};

export default LeftSidebar;
