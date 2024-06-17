import { contractsConfig } from '@/utils/contractsConfig';
import { ethers } from 'ethers';
import { processImage } from './generate-image';

export default async function handler(req, res) {
  try {
    const { event } = req.body;
    const activity = event.activity[0];
    if (activity.fromAddress === '0x0000000000000000000000000000000000000000') {
      // Mints new NFT
      const tokenId = Number(activity.erc721TokenId);
      const infuraProvider = new JsonRpcProvider(contractsConfig.infuraRPCURL);
      const nftContract = new ethers.Contract(
        contractsConfig.traitForgeNftAddress,
        contractsConfig.traitForgeNftAbi,
        infuraProvider
      );
      const currentGen = await nftContract.currentGeneration();
      const tokenGen = await nftContract.tokenGenerations(tokenId);
      if (tokenGen > currentGen) {
        // EntityForging
        const tokenEntropy = await nftContract.tokenEntropy(tokenId);
        await processImage(tokenEntropy, tokenGen);
      }
    }
    res.status(200).send('Ok');
  } catch (e) {
    console.log('Nft event error:', e);
    res.status(500).send(e);
  }
}
