'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { toast } from 'react-toastify';
import styles from '~/styles/honeypot.module.scss';
import { EntityCard, LoadingSpinner } from '~/components';
import { FiltersHeader } from '~/components';
import { CONTRACT_ADDRESSES } from '~/constants/address';
import {
    useApprovalForAll,
    useApproval,
    useApproveNft,
    useBidEntity,
    useOwnerEntities,
    useBidEntities,
    useClaimReward,
    useRecentBidWinners,
    useWonAmount
} from '~/hooks';
import { SingleValue } from 'react-select';
import { LottFundBody, LottFundHeader } from '~/components/screens';

const LottFund = () => {
  const { address } = useAccount();
  const { data: ownerEntities, refetch } = useOwnerEntities(address || '0x0');
  const [step, setStep] = useState('one');
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('');
  const [selectedForBidding, setSelectedForBidding] = useState<number[]>([]);
  const [sortingFilter, setSortingFilter] = useState('');
  const [loadingText, setLoadingText] = useState('');
  const [approvalState, setApprovalState] = useState({
    isApprovePending: false,
    isApproveConfirmed: false,
  });
  const {
    onWriteAsync: onBid,
    isPending: isBidPending,
    isConfirmed: isBidConfirmed,
  } = useBidEntity();
  const { data: approved } = useApproval(
    CONTRACT_ADDRESSES.LottFund,
    selectedForBidding[0] || 0
  );
  const {
    onWriteAsync: onBiddedEntities,
    isPending: isBiddedEntitiesPending,
    isConfirmed: isBiddedEntitiesConfirmed,
  } = useBidEntities();
  const {
    onWriteAsync: onApprove,
    isPending: isApprovePending,
    isConfirmed: isApproveConfirmed,
  } = useApproveNft();
  const {
    onWriteAsync: onApproveAll,
    isPending: isApproveAllPending,
    isConfirmed: isApproveAllConfirmed
  } = useApprovalForAll();
  const {
    onWriteAsync: onClaim,
    isPending: isClaimPending,
    isConfirmed: claimConfirmed
  } = useClaimReward();
  const {
    data: payoutEvents
  } = useRecentBidWinners()
  const {
    data: wonAmount
  } = useWonAmount(address || '0x0')

  useEffect(() => {
    if (isBidConfirmed || isBiddedEntitiesConfirmed) {
      refetch();
      setSelectedForBidding([]);
    }
  }, [isBidConfirmed, isBiddedEntitiesConfirmed]);


  const handleApprove = async () => {
    if (selectedForBidding.length === 1) {
      const tokenId = selectedForBidding[0]; 
      if(!tokenId){return};
      await onApprove(CONTRACT_ADDRESSES.LottFund, tokenId);
      console.log("approved")
    } else if (selectedForBidding.length > 1 && address) {
      await onApproveAll(CONTRACT_ADDRESSES.LottFund);
      console.log("approved for all")
    }
  };

 // const handleClaim = async () => {
 //   if(address != )
 // }

  const handleFilterChange = (
    selectedOption: SingleValue<
      { value: number; label: string } | { value: string; label: string }
    >,
    type: string
  ) => {
    if (type === 'generation') {
      setGenerationFilter(String(selectedOption?.value || ''));
    } else if (type === 'sorting') {
      setSortingFilter(String(selectedOption?.value || ''));
    }
  };

  const filteredAndSortedListings = useMemo(() => {
    let filtered = ownerEntities.filter(listing => {
      if (
        generationFilter &&
        String(listing.generation) !== String(generationFilter)
      ) {
        return false;
      }

      if (sortOption === 'all') return true;
      if (sortOption === 'forgers') return listing.role === 'Forger';
      if (sortOption === 'mergers') return listing.role === 'Merger';
      return true;
    });

    if (sortingFilter === 'NukeFactor_low_to_high') {
      filtered.sort((a, b) => Number(a.nukeFactor) - Number(b.nukeFactor));
    } else if (sortingFilter === 'NukeFactor_high_to_low') {
      filtered.sort((a, b) => Number(b.nukeFactor) - Number(a.nukeFactor));
    }

    return filtered;
  }, [sortOption, generationFilter, sortingFilter, ownerEntities]);

  const bidEntity = async () => {
    if (selectedForBidding.length === 0) {
      return;
    };
    setLoadingText('Bidding entity/entities...');
    if(!isApproveConfirmed || !isApproveAllConfirmed){
    await handleApprove();
    }
    if (selectedForBidding.length > 1) {
      await onBiddedEntities(selectedForBidding.map(tokenId => BigInt(tokenId)));
    }
    else if (selectedForBidding.length == 1) {
      const tokenId = selectedForBidding[0]; 
      await onBid(Number(tokenId)); 
    }
  };

  const handleClaim = async () => {
    setLoadingText('Claiming Winnings...');
    try{
    if(wonAmount == 0 ){
      toast.error('You have no winnings to claim.');
      return;
    };
    onClaim();
  } catch(error){
    toast.error('Claim Failed.')
    console.error(error)
  }
  }
  

  //if (isLoading)
  //  return (
  //    <div className="h-full w-full flex justify-center items-center flex-col">
  //      <LoadingSpinner color="#9457EB" />
  //      {loadingText && <p className="mt-3 text-[#9457EB]">{loadingText}</p>}
  //    </div>
  //  );

  let content;

  switch (step) {
    case 'two':
      content = (
        <div className="overflow-y-auto flex-1 bg-custom-radial">
          <div className="container">
            <FiltersHeader
              pageType="nuke"
              sortOption={sortOption}
              handleSort={setSortOption}
              color="purple"
              handleFilterChange={(selectedOption, type) =>
                handleFilterChange(selectedOption, type)
              }
              generationFilter={generationFilter}
              sortingFilter={sortingFilter}
            />
            <div className="grid mt-10 grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-x-[5px] gap-y-2">
            {filteredAndSortedListings.map(entity => {
               return (
                 <EntityCard
                   key={entity.tokenId}
                   entity={entity}
                   isOwnedByUser={selectedForBidding.includes(entity.tokenId)}
                   onSelect={() => {
                     setSelectedForBidding(prevSelected => {
                       if (prevSelected.includes(entity.tokenId)) {
                         return prevSelected.filter(id => id !== entity.tokenId);
                       } else {
                         return [...prevSelected, entity.tokenId];
                       }
                     });
                   }}
                 />
               );
             })}
            </div>
          </div>
        </div>
      );
      break;
    default:
      content = <LottFundBody handleStep={() => setStep('two')} handleClaim={() => handleClaim()} wonAmount={wonAmount} />;
  }

  return (
    <div className={styles.honeyPotContainer}>
      <div className="flex flex-col h-full w-full">
        <LottFundHeader setSelectedForBidding={setSelectedForBidding} selectedForBidding={selectedForBidding} step={step} handleStep={setStep} bidEntity={bidEntity}/>
        {content}
      </div>
    </div>
  );
};

export default LottFund;
