import React, { useState, useEffect, useCallback, useContext } from 'react';
import Web3 from 'web3';
import { Web3Context } from '../utils/Web3Context';
import LoadingSpinner from './LoadingSpinner';
import '../styles/HomeBody.css';
import Slider from './EntitySlider';

import mintContractAbi from '../contracts/Mint.json';

const HomeBody = () => {
  const { userWallet } = useContext(Web3Context);
  const [entityPrice, setEntityPrice] = useState(null);
  const [mintedCounts, setMintedCounts] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const InfuraProvider = 'https://goerli.infura.io/v3/3f27d7e6326b43c5b77e16ac62188640';
  const getLatestEntityPrice = useCallback(async () => {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(InfuraProvider));
      const contract = new web3.eth.Contract(mintContractAbi.abi, '0x4a634580371BB162f371616aec871Bc46201D937');
    
      const START_PRICE = await contract.methods.START_PRICE().call();
      const PRICE_INCREMENT = await contract.methods.PRICE_INCREMENT().call();
      const mintedCount = await contract.methods.mintedCount().call();

      const currentPrice = (parseInt(START_PRICE) + (parseInt(mintedCount) * parseInt(PRICE_INCREMENT))).toString();
      const priceInEth = web3.utils.fromWei(currentPrice, 'ether');
      console.log('priceInEth:', priceInEth); 
      setEntityPrice(priceInEth);
    } catch (error) {
      console.error('Error in getLatestEntityPrice:', error);
      throw error;
    }
  }, []);



  const fetchMintedCounts = async () => {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(InfuraProvider));
      const contract = new web3.eth.Contract(mintContractAbi.abi, '0x4a634580371BB162f371616aec871Bc46201D937');
      const mintedCountsData = {};
      for (let gen = 1; gen <= 6; gen++) {
        mintedCountsData[`gen${gen}`] = await contract.methods.mintedCount(gen).call();
      }
      setMintedCounts(mintedCountsData);
    } catch (error) {
      console.error('Error fetching minted counts:', error);
    }
  };



  useEffect(() => {
    setIsLoading(true);
    getLatestEntityPrice() 
      .then(() => {
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching entity price:', error);
        setIsLoading(false);
      });
  
    fetchMintedCounts();
  }, [getLatestEntityPrice]);



  const mintEntityHandler = async () => {
    setIsLoading(true);
  
    if (!userWallet) {
      alert('Wallet is not connected.');
      return;
    };
  
    if (entityPrice == null) {
      alert("The entity price is not yet available. Please try again later.");
      return;
    };
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(InfuraProvider));
      const contract = new web3.eth.Contract(mintContractAbi.abi, '0x4a634580371BB162f371616aec871Bc46201D937');
      const transactionParameters = {
        to: '0x4a634580371BB162f371616aec871Bc46201D937',
        from: userWallet,
        value: web3.utils.toWei(entityPrice.toString(), 'ether'),
        data: contract.methods.mint().encodeABI()
      }; 


      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      }); console.log('Entity minted successfully');
    } catch (error) {
      console.error('Error minting entity:', error);
      alert('There was an error minting your entity.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <main>
     
    <div className='mint-container'>
        <span className='mint-text'>Mint your TraitForge Entity here </span>
      <div className='mint-button'>
      <button onClick={mintEntityHandler} disabled={!userWallet || isLoading}>
         {isLoading ? <LoadingSpinner /> : `Mint for ${entityPrice} ETH`}
      </button>

      </div>
     </div>

     <div className='nexttokenslider'> 
        <Slider/>
      </div>

        <h2>Entities Minted:</h2>
        <div className="gen-container">
          {Object.entries(mintedCounts).map(([generation, count]) => (
            <div key={generation}>{generation}: <span>{count}</span>/10,000</div>
          ))}
        </div>

    
    </main>
  );
};

export default HomeBody;