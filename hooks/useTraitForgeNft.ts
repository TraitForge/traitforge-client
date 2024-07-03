import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatEther } from 'viem';
import {
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import {
  EntityForgingABI,
  EntityTradingABI,
  EntropyGeneratorABI,
  NukeFundABI,
  TraitForgeNftABI,
} from '~/lib/abis';
import { Entity, EntityForging, EntityTrading, Entropy } from '~/types';
import { calculateEntityAttributes } from '~/utils';

// Read Functions

export const useCurrentGeneration = () => {
  const { data, isFetching, refetch } = useReadContract({
    abi: TraitForgeNftABI,
    address: CONTRACT_ADDRESSES.TraitForgeNft,
    functionName: 'getGeneration',
    args: [],
  });

  return {
    data: Number(data ?? 0),
    isFetching,
    refetch,
  };
};

export const useMintPrice = () => {
  const { data, isFetching, refetch } = useReadContract({
    abi: TraitForgeNftABI,
    address: CONTRACT_ADDRESSES.TraitForgeNft,
    functionName: 'calculateMintPrice',
    args: [],
  });

  return {
    data: BigInt(data ?? 0),
    isFetching,
    refetch,
  };
};

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
            entropy: Number(res.result ?? 0),
          }) as Entropy
      ) ?? [],
    isFetching,
  };
};

export const useNftBalance = (address: `0x${string}`) => {
  const { data, isFetching, refetch } = useReadContract({
    abi: TraitForgeNftABI,
    address: CONTRACT_ADDRESSES.TraitForgeNft,
    functionName: 'balanceOf',
    args: [address],
  });

  return {
    data: Number(data ?? 0),
    isFetching,
    refetch,
  };
};

export const useTokenIds = (address: `0x${string}`) => {
  const {
    data: balance,
    isFetching: isBalanceFetching,
    refetch,
  } = useNftBalance(address);

  const { data, isFetching } = useReadContracts({
    contracts: new Array(balance).fill(0).map((_, index) => ({
      abi: TraitForgeNftABI,
      address: CONTRACT_ADDRESSES.TraitForgeNft,
      functionName: 'tokenOfOwnerByIndex',
      args: [address, index],
    })),
  });

  return {
    data: ((data as any) ?? []).map((res: any) =>
      Number(res.result ?? 0)
    ) as number[],
    isFetching: isFetching || isBalanceFetching,
    refetch,
  };
};

export const useNukeFactors = (tokenIds: number[]) => {
  const { data, isFetching } = useReadContracts({
    contracts: tokenIds.map(tokenId => ({
      abi: NukeFundABI,
      address: CONTRACT_ADDRESSES.NukeFund,
      functionName: 'calculateNukeFactor',
      args: [tokenId],
    })),
  });

  return {
    data: (data ?? []).map(res => Number(res.result ?? 0)),
    isFetching,
  };
};

export const useTokenGenerations = (tokenIds: number[]) => {
  const { data, isFetching } = useReadContracts({
    contracts: tokenIds.map(tokenId => ({
      abi: TraitForgeNftABI,
      address: CONTRACT_ADDRESSES.TraitForgeNft,
      functionName: 'getTokenGeneration',
      args: [tokenId],
    })),
  });

  return {
    data: (data as any)?.map((res: any) => Number(res.result ?? 0)) ?? [],
    isFetching,
  };
};

export const useTokenEntropies = (tokenIds: number[]) => {
  const { data, isFetching } = useReadContracts({
    contracts: tokenIds.map(tokenId => ({
      abi: TraitForgeNftABI,
      address: CONTRACT_ADDRESSES.TraitForgeNft,
      functionName: 'getTokenEntropy',
      args: [tokenId],
    })),
  });

  return {
    data: (data as any)?.map((res: any) => Number(res.result ?? 0)) ?? [],
    isFetching,
  };
};

