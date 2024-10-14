import { baseClient } from '~/lib/client';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { TraitForgeNftABI, EntityForgingABI, EntropyGeneratorABI } from '~/lib/abis';
import { NextRequest, NextResponse } from 'next/server';
import { processImage } from '~/utils/entropy';
import { isInbred } from '~/utils';
import { decodeEventLog } from 'viem';
import { ethers } from 'ethers';
import { random } from 'lodash';

const eventAbi = [
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "newTokenid", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "parent1Id", "type": "uint256" },
      { "indexed": true, "internalType": "uint256", "name": "parent2Id", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "newEntropy", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "forgingFee", "type": "uint256" }
    ],
    "name": "EntityForged",
    "type": "event"
  }
];

export const POST = async (req: NextRequest) => {
  try {
    const data = await req.json();
    const { event } = data;
    const activity = event.activity[0];
    if (activity.fromAddress === '0x0000000000000000000000000000000000000000') {
      // Mints new NFT
      const tokenId = Number(activity.erc721TokenId);
      const tokenGen = Number(
        await baseClient.readContract({
          address: CONTRACT_ADDRESSES.TraitForgeNft,
          abi: TraitForgeNftABI,
          functionName: 'tokenGenerations',
          args: [BigInt(tokenId)],
        })
      );
        // EntityForging
        const tokenEntropy = Number(
          await baseClient.readContract({
            address: CONTRACT_ADDRESSES.TraitForgeNft,
            abi: TraitForgeNftABI,
            functionName: 'tokenEntropy',
            args: [BigInt(tokenId)],
          })
        );
        const transactionHash = activity.hash;
        if (!transactionHash) {
           console.error('Transaction hash is missing or null');
         return NextResponse.json({ status: 'fail', message: 'Invalid transaction hash' }, { status: 400 });
        }
        const receipt = await baseClient.getTransactionReceipt({ hash: transactionHash });
        const eventLog = receipt.logs[9];
        if (!eventLog) {
          return NextResponse.json({ status: 'fail' }, { status: 404 });;
        }
        const iface = new ethers.Interface(eventAbi);
        const decodedLog = iface.decodeEventLog("EntityForged", eventLog.data, eventLog.topics);
        console.log(decodedLog);
        if (
           decodedLog[1] && 
           decodedLog[2] &&
          typeof decodedLog[1] === 'bigint' &&
          typeof decodedLog[2] === 'bigint'
        ) {
          const parent1Id = decodedLog[1];
          const parent2Id = decodedLog[2];
          const isPossiblyInbred = await isInbred(parent1Id, parent2Id);
          if (isPossiblyInbred) {
            const index = Math.floor(Math.random() * 13);
            const slot = Math.floor(Math.random() * 834);
            const randomEntropy = Number(
              await baseClient.readContract({
                address: CONTRACT_ADDRESSES.EntropyGenerator, 
                abi: EntropyGeneratorABI,
                functionName: 'getPublicEntropy',
                args: [BigInt(slot), BigInt(index)], 
              })
            );
          await processImage(tokenEntropy, randomEntropy, tokenGen, isPossiblyInbred);
        } else {
          await processImage(tokenEntropy, tokenEntropy, tokenGen, isPossiblyInbred);
        }
      } else {
        console.error('parent1Id and parent2Id do not exist in the event args');
      }
    }
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  } catch (e) {
    console.log('Nft event error:', e);
    return NextResponse.json({ e }, { status: 500 });
  }
};
