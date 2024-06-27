type StatsNavbarTypes = {
  currentStat: string;
  handleCurrentStats: (value: string) => void;
};

export const StatsNavbar = ({
  currentStat,
  handleCurrentStats,
}: StatsNavbarTypes) => {
  const statTypes = {
    addressWithMostEntities: 'most entities owned',
    highestTotalEntropy: 'Highest Total Entropy',
    mostForges: 'most forges executed',
    transactionsDisplay: 'Game Activity',
  };

  const headerTitles: { [key: string]: string[] } = {
    addressWithMostEntities: ['Entities Owned'],
    highestTotalEntropy: ['Total Entropy'],
    mostForges: ['Forges Executed'],
    transactionsDisplay: ['Entity'],
  };

  return (
    <>
      <div className="navbar">
        {Object.entries(statTypes).map(([key, title]) => (
          <button
            key={key}
            onClick={() => handleCurrentStats(key)}
            className={`${
              currentStat === key ? 'active' : ''
            } max-md:py-3 py-4 px-2 md:px-6 text-base md:text-[32px]`}
          >
            {title}
          </button>
        ))}
      </div>
      {currentStat !== 'transactionsDisplay' && (
        <div className="flex font-electrolize font-normal text-neutral-100 py-[26px] text-base md:text-large max-md:bg-dark-81 max-md:px-3">
          <span className="basis-1/12 md:basis-2/12 text-center"> No.</span>
          <span className="basis-7/12 text-left"> Wallet Address</span>
          <span className="basis-4/12 md:basis-3/12 text-center">
            {headerTitles[currentStat]?.[0] || ''}
          </span>
        </div>
      )}
    </>
  );
};