export const useOwnerEntities = (address: `0x${string}`) => {
  const {
    data: tokenIds,
    isFetching: isTokenIdsFetching,
    refetch,
  } = useTokenIds(address);
  const { data: tokenGenerations, isFetching: isTokenGenerationsFetching } =
    useTokenGenerations(tokenIds);
  const { data: tokenEntropies, isFetching: isTokenEntropiesFetching } =
    useTokenEntropies(tokenIds);

  return {
    data: tokenIds.map((tokenId, index) => {
      const generation = tokenGenerations?.[index] ?? 0;
      const entropy = tokenEntropies?.[index] ?? 0;
      const paddedEntropy = entropy.toString().padStart(6, '0');
      const { role, forgePotential, performanceFactor, nukeFactor } =
        calculateEntityAttributes(paddedEntropy);
      return {
        tokenId,
        nukeFactor,
        generation,
        paddedEntropy,
        role,
        forgePotential,
        performanceFactor,
      } as Entity;
    }),
    isFetching:
      isTokenIdsFetching ||
      isTokenGenerationsFetching ||
      isTokenEntropiesFetching,
    refetch,
  };
};

export const useForgeListings = () => {
  const { data, isFetching, refetch } = useReadContract({
    abi: EntityForgingABI,
    address: CONTRACT_ADDRESSES.EntityForging,
    functionName: 'fetchListings',
    args: [],
  });

  return {
    data: data ?? [],
    isFetching,
    refetch,
  };
};

export const useEntitiesForForging = () => {
  const {
    data: listings,
    isFetching: isForgeListingsFetching,
    refetch,
  } = useForgeListings();
  const tokenIds = listings.map(listing => Number(listing.tokenId));
  const { data: tokenGenerations, isFetching: isTokenGenerationsFetching } =
    useTokenGenerations(tokenIds);
  const { data: tokenEntropies, isFetching: isTokenEntropiesFetching } =
    useTokenEntropies(tokenIds);

  return {
    data: listings.map((listing, index) => {
      const generation = tokenGenerations?.[index] ?? 0;
      const entropy = tokenEntropies?.[index] ?? 0;
      const paddedEntropy = entropy.toString().padStart(6, '0');
      const { role, forgePotential, performanceFactor, nukeFactor } =
        calculateEntityAttributes(paddedEntropy);
      return {
        tokenId: Number(listing.tokenId),
        nukeFactor,
        generation,
        paddedEntropy,
        role,
        forgePotential,
        performanceFactor,
        account: listing.account,
        fee: Number(formatEther(listing.fee)),
        isListed: listing.isListed,
      } as EntityForging;
    }),
    isFetching:
      isForgeListingsFetching ||
      isTokenGenerationsFetching ||
      isTokenEntropiesFetching,
    refetch,
  };
};

export const useTradingListings = () => {
  const { data, isFetching, refetch } = useReadContract({
    abi: EntityTradingABI,
    address: CONTRACT_ADDRESSES.EntityTrading,
    functionName: 'fetchListedEntities',
    args: [],
  });

  return {
    data: data ?? [[], [], []],
    isFetching,
    refetch,
  };
};

export const useEntitiesForSale = () => {
  const {
    data: listings,
    isFetching: isTradingListingFetching,
    refetch,
  } = useTradingListings();
  const [tokenList, sellers, prices] = listings;
  const tokenIds = tokenList.map(tokenId => Number(tokenId));
  const { data: tokenGenerations, isFetching: isTokenGenerationsFetching } =
    useTokenGenerations(tokenIds);
  const { data: tokenEntropies, isFetching: isTokenEntropiesFetching } =
    useTokenEntropies(tokenIds);

  return {
    data: tokenIds.map((tokenId, index) => {
      const generation = tokenGenerations?.[index] ?? 0;
      const entropy = tokenEntropies?.[index] ?? 0;
      const paddedEntropy = entropy.toString().padStart(6, '0');
      const { role, forgePotential, performanceFactor, nukeFactor } =
        calculateEntityAttributes(paddedEntropy);
      return {
        tokenId,
        nukeFactor,
        generation,
        paddedEntropy,
        role,
        forgePotential,
        performanceFactor,
        seller: sellers[index] ?? '0x0',
        price: Number(formatEther(prices[index] ?? 0n)),
      } as EntityTrading;
    }),
    isFetching:
      isTradingListingFetching ||
      isTokenGenerationsFetching ||
      isTokenEntropiesFetching,
    refetch,
  };
};

