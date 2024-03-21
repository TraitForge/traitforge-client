import mintAbi from '../../solidity/artifacts/contracts/CustomERC721.sol/CustomERC721.json';
import EntropyGenerator from '../../solidity/artifacts/contracts/EntropyGenerator.sol/EntropyGenerator.json';
import entityMerging from '../../solidity/artifacts/contracts/EntityMerging.sol/EntityMerging.json';
import nukeFund from '../../solidity/artifacts/contracts/NukeFund.sol/NukeFund.json';

export const contractsConfig = {
  totalSlots: 770,
  valuesPerSlot: 13,
  mintAbi: mintAbi.abi,
  mintAddress: process.env.NEXT_PUBLIC_MINT_ADDRESS,
  entropyGeneratorContractAbi: EntropyGenerator.abi,
  entropyGeneratorContract: process.env.NEXT_PUBLIC_ENTROPY_GENERATOR_ADDRESS,
  entityMergingContractAbi: entityMerging.abi,
  nukeFundContractAbi: nukeFund.abi,
  nukeContractAddress: process.env.NEXT_PUBLIC_NUKE_CONTRACT_ADDRESS,
};
