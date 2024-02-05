import Web3 from 'web3';
import ERC721ABI from './path/to/ERC721ABI.json'; 

const web3 = new Web3('https://goerli.infura.io/v3/3f27d7e6326b43c5b77e16ac62188640');

const erc721ContractAddress = 'ERC721_contract';

const erc721Contract = new web3.Contract(ERC721ABI, erc721ContractAddress);


const convertIpfsUriToHttpUrl = (uri) => uri.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${uri.substring(7)}` : uri;


export const fetchEntityDetails = async (tokenId) => {
  try {
    const tokenUri = await erc721Contract.methods.tokenURI(tokenId).call();
    const metadataUri = convertIpfsUriToHttpUrl(tokenUri);
    const response = await fetch(metadataUri);
    const metadata = await response.json();
    

    return {
      tokenId,
      generation: metadata.generation,
      age: metadata.age,
      gender: metadata.gender,
      claimShare: metadata.claimShare,
      breedPotential: metadata.breedPotential, 
    };
  } catch (error) {
    console.error('Failed to fetch entity details:', error);
    throw error;
  }
};
