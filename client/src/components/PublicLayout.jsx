import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import CustomCursor from "./CustomCursor";
import LeftSidebar from "./LeftSidebar";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <CustomCursor />
      <Navigation />
      <LeftSidebar />
      {/* Main content — shifted right on desktop to account for sidebar */}
      <main className="lg:ml-[360px]">
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
