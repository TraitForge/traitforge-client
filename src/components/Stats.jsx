import React, { useState, useEffect } from 'react';
import TransactionsDisplay from './TransactionsDisplay';
import '../styles/Stats.css';

const Stats = () => {
  const [currentStat, setCurrentStat] = useState('highestNukefactor');
  const [stats, setStats] = useState({
  highestNukefactor: [],
  mostForges: [],
  addressWithMostEntities: [],
});

useEffect(() => {
  const fetchStats = async () => {
  const data = await getStatsFromAPI();
  setStats(data);
}; fetchStats();
}, []);

const statTypes = {
  highestNukefactor: 'Highest Nuke Factor',
  mostForges: 'Most Forges Executed',
  addressWithMostEntities: 'Address with the Most Entities',
  transactionsDisplay: 'Game Activity',
};

const headerTitles = {
  highestNukefactor: ['Nuke Factor'],
  mostForges:  ['Forges Executed'],
  addressWithMostEntities: [ 'Entities Owned'],
  transactionsDisplay: [], 
}

return (
  <div className='page-container'>
    <div className='stats-container'>
      <h1> Statistics </h1>
      <div className="navbar">
        {Object.entries(statTypes).map(([key, title]) => (
          <button
            key={key}
            onClick={() => setCurrentStat(key)}
            className={currentStat === key ? "active" : ""}
          >
            {title}
          </button>
        ))}
      </div>
      {currentStat !== 'transactionsDisplay' && (
        <div className='statsclassheader'>
          <h1> No.</h1>
          <h1> Wallet Address</h1>
          <h1>{headerTitles[currentStat][0] || ''}</h1> 
        </div>
      )}
      {currentStat === 'transactionsDisplay' ? (
        <TransactionsDisplay />
      ) : (
       <div className="stats-container2">
          <div className="stats-grid">
            <div className="stat-card">
              <ul>
                {stats[currentStat].length > 0 ? (
                  stats[currentStat].map((item, index) => <li key={index}>{item}</li>)
                ) : (
                  <li>Loading...</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )} 
    </div>
  </div>
);
}


async function getStatsFromAPI() {
  return new Promise(resolve => setTimeout(() => resolve({


highestNukefactor: [
  '0x12e379a83939874d002uv03 (1st gen 5/10,000) (46%)',
  '0x24f479b84939874d003uv04 (2nd gen 72/10,000) (45%)',
  '0x35g569c95939874d004uv05 (1st gen 964/10,000) (43%)',
  '0x46h679d06939874d005uv06 (2th gen 1992/10,000) (40%)',
  '0x57i789e17939874d006uv07 (1th gen 5678/10,000) (39%)',
  '0x12e379a83939874d002uv03 (1st gen 5/10,000) (46%)',
  '0x24f479b84939874d003uv04 (2nd gen 72/10,000) (45%)',
  '0x35g569c95939874d004uv05 (1st gen 964/10,000) (43%)',
  '0x46h679d06939874d005uv06 (2th gen 1992/10,000) (40%)',
  '0x57i789e17939874d006uv07 (1th gen 5678/10,000) (39%)',
],

mostForges: [
  '0x11d299her378493dy4983 (16 Breeds over 3 Years)',
  '0x22e3aajsi48493fy5984 (14 Breeds over 2 Years)',
  '0x33f4bbktj59493gz6985 (12 Breeds over 4 Years)',
  '0x44g5ccluk60493ha7986 (10 Breeds over 5 Years)',
  '0x55h6ddmvn71493ib8987 (8 Breeds over 1 Year)',
  '0x11d299her378493dy4983 (16 Breeds over 3 Years)',
  '0x22e3aajsi48493fy5984 (14 Breeds over 2 Years)',
  '0x33f4bbktj59493gz6985 (12 Breeds over 4 Years)',
  '0x44g5ccluk60493ha7986 (10 Breeds over 5 Years)',
  '0x55h6ddmvn71493ib8987 (8 Breeds over 1 Year)',
],

addressWithMostEntities: [
  '0x4568347h8364ff48h3822 (230 Entities)',
  '0x5679458i9475gg59i4933 (215 Entities)',
  '0x678a569j0586hh6aj5044 (200 Entities)',
  '0x789b67ak1697ii7bk6155 (185 Entities)',
  '0x89ac78bl27a8jj8cl7266 (170 Entities)',
  '0x4568347h8364ff48h3822 (230 Entities)',
  '0x5679458i9475gg59i4933 (215 Entities)',
  '0x678a569j0586hh6aj5044 (200 Entities)',
  '0x789b67ak1697ii7bk6155 (185 Entities)',
  '0x89ac78bl27a8jj8cl7266 (170 Entities)',
],

}), 1000));
}

export default Stats;
