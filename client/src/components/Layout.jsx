import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen lg:max-w-none lg:mx-0 pt-6 pb-2 py-12 md:px-12 md:py-20 lg:pl-3 lg:pr-12">
      {/* Full Width Content */}
      <main className="pt-16 px-6 pb-20 md:px-0 md:pb-0">{children}</main>
    </div>
  );
};

export default Layout;
