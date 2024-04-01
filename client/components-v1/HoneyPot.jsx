import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import HoneyPotModal from './HoneyPotModal';
import NukeButton from '../utils/nukebutton.png';
import '../styles/HoneyPot.css';
import { useWeb3ModalProvider } from '@web3modal/ethers5/react';
import NukeFundAbi from '../artifacts/contracts/NukeFund.sol/NukeFund.json';

const NukeFundAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

function HoneyPot() {
  const [showNFTModal, setShowNFTModal] = useState(false);
  const [nukeHistory, setNukeHistory] = useState([]);
  const [ethAmount, setEthAmount] = useState(0);
  const [usdAmount, setUsdAmount] = useState(0);
  const { walletProvider } = useWeb3ModalProvider();

  const toggleModal = () => {
    setShowNFTModal(prevState => !prevState);
  };

  const fetchEthAmount = useCallback(async () => {
    try {
      const provider = new ethers.providers.Web3Provider(walletProvider);
      const nukeFundContract = new ethers.Contract(
        NukeFundAddress,
        NukeFundAbi.abi,
        provider
      );
      const balance = await nukeFundContract.getFundBalance();
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Error fetching ETH amount from nuke fund:', error);
      return 0;
    }
  }, [walletProvider]);

  const fetchEthToUsdRate = async () => {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      );
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
  }, [fetchEthAmount]);

  useEffect(() => {
    const storedNukeHistory = localStorage.getItem('Nuked');
    if (storedNukeHistory) {
      setNukeHistory(JSON.parse(storedNukeHistory));
    }
  }, []);

  return (
    <div className="honey-pot-container">
      <h1>The HoneyPot</h1>

      <div className="frame-container">
        <div className="eth-amount">
          <h1>{ethAmount} ETH</h1>
          <p>≈ ${usdAmount} USD</p>
        </div>
      </div>

      <img src={NukeButton} className="nuke-button" onClick={toggleModal} />
      {showNFTModal && <HoneyPotModal onClose={() => setShowNFTModal(false)} />}
    </div>
  );
}

export default HoneyPot;
