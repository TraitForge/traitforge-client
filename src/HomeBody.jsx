import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import './HomeBody.css';
import Slider from './NFTSlider';




const HomeBody = ({ userWallet }) => {
  const [nftPrice, setNftPrice] = useState(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(true);
  const [mintedCounts, setMintedCounts] = useState({
    gen1: 0, gen2: 0, gen3: 0, gen4: 0
  });




  const getLatestNftPrice = async () => {
    try {
      const web3 = new Web3(`http://localhost:8545`);
      const contract = new web3.eth.Contract();
      const price = await contract.methods.getCurrentPrice().call();
      const priceInEth = web3.utils.fromWei(price, 'ether');
      return priceInEth;
    } catch (error) {
      console.error('Error in getLatestNftPrice:', error);
      throw error;
    }
  };




  const fetchMintedCounts = async () => {
    if (typeof window.ethereum === 'undefined') {
      console.error('Please install MetaMask!');
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);
      const contract = new web3.eth.Contract();

      const mintedCountsData = {};
      for (let gen = 1; gen <= 6; gen++) {
        mintedCountsData[`gen${gen}`] = await contract.methods.getMintedCountForGeneration(gen).call();
      }

      setMintedCounts(mintedCountsData);
    } catch (error) {
      console.error('Error fetching minted counts:', error);
    }
  };



  useEffect(() => {
    setIsFetchingPrice(true);
    getLatestNftPrice()
      .then(price => {
        setNftPrice(price);
        setIsFetchingPrice(false);
      })
      .catch(error => {
        console.error('Error fetching NFT price:', error);
        setIsFetchingPrice(false);
      });

    fetchMintedCounts();
  }, []);





    const mintNftHandler = async () => {
      if (!userWallet) {
        alert('Wallet is not connected.');
        return;
      }
    
      if (nftPrice == null) {
        alert("The NFT price is not yet available. Please try again later.");
        return;
      }
    
      try {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract();



        const transactionParameters = {
          to: contract, 
          from: userWallet, 
          value: web3.utils.toWei(nftPrice.toString(), 'ether'), 
          data: contract.methods.mintNFT().encodeABI() 
        };
  
        
        await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [transactionParameters],
        });
    
        console.log('NFT minted successfully');
      } catch (error) {
        console.error('Error minting NFT:', error);
        alert('There was an error minting your NFT.');
      }
  };



  return (
    <main>

    <div className='mint-container'>
        <span className='mint-text'>Mint your TraitForge Entity here</span>
      <div className='mint-button'>
     <button onClick={mintNftHandler} disabled={isFetchingPrice || !userWallet}>
      {isFetchingPrice ? 'Fetching Price...' : `Mint for ${nftPrice} ETH`}
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