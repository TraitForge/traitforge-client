import classNames from 'classnames';
export const FiltersHeader = ({ handleSort, sortOption, color }) => {
  const commonClasses = ` after:absolute after:bottom-0 after:left-0 after:w-full after:h-[3px]`;
  const activeClasses = classNames(commonClasses, {
    'after:bg-neon-orange': color === 'orange',
    'after:bg-neon-green': color === 'green',
  });

  return (
    <div className="flex items-center uppercase gap-x-6 pt-6 text-[24px]">
      <button
        className={`${sortOption === 'all' ? activeClasses : null} relative px-6 pb-3`}
        onClick={() => handleSort('all')}
      >
        All
      </button>
      <button
        className={`${sortOption === 'forgers' ? activeClasses : null} relative px-6 pb-3`}
        onClick={() => handleSort('forgers')}
      >
        forgers
      </button>
      <button
        className={`${sortOption === 'mergers' ? activeClasses : null} relative px-6 pb-3`}
        onClick={() => handleSort('mergers')}
      >
        mergers
      </button>
    </div>
  );
};
