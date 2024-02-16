import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import LoadingSpinner from './Spinner';
import '../styles/Home.css';
import Slider from './EntitySlider';
import MintAbi from '../artifacts/contracts/Mint.sol/Mint.json';

const MintAddress = '0xA51c1fc2f0D1a1b8494Ed1FE312d7C3a78Ed91C0';


const HomeBody = () => {
  const [entityPrice, setEntityPrice] = useState(null);
  const [mintedCounts, setMintedCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { isConnected} = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const getLatestEntityPrice = useCallback(async () => {
    if (!walletProvider) return;
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = ethersProvider.getSigner();
      const mintContract = new ethers.Contract(MintAddress, MintAbi.abi, signer);
      
      const startPrice = await mintContract.START_PRICE();
      const priceIncrement = await mintContract.PRICE_INCREMENT();
      const mintedCount = await mintContract.mintedCount();
      const currentPrice = startPrice.add(priceIncrement.mul(mintedCount));
      const priceInEth = ethers.utils.formatEther(currentPrice);
  
      console.log('priceInEth:', priceInEth);
      setEntityPrice(priceInEth);
      setMintedCounts(mintedCounts);
    } catch (error) {
      console.error('Error in getLatestEntityPrice:', error);
    }
  }, [walletProvider, mintedCounts]);

const mintEntityHandler = async () => {
  if (!isConnected) {
    console.error('User disconnected');
    return;
  }
  setIsLoading(true);
  try {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const mintContract = new ethers.Contract(MintAddress, MintAbi.abi, signer);
    const transaction = await mintContract.mint({ value: ethers.utils.parseEther(entityPrice), gasLimit: ethers.utils.hexlify(1000000) });
    await transaction.wait();
    console.log('Entity minted successfully');
  } catch (error) {
    console.error('Minting entity failed:', error);
  } finally {
    setIsLoading(false);
  }
};


  useEffect(() => {
    getLatestEntityPrice();
  }, [getLatestEntityPrice]);


  return (
    <main>
      <div className='mint-container'>
        <span className='mint-text'>Mint your traitforge entity</span>
        <div className='mint-button'>
          <button onClick={mintEntityHandler} disabled={isLoading || !entityPrice}>
            {isLoading ? <LoadingSpinner /> : `Mint for ${entityPrice || '...'} ETH`}
          </button>
        </div>
      </div>
      <div className='nexttokenslider'>
        <Slider />
      </div>
    </main>
  );
};

export default HomeBody;

