import { formatEther } from 'viem';
import { EntityRole } from '~/types';

export const calculateUri = (
  _paddedEntropy: number | string,
  _generation: number | string
) => {
  return `entity/${_generation}/${_paddedEntropy}`;
};

export const getEntityPrice = (
  mintPrice: bigint,
  priceIncrement: bigint,
  index: number
) => {
  return Number(formatEther(mintPrice + priceIncrement * BigInt(index)));
};

export const calculateEntityAttributes = (paddedEntropy: string | number) => {
  const paddedEntropyNumber = Number(paddedEntropy);
  const performanceFactor = paddedEntropyNumber % 10;
  const lastTwoDigits = paddedEntropyNumber % 100;
  const forgePotential = Math.floor(lastTwoDigits / 10);
  const nukeFactor = Number((paddedEntropyNumber / 40000).toFixed(2));
  const result = paddedEntropyNumber % 3;
  const role = result === 0 ? EntityRole.FORGER : EntityRole.MERGER;
  return { role, forgePotential, nukeFactor, performanceFactor };
};

export const shortenAddress = (address: `0x${string}`) => {
  // Extract the first four characters (including '0x')
  const firstPart = address.slice(0, 4);

  // Extract the last four characters
  const lastPart = address.slice(-4);

  // Combine the parts with '......' in between
  const shortenedAddress = `${firstPart}......${lastPart}`;

  return shortenedAddress;
};
