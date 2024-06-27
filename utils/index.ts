import { formatEther } from 'viem';

export const calculateUri = (
  _paddedEntropy: number | string,
  _generation: number | string
) => {
  return `${_paddedEntropy}_${_generation}`;
};

export const getEntityPrice = (mintPrice: bigint, index: number) => {
  const numericPrice = Number(formatEther(mintPrice));
  const increment = index * 0.0001;
  const calculatedPrice = (numericPrice + increment).toFixed(4);
  return calculatedPrice;
};
