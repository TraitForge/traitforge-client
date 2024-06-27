import { formatEther } from 'viem';
import { useReadContracts } from 'wagmi';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { EntropyGeneratorABI } from '~/lib/abis';
import { Entropy } from '~/types';

export const useUpcomingMints = (mintPrice: bigint) => {
  const entityPrice = Number(formatEther(mintPrice));
  const priceToIndex = Math.floor(entityPrice * 10000);
  const startSlot = Math.floor(priceToIndex / 13);
  const startNumberIndex = (priceToIndex + 12) % 13;
  const maxSlot = 770;
  const maxCount = 50;
  const inputs = [];

  let slot = startSlot;
  let index = startNumberIndex;

  while (inputs.length < maxCount && slot < maxSlot) {
    for (
      let numberIndex = index;
      numberIndex < 13 && inputs.length < maxCount;
      numberIndex++
    ) {
      inputs.push({ slot: slot, index: numberIndex });
    }
    slot++;
    index = 0;
  }

  const { data, isFetching } = useReadContracts({
    contracts: inputs.map(input => ({
      abi: EntropyGeneratorABI,
      address: CONTRACT_ADDRESSES.EntropyGenerator,
      functionName: 'getPublicEntropy',
      args: [input.slot, input.index],
    })),
  });

  return {
    data:
      data?.map(
        (res, index) =>
          ({
            id: startSlot * 13 + index,
            entropy: Number(res.result || 0),
          } as Entropy)
      ) || [],
    isFetching,
  };
};
