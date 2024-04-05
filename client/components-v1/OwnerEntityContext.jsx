import React, { createContext, useContext, useState, useEffect } from 'react';
import { useWeb3ModalAccount } from '@web3modal/ethers5/react';
import { ethers } from 'ethers';
import ERC721ContractAbi from '../artifacts/contracts/CustomERC721.sol/CustomERC721.json';

const EntityContext = createContext();
const ERC721ContractAddress = '...';

export const useEntities = () => useContext(EntityContext);

const EntityProvider = ({ children }) => {
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { address, isConnected, walletProvider } = useWeb3ModalAccount();

  useEffect(() => {
    const fetchUserEntities = async () => {
      if (!isConnected || !address) {
        console.error('Wallet not connected or address not found');
        setError('Wallet not connected or address not found');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const ethersProvider = new ethers.providers.Web3Provider(
          walletProvider
        );
        const signer = ethersProvider.getSigner();
        const ERC721Contract = new ethers.Contract(
          ERC721ContractAddress,
          ERC721ContractAbi.abi,
          signer
        );
        const balance = await ERC721Contract.balanceOf(address);
        let tokenIds = [];
        for (let index = 0; index < balance.toNumber(); index++) {
          const tokenId = await ERC721Contract.tokenOfOwnerByIndex(
            address,
            index
          );
          tokenIds.push(tokenId.toString());
        }

        const entitiesDetails = await Promise.all(
          tokenIds.map(async tokenId => {
            const entropy = await ERC721Contract.getEntropyForToken(tokenId);
            const [nukeFactor, breedPotential, performanceFactor, isSire] =
              await ERC721Contract.deriveTokenParameters(entropy);
            return {
              tokenId,
              nukeFactor: nukeFactor.toString(),
              breedPotential: breedPotential.toString(),
              performanceFactor: performanceFactor.toString(),
              isSire: isSire,
            };
          })
        );

        setEntities(entitiesDetails);
      } catch (error) {
        console.error('Could not retrieve entities:', error);
        setError('Failed to fetch entities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserEntities();
  }, [address, isConnected, walletProvider]);

  return (
    <EntityContext.Provider value={{ entities, isLoading, error }}>
      {children}
    </EntityContext.Provider>
  );
};

export default EntityProvider;
