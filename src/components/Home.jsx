import React, { useState, useEffect, useCallback } from 'react';
import { useWeb3ModalProvider, useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import LoadingSpinner from './Spinner';
import '../styles/Home.css';
import Slider from './EntitySlider';
import MintAbi from '../artifacts/contracts/CustomERC721.sol/CustomERC721.json';

const MintAddress = '0x2E2Ed0Cfd3AD2f1d34481277b3204d807Ca2F8c2';


const HomeBody = () => {
  const [entityPrice, setEntityPrice] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isConnected} = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const initializeEthersProvider = () => {
    if (window.ethereum) {
      try {
        return new ethers.providers.Web3Provider(window.ethereum);
      } catch (error) {
        console.error("Failed to create a Web3Provider:", error);
      }
    } else {
      console.warn("Ethereum object (window.ethereum) not found. This application requires an Ethereum browser extension like MetaMask.");
      return null;
    }
  };

  const getLatestEntityPrice = useCallback(async () => {
    const ethersProvider = initializeEthersProvider();
    if (!ethersProvider) return;
    setIsLoading(true);
    try {
      const signer = ethersProvider.getSigner();
      const mintContract = new ethers.Contract(MintAddress, MintAbi.abi, signer);
      
      const mintPrice = await mintContract.calculateMintPrice();
      const priceInEth = ethers.utils.formatEther(mintPrice);
      setEntityPrice(priceInEth);
    } catch (error) {
      console.error('Error in getLatestEntityPrice:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getLatestEntityPrice();
  }, [getLatestEntityPrice]);

const mintEntityHandler = async () => {
  if (!isConnected) {
    alert('Please connect Wallet.');
    return;
  }
  setIsLoading(true);
  try {
    const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const userAddress = await signer.getAddress();
    const mintContract = new ethers.Contract(MintAddress, MintAbi.abi, signer);
    const transaction = await mintContract.mintToken(
      userAddress, 
      { value: ethers.utils.parseEther(entityPrice),
      gasLimit: ethers.utils.hexlify(1000000)
    });
    await transaction.wait();
    alert('Entity minted successfully');
  } catch (error) {
    console.error('Failed to mint entity:', error);
    alert('Minting entity failed');
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
)};

export default HomeBody;