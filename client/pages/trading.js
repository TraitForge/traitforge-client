import React, { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers/react';

import styles from '@/styles/trading.module.scss';
import { EntityCard, LoadingSpinner } from '@/components';
import { contractsConfig } from '@/utils/contractsConfig';
import { useContextState } from '@/utils/context';
import { TraidingHeader } from '@/screens/traiding/TraidingHeader';
import { SellEntity } from '@/screens/traiding/SellEntity';
import { BuyEntity } from '@/screens/traiding/BuyEntity';
import { FiltersHeader } from '@/components';
import { createContract, approveNFTForTrading } from '@/utils/utils';
// import { MarketplaceEntityCard } from '@/screens/traiding/MarketplaceEntityCard';

const Marketplace = () => {
  const {
    isLoading,
    setIsLoading,
    ownerEntities,
    entitiesForSale,
    walletProvider,
  } = useContextState();
  const [selectedForSale, setSelectedForSale] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [step, setStep] = useState('one');
  const { open } = useWeb3Modal();

  const buyEntity = async (tokenId, price) => {
    setIsLoading(true);
    if (!walletProvider) open();
    try {
      const tradeContract = await createContract(
        walletProvider,
        contractsConfig.entityTradingContractAddress,
        contractsConfig.entityTradingAbi
      );
      const priceInWei = ethers.parseEther(price);
      const transaction = await tradeContract.buyNFT(tokenId, {
        value: priceInWei,
      });
      await transaction.wait();
      toast.success('Entity purchased successfully!');
    } catch (error) {
      toast.error(`Purchase failed. Please try again`);
    } finally {
      setIsLoading(false);
    }
  };

  const listEntityForSale = async (tokenId, price) => {
    setIsLoading(true);
    if (!walletProvider) open();
    try {
      await approveNFTForTrading(tokenId, walletProvider);

      const tradeContract = await createContract(
        walletProvider,
        contractsConfig.entityTradingContractAddress,
        contractsConfig.entityTradingAbi
      );
      const priceInWei = ethers.parseEther(price);
      console.log('Wei price:', priceInWei);
      const transaction = await tradeContract.listNFTForSale(
        tokenId,
        priceInWei
      );
      await transaction.wait();
      toast.success('Entity listed for sale successfully');
    } catch (error) {
      toast.error(`Listing failed. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep = step => setStep(step);

  let content;

  if (isLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner color="#0EEB81" />
      </div>
    );

  switch (step) {
    case 'four':
      content = (
        <BuyEntity
          handleStep={handleStep}
          selectedListing={selectedListing}
          buyEntity={buyEntity}
        />
      );
      break;
    case 'three':
      content = (
        <SellEntity
          handleStep={handleStep}
          selectedForSale={selectedForSale}
          listEntityForSale={listEntityForSale}
        />
      );
      break;
    case 'two':
      content = (
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 lg:gap-y-10">
          {ownerEntities.map(entity => (
            <EntityCard
              key={entity}
              entity={entity}
              borderType="green"
              onSelect={() => {
                setSelectedForSale(entity);
                setStep('three');
                console.log('selected entity');
              }}
            />
          ))}
        </div>
      );
      break;
    default:
      content = (
        <>
          <div className="flex justify-between items-center border-b mb-12"></div>
          <div className="overflow-y-auto flex-1">
            <div className="grid grid-col-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 lg:gap-y-10">
              {entitiesForSale.map(listing => (
                <EntityCard
                  key={listing.tokenId}
                  entity={listing.tokenId}
                  price={listing.price}
                  borderType="green"
                  onSelect={() => {
                    setSelectedListing(listing);
                    handleStep('four');
                    console.log('the listing is:', listing);
                  }}
                  showPrice={listing.price}
                />
              ))}
            </div>
          </div>
        </>
      );
  }

  return (
    <div className={styles.tradingPage}>
      <div className="container pt-16 md:pt-[134px] flex flex-col h-full">
        <TraidingHeader handleStep={handleStep} step={step} />
        {content}
      </div>
    </div>
  );
};

export default Marketplace;
