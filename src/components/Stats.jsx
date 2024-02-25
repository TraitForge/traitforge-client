import React, { useState, useEffect } from 'react';
import TransactionsDisplay from './TransactionsDisplay';
import '../styles/Stats.css';

const Stats = () => {
    const [stats, setStats] = useState({
        highestClaimshare: [],
        mostForges: [],
        addressWithMostEntities: [],
      });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStatsFromAPI();
      setStats(data);
    };

    fetchStats();
  }, []);

  return (
    <>
      <div className="stats-container">
        <h1 className="stats-title">Statistics</h1>
        <div className="stats-grid">
          <div className="stat-card">
            <h2>Highest Nuke Factor</h2>
            <ul>
              {stats.highestNukefactor.length > 0 ? (
                stats.highestNukefactor.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          </div>
          <div className="stat-card">
            <h2>Most Forges executed</h2>
            <ul>
              {stats.mostForges.length > 0 ? (
                stats.mostForges.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          </div>
          <div className="stat-card">
            <h2>Address with the Most Entities</h2>
            <ul>
              {stats.addressWithMostEntities.length > 0 ? (
                stats.addressWithMostEntities.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>Loading...</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <TransactionsDisplay />
    </>
  );
}


async function getStatsFromAPI() {
    return new Promise(resolve => setTimeout(() => resolve({
      highestNukefactor: [
        '1st: 0x12e379a83939874d002uv03 (1st gen 5/10,000) (46%)',
        '2nd: 0x24f479b84939874d003uv04 (2nd gen 72/10,000) (45%)',
        '3rd: 0x35g569c95939874d004uv05 (1st gen 964/10,000) (43%)',
        '4th: 0x46h679d06939874d005uv06 (2th gen 1992/10,000) (40%)',
        '5th: 0x57i789e17939874d006uv07 (1th gen 5678/10,000) (39%)',
      ],
      mostForges: [
        '1st: 0x11d299her378493dy4983 (16 Breeds over 3 Years)',
        '2nd: 0x22e3aajsi48493fy5984 (14 Breeds over 2 Years)',
        '3rd: 0x33f4bbktj59493gz6985 (12 Breeds over 4 Years)',
        '4th: 0x44g5ccluk60493ha7986 (10 Breeds over 5 Years)',
        '5th: 0x55h6ddmvn71493ib8987 (8 Breeds over 1 Year)',
      ],
      addressWithMostEntities: [
        '1st: 0x4568347h8364ff48h3822 (230 Entities)',
        '2nd: 0x5679458i9475gg59i4933 (215 Entities)',
        '3rd: 0x678a569j0586hh6aj5044 (200 Entities)',
        '4th: 0x789b67ak1697ii7bk6155 (185 Entities)',
        '5th: 0x89ac78bl27a8jj8cl7266 (170 Entities)',
      ],
    }), 1000));
  }

export default Stats;
