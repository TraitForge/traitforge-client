import { baseSepoliaClient } from '~/lib/client';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { TraitForgeNftABI, EntityForgingABI } from '~/lib/abis';
import { NextRequest, NextResponse } from 'next/server';
import { processImage } from '~/utils/entropy';
import { isInbred } from '~/utils';
import { decodeEventLog } from 'viem'

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { event } = data;
    const activity = event.activity[0];
    if (activity.fromAddress === '0x0000000000000000000000000000000000000000') {
      // Mints new NFT
      const tokenId = Number(activity.erc721TokenId);
      const currentGen = Number(
        await baseSepoliaClient.readContract({
          address: CONTRACT_ADDRESSES.TraitForgeNft,
          abi: TraitForgeNftABI,
          functionName: 'currentGeneration',
          args: [],
        })
      );
      const tokenGen = Number(
        await baseSepoliaClient.readContract({
          address: CONTRACT_ADDRESSES.TraitForgeNft,
          abi: TraitForgeNftABI,
          functionName: 'tokenGenerations',
          args: [BigInt(tokenId)],
        })
      );
        // EntityForging
        const tokenEntropy = Number(
          await baseSepoliaClient.readContract({
            address: CONTRACT_ADDRESSES.TraitForgeNft,
            abi: TraitForgeNftABI,
            functionName: 'tokenEntropy',
            args: [BigInt(tokenId)],
          })
        );
        const transactionHash = activity.transactionHash;
        const receipt = await baseSepoliaClient.getTransactionReceipt({ hash: transactionHash });
        const eventLog = receipt.logs[3];
        if (!eventLog) {
          return NextResponse.json({ status: 'fail' }, { status: 404 });;
        }
        const decodedLog = decodeEventLog({
          abi: EntityForgingABI,
          data: eventLog.data,
          topics: eventLog.topics,
        }); 
        const parent1Id = decodedLog.args.parent1Id;
        const parent2Id = decodedLog.args.parent2Id;
        const isPossiblyInbred = await isInbred(parent1Id, parent2Id);
        await processImage(tokenEntropy, tokenGen, isPossiblyInbred);
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (e) {
    console.log('Nft event error:', e);
    return NextResponse.json({ e }, { status: 500 });
  }
};
