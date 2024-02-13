<<<<<<< HEAD
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { FaWallet, FaCheck, FaBars, FaTimes } from 'react-icons/fa';
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import { Web3Provider} from './Web3Context';
import Web3 from 'web3';
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import TFLogo from './TFLogo.png';
import Home from './HomeBody';
import TBG from './TBG';
import HoneyPot from './HoneyPot';
import BuySell from './BuySell';
import './App.css';



function App() {


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
        <NavLink to="/HomeBody" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleNavLinkClick}>HOME</NavLink>
        <NavLink to="/TBG" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleNavLinkClick}>BREEDING</NavLink>
        <NavLink to="/HoneyPot" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleNavLinkClick}>HONEYPOT</NavLink>
        <NavLink to="/BuySell" className={({ isActive }) => (isActive ? "active" : "")} onClick={handleNavLinkClick}>BUY/SELL</NavLink>
      </nav>
    </>
  );
};



const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider,
    options: {
      infuraId: "YOUR_INFURA_ID" 
    }
  },
};

const web3Modal = new Web3Modal({
  network: "mainnet", 
  cacheProvider: true,
  providerOptions
});

useEffect(() => {
  if (web3Modal.cachedProvider) {
    setUserWallet();
  }
  // eslint-disable-next-line
 }, []);


