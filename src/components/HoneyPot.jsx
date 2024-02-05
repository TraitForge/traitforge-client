import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import HoneyPotModal from './HoneyPotModal';
import '../styles/honeypot.css'; 

import NukeFundAbi from '../contracts/NukeFund.json';

function HoneyPot() {
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [ethAmount, setEthAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);

  const toggleModal = () => {
    setShowNFTModal(prevState => !prevState); 
  };

  const NukeFundAddress = '0x0f52F14b4df86F223234DDC4a61dc0d63B77269a';

  const fetchEthAmount = async () => {
    try {
        const web3 = new Web3(Web3.givenProvider || "https://goerli.infura.io/v3/3f27d7e6326b43c5b77e16ac62188640");
        const nukeFundContract = new web3.eth.Contract(NukeFundAbi.abi, NukeFundAddress);
        
        const balance = await nukeFundContract.methods.getFundBalance().call();
        return web3.utils.fromWei(balance, 'ether');
    } catch (error) {
        console.error('Error fetching ETH amount from nuke fund:', error);
        return 0; 
    }
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
    const interval = setInterval(async () => {
      const amount = await fetchEthAmount();
      const rate = await fetchEthToUsdRate();
      if (amount && rate) {
        const usdValue = convertEthToUsd(amount, rate);
        setEthAmount(Number(amount).toFixed(2)); 
        setUsdAmount(Number(usdValue).toFixed(2)); 
      }
    }, 10000);

    return () => clearInterval(interval); 
  }, []);

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