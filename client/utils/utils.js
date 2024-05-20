import { ethers } from 'ethers';

import { contractsConfig } from './contractsConfig';

export function calculateEntityAttributes(paddedEntropy) {
  const performanceFactor = paddedEntropy.toString() % 10;
  const lastTwoDigits = paddedEntropy.toString() % 100;
  const forgePotential = Math.floor(lastTwoDigits / 10);
  const nukeFactor = Number((paddedEntropy / 40000).toFixed(3));
  let role;
  const result = paddedEntropy.toString() % 3;
  if (result === 0) {
    role = 'Forger';
  } else {
    role = 'Merger';
  }
  return { role, forgePotential, nukeFactor, performanceFactor };
}

export async function createContract(walletProvider, address, abi) {
  const ethersProvider = new ethers.BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const mintContract = new ethers.Contract(address, abi, signer);
  return mintContract;
}

export const getEntitiesHook = async infuraProvider => {
  const contract = new ethers.Contract(
    contractsConfig.entityMergingAddress,
    contractsConfig.entityMergingContractAbi,
    infuraProvider
  );
  const data = await contract.fetchListings();
  const entitiesForForging = await Promise.all(data);
  return entitiesForForging;
};

export const getUpcomingMintsHook = async (
  startSlot,
  startNumberIndex,
  infuraProvider
) => {
  const contract = new ethers.Contract(
    contractsConfig.entropyGeneratorContractAddress,
    contractsConfig.entropyGeneratorContractAbi,
    infuraProvider
  );

  let allEntropies = [];
  let maxSlot = 770;
  let maxCount = 50;

  try {
    while (allEntropies.length < maxCount && startSlot < maxSlot) {
      const promises = [];
      for (
        let numberIndex = startNumberIndex;
        numberIndex < 13 && allEntropies.length < maxCount;
        numberIndex++
      ) {
        const promise = contract
          .getPublicEntropy(startSlot, numberIndex)
          .then(value => parseInt(value, 10))
          .catch(error => {
            console.error('Error fetching entropy:', error);
            return 0;
          });
        promises.push(promise);
      }
      const results = await Promise.all(promises);
      allEntropies = allEntropies.concat(results);
      startSlot++;
      startNumberIndex = 0;
    }
  } catch (error) {
    console.error('Unhandled error:', error);
  }

  return { allEntropies, maxCount };
};
export const getEntitiesForSaleHook = async infuraProvider => {
  const tradeContract = new ethers.Contract(
    contractsConfig.entityTradingContractAddress,
    contractsConfig.entityTradingAbi,
    infuraProvider
  );
  const data = await tradeContract.fetchListedEntities();
  const entitiesForSale = await Promise.all(data);
  return entitiesForSale;
};

export const getOwnersEntitiesHook = async walletProvider => {
  try {
    const ethersProvider = new ethers.BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const TraitForgeContract = new ethers.Contract(
      contractsConfig.traitForgeNftAddress,
      contractsConfig.traitForgeNftAbi,
      ethersProvider
    );

    const balance = await TraitForgeContract.balanceOf(address);
    console.log("entity balance:", balance)
    const fetchPromises = [];

    for (let i = 0; i < balance; i++) {
      fetchPromises.push(TraitForgeContract.tokenOfOwnerByIndex(address, i));
    }

    const entities = await Promise.all(fetchPromises);
    console.log("context entities", entities)
    return entities;
  } catch (error) {
    console.error("Error fetching owner's entities:", error);
    throw error;
  }
};

export const getEntityEntropyHook = async (walletProvider, listing) => {
  const ethersProvider = new ethers.BrowserProvider(walletProvider)
  const signer = await ethersProvider.getSigner();
  const TraitForgeContract = new ethers.Contract(
    contractsConfig.traitForgeNftAddress,  
    contractsConfig.traitForgeNftAbi,     
    signer
  );
  const entityEntropy = await TraitForgeContract.getTokenEntropy(listing);
  return entityEntropy;
};