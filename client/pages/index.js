import { useState } from 'react';
import { useContextState } from '@/utils/context';
import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';

import { contractsConfig } from '@/utils/contractsConfig';
import { LoadingSpinner, Slider, Button, BudgetModal } from '@/components';

const Home = () => {
  const { isLoading, setIsLoading, entityPrice } = useContextState();
  const { walletProvider } = useWeb3ModalProvider();
  const [isModalOpen, setModalOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');

  const mintEntityHandler = async () => {
    if (!walletProvider) {
      alert('Please connect Wallet.');
      return;
    }
    setIsLoading(true);
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const mintContract = new ethers.Contract(
        contractsConfig.traitForgeNftAddress,
        contractsConfig.traitForgeNftAbi,
        signer
      );
      const transaction = await mintContract.mintToken({
        value: ethers.parseEther(entityPrice),
        gasLimit: 5000000
      });
      await transaction.wait();
      alert('Entity minted successfully');
    } catch (error) {
      console.error('Failed to mint entity:', error);
      alert('Minting entity failed: ${error.message}');
    } finally {
      setIsLoading(false);
    }
  };

  const mintBatchEntityHandler = async () => {
    if (!walletProvider) {
      alert('Please connect Wallet.');
      return;
    }
    setIsLoading(true);
    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const mintContract = new ethers.Contract(
        contractsConfig.traitForgeNftAddress,
        contractsConfig.traitForgeNftAbi,
        signer
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <div
      className="mint-container h-[100vh]"
      style={{
        backgroundImage: "url('/images/home.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <span title="Mint Your Traitforge Entity" className="mint-entity-header text-[36px] mb-2.5 text-center md:text-extra-large">
        Mint your traitforge entity
      </span>
      <div className="w-full pb-10 flex justify-center">
        <Slider />
      </div>
      <div className="max-md:px-5 flex flex-col">
        <Button
          onClick={mintEntityHandler}
          bg="#023340"
          borderColor="#0ADFDB"
          text={`Mint 1 For ${entityPrice} ETH`}
          style={{ marginBottom: '20px' }}
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
