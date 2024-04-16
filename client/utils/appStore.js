import { makeAutoObservable } from 'mobx';
import { ethers } from 'ethers';
import { JsonRpcProvider } from 'ethers/providers';
import { contractsConfig } from './contractsConfig';

class AppStore {
    entitiesForSale = [];
    upcomingMints = [];
    entitiesForForging = [];
    transactions = [];
    modalContent = null;
    ownerEntities = [];
    isLoading = false;
    isOpen = false;
    infuraProvider = new JsonRpcProvider(contractsConfig.infuraRPCURL); 

    constructor() {
        makeAutoObservable(this);
    }

    openModal(content) {
        this.modalContent = content;
        this.isOpen = true;
    }

    closeModal() {
        this.isOpen = false;
    }

    async getUpcomingMints() {
        if (!this.infuraProvider) return;
        this.isLoading = true;
        
        const contract = new ethers.Contract(
            contractsConfig.entropyGeneratorContractAddress,
            contractsConfig.entropyGeneratorContractAbi,
            this.infuraProvider
        );
        
        let allEntropies = [];
        for (let slotIndex = 0; slotIndex < 4; slotIndex++) {
            for (let numberIndex = 0; numberIndex < 13; numberIndex++) {
                try {
                    const entropyValue = await contract.getPublicEntropy(slotIndex, numberIndex);
                    allEntropies.push(parseInt(entropyValue, 10));
                } catch (error) {
                    console.error('Error fetching entropy:', error);
                    allEntropies.push(0);
                }
            }
        }
        
        this.upcomingMints = allEntropies.slice(0, 150).map((entropy, index) => ({
            id: index + 1,
            entropy,
        }));
        
        this.isLoading = false;
    }

    async getOwnersEntities(address) {
        if (!address) {
            this.ownerEntities = [];
            console.log(address);
            return;
        }
        
        const TraitForgeContract = new ethers.Contract(
            contractsConfig.traitForgeNftAddress,
            contractsConfig.traitForgeNftAbi,
            this.infuraProvider
        );
    
        try {
            const balance = await TraitForgeContract.balanceOf(address);
            const fetchPromises = [];
            console.log(`Balance for address ${address}: ${balance}`);

    
            for (let i = 0; i < balance; i++) {
                fetchPromises.push((async () => {
                    const tokenId = await TraitForgeContract.tokenOfOwnerByIndex(address, i);
                    const tokenURI = await TraitForgeContract.tokenURI(tokenId);
                    return { tokenId: tokenId.toString(), tokenURI };
                })());
            }
    
            this.ownerEntities = await Promise.all(fetchPromises);
        } catch (error) {
            console.error('Error fetching NFTs:', error);
            this.ownerEntities = [];
        }
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