export const useApproval = (address: `0x${string}`, tokenId: number) => {
  const { data, isFetching } = useReadContract({
    abi: TraitForgeNftABI,
    address: CONTRACT_ADDRESSES.TraitForgeNft,
    functionName: 'isApprovedOrOwner',
    args: [address, BigInt(tokenId)],
  });

  return {
    data: data ?? false,
    isFetching,
  };
};

export const useListedEntitiesByUser = (account: `0x${string}`) => {
  const { data: ownerEntities, isFetching: isOwnerEntitiesFetching } =
    useOwnerEntities(account);
  const { data: entitiesForForging, isFetching: isForgingFetching } =
    useEntitiesForForging();
  const { data: entitiesForSale, isFetching: isTradingFetching } =
    useEntitiesForSale();

  const listedEntities = entitiesForSale.filter(
    entity => entity.seller === account
  );

  const forgingEntities = entitiesForForging.filter(entity =>
    ownerEntities.some(ownedEntity => ownedEntity.tokenId === entity.tokenId)
  );

  const combinedListedEntities = [...listedEntities, ...forgingEntities];

  return {
    data: combinedListedEntities,
    isFetching:
      isOwnerEntitiesFetching || isForgingFetching || isTradingFetching,
  };
};

// Write Functions

export const useMintToken = () => {
  const {
    data: hash,
    error: errorCreation,
    isPending: isTxCreating,
    isError: isCreationError,
    writeContractAsync,
  } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    error: errorConfirm,
    isError: isConfirmError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Entity minted successfully');
    }
    if (isCreationError) {
      toast.error(`Minting entity failed`);
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error(`Minting entity failed`);
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (mintPrice: bigint) => {
    await writeContractAsync({
      abi: TraitForgeNftABI,
      address: CONTRACT_ADDRESSES.TraitForgeNft,
      functionName: 'mintToken',
      args: [],
      value: mintPrice,
    });
  };

  return {
    isPending: isTxCreating || isTxConfirming,
    hash,
    onWriteAsync,
    isConfirmed,
  };
};

export const useMintWithBudget = () => {
  const {
    data: hash,
    error: errorCreation,
    isPending: isTxCreating,
    isError: isCreationError,
    writeContractAsync,
  } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    error: errorConfirm,
    isError: isConfirmError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Entity minted successfully');
    }
    if (isCreationError) {
      toast.error(`Minting entity failed`);
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error(`Minting entity failed`);
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (mintPrice: bigint) => {
    await writeContractAsync({
      abi: TraitForgeNftABI,
      address: CONTRACT_ADDRESSES.TraitForgeNft,
      functionName: 'mintWithBudget',
      args: [],
      value: mintPrice,
    });
  };

  return {
    isPending: isTxCreating || isTxConfirming,
    hash,
    onWriteAsync,
    isConfirmed,
  };
};

export const useForgeWithListed = () => {
  const {
    data: hash,
    error: errorCreation,
    isPending: isTxCreating,
    isError: isCreationError,
    writeContractAsync,
  } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    error: errorConfirm,
    isError: isConfirmError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Forged successfully');
    }
    if (isCreationError) {
      toast.error(`Failed to Forge`);
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error(`Failed to Forge`);
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (
    forgerTokenId: number,
    mergerTokenId: number,
    fee: bigint
  ) => {
    await writeContractAsync({
      abi: EntityForgingABI,
      address: CONTRACT_ADDRESSES.EntityForging,
      functionName: 'forgeWithListed',
      args: [BigInt(forgerTokenId), BigInt(mergerTokenId)],
      value: fee,
    });
  };

  return {
    isPending: isTxCreating || isTxConfirming,
    hash,
    onWriteAsync,
    isConfirmed,
  };
};

