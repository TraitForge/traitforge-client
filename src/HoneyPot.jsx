import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useWeb3 } from './Web3Context'; 
import HoneyPotModal from './honeypotmodal';
import './honeypot.css'; 

function HoneyPot() {
  const { web3 } = useWeb3(); 
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [ethAmount, setEthAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);

  const toggleModal = () => {
    setShowNFTModal(true);
  };

  const fetchEthAmount = async () => {
    //smart contract stuff here
    return Math.random()  * 100; // delete this when real logic is in
  };

  const fetchEthToUsdRate = async () => {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
      return response.data.ethereum.usd;
    } catch (error) {
      console.error('Error fetching ETH to USD rate:', error);
    }
    return 10000;
  };

  const convertEthToUsd = (eth, rate) => {
    return eth * rate;
  };

  useEffect(() => {
    if (web3) {
      const interval = setInterval(async () => {
        const amount = await fetchEthAmount();
        const rate = await fetchEthToUsdRate();
        const usdValue = convertEthToUsd(amount, rate);

        setEthAmount(amount.toFixed(2));
        setUsdAmount(usdValue.toFixed(2));
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [web3]);

  return (
    <div className="honey-pot-container">
      <h1>The HoneyPot</h1>
      <div className="eth-amount">
        <h1>{ethAmount} ETH </h1>
        <p>≈ ${usdAmount} USD</p>
      </div>
      <button 
        className='nuke-button' 
        onClick={toggleModal} 
      >
        Nuke Entity
      </button>
      {showNFTModal && (
        <HoneyPotModal
          onClose={() => setShowNFTModal(false)}
        />
      )}
    </div>
  );
}

export default HoneyPot;