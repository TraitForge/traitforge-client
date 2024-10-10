import { useEffect } from 'react';
import { toast } from 'react-toastify';
import { formatEther } from 'viem';
import {
  useReadContract,
  useReadContracts,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { sepolia, base } from 'wagmi/chains';
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

// --------- Read Functions -----------

// NFT
export const useWhitelistEndTime = () => {
  const { data, isFetching, refetch } = useReadContract({
    chainId: base.id,
    abi: TraitForgeNftABI,
    address: CONTRACT_ADDRESSES.TraitForgeNft,
    functionName: 'whitelistEndTime',
    args: [],
  });

  return {
    data: Number(data ?? 0),
    isFetching,
    refetch,
  };
};

export const useCurrentGeneration = () => {
  const { data, isFetching, refetch } = useReadContract({
    chainId: base.id,
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
    chainId: base.id,
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

export const usePriceIncrement = () => {
  const { data, isFetching, refetch } = useReadContract({
    chainId: base.id,
    abi: TraitForgeNftABI,
    address: CONTRACT_ADDRESSES.TraitForgeNft,
    functionName: 'priceIncrement',
    args: [],
  });

  return {
    data: BigInt(data ?? 0),
    isFetching,
    refetch,
  };
};

export const useApproval = (address: `0x${string}`, tokenId: number) => {
  const { data, isFetching } = useReadContract({
    chainId: base.id,
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

export const useUpcomingMints = (mintPrice: bigint, generation: number) => {
  const basePrice = 0.005;  
  const initialIncrement = 0.0000245;
  const generationIncrement = 0.000005;
  const currentGeneration = generation;
  const entityPrice = Number(formatEther(mintPrice));
  const effectiveIncrement = initialIncrement + (generationIncrement * (currentGeneration - 1));
  const nftIndex = (entityPrice - basePrice) / effectiveIncrement;
  const startSlot = Math.floor(nftIndex / 12); 
  const startNumberIndex = nftIndex % 12;
  const maxSlot = 833;
  const maxCount = 50;
  const inputs = [];

  let slot = Math.floor(startSlot);
  let index = Math.floor(startNumberIndex);

  while (inputs.length < maxCount && slot < maxSlot) {
    for (
      let numberIndex = index;
      numberIndex < 12 && inputs.length < maxCount;
      numberIndex++
    ) {
      inputs.push({ slot: slot, index: numberIndex });
    }
    slot++;
    index = 0;
  }

  const { data, isFetching } = useReadContracts({
    contracts: inputs.map(input => ({
      chainId: base.id,
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
            id: startSlot * 12 + index,
            entropy: Number(res.result ?? 0),
          }) as Entropy
      ) ?? [],
    isFetching,
  };
};

export const useNftBalance = (address: `0x${string}`) => {
  const { data, isFetching, refetch } = useReadContract({
    chainId: base.id,
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
      chainId: base.id,
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

export const useTokenGenerations = (tokenIds: number[]) => {
  const { data, isFetching } = useReadContracts({
    contracts: tokenIds.map(tokenId => ({
      chainId: base.id,
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

export const useIsNukeable = (entities: Entity[]) => {
  const { data, isFetching } = useReadContracts({
    contracts: entities.map(entity => ({
      chainId: base.id,
      abi: NukeFundABI,
      address: CONTRACT_ADDRESSES.NukeFund,
      functionName: 'canTokenBeNuked',
      args: [entity.tokenId],
    })),
  });

  const nukeableMap = (data as any)?.reduce((acc: Record<number, boolean>, res: any, index: number) => {
    if (entities && entities[index]) {
      acc[entities[index].tokenId] = Boolean(res.result);
    }
    return acc;
  }, {});

  return {
    data: nukeableMap ?? {},
    isFetching,
  };
};


export const useTokenEntropies = (tokenIds: number[]) => {
  const { data, isFetching } = useReadContracts({
    contracts: tokenIds.map(tokenId => ({
      chainId: base.id,
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

// NukeFund
export const useNukeFundBalance = () => {
  const { data, isFetching, refetch } = useReadContract({
    chainId: base.id,
    abi: NukeFundABI,
    address: CONTRACT_ADDRESSES.NukeFund,
    functionName: 'getFundBalance',
    args: [],
  });

  return {
    data: BigInt(data ?? 0),
    isFetching,
    refetch,
  };
};

export const useIsEMP = () => {
  const { data, isFetching, refetch } = useReadContract({
    chainId: base.id,
    abi: NukeFundABI,
    address: CONTRACT_ADDRESSES.NukeFund,
    functionName: 'isEMPActive',
    args: [],
  });

  return {
    data,
    isFetching,
    refetch,
  };
};

export const useEMPFinishTime = () => {
  const { data, isFetching, refetch } = useReadContract({
    chainId: base.id,
    abi: NukeFundABI,
    address: CONTRACT_ADDRESSES.NukeFund,
    functionName: 'unpauseAt',
    args: [],
  });

  return {
    data: Number(data ?? 0),
    isFetching,
    refetch,
  };
};

export const useNukeFactors = (tokenIds: number[]) => {
  const { data, isFetching } = useReadContracts({
    contracts: tokenIds.map(tokenId => ({
      chainId: base.id,
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

// EntityForging
export const useForgeListings = () => {
  const {
    data: count,
    isFetching: isCountFetching,
    refetch,
  } = useReadContract({
    chainId: base.id,
    abi: EntityForgingABI,
    address: CONTRACT_ADDRESSES.EntityForging,
    functionName: 'listingCount',
    args: [],
  });

  const { data, isFetching: isListFetching } = useReadContracts({
    contracts: new Array(Number(count ?? 0)).fill(0).map((_, index) => ({
      chainId: base.id,
      abi: EntityForgingABI,
      address: CONTRACT_ADDRESSES.EntityForging,
      functionName: 'listings',
      args: [index + 1],
    })),
  });

  return {
    data:
      data
        ?.map((res: any) => {
  
          return {
            seller: (res.result?.[0] ?? '0x0') as `0x${string}`,
            tokenId: res.result?.[1] ?? 0,
            price: formatEther(res.result?.[3] ?? 0),
            isActive: Boolean(res.result?.[2] ?? false),
          };
        })
        .filter(listing => listing.isActive) ?? [],
    isFetching: isCountFetching || isListFetching,
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
        account: listing.seller,
        fee: Number(listing.price),
        isListed: listing.isActive,
      } as EntityForging;
    }),
    isFetching:
      isForgeListingsFetching ||
      isTokenGenerationsFetching ||
      isTokenEntropiesFetching,
    refetch,
  };
};

export const useForgingCounts = (tokenId: number) => {
  const { data, isFetching, refetch } = useReadContract({
    chainId: base.id,
    abi: EntityForgingABI,
    address: CONTRACT_ADDRESSES.EntityForging,
    functionName: 'forgingCounts',
    args: [BigInt(tokenId)],
  });

  return {
    data: Number(data ?? 0),
    isFetching,
    refetch,
  };
};

export const useTotalSupply = () => {
  const { data, isFetching, refetch } = useReadContract({
    chainId: base.id,
    abi: TraitForgeNftABI,
    address: CONTRACT_ADDRESSES.TraitForgeNft,
    functionName: 'totalSupply'
  });
  return {
    data: Number(data ?? 0),
    isFetching,
    refetch,
  };
};

// EntityTrading
export const useTradingListings = () => {
  const {
    data: count,
    isFetching: isCountFetching,
    refetch,
  } = useReadContract({
    chainId: base.id,
    abi: EntityTradingABI,
    address: CONTRACT_ADDRESSES.EntityTrading,
    functionName: 'listingCount',
    args: [],
  });

  const { data, isFetching: isListFetching } = useReadContracts({
    contracts: new Array(Number(count ?? 0)).fill(0).map((_, index) => ({
      chainId: base.id,
      abi: EntityTradingABI,
      address: CONTRACT_ADDRESSES.EntityTrading,
      functionName: 'listings',
      args: [index + 1],
    })),
  });

  return {
    data:
      data
        ?.map((res: any) => ({
          seller: (res.result?.[0] ?? '0x0') as `0x${string}`,
          tokenId: Number(res.result?.[1] ?? 0),
          price: BigInt(res.result?.[2] ?? 0),
          isActive: Boolean(res.result?.[3] ?? false),
        }))
        .filter(listing => listing.isActive) ?? [],
    isFetching: isCountFetching || isListFetching,
    refetch,
  };
};

export const useEntitiesForSale = () => {
  const {
    data: listings,
    isFetching: isTradingListingFetching,
    refetch,
  } = useTradingListings();
  const tokenIds = listings.map(listing => listing.tokenId);
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
        tokenId: listing.tokenId,
        nukeFactor,
        generation,
        paddedEntropy,
        role,
        forgePotential,
        performanceFactor,
        seller: listing.seller,
        price: Number(formatEther(listing.price)),
        isActive: listing.isActive,
      } as EntityTrading;
    }),
    isFetching:
      isTradingListingFetching ||
      isTokenGenerationsFetching ||
      isTokenEntropiesFetching,
    refetch,
  };
};

// User Entities
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

export const useListedEntitiesByUser = (account: `0x${string}`) => {
  const { data: ownerEntities, isFetching: isOwnerEntitiesFetching } =
    useOwnerEntities(account);
  const {
    data: entitiesForForging,
    isFetching: isForgingFetching,
    refetch: refetchForging,
  } = useEntitiesForForging();
  const {
    data: entitiesForSale,
    isFetching: isTradingFetching,
    refetch: refetchTrading,
  } = useEntitiesForSale();

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
    refetch: () => {
      refetchForging();
      refetchTrading();
    },
  };
};


// --------- Write Functions -----------

// NFT
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
  const { 
    data: mintPrice
  } = useMintPrice();

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

  const onWriteAsync = async (proof: `0x${string}`[]) => {
    await writeContractAsync({
      chainId: base.id,
      abi: TraitForgeNftABI,
      address: CONTRACT_ADDRESSES.TraitForgeNft,
      functionName: 'mintToken',
      args: [proof],
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

  const onWriteAsync = async (mintPrice: bigint, proof: `0x${string}`[], minAmountMinted: number) => {
    await writeContractAsync({
      chainId: base.id,
      abi: TraitForgeNftABI,
      address: CONTRACT_ADDRESSES.TraitForgeNft,
      functionName: 'mintWithBudget',
      args: [proof, BigInt(minAmountMinted)],
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
      chainId: base.id,
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

// EntityForging
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
      chainId: base.id,
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

export const useUnlistEntityForForging = () => {
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
      toast.success('Entity unlisted for forging successfully');
    }
    if (isCreationError) {
      toast.error('Unlisting failed. Please try again.');
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error('Unlisting failed. Please try again.');
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (tokenId: number) => {
    await writeContractAsync({
      chainId: base.id,
      abi: EntityForgingABI,
      address: CONTRACT_ADDRESSES.EntityForging,
      functionName: 'cancelListingForForging',
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
      chainId: base.id,
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

// EntityTrading
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
      chainId: base.id,
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

export const useUnlistEntityForSale = () => {
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
      toast.success('Entity unlisted for sale successfully');
    }
    if (isCreationError) {
      toast.error('Unlisting failed. Please try again.');
      console.log(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error('Unlisting failed. Please try again.');
      console.log(errorConfirm?.message);
    }
  }, [isConfirmed, isCreationError, isConfirmError]);

  const onWriteAsync = async (tokenId: number) => {
    await writeContractAsync({
      chainId: base.id,
      abi: EntityTradingABI,
      address: CONTRACT_ADDRESSES.EntityTrading,
      functionName: 'cancelListing',
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
      chainId: base.id,
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

// NukeFund
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
      chainId: base.id,
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
