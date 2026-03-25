import React, { useState, useEffect, useCallback } from "react";

const Layout = ({ children }) => {
  // ─── Mouse-follow spotlight gradient ────────────────
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  return (
    <div
      className="relative min-h-screen max-w-screen-xl mx-auto px-6 py-12 md:px-12 md:py-20 lg:px-24 group/spotlight"
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight gradient overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`,
        }}
      />

      {/* Full Width Content */}
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
