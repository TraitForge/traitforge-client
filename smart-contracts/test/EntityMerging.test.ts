const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('EntityMerging', () => {
  let entityMerging;
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

    // Deploy EntityMerging contract
    const EntropyGenerator = await ethers.getContractFactory(
      'EntropyGenerator'
    );
    const entropyGenerator = await EntropyGenerator.deploy(nft.address);
    await entropyGenerator.deployed();
    await nft.setEntropyGenerator(entropyGenerator.address);

    // Deploy EntityMerging contract
    const EntityMerging = await ethers.getContractFactory('EntityMerging');
    entityMerging = await EntityMerging.deploy(nft.address);
    await entityMerging.deployed();
    await nft.setEntityMergingContract(entityMerging.address);

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
        entityMerging.connect(user1).listForBreeding(tokenId, fee)
      ).to.be.revertedWith('Caller must own the token');

      // Additional assertions as needed
    });

    // Add more test cases for listForBreeding as needed

    it('should allow the owner to list a token for breeding', async () => {
      const tokenId = 0;
      const fee = BREEDING_FEE;

      await entityMerging.connect(owner).listForBreeding(tokenId, fee);

      const listing = await entityMerging.listings(tokenId);
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
        entityMerging
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

      await entityMerging
        .connect(owner)
        .listForBreeding(forgerTokenId, BREEDING_FEE);

      const initialBalance = await ethers.provider.getBalance(user1.address);
      const tx = await entityMerging
        .connect(user1)
        .breedWithListed(forgerTokenId, mergerTokenId, {
          value: BREEDING_FEE,
        });
      const finalBalance = await ethers.provider.getBalance(user1.address);

      // Check event emissions
      expect(tx)
        .to.emit(entityMerging, 'FeePaid')
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
