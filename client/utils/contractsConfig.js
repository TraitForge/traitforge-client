import TraitForgeNftAbi from '../artifacts/contracts/TraitForgeNft/TraitForgeNft.sol/TraitForgeNft.json';
import EntropyGenerator from '../artifacts/contracts/EntropyGenerator/EntropyGenerator.sol/EntropyGenerator.json';
import entityMerging from '../artifacts/contracts/EntityForging/EntityForging.sol/EntityForging.json';
import entityTrading from '../artifacts/contracts/EntityTrading/EntityTrading.sol/EntityTrading.json';
import nukeFund from '../artifacts/contracts/NukeFund/NukeFund.sol/NukeFund.json';

export const DEPLOYED_CONTRACTS = {
  sepolia: {
    Trait: '0x144657441899F0d02039df60f7deA6E5014B7304',
    TraitForgeNft: '0x7372C90546C35b7e6eb25BFD6035509D66B76Cd0',
    EntropyGenerator: '0xB597f0F51aC7e9701ee75Dd7f041813fC43eB01d',
    EntityTrading: '0x123111F64D5bBD7985cf493F782B9D113574D2C3',
    EntityForging: '0x2973285e98e2Da081E0F0A40FC6D3A611f64a824',
    DevFund: '0x9AA1eD62583bc5AF9E8E4d70Ef2ee6Cc4560c6B3',
    Airdrop: '0xea3A0Bee556bE674ED523C2B4a3a3c6C94621c5e',
    DAOFund: '0xA4FB2D313D93B0e68C046540d983A7A9a98edcb2',
    NukeFund: '0x025a06ad1F0e0f04cFF924223E9CAdEe4b389565',
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
