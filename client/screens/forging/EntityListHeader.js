export const EntityListHeader = ({ handleSort, sortOption }) => {
  return (
    <div className="flex items-center uppercase gap-x-6 pt-6 text-[24px]">
      <button
        className={`relative  px-6 pb-3 ${sortOption === 'all' ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-neon-orange' : ''}`}
        onClick={() => handleSort('all')}
      >
        All
      </button>
      <button
        className={`relative  px-6 pb-3 ${sortOption === 'forgers' ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-neon-orange' : ''}`}
        onClick={() => handleSort('forgers')}
      >
        forgers
      </button>
      <button
        className={`relative  px-6 pb-3 ${sortOption === 'mergers' ? 'after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px] after:bg-neon-orange' : ''}`}
        onClick={() => handleSort('mergers')}
      >
        mergers
      </button>
    </div>
  );
};
