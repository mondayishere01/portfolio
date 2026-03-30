import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import LeftSidebar from "./LeftSidebar";
import FloatingContact from "./FloatingContact";

const PublicLayout = () => {
  return (
    <div className="min-h-screen relative transition-colors duration-300" style={{ backgroundColor: 'var(--surface-base)' }}>
      <Navigation />
      {/* Sticky sidebar — absolutely positioned */}
      <LeftSidebar />
      {/* Main content — shifted right on desktop to account for sidebar */}
      <main className="lg:ml-[360px]">
        <Outlet />
      </main>
      <FloatingContact />
    </div>
  );
};

export default PublicLayout;
