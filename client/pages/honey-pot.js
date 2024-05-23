import React, { useState } from 'react';
import { useWeb3Modal } from '@web3modal/ethers/react';

import styles from '@/styles/honeypot.module.scss';
import { contractsConfig } from '@/utils/contractsConfig';
import { HoneyPotHeader } from '@/screens/honey-pot/HoneyPotHeader';
import { EntityCard, LoadingSpinner } from '@/components';
import { HoneyPotBody } from '@/screens/honey-pot/HoneyPotBody';
import { NukeEntity } from '@/screens/honey-pot/NukeEntity';
import { useContextState } from '@/utils/context';
import { createContract, approveNFTForNuking } from '@/utils/utils';

const HoneyPot = () => {
  const { isLoading, setIsLoading, ownerEntities, walletProvider } =
    useContextState();
  const [selectedForNuke, setSelectedForNuke] = useState(null);
  const [step, setStep] = useState('one');
  const { open } = useWeb3Modal();

  const handleStep = nextStep => setStep(nextStep);

  const nukeEntity = async tokenId => {
    if (!walletProvider) open();
    setIsLoading(true);
    try {
      await approveNFTForNuking(tokenId, walletProvider);
      const tradeContract = await createContract(
        walletProvider,
        contractsConfig.nukeContractAddress,
        contractsConfig.nukeFundContractAbi
      );
      const transaction = await tradeContract.nuke(tokenId);
      await transaction.wait();
      toast.success('Entity Nuked successfully!');
    } catch (error) {
      toast.error(`Nuke failed. Please try again`);
    } finally {
      setIsLoading(false);
    }
  };

  let content;
  if (isLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner color="#9457EB" />
      </div>
    );
  switch (step) {
    case 'three':
      content = (
        <NukeEntity selectedForNuke={selectedForNuke} nukeEntity={nukeEntity} />
      );
      break;
    case 'two':
      content = (
        <div className="overflow-y-scroll flex-1 pt-8">
          <div className="grid grid-cols-3 lg:grid-cols-5 lg:px-20 gap-x-[15px] gap-y-5 md:gap-y-10">
            {ownerEntities.map(entity => (
              <EntityCard
                key={entity}
                tokenId={entity}
                borderType="purple"
                onSelect={() => {
                  setSelectedForNuke(entity);
                  setStep('three');
                  console.log('selected entity for nuke:', entity);
                }}
              />
            ))}
          </div>
        </div>
      );
      break;
    default:
      content = <HoneyPotBody handleStep={() => setStep('two')} />;
  }

  return (
    <div className={styles.honeyPotContainer}>
      <div className="container flex flex-col h-full">
        <HoneyPotHeader step={step} handleStep={handleStep} />
        {content}
      </div>
    </div>
  );
};

export default HoneyPot;
