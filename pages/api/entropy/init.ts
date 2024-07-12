import { CONTRACT_ADDRESSES } from '~/constants/address';
import { EntropyGeneratorABI } from '~/lib/abis';
import { publicClient } from '~/lib/config';
import { NextApiRequest, NextApiResponse } from 'next';
import { processImage } from './process';

async function startProcessing() {
  let entityGeneration = 1;
  for (let slotIndex = 0; slotIndex < 770; slotIndex++) {
    for (let numberIndex = 0; numberIndex < 13; numberIndex++) {
      try {
        const result = await publicClient.readContract({
          address: CONTRACT_ADDRESSES.EntropyGenerator,
          abi: EntropyGeneratorABI,
          functionName: 'getPublicEntropy',
          args: [BigInt(slotIndex), BigInt(numberIndex)],
        });
        const paddedEntropy = String(result);
        const url = await processImage(paddedEntropy, entityGeneration);
        console.log(
          `Processed ${paddedEntropy} in generation ${entityGeneration}: ${url}`
        );
      } catch (error) {
        console.error(
          `Failed at slot ${slotIndex}, number ${numberIndex} in generation ${entityGeneration}:`,
          error
        );
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      await startProcessing();
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).send('Init success');
    } catch (error) {
      console.error('Failed to generate or upload:', error);
      res.status(500).send('Failed to compose or upload image');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
