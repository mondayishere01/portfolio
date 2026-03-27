const SectionHeader = ({ label }) => (
  <div className="sticky top-0 z-20 -mx-6 mb-12 w-screen bg-black/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:bg-transparent lg:mb-8">
    <h2 className="text-sm font-bold uppercase tracking-widest text-[#ffeb00] lg:text-[#ffeb00]/50">
      {label}
    </h2>
  </div>
);

export default SectionHeader;
