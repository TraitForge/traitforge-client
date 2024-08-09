import { formatUnits } from 'viem';
import { useReadContract } from 'wagmi';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { PriceOracleABI } from '~/lib/abis';

export const useEthPrice = () => {
  const { data, isFetching } = useReadContract({
    abi: PriceOracleABI,
    address: CONTRACT_ADDRESSES.PriceOracle,
    functionName: 'latestRoundData',
    args: [],
    query: {
      refetchInterval: 15000,
    },
  });

  return {
    data: Number(formatUnits(BigInt(data?.[1] ?? 0n), 8)),
    isFetching,
  };
};
