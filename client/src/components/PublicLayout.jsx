import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