export const useListForForging = () => {
  const {
    data: hash,
    error: errorCreation,
    isPending: isTxCreating,
    isError: isCreationError,
    writeContractAsync,
  } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    error: errorConfirm,
    isError: isConfirmError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Listed Successfully');
    }
    if (isCreationError) {
      toast.error(`Failed to List Entity`);
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error(`Failed to List Entity`);
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (tokenId: number, fee: bigint) => {
    await writeContractAsync({
      abi: EntityForgingABI,
      address: CONTRACT_ADDRESSES.EntityForging,
      functionName: 'listForForging',
      args: [BigInt(tokenId), fee],
    });
  };

  return {
    isPending: isTxCreating || isTxConfirming,
    hash,
    onWriteAsync,
    isConfirmed,
  };
};

export const useApproveNft = () => {
  const {
    data: hash,
    error: errorCreation,
    isPending: isTxCreating,
    isError: isCreationError,
    writeContractAsync,
  } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    error: errorConfirm,
    isError: isConfirmError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Approved Successfully');
    }
    if (isCreationError) {
      toast.error(`Failed to approve`);
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error(`Failed to approve`);
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (address: `0x${string}`, tokenId: number) => {
    await writeContractAsync({
      abi: TraitForgeNftABI,
      address: CONTRACT_ADDRESSES.TraitForgeNft,
      functionName: 'approve',
      args: [address, BigInt(tokenId)],
    });
  };

  return {
    isPending: isTxCreating || isTxConfirming,
    hash,
    onWriteAsync,
    isConfirmed,
  };
};

export const useNukeEntity = () => {
  const {
    data: hash,
    error: errorCreation,
    isPending: isTxCreating,
    isError: isCreationError,
    writeContractAsync,
  } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    error: errorConfirm,
    isError: isConfirmError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Entity Nuked successfully!');
    }
    if (isCreationError) {
      toast.error(`Nuke failed. Please try again`);
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error(`Nuke failed. Please try again`);
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (tokenId: number) => {
    await writeContractAsync({
      abi: NukeFundABI,
      address: CONTRACT_ADDRESSES.NukeFund,
      functionName: 'nuke',
      args: [BigInt(tokenId)],
    });
  };

  return {
    isPending: isTxCreating || isTxConfirming,
    hash,
    onWriteAsync,
    isConfirmed,
  };
};

export const useBuyEntity = () => {
  const {
    data: hash,
    error: errorCreation,
    isPending: isTxCreating,
    isError: isCreationError,
    writeContractAsync,
  } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    error: errorConfirm,
    isError: isConfirmError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Entity purchased successfully!');
    }
    if (isCreationError) {
      toast.error(`Purchase failed. Please try again`);
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error(`Purchase failed. Please try again`);
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (tokenId: number, price: bigint) => {
    await writeContractAsync({
      abi: EntityTradingABI,
      address: CONTRACT_ADDRESSES.EntityTrading,
      functionName: 'buyNFT',
      args: [BigInt(tokenId)],
      value: price,
    });
  };

  return {
    isPending: isTxCreating || isTxConfirming,
    hash,
    onWriteAsync,
    isConfirmed,
  };
};

export const useListEntityForSale = () => {
  const {
    data: hash,
    error: errorCreation,
    isPending: isTxCreating,
    isError: isCreationError,
    writeContractAsync,
  } = useWriteContract();
  const {
    isLoading: isTxConfirming,
    error: errorConfirm,
    isError: isConfirmError,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) {
      toast.success('Entity listed for sale successfully');
    }
    if (isCreationError) {
      toast.error('Listing failed. Please try again.');
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error('Listing failed. Please try again.');
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (tokenId: number, price: bigint) => {
    await writeContractAsync({
      abi: EntityTradingABI,
      address: CONTRACT_ADDRESSES.EntityTrading,
      functionName: 'listNFTForSale',
      args: [BigInt(tokenId), price],
    });
  };

  return {
    isPending: isTxCreating || isTxConfirming,
    hash,
    onWriteAsync,
    isConfirmed,
  };
};
