import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { contractsConfig } from '@/utils/contractsConfig';
import { processImage } from '@/pages/api/generate-image';
import cron from 'node-cron';

const provider = new JsonRpcProvider(contractsConfig.infuraRPCURL);

const contract = new ethers.Contract(
    contractsConfig.traitForgeNftAddress,
    contractsConfig.traitForgeNftAbi,
    provider
);

const nukeContract = new ethers.Contract(
    contractsConfig.nukeContractAddress,
    contractsConfig.nukeFundContractAbi,
    provider
);

async function getTokenURI(tokenId) {
    try {
        return await contract.getTokenURI(tokenId);
    } catch (error) {
        console.error('Error fetching token URI:', error);
        throw error;
    }
}

async function getTokenMaturity(tokenId) {
    try {
        return await nukeContract.calculateNukeFactor(tokenId);
    } catch (error) {
        console.error('Error calculating nuke factor:', error);
        throw error;
    }
}

async function calculateIntensityByMaturity(maturity) {
    const maxIntensity = 500000;
    return (maturity / maxIntensity) * 100;
}

async function renderAndUpdateImage(tokenId) {
    try {
        const uri = await getTokenURI(tokenId);
        const maturity = await getTokenMaturity(tokenId);
        const entropy = uri.slice(0, 6);
        const generation = uri.split('_').pop();
        const intensity = await calculateIntensityByMaturity(maturity);
        const newImage = processImage(entropy, generation, intensity);
    } catch (error) {
        console.error('Error processing token:', tokenId, error);
    }
}

cron.schedule('0 0 * * *', async () => {
    try {
        const totalTokens = await contract.totalSupply();
        for (let i = 0; i < totalTokens; i++) {
            await renderAndUpdateImage(i);
        }
    } catch (error) {
        console.error('Error in scheduled job:', error);
    }
});
