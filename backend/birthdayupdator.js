const { ethers } = require('ethers');
const cron = require('node-cron');
const { generateUpdatedImage, storeImage, updateMetadata } = require('./imageUtils');


const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_API_KEY');
const nftContract = new ethers.Contract(YOUR_CONTRACT_ADDRESS, YOUR_CONTRACT_ABI, provider);


async function retrieveNFTData() {
    const nftData = [];
    for (let i = 0; i < 10000; i++) {
        const data = await nftContract.tokenURI(i);
        nftData.push({ tokenId: i, data });
    }
    return nftData;
}


function updateNFTsAnnually() {
    cron.schedule('0 0 1 * *', async () => { 
        const nftData = await retrieveNFTData();
        for (const nft of nftData) {
            const newImage = await generateUpdatedImage(nft); 
            const newImageUrl = await storeImage(newImage); 
            await updateMetadata(nft.tokenId, newImageUrl); 
        }
    });
}


async function main() {
    updateNFTsAnnually();
}

main();
