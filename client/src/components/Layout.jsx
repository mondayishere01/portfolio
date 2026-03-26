import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen lg:max-w-none lg:mx-0 px-6 py-12 md:px-12 md:py-20 lg:pl-0 lg:pr-24">
      {/* Full Width Content */}
      <main className="pt-16">{children}</main>
    </div>
  );
};

export default Layout;
