import TraitForgeNftAbi from '../artifacts/contracts/TraitForgeNft/TraitForgeNft.sol/TraitForgeNft.json';
import EntropyGenerator from '../artifacts/contracts/EntropyGenerator/EntropyGenerator.sol/EntropyGenerator.json';
import entityMerging from '../artifacts/contracts/EntityForging/EntityForging.sol/EntityForging.json';
import entityTrading from '../artifacts/contracts/EntityTrading/EntityTrading.sol/EntityTrading.json';
import nukeFund from '../artifacts/contracts/NukeFund/NukeFund.sol/NukeFund.json';

export const DEPLOYED_CONTRACTS = {
  sepolia: {
    Trait: '0x47eA9b10E643A70B8BCc5416Cb59d27E125a97e7',
    TraitForgeNft: '0xd9eD1d414A7354a96E42e16B278310AC59aEcb4D',
    EntropyGenerator: '0x4b9d22f086F29d591651eEdB7aEC7fA9874ff3a2',
    EntityTrading: '0xD98fB1c80432c5EF28C664641A41377403bED9dC',
    EntityForging: '0xDf808173833bB17fDd7bd66aE9afDeE6916f7807',
    DevFund: '0xd5236DD308C5a9986a012e9D398D7C6f8E2c8BB7',
    Airdrop: '0xF88E1F794923744FFe3456B2439D07288Cb477db',
    DAOFund: '0x40c5401Eb27a1C99776fdd7e6b8B1A22E2b3C651',
    NukeFund: '0xf6289f2c0323a91cD8eb6aADd07E00B2ED9C548a',
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
