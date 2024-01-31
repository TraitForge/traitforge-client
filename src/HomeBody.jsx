import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './HomeBody.css';
import Slider from './NFTSlider';

import mintContractAbi from '/Users/hudsondungey/TFCREAM/updatedrepo/src/contracts/Mint.json';

const HomeBody = ({ userWallet }) => {
  const [entityPrice, setEntityPrice] = useState(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(true);
  const [mintedCounts, setMintedCounts] = useState({});
  
  const localProvider = 'http://localhost:8545';




  const getLatestEntityPrice = async () => {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(localProvider));
      const contract = new web3.eth.Contract(mintContractAbi.abi, '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0');
      const price = await contract.methods.getCurrentPrice().call();
      const priceInEth = web3.utils.fromWei(price, 'ether');
      setEntityPrice(priceInEth);
    } catch (error) {
      console.error('Error in getLatestEntityPrice:', error);
      throw error;
    }
  };




  const fetchMintedCounts = async () => {
    try {
      const web3 = new Web3(new Web3.providers.HttpProvider(localProvider));
      const contract = new web3.eth.Contract(mintContractAbi.abi, '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0');
  
      const mintedCountsData = {};
      for (let gen = 1; gen <= 6; gen++) {
        mintedCountsData[`gen${gen}`] = await contract.methods.entitiesPerGenerationCount(gen).call();
      }
  
      setMintedCounts(mintedCountsData);
    } catch (error) {
      console.error('Error fetching minted counts:', error);
    }
  };



  useEffect(() => {
    setIsFetchingPrice(true);
    getLatestEntityPrice()
      .then(price => {
        setEntityPrice(price);
        setIsFetchingPrice(false);
      })
      .catch(error => {
        console.error('Error fetching entity price:', error);
        setIsFetchingPrice(false);
      });

    fetchMintedCounts();
  }, []);




  const mintEntityHandler = async () => {
    if (!userWallet) {
      alert('Wallet is not connected.');
      return;
    }
  
    if (entityPrice == null) {
      alert("The entity price is not yet available. Please try again later.");
      return;
    }
  
    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract(mintContractAbi.abi, '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0');
      const transactionParameters = {
        to: '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0',
        from: userWallet,
        value: web3.utils.toWei(entityPrice.toString(), 'ether'),
        data: contract.methods.mint().encodeABI()
      };

      await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters],
      });

      console.log('Entity minted successfully');
    } catch (error) {
      console.error('Error minting entity:', error);
      alert('There was an error minting your entity.');
    }
  };



  return (
    <main>

    <div className='mint-container'>
        <span className='mint-text'>Mint your TraitForge Entity here</span>
      <div className='mint-button'>
     <button onClick={mintEntityHandler} disabled={isFetchingPrice || !userWallet}>
      {isFetchingPrice ? 'Fetching Price...' : `Mint for ${entityPrice} ETH`}
     </button>
      </div>



     </div>

     <div className='nexttokenslider'> 
        <Slider/>
      </div>

        <h2>Entities Minted:</h2>
        <div className="gen-container">
          {Object.entries(mintedCounts).map(([generation, count]) => (
            <div key={generation}>{generation}: <span>{count}</span></div>
          ))}
        </div>

    
    </main>
  );
};

export default HomeBody;