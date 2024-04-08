import { expect } from 'chai';
import { ethers } from 'hardhat';

describe('TraitForgeNft', function () {
  before(async function () {
    // Get signers
  });

  describe('Deployment', function () {
    it('should deploy NukeFund successfully', async function () {});

    it('should deploy EntropyGenerator successfully', async function () {});

    it('should deploy TraitForgeNft successfully', async function () {});
  });

  describe('Owner functions', function () {
    it('initialize', async function () {
      // Update entropyGenerator address
    });

    it('setNukeFundContract', async function () {});

    it('setEntityMerginContract', async function () {});

    it('setDAOFundAddress', async function () {});

    it('setEntropyGenerator', async function () {});
  });

  describe('Minting', function () {
    it('calculateMintPrice', async function () {});

    it('should mint new entity successfully', async function () {});

    it('should mint new token successfully', async function () {});

    it('should distribute funds successfully', async function () {});

    it('calculateTokenParameters', async function () {});

    it('getTokenCreationTimestamp', async function () {});
  });

  describe('Breeding', function () {
    it('getTokenEntropy', async function () {});

    it('getTokenAge', async function () {});

    it('fetchEntropies', async function () {});

    it('isForger', async function () {});

    it('should breed successfully', async function () {});
  });
});
