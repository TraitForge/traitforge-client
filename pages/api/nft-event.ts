import { processImage } from './entropy/process';
import { NextApiRequest, NextApiResponse } from 'next';
import { publicClient } from '~/lib/config';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { TraitForgeNftABI } from '~/lib/abis';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { event } = req.body;
    const activity = event.activity[0];
    if (activity.fromAddress === '0x0000000000000000000000000000000000000000') {
      // Mints new NFT
      const tokenId = Number(activity.erc721TokenId);
      const currentGen = Number(
        await publicClient.readContract({
          address: CONTRACT_ADDRESSES.TraitForgeNft,
          abi: TraitForgeNftABI,
          functionName: 'currentGeneration',
          args: [],
        })
      );
      const tokenGen = Number(
        await publicClient.readContract({
          address: CONTRACT_ADDRESSES.TraitForgeNft,
          abi: TraitForgeNftABI,
          functionName: 'tokenGenerations',
          args: [BigInt(tokenId)],
        })
      );
      if (tokenGen > currentGen) {
        // EntityForging
        const tokenEntropy = Number(
          await publicClient.readContract({
            address: CONTRACT_ADDRESSES.TraitForgeNft,
            abi: TraitForgeNftABI,
            functionName: 'tokenEntropy',
            args: [BigInt(tokenId)],
          })
        );
        await processImage(tokenEntropy, tokenGen);
      }
    }
    res.status(200).send('Ok');
  } catch (e) {
    console.log('Nft event error:', e);
    res.status(500).send(e);
  }
}
