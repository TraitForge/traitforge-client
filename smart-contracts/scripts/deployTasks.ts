import { task } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import { ethers } from 'hardhat';
import {
  Airdrop,
  DAOFund,
  DevFund,
  EntityMerging,
  EntityTrading,
  EntropyGenerator,
  NukeFund,
  Trait,
  TraitForgeNft,
} from '../typechain-types';

task('deploy-all', 'Deploy all the contracts').setAction(async (_, hre) => {
  const token: Trait = await hre.run('deploy-token');
  const nft: TraitForgeNft = await hre.run('deploy-nft');
  const entropyGenerator: EntropyGenerator = await hre.run(
    'deploy-entropy-generator',
    { nft: await nft.getAddress() }
  );
  const entityTrading: EntityTrading = await hre.run('deploy-entity-trading', {
    nft: await nft.getAddress(),
  });
  const entityMerging: EntityMerging = await hre.run('deploy-entity-merging', {
    nft: await nft.getAddress(),
  });
  const devFund: DevFund = await hre.run('deploy-dev-fund');
  const airdrop: Airdrop = await hre.run('deploy-airdrop');
  const daoFund: DAOFund = await hre.run('deploy-dao-fund');
  const nukeFund: NukeFund = await hre.run('deploy-nuke-fund', {
    nft: await nft.getAddress(),
    devFund: await devFund.getAddress(),
    airdrop: await airdrop.getAddress(),
    daoFund: await daoFund.getAddress(),
  });

  await nft.setEntropyGenerator(await entropyGenerator.getAddress());
  await nft.setEntityMergingContract(await entityMerging.getAddress());
  await nft.setNukeFundContract(await nukeFund.getAddress());
  await nft.setAirdropContract(await airdrop.getAddress());
  await entityTrading.setNukeFundAddress(await nukeFund.getAddress());
  await entityMerging.setNukeFundAddress(await nukeFund.getAddress());
  await airdrop.setTraitToken(await token.getAddress());
});

task('deploy-token', 'Deploy Trait Token').setAction(async (_, hre) => {
  const name = 'TRAIT';
  const symbol = 'TRAIT';
  const totalSupply = ethers.parseEther('1000000');

  try {
    console.log('Deploying Trait...');
    const token = await hre.ethers.deployContract('Trait', [
      name,
      symbol,
      totalSupply,
    ]);
    await token.waitForDeployment();
    console.log('Contract deployed to:', await token.getAddress());
    return token;
  } catch (error) {
    console.error(error);
  }
  return null;
});

task('deploy-nft', 'Deploy TraitForgeNft').setAction(async (_, hre) => {
  try {
    console.log('Deploying TraitForgeNft...');
    const nft = await hre.ethers.deployContract('TraitForgeNft', []);
    await nft.waitForDeployment();
    console.log('Contract deployed to:', await nft.getAddress());
    return nft;
  } catch (error) {
    console.error(error);
  }
  return null;
});

task('deploy-entropy-generator', 'Deploy EntropyGenerator')
  .addParam('nft', 'The address of TraitForgeNft')
  .setAction(async (taskArguments, hre) => {
    try {
      console.log('Deploying EntropyGenerator...');
      const entropyGenerator = await hre.ethers.deployContract(
        'EntropyGenerator',
        [taskArguments.nft]
      );
      await entropyGenerator.waitForDeployment();
      console.log('Contract deployed to:', await entropyGenerator.getAddress());
      return entropyGenerator;
    } catch (error) {
      console.error(error);
    }
    return null;
  });

task('deploy-entity-trading', 'Deploy EntityTrading')
  .addParam('nft', 'The address of TraitForgeNft')
  .setAction(async (taskArguments, hre) => {
    try {
      console.log('Deploying EntityTrading...');
      const entityTrading = await hre.ethers.deployContract('EntityTrading', [
        taskArguments.nft,
      ]);
      await entityTrading.waitForDeployment();
      console.log('Contract deployed to:', await entityTrading.getAddress());
      return entityTrading;
    } catch (error) {
      console.error(error);
    }
    return null;
  });

task('deploy-entity-merging', 'Deploy EntityMerging')
  .addParam('nft', 'The address of TraitForgeNft')
  .setAction(async (taskArguments, hre) => {
    try {
      console.log('Deploying EntityMerging...');
      const entityMerging = await hre.ethers.deployContract('EntityMerging', [
        taskArguments.nft,
      ]);
      await entityMerging.waitForDeployment();
      console.log('Contract deployed to:', await entityMerging.getAddress());
      return entityMerging;
    } catch (error) {
      console.error(error);
    }
    return null;
  });

task('deploy-dev-fund', 'Deploy DevFund').setAction(async (_, hre) => {
  try {
    console.log('Deploying DevFund...');
    const devFund = await hre.ethers.deployContract('DevFund', []);
    await devFund.waitForDeployment();
    console.log('Contract deployed to:', await devFund.getAddress());
    return devFund;
  } catch (error) {
    console.error(error);
  }
  return null;
});

task('deploy-airdrop', 'Deploy Airdrop').setAction(async (_, hre) => {
  try {
    console.log('Deploying Airdrop...');
    const airdrop = await hre.ethers.deployContract('Airdrop', []);
    await airdrop.waitForDeployment();
    console.log('Contract deployed to:', await airdrop.getAddress());
    return airdrop;
  } catch (error) {
    console.error(error);
  }
  return null;
});

task('deploy-dao-fund', 'Deploy DAOFund').setAction(async (_, hre) => {
  try {
    console.log('Deploying DAOFund...');
    const daoFund = await hre.ethers.deployContract('DAOFund', []);
    await daoFund.waitForDeployment();
    console.log('Contract deployed to:', await daoFund.getAddress());
    return daoFund;
  } catch (error) {
    console.error(error);
  }
  return null;
});

task('deploy-nuke-fund', 'Deploy NukeFund')
  .addParam('nft', 'The address of TraitForgeNft')
  .addParam('devFund', 'The address of DevFund')
  .addParam('airdrop', 'The address of Airdrop')
  .addParam('daoFund', 'The address of DaoFund')
  .setAction(async (taskArguments, hre) => {
    try {
      console.log('Deploying NukeFund...');
      const nukeFund = await hre.ethers.deployContract('NukeFund', [
        taskArguments.nft,
        taskArguments.devFund,
        taskArguments.airdrop,
        taskArguments.daoFund,
      ]);
      await nukeFund.waitForDeployment();
      console.log('Contract deployed to:', await nukeFund.getAddress());
      return nukeFund;
    } catch (error) {
      console.error(error);
    }
    return null;
  });
