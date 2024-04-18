export const StatsNavbar = ({ currentStat, handleCurrentStats }) => {
  const statTypes = {
    addressWithMostEntities: 'Address with the Most Entities',
    highestTotalEntropy: 'Highest Total Entropy',
    mostForges: 'Total Forges',
    transactionsDisplay: 'Game Activity',
  };

  const headerTitles = {
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
            className={currentStat === key ? 'active' : ''}
          >
            {title}
          </button>
        ))}
      </div>
      {currentStat !== 'transactionsDisplay' && (
        <div className="flex font-electrolize font-normal text-neutral-100 mb-[26px] text-large">
          <span className="basis-2/12 text-center"> No.</span>
          <span className="basis-7/12 text-left"> Wallet Address</span>
          <span className="basis-3/12 text-center">
            {headerTitles[currentStat][0] || ''}
          </span>
        </div>
      )}
    </>
  );
};
