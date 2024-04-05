import { useContextState } from '@/utils/context';
import { ethers } from 'ethers';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { LoadingSpinner, Slider, Button } from '@/components';

const Home = () => {
  const { isLoading, setIsLoading } = useContextState();
  const { walletProvider } = useWeb3ModalProvider()

  const mintEntityHandler = async () => {
    if (!walletProvider) {
      alert('Please connect Wallet.');
      return;
    }
    setIsLoading(true);
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const userAddress = await signer.getAddress();
      const mintContract = new ethers.Contract(MintAddress, MintAbi.abi, signer);
      const transaction = await mintContract.mintToken(
        userAddress, 
        { value: ethers.utils.parseEther(entityPrice),
        gasLimit: ethers.utils.hexlify(1000000)
      });
      await transaction.wait();
      alert('Entity minted successfully');
    } catch (error) {
      console.error('Failed to mint entity:', error);
      alert('Minting entity failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="mint-container min-h-[100vh]" style={{backgroundImage: "url('/images/home.png')", backgroundPosition: "center", backgroundSize: "cover"}}>
      <span className="mint-text">Mint your traitforge entity</span>
      <div className="w-full pb-10">
        <Slider />
      </div>
      <Button onClick={mintEntityHandler} bg="#023340" borderColor="#0ADFDB" text="Mint For 0.01 ETH" />
    </div>
  );
};

export default Home;
