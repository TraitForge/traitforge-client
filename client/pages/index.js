import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3Modal } from '@web3modal/ethers/react';

import { useContextState } from '@/utils/context';
import { contractsConfig } from '@/utils/contractsConfig';
import { Slider, Button, BudgetModal, LoadingSpinner } from '@/components';
import { createContract } from '@/utils/utils';

const Home = () => {
  const { isLoading, setIsLoading, entityPrice } = useContextState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');

  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();

  const mintEntityHandler = async () => {
    if (!walletProvider) return open();
    setIsLoading(true);

    try {
      const mintContract = await createContract(
        walletProvider,
        contractsConfig.traitForgeNftAddress,
        contractsConfig.traitForgeNftAbi
      );
      const transaction = await mintContract.mintToken({
        value: ethers.parseEther(entityPrice),
        gasLimit: 5000000,
      });
      await transaction.wait();
      alert('Entity minted successfully');
    } catch (error) {
      console.error('Failed to mint entity:', error);
      alert(`Minting entity failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const mintBatchEntityHandler = async () => {
    if (!walletProvider) return open();
    setIsLoading(true);
    try {
      const mintContract = await createContract(
        walletProvider,
        contractsConfig.traitForgeNftAddress,
        contractsConfig.traitForgeNftAbi
      );
      const transaction = await mintContract.mintWithBudget({
        value: ethers.parseEther(budgetAmount),
        gasLimit: 5000000,
      });
      await transaction.wait();
      alert('Entity minted successfully');
    } catch (error) {
      console.error('Failed to mint entity:', error);
      alert('Minting entity failed');
    } finally {
      setModalOpen(false);
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner color="#0ff"/>
      </div>
    );

  return (
    <div
      className="mint-container mt-24 h-full"
      style={{
        backgroundImage: "url('/images/home.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <span
        title="Mint Your Traitforge Entity"
        className="headers text-[36px] mb-2.5 text-center md:text-extra-large"
      >
        Mint your traitforge entity
      </span>
      <div className="w-full flex justify-center">
        <Slider />
      </div>
      <div className="max-md:px-5 flex flex-col">
        <Button
          onClick={mintEntityHandler}
          bg="#023340"
          borderColor="#0ADFDB"
          text={`Mint 1 For ${entityPrice} ETH`}
          style={{ marginBottom: '25px' }}
        />
        <Button
          onClick={() => setModalOpen(true)}
          bg="#023340"
          borderColor="#0ADFDB"
          text={`Mint With a Budget`}
        />
        {isModalOpen && (
          <BudgetModal
            bg="#023340"
            borderColor="#0ADFDB"
            budgetAmount={budgetAmount}
            setBudgetAmount={setBudgetAmount}
            onSubmit={() => mintBatchEntityHandler(budgetAmount)}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
