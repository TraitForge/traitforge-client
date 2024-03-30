import TraitForgeNftAbi from '../../solidity/artifacts/contracts/TraitForgeNft/TraitForgeNft.sol/TraitForgeNft.json';
import EntropyGenerator from '../../solidity/artifacts/contracts/EntropyGenerator/EntropyGenerator.sol/EntropyGenerator.json';
import entityMerging from '../../solidity/artifacts/contracts/EntityMerging/EntityMerging.sol/EntityMerging.json';
import nukeFund from '../../solidity/artifacts/contracts/NukeFund/NukeFund.sol/NukeFund.json';

export const contractsConfig = {
  totalSlots: 770,
  valuesPerSlot: 13,
  traitForgeNftAbi: TraitForgeNftAbi.abi,
  traitForgeNftAddress: process.env.NEXT_PUBLIC_MINT_ADDRESS,
  entropyGeneratorContractAbi: EntropyGenerator.abi,
  entropyGeneratorContract: process.env.NEXT_PUBLIC_ENTROPY_GENERATOR_ADDRESS,
  entityMergingContractAbi: entityMerging.abi,
  entityMergingAddress: process.env.NEXT_PUBLIC_MERGING_CONTRACT_ADDRESS,
  nukeFundContractAbi: nukeFund.abi,
  nukeContractAddress: process.env.NEXT_PUBLIC_NUKE_CONTRACT_ADDRESS,
};