const OpenInNewTabButton = ({ url, children }) => {
  const handleClick = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };
  return (
    <button onClick={handleClick} className="new-tab-button">
      {children}
    </button>
  );
};

  const [showInstructions, setShowInstructions] = useState(false);
  const [userWallet, setUserWallet] = useState(null);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  
  const connectWalletHandler = async () => {
    try {
      const provider = await web3Modal.connect();
      const web3 = new Web3(provider);
  
      const accounts = await web3.eth.getAccounts();
      if (accounts.length > 0) {
        setUserWallet(accounts[0]);
      }
  
      provider.on("connect", (info) => console.log(info));
      provider.on("disconnect", (error) => console.log(error));
    } catch (error) {
      console.error('Error connecting to wallet', error);
    }
  };

  const toggleInstructions = () => {
    setShowInstructions(!showInstructions);
  };

  const particlesInit = async (main) => { 
    await loadFull(main); 
  }; 
  const particlesLoaded = (container) => { 
  }; 
  
  const ParticlesOptions = {
    background: {
      color: "#000000",  
    },
    fpsLimit: 120,
    interactivity: {
      detect_on: "canvas",  
      events: {
      onhover: {
        enable: true,
        mode: "attract"
      },
        onclick: {
          enable: true,
          mode: "push"  
        }
      },
      modes: {
        push: {
          particles_nb: 4
        }
      }
    },


    particles: {
      number: {
        value: 50, 
        density: {
          enable: true,
          area: 400, 
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: 3,
        random: true,  
        anim: {
          enable: true,
          speed: 4,
          size_min: 0.3,
          sync: false
        },
      },
      color: {
        value: "#0ff",  
      },
      opacity: {
        value: 1,
        anim: {
          enable: true,
          speed: 1,
          opacity_min: 0.1,
          sync: false
        }
      },
      line_linked: {
        enable: false  
      },
      move: {
        enable: true,
        speed: 1,
        direction: "top",
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
    },
  };



  const links = [
    { url: 'https://discord.gg/S3VJS6ByYE', text: 'HOW TO PLAY' },
    { url: 'https://twitter.com/TraitForge', text: 'TWITTER/X' },
    { url: 'https://discord.gg/wPxFNRWZEf', text: 'DISCORD' },
  ];
  



  return (
    <Web3Provider>
    <BrowserRouter>
      <div className="App">


      <Particles 
        id="tsparticles" 
        init={particlesInit} 
        loaded={particlesLoaded} 
        options={ParticlesOptions}
      /> 

        <header className="App-header">
        <div className="logo-title-container">
          <img src={TFLogo} alt="TF Logo" className="logo" />
          <h1>TraitForge</h1>
        </div>
          <div className="wallet-connect">
            <button onClick={connectWalletHandler}
              className={`meta-mask-button ${userWallet ? 'disabled' : ''}`}
              disabled={!!userWallet}>
              <span className="button-text">{userWallet ? 'Wallet Connected' : 'Connect Wallet'}</span>
              <span className="button-icon">{userWallet ? <FaCheck /> : <FaWallet />}</span>
            </button>
            {userWallet && (
              <div className="wallet-address">
                <span className="address-text">Address: {userWallet.slice(0, 6)}...{userWallet.slice(-4)}</span>
                <span className="address-icon"><FaCheck /></span>
              </div>
            )}
          </div>
          <Navbar isNavExpanded={isNavExpanded} setIsNavExpanded={setIsNavExpanded}/>
        </header>

        <Routes>
          <Route path="/" element={<Navigate to ="HomeBody" />} />
          <Route path="/HomeBody" element={<Home />} />
          <Route path="/TBG" element={<TBG />} />
          <Route path="/HoneyPot" element={<HoneyPot />} />
          <Route path="/BuySell" element={<BuySell />} />
        </Routes>
      </div>

      <div className="footer-container">
        <footer className="App-Footer">
          <p>Resources</p>
          {links.map((link, index) => ( 
            <OpenInNewTabButton key={index} url={link.url}>
              {link.text}
            </OpenInNewTabButton>
          ))}
         </footer>
         <div/>
         

         <div>
         <button onClick={toggleInstructions} className='instructions-button'>
            How To Play
         </button>
               {showInstructions && (
          <div className='instructions-pop-up'>
          <h4>How to Play</h4>
          <button className='closer-button' onClick={toggleInstructions}>Close</button>
          <div className='instructions-content'>


<p>Welcome to TraitForge, an innovative NFT honeypot game that blends strategic gameplay with the exciting world of NFTs.</p>


<h3>Getting Started</h3>
<ul>
  <li>Create a Digital Wallet: To participate in TraitForge, you need an Ethereum wallet.</li>
  <li>Purchase ETH: Ensure you have enough ETH in your wallet to cover the cost of minting your first entity and to pay for transaction fees.</li>
</ul>

<h3>Generation 1 Mint</h3>
<ul>
<li>Mint Your Entity: Mint one of the 10,000 unique Gen 1 entities. The minting price starts at 0.01 ETH and increases 0.01 ETH with each mint.</li>
<li>Understand Your Entity: Each entity has specific traits, including a claim share, breed potential, and a unique visual appearance.</li>
</ul>

<h3>The Honeypot (Nuke Fund)</h3>
<ul>
<li>Contribute to the Fund: The Nuke Fund grows with each mint and game transaction.</li>
<li>Strategise Your Claim: You can nuke your entity to claim a portion of the fund, but this decision is irreversible.</li>
</ul>

<h3>Breeding Entities</h3>
<ul>
<li>Sires and Breeders: Gender will be randomly set on mint.</li>
<li>Sires: Charge a fee to the Breeder to create a Next-Gen entity.</li>
<li>Breeders: Pay a Sire to create and obtain the new Next-Gen entity.</li>
<li>Breeding Process: Pair Sires with Breeders to create Next-Gen entities. The traits of the offspring are a combination of both parents.</li>
<li>Breed or Nuke: Each entity has limited breeding times. After breeding, you can still nuke your entity or continue to the next generation.</li>
</ul>

<h3>Economic Activity and Aging</h3>
<ul>
<li>Transaction Fees: A portion of all game transactions contributes to the Nuke Fund and the developers.</li>
<li>Aging Mechanism: Your entity ages and evolves over time, enhancing its claim share and breed potential.</li>
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
          </div>
               )}
        </div>
        </div>
    </BrowserRouter>
    </Web3Provider>
  );
}

export default App;
=======
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
>>>>>>> 4bd242a (Initialize project using Create React App)
