import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import CustomCursor from "./CustomCursor";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-black">
      <CustomCursor />
      <Navigation />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
