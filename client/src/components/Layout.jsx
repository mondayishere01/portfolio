import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen max-w-screen-xl mx-auto px-6 py-12 md:px-12 md:py-20 lg:px-24">
      {/* Full Width Content */}
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
