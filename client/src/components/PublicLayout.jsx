import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import LeftSidebar from "./LeftSidebar";
import FloatingContact from "./FloatingContact";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-black relative">
      <Navigation />
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
