const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EntityMerging", () => {
  let EntityMerging;
  let entityMerging;
  let owner;
  let user1;
  let user2;

  const BREEDING_FEE = ethers.utils.parseEther("1.0"); // 1 ETH

  beforeEach(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    // Deploy CustomERC721 contract
    const CustomERC721 = await ethers.getContractFactory("CustomERC721");
    const customERC721 = await CustomERC721.deploy(
      owner.address,
      user2.address,
      user1.address
    );
    await customERC721.deployed();

    // Deploy EntityMerging contract
    EntityMerging = await ethers.getContractFactory("EntityMerging");
    entityMerging = await EntityMerging.deploy(
      owner.address,
      user1.address,
      user2.address
    );
    await entityMerging.deployed();

    // Set customERC721ContractAddress in the EntityMerging contract
    await entityMerging.setCustomERC721ContractAddress(customERC721.address);

    // Mint some tokens for testing
    await customERC721.mint(owner.address, 1);
    await customERC721.mint(user1.address, 2);
    await customERC721.mint(user2.address, 3);
  });

  describe("listForBreeding", () => {
    it("should allow the owner to list a token for breeding", async () => {
      const tokenId = 1;
      const fee = BREEDING_FEE;

      await entityMerging.connect(owner).listForBreeding(tokenId, fee);

      const listing = await entityMerging.listings(tokenId);
      expect(listing.isListed).to.be.true;
      expect(listing.fee).to.equal(fee);

      // Additional assertions as needed
    });

    it("should not allow non-owners to list a token for breeding", async () => {
      const tokenId = 1;
      const fee = BREEDING_FEE;

      await expect(
        entityMerging.connect(user1).listForBreeding(tokenId, fee)
      ).to.be.revertedWith("Caller must own the token");

      // Additional assertions as needed
    });

    // Add more test cases for listForBreeding as needed
  });

  describe("breedWithListed", () => {
    it("should allow breeding with a listed token", async () => {
      const forgerTokenId = 1;
      const mergerTokenId = 2;

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
        .to.emit(entityMerging, "FeePaid")
        .withArgs(forgerTokenId, mergerTokenId, BREEDING_FEE);

      // Check balances
      expect(finalBalance).to.equal(initialBalance.sub(BREEDING_FEE));

      // Additional assertions as needed
    });

    it("should not allow breeding with an unlisted forger token", async () => {
      const forgerTokenId = 1;
      const mergerTokenId = 2;

      await expect(
        entityMerging
          .connect(user1)
          .breedWithListed(forgerTokenId, mergerTokenId, {
            value: BREEDING_FEE,
          })
      ).to.be.revertedWith("Forger's entity not listed for breeding");

      // Additional assertions as needed
    });

    // Add more test cases for breedWithListed as needed
  });

  // Add more describe blocks for other functions and scenarios

  // Add more test cases as needed
});