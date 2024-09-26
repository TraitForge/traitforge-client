import { CONTRACT_ADDRESSES } from '~/constants/address';
import { EntropyGeneratorABI } from '~/lib/abis';
import { baseSepoliaClient } from '~/lib/client';
import { NextResponse } from 'next/server';
import { processImage } from '~/utils/entropy';

export const POST = async () => {
  try {
    let entityGeneration = 1;
    let finalIndex = 1;
    for (let slotIndex = 0; slotIndex < 770; slotIndex++) {
      for (let numberIndex = 0; numberIndex < 13; numberIndex++) {
        try {
          const result = await baseSepoliaClient.readContract({
            address: CONTRACT_ADDRESSES.EntropyGenerator,
            abi: EntropyGeneratorABI,
            functionName: 'getPublicEntropy',
            args: [BigInt(slotIndex), BigInt(numberIndex)],
          });
          const paddedEntropy = String(result);
          const isPossiblyInbred = false
          const url = await processImage(paddedEntropy, paddedEntropy, entityGeneration, isPossiblyInbred);
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
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('Failed to generate or upload:', error);
    return NextResponse.json(
      { error: 'Failed to compose or upload image' },
      { status: 500 }
    );
  }
};
