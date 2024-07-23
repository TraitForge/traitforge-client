import { CONTRACT_ADDRESSES } from '~/constants/address';
import { EntropyGeneratorABI } from '~/lib/abis';
import { publicClient } from '~/lib/config';
import { processImage } from '../process/route';
import { NextResponse } from 'next/server';

async function startProcessing() {
  let entityGeneration = 1;
  let finalIndex = 1;
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
          `${finalIndex}: Processed ${paddedEntropy} in generation ${entityGeneration}: ${url}`
        );
      } catch (error) {
        console.error(
          `${finalIndex}: Failed at slot ${slotIndex}, number ${numberIndex} in generation ${entityGeneration}:`,
          error
        );
      }
      finalIndex++;
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

export const POST = async () => {
  try {
    await startProcessing();
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Failed to generate or upload:', error);
    return NextResponse.json(
      { error: 'Failed to compose or upload image' },
      { status: 500 }
    );
  }
};
