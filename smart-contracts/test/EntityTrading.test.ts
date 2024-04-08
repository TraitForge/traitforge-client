const { expect } = require('chai');
const { ethers } = require('hardhat');

// Define some constants for testing
const TOKEN_ID = 1;
const LISTING_PRICE = ethers.utils.parseEther('1.0');

// Helper function to deploy the contracts
async function deployContracts() {
  const TraitForgeNft = await ethers.getContractFactory('TraitForgeNft');
  const nft = await TraitForgeNft.deploy();

  const EntityTrading = await ethers.getContractFactory('EntityTrading');
  const entityTrading = await EntityTrading.deploy(nft.address);

  await nft.setApprovalForAll(entityTrading.address, true);

  return { nft, entityTrading };
}

describe('EntityTrading', function () {
  let nft;
  let entityTrading;
  let owner;
  let buyer;
  let nukeFundAddress;

  before(async function () {
    // Deploy contracts before each test case
    ({ nft, entityTrading } = await deployContracts());

    // Get the owner and buyer accounts
    [owner, buyer] = await ethers.getSigners();

    // Set NukeFund address
    nukeFundAddress = await owner.getAddress();
    await entityTrading.setNukeFundAddress(nukeFundAddress);

    // Mint and approve the NFT for trading
    await nft.mint(owner.address, TOKEN_ID);
    await nft.approve(entityTrading.address, TOKEN_ID);
  });

  it('should list an NFT for sale', async function () {
    await entityTrading.listNFTForSale(TOKEN_ID, LISTING_PRICE);

    const listing = await entityTrading.listings(TOKEN_ID);

    expect(listing.seller).to.equal(owner.address);
    expect(listing.price).to.equal(LISTING_PRICE);
    expect(listing.isActive).to.be.true;
  });

  it('should allow a buyer to purchase the listed NFT', async function () {
    const initialBalance = await buyer.getBalance();

    await expect(
      entityTrading.connect(buyer).buyNFT(TOKEN_ID, { value: LISTING_PRICE })
    )
      .to.emit(entityTrading, 'NFTSold')
      .withArgs(
        TOKEN_ID,
        owner.address,
        buyer.address,
        LISTING_PRICE.div(10),
        LISTING_PRICE.sub(LISTING_PRICE.div(10))
      );

    const listing = await entityTrading.listings(TOKEN_ID);
    expect(listing.isActive).to.be.false;

    // Check the balances after the purchase
    const finalBalance = await buyer.getBalance();
    expect(finalBalance).to.be.above(initialBalance.sub(LISTING_PRICE));
  });

  it('should allow the seller to cancel the listing', async function () {
    await entityTrading.cancelListing(TOKEN_ID);

    const listing = await entityTrading.listings(TOKEN_ID);
    expect(listing.isActive).to.be.false;

    // Check if the NFT is transferred back to the owner
    const ownerBalance = await nft.balanceOf(owner.address);
    expect(ownerBalance).to.equal(1);
  });

  it('should handle NukeFund contributions correctly', async function () {
    const initialNukeFundBalance = await ethers.provider.getBalance(
      nukeFundAddress
    );

    await entityTrading.listNFTForSale(TOKEN_ID, LISTING_PRICE);

    await expect(
      entityTrading.connect(buyer).buyNFT(TOKEN_ID, { value: LISTING_PRICE })
    )
      .to.emit(entityTrading, 'NukeFundContribution')
      .withArgs(entityTrading.address, LISTING_PRICE.div(10));

    // Check the NukeFund balance after the purchase
    const finalNukeFundBalance = await ethers.provider.getBalance(
      nukeFundAddress
    );
    expect(finalNukeFundBalance.sub(initialNukeFundBalance)).to.equal(
      LISTING_PRICE.div(10)
    );
  });
});
