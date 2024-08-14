import { publicClient } from '~/lib/client';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { TraitForgeNftABI } from '~/lib/abis';
import { NextRequest, NextResponse } from 'next/server';
import { processImage } from '~/utils/entropy';

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { event } = data;
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
        const power = Math.floor(Number(tokenEntropy) / 40000)
        await processImage(tokenEntropy, tokenGen, power);
      }
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (e) {
    console.log('Nft event error:', e);
    return NextResponse.json({ e }, { status: 500 });
  }
};
