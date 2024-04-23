import { makeAutoObservable } from 'mobx';
import { ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { contractsConfig } from './contractsConfig';

class AppStore {
  entitiesForSale = [];
  upcomingMints = [];
  entitiesForForging = [];
  transactions = [];
  isLoading = false;
  infuraProvider = new JsonRpcProvider(contractsConfig.infuraRPCURL);

  constructor() {
    makeAutoObservable(this);
  }

  async getUpcomingMints(startSlot = 0, startNumberIndex = 0) {
    if (!this.infuraProvider) return;
    this.isLoading = true;

    const contract = new ethers.Contract(
      contractsConfig.entropyGeneratorContractAddress,
      contractsConfig.entropyGeneratorContractAbi,
      this.infuraProvider
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

    this.upcomingMints = allEntropies
      .slice(0, maxCount)
      .map((entropy, index) => ({
        id: startSlot * 13 + index + 1,
        entropy,
      }));

    this.isLoading = false;
  }
  
  async getEntitiesForSale() {
    if (!this.infuraProvider) return;
    this.isLoading = true;
    try {
      const tradeContract = new ethers.Contract(
        contractsConfig.tradeContractAddress,
        contractsConfig.tradeContractAbi,
        this.infuraProvider
      );
      const data = await tradeContract.fetchEntitiesForSale();
      this.entitiesForSale = await Promise.all(data);
    } catch (error) {
      console.error('Failed to fetch entities for sale:', error);
      this.entitiesForSale = [];
    }
    this.isLoading = false;
  }

  async getEntitiesForForging() {
    if (!this.infuraProvider) return;
    this.isLoading = true;
    try {
      const contract = new ethers.Contract(
        contractsConfig.forgeContractAddress,
        contractsConfig.forgeContractAbi,
        this.infuraProvider
      );
      const data = await contract.getAllEntitiesForMerging();
      this.entitiesForForging = await Promise.all(data);
    } catch (error) {
      console.error('Failed to fetch entities for forging:', error);
      this.entitiesForForging = [];
    }
    this.isLoading = false;
  }
}

export const appStore = new AppStore();
