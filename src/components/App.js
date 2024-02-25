import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';
import TFLogo from '../utils/TFLogo.png';
import Home from './Home';
import Forging from './Forging';
import HoneyPot from './HoneyPot';
import Trading from './Trading';
import Stats from './Stats';
import '../styles/App.css';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers5/react';

const projectId = '60db0656302510a26d3e49acc62e5473'; 
const chains = {
  chainId: 31337,
  name: 'Hardhat',
  currency: 'ETH',
  rpcUrl: 'http://127.0.0.1:8545',
};

const metadata = {
  name: 'TraitForge',
  description: 'TraitForge',
  url: 'http://localhost:3000', 
};

createWeb3Modal({
  ethersConfig: defaultConfig({ metadata }),
  chains: [chains],
  projectId,
  enableAnalytics: true, 
  themeMode: 'dark',
  themeVariables: {
  '--w3m-font-family': 'bebas neue',
  '--w3m-font-size-master': '0.9rem',
  '--w3m-accent': '#33333',
}});

const Navbar = ({ isNavExpanded, setIsNavExpanded }) => {
  const handleNavLinkClick = () => {
  setIsNavExpanded(false);
 };

return (
  <>
  <button className='nav-toggle' onClick={() => setIsNavExpanded(!isNavExpanded)}>
    {isNavExpanded ? <FaTimes /> : <FaBars />}
  </button>
  <nav className={isNavExpanded ? "navlist expanded" : "navlist"}>
   <NavLink to="/Home" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleNavLinkClick}>HOME</NavLink>
   <NavLink to="/Forging" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleNavLinkClick}>Forging</NavLink>
   <NavLink to="/BuySell" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleNavLinkClick}>MARKETPLACE</NavLink>
   <NavLink to="/HoneyPot" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleNavLinkClick}>HONEYPOT</NavLink>
   <NavLink to="/Stats" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleNavLinkClick}>GAME STATS</NavLink>
  </nav>
  </>
)};


const SocialMediaLink = ({ url, icon, className }) => (
  <a href={url} target="_blank" rel="noopener noreferrer" className="SM-icons" >
  <FontAwesomeIcon icon={icon} size="1.5x" />
  </a>
);


function App() {
  const [showInstructions, setShowInstructions] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false); 
  const [init, setInit] = useState(false);

useEffect(() => {
  initParticlesEngine(async (engine) => {
  await loadFull(engine);
  }).then(() => {setInit(true)});
}, []);


const particlesOptions = {
    background: {
      color: "#000000",
    },
    fpsLimit: 120,
    interactivity: {
      detect_on: "canvas",
      events: {
        onHover: {
          enable: true,
          mode: false,
        },
        onClick: {
          enable: true,
          mode: "false",
        },
      },
      modes: {
        push: {
          particles_nb: 4,
        },
      },
    },


    particles: {

      color: {
        value: "#0ff",
      },
      links: {
        enable: false,
      },
      move: {
        enable: true,
        speed: 0.3,
        direction: "none",
        random: true,
        straight: false,
        out_mode: "out",
        bounce: false,
        attract: {
          enable: false,
          rotateX: 1000,
          rotateY: 800,
        },
      },
      number: {
        value: 80,
        density: {
          enable: true,
          area: 400,
        },
      },
      opacity: {
        value: 1,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: 1,
        random: true,
        anim: {
          enable: true,
          speed: 4,
          size_min: 1,
          sync: false,
        },
      },
    },
};

const particlesLoaded = (container) => {
  console.log(container);
};

const toggleInstructions = () => {
  setShowInstructions(prev => !prev);
};

const links = [
  { url: 'https://t.me/+b31jKqlV-1BjNzY1', icon: faTelegram, text: 'Telegram' },
  { url: 'https://twitter.com/TraitForge', icon: faTwitter, text: 'Twitter' },
  { url: 'https://discord.gg/wPxFNRWZEf', icon: faDiscord, text: 'Discord' },
];


return (
  <BrowserRouter>
  <div className="App" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  {init && (
  <Particles 
    id="tsparticles"
    loaded={particlesLoaded}
     options={particlesOptions}
  />)}

<header className="App-header">
  <div className='header-bar'> black </div>
  <div className="logo-title-container">
    <img src={TFLogo} alt="TF Logo" className="logo" />
    <h1>TraitForge</h1>
  </div>

  <div className="wallet-connect"><w3m-button/></div>

  <Navbar isNavExpanded={isNavExpanded} setIsNavExpanded={setIsNavExpanded}/>
</header>


<div className='main-content' style={{ flex: 1 }}>
  <Routes>
    <Route path='/' element={<Navigate to="/Home"/>} />
    <Route path="/Home" element={<Home />} />
    <Route path="/Forging" element={<Forging />} />
    <Route path="/HoneyPot" element={<HoneyPot />} />
    <Route path="/Trading" element={<Trading />} />
    <Route path="/Stats" element={<Stats />} />
  </Routes>
</div>


<footer className="footer-container" style={{ background: '#000', color: '#fff', textAlign: 'center', padding: '10px' }}>
  <div className="App-Footer">
  {links.map((link, index) => (
    <SocialMediaLink key={index} url={link.url} icon={link.icon} className="social-media-link" />
    ))}
  </div>
</footer>


<button onClick={toggleInstructions} className='instructions-button'>
  {showInstructions ? 'Close' : 'How To Play'}
</button>

  {showInstructions && (
<div className='instructions-pop-up'>
  <p>Welcome to TraitForge, an innovative NFT honeypot game that blends strategic gameplay with the exciting world of NFTs.</p>
  <h3> Terminology </h3>

  <ul>
   <li>Entity - The name of a TraitForge specific Token.</li>
   <li>Nuke Factor - The % of NukeFund claimed when you Nuke your Entity.</li>
   <li>Performance Factor - The rate at which your Entities Abilities increase over time.</li>
   <li>Type - The Type of your entity changes the outcome of a Forge event (eg, Forgers receive ETH, Mergers receive Next-Gen Entity).</li>
   <li>Forge Potential - The amount of times you can breed per year.</li>
   <li>Generation - the Generation of your token.</li>
   <li>NukeFund - The pool of ETH that the game revolves around. 90% of ETH from minting goes to NukeFund.</li>
  </ul>

<h3>Getting Started</h3>
  <ul>
   <li>Create a Digital Wallet: To participate in TraitForge, you need an Ethereum wallet.</li>
   <li>Purchase ETH: Ensure you have enough ETH in your wallet to cover the cost of minting your first entity and to pay for transaction fees.</li>
  </ul>

<h3>Generation 1 Mint</h3>
  <ul>
   <li>Mint Your Entity: Mint one of the 10,000 unique Gen 1 entities. The minting price starts at 0.01 ETH and increases 0.01 ETH with each mint.</li>
   <li>Understand Your Entity: Each entity has specific traits, including a claim share, Forge potential, and a unique visual appearance.</li>
  </ul>

<h3>The Honeypot (Nuke Fund)</h3>
  <ul>
   <li>Contribute to the Fund: The Nuke Fund grows with each mint and game transaction.</li>
   <li>Strategise Your Claim: You can nuke your entity to claim a portion of the fund, but this decision is irreversible.</li>
  </ul>

<h3>Forging Entities</h3>
  <ul>
   <li>Forgers and Mergers: Gender will be randomly set on mint.</li>
   <li>Forgers: Charge a fee to the Merger to create a Next-Gen entity.</li>
   <li>Mergers: Pay a Forger to create and obtain the new Next-Gen entity.</li>
   <li>Forging Process: Pair Forgers with Mergers to create Next-Gen entities. The traits of the offspring are a combination of both Entities.</li>
   <li>Breed or Nuke: Each entity has limited breeding times. After breeding, you can still nuke your entity or continue to the next generation.</li>
  </ul>

<h3>Economic Activity and Aging</h3>
  <ul>
   <li>Transaction Fees: A portion of all game transactions contributes to the Nuke Fund and the developers.</li>
   <li>Aging Mechanism: Your entity ages and evolves over time, enhancing its claim share and Forge potential.</li>
  </ul>

<h3>Generations and Multi-chain Expansion</h3>
  <ul>
   <li>Generational Play: There are unlimited generations, each offering new strategic opportunities.</li>
   <li>Multi-chain Universe: Future expansions to multiple blockchains will introduce unique traits and gameplay elements. TraitForge will be originally hosted on the Ethereum blockchain. Our development team is actively working to expand TraitForge onto multiple blockchains, broadening our universe and bringing new, unique gameplay experiences to diverse blockchain communities.</li>
  </ul>

<h3>Tips for Success</h3>
  <ul>
   <li>Plan Your Strategy: Whether its breeding, aging, or nuking, each decision affects your journey.</li>
   <li>Stay Informed: Join our Discord and follow us on Twitter for the latest updates and strategies from the community.</li>
   <li>Engage with the Community: Share tips, strategies, and experiences with fellow players.</li>
  </ul>

<h3>Support and Resources</h3>
  <ul>
   <li>Need Help?: Reach out to the community on Discord for assistance.</li>
   <li>Learn More: Explore advanced strategies and updates through our community channels.</li>
  </ul>


<p>Thank you for joining the world of TraitForge. Forge your path, strategize wisely, and enjoy the adventure!</p>
</div>
    )}
</div>
</BrowserRouter>
)}
export default App;
