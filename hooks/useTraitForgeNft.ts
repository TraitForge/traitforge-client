import { useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  useReadContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import { TraitForgeNftABI } from '~/lib/abis';

export const useCurrentGeneration = () => {
  const { data, isFetching } = useReadContract({
    abi: TraitForgeNftABI,
    address: CONTRACT_ADDRESSES.TraitForgeNft,
    functionName: 'getGeneration',
    args: [],
  });

  return {
    data: Number(data || 0),
    isFetching,
  };
};

export const useMintPrice = () => {
  const { data, isFetching } = useReadContract({
    abi: TraitForgeNftABI,
    address: CONTRACT_ADDRESSES.TraitForgeNft,
    functionName: 'calculateMintPrice',
    args: [],
  });

  return {
    data: BigInt(data || 0),
    isFetching,
  };
};

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
      console.error(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error(`Minting entity failed`);
      console.error(errorConfirm?.message);
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
      console.error(errorCreation?.message);
    }
    if (isConfirmError) {
      toast.error(`Minting entity failed`);
      console.error(errorConfirm?.message);
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
