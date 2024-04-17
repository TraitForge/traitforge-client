import { TransactionsDisplay } from '@/components';

export const StatisticsList = ({ currentStat, stats }) => {
  const formatRanking = index => {
    const j = index % 10,
      k = index % 100;
    if (j === 1 && k !== 11) {
      return index + 'st';
    }
    if (j === 2 && k !== 12) {
      return index + 'nd';
    }
    if (j === 3 && k !== 13) {
      return index + 'rd';
    }
    return index + 'th';
  };

  return (
    <>
      {currentStat === 'transactionsDisplay' ? (
        <TransactionsDisplay />
      ) : (
        <div className="stats-container2 overflow-y-scroll flex-1">
          <ul className="flex flex-col gap-6">
            {stats[currentStat].length > 0 ? (
              stats[currentStat].map((item, index) => (
                <li className="listli text-large flex" key={index}>
                  <p className="basis-2/12">{formatRanking(index + 1)}</p>
                  <p className="basis-7/12 text-left">{item.address}</p>
                  <p className="basis-3/12">{item.value}</p>
                </li>
              ))
            ) : (
              <li>Loading...</li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};
