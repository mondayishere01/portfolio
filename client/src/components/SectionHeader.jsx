const SectionHeader = ({ label }) => (
  <div
    className="sticky top-0 z-20 -mx-6 mb-12 w-screen px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:backdrop-blur-none lg:mb-8"
    style={{ backgroundColor: 'var(--surface-base-75)' }}
  >
    <h2
      className="text-sm font-bold uppercase tracking-widest lg:opacity-50"
      style={{ color: 'var(--accent-brand)' }}
    >
      {label}
    </h2>
  </div>
);

export default SectionHeader;
