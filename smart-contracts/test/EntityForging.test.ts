const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('EntityForging', () => {
  let entityForging;
  let nft;
  let owner;
  let user1;
  let user2;

  const BREEDING_FEE = ethers.utils.parseEther('1.0'); // 1 ETH

  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy TraitForgeNft contract
    const TraitForgeNft = await ethers.getContractFactory('TraitForgeNft');
    nft = await TraitForgeNft.deploy();
    await nft.deployed();

    // Deploy EntityForging contract
    const EntropyGenerator = await ethers.getContractFactory(
      'EntropyGenerator'
    );
    const entropyGenerator = await EntropyGenerator.deploy(nft.address);
    await entropyGenerator.deployed();
    await nft.setEntropyGenerator(entropyGenerator.address);

    // Deploy EntityForging contract
    const EntityForging = await ethers.getContractFactory('EntityForging');
    entityForging = await EntityForging.deploy(nft.address);
    await entityForging.deployed();
    await nft.setEntityForgingContract(entityForging.address);

    await nft.setNukeFundContract(user2.address);

    // Mint some tokens for testing
    await nft.mintToken(owner.address, { value: ethers.utils.parseEther('1') });
    await nft.mintToken(user1.address, { value: ethers.utils.parseEther('1') });
    await nft.mintToken(user2.address, { value: ethers.utils.parseEther('1') });
  });

  describe('listForBreeding', () => {
    it('should not allow non-owners to list a token for breeding', async () => {
      const tokenId = 0;
      const fee = BREEDING_FEE;

      await expect(
        entityForging.connect(user1).listForBreeding(tokenId, fee)
      ).to.be.revertedWith('Caller must own the token');

      // Additional assertions as needed
    });

    // Add more test cases for listForBreeding as needed

    it('should allow the owner to list a token for breeding', async () => {
      const tokenId = 0;
      const fee = BREEDING_FEE;

      await entityForging.connect(owner).listForBreeding(tokenId, fee);

      const listing = await entityForging.listings(tokenId);
      expect(listing.isListed).to.be.true;
      expect(listing.fee).to.equal(fee);

      // Additional assertions as needed
    });
  });

  describe('breedWithListed', () => {
    it('should not allow breeding with an unlisted forger token', async () => {
      const forgerTokenId = 0;
      const mergerTokenId = 1;

      await expect(
        entityForging
          .connect(user1)
          .breedWithListed(forgerTokenId, mergerTokenId, {
            value: BREEDING_FEE,
          })
      ).to.be.revertedWith("Forger's entity not listed for breeding");

      // Additional assertions as needed
    });

    it('should allow breeding with a listed token', async () => {
      const forgerTokenId = 0;
      const mergerTokenId = 1;

      await entityForging
        .connect(owner)
        .listForBreeding(forgerTokenId, BREEDING_FEE);

      const initialBalance = await ethers.provider.getBalance(user1.address);
      const tx = await entityForging
        .connect(user1)
        .breedWithListed(forgerTokenId, mergerTokenId, {
          value: BREEDING_FEE,
        });
      const finalBalance = await ethers.provider.getBalance(user1.address);

      // Check event emissions
      expect(tx)
        .to.emit(entityForging, 'FeePaid')
        .withArgs(forgerTokenId, mergerTokenId, BREEDING_FEE);

      // Check balances
      expect(finalBalance).to.equal(initialBalance.sub(BREEDING_FEE));

      // Additional assertions as needed
    });

    // Add more test cases for breedWithListed as needed
  });

  // Add more describe blocks for other functions and scenarios

  // Add more test cases as needed
});
