import TraitForgeNftAbi from '../artifacts/contracts/TraitForgeNft/TraitForgeNft.sol/TraitForgeNft.json';
import EntropyGenerator from '../artifacts/contracts/EntropyGenerator/EntropyGenerator.sol/EntropyGenerator.json';
import entityMerging from '../artifacts/contracts/EntityForging/EntityForging.sol/EntityForging.json';
import entityTrading from '../artifacts/contracts/EntityTrading/EntityTrading.sol/EntityTrading.json';
import nukeFund from '../artifacts/contracts/NukeFund/NukeFund.sol/NukeFund.json';

export const DEPLOYED_CONTRACTS = {
  sepolia: {
    Trait: '0x5B54Ca56C6E1BeB94c7b886D10B6f8794f4b44f0',
    TraitForgeNft: '0x9054cCC149d877ADC52505017a11757351488Bc0',
    EntropyGenerator: '0xE38e5988f32e84Ae5A1f85Eeb3F27a4d2E645B84',
    EntityTrading: '0x72B608d591A06308825a4E94f4c635A4391069F5',
    EntityForging: '0xE32e6bC6fE53488EF74DE561110bA6fE6DCF8D72',
    DevFund: '0x1721de62d78af195cE0AAbE93F4f8b99C026890B',
    Airdrop: '0xf8795909B5c8e4308eE0B6cef34069441ce576EF',
    DAOFund: '0xb3C092ADb2f55BD6dAD31e17A3E5a9C3BFA241Fd',
    NukeFund: '0xC94EA64B31678B24d164481aD19489828988445b',
  },
};

export const contractsConfig = {
  totalSlots: 770,
  valuesPerSlot: 13,
  infuraRPCURL: process.env.NEXT_PUBLIC_ALCHEMY_RPCURL,
  traitForgeNftAbi: TraitForgeNftAbi.abi,
  traitForgeNftAddress: DEPLOYED_CONTRACTS.sepolia.TraitForgeNft,
  entropyGeneratorContractAbi: EntropyGenerator.abi,
  entropyGeneratorContractAddress: DEPLOYED_CONTRACTS.sepolia.EntropyGenerator,
  entityTradingAbi: entityTrading.abi,
  entityTradingContractAddress: DEPLOYED_CONTRACTS.sepolia.EntityTrading,
  entityMergingContractAbi: entityMerging.abi,
  entityMergingAddress: DEPLOYED_CONTRACTS.sepolia.EntityForging,
  nukeFundContractAbi: nukeFund.abi,
  nukeContractAddress: DEPLOYED_CONTRACTS.sepolia.NukeFund,
};
