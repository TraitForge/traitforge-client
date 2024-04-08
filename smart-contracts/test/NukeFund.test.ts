import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { NukeFund, TraitForgeNft } from '../typechain-types';

describe('NukeFund', function () {
  let owner: HardhatEthersSigner,
    user1: HardhatEthersSigner,
    nukeFund: NukeFund,
    nft: TraitForgeNft;
  let nukeFundAddress: string, entropyGeneratorAddress: string;

  beforeEach(async function () {
    [owner, user1] = await ethers.getSigners();

    // Assuming these addresses are already deployed and known
    nukeFundAddress = '0xE6E340D132b5f46d1e472DebcD681B2aBc16e57E'; // Correctly initialized
    entropyGeneratorAddress = '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB'; // Assuming it's used somewhere in your setup

    // Here, nukeFund is fetched from a known address. If it's supposed to be dynamically deployed in the test, you need to deploy it first.
    nukeFund = await ethers.getContractAt('NukeFund', nukeFundAddress, owner);

    // For erc721Contract, we should deploy it dynamically in tests where it's needed, unless it's also supposed to be a fixed address.
    // Deploying TraitForgeNft dynamically as part of the test setup for the first test
  });

  it('should allow the owner to update the ERC721 contract address', async function () {
    // Dynamically deploy a new instance of the TraitForgeNft contract
    const TraitForgeNft = await ethers.getContractFactory('TraitForgeNft');
    const initialOwnerAddress = owner.address;
    nft = await TraitForgeNft.deploy(
      initialOwnerAddress,
      nukeFundAddress, // Use the existing nukeFundAddress here if the new ERC721 needs to know about it, or adjust as needed
      entropyGeneratorAddress
    );
    nft.waitForDeployment();

    // Assuming nukeFund is already deployed and you're setting the ERC721 address
    await expect(nukeFund.connect(owner).setTraitForgeNftContract(nft.address))
      .to.emit(nukeFund, 'TraitForgeNftAddressUpdated')
      .withArgs(nft.address);

    expect(await nukeFund.nftContract()).to.equal(nft.address);
  });

  it('should receive funds and distribute dev share', async function () {
    const initialFundBalance = await nukeFund.getFundBalance();
    const devShare = ethers.utils.parseEther('0.1'); // 10% of the sent amount

    await expect(() =>
      user1.sendTransaction({ value: ethers.utils.parseEther('1') })
    ).to.changeEtherBalance(nukeFund, ethers.utils.parseEther('0.9'));

    const newFundBalance = await nukeFund.getFundBalance();
    expect(newFundBalance).to.equal(
      initialFundBalance.add(ethers.utils.parseEther('0.9'))
    );

    const devBalance = await ethers.provider.getBalance(nukeFund.devAddress);
    expect(devBalance).to.equal(devShare);
  });

  it('should calculate the age of a token', async function () {
    const tokenId = 1;

    // Mock token creation timestamp and entropy
    await nft.mint(owner.address, tokenId);
    await nft.setTokenCreationTimestamp(
      tokenId,
      Math.floor(Date.now() / 1000) - 2 * 24 * 60 * 60
    );
    await nft.setEntropy(tokenId, 12345);

    const age = await nukeFund.calculateAge(tokenId);
    expect(age).to.be.a('number');
  });

  // Add more test cases as needed...

  it('should nuke a token', async function () {
    const tokenId = 1;

    // Mint a token
    await nft
      .connect(owner)
      .mintToken(owner.address, { value: ethers.utils.parseEther('0.01') });

    // Send some funds to the contract
    await user1.sendTransaction({ value: ethers.utils.parseEther('1') });

    // Calculate nuke factor
    const nukeFactor = await nukeFund.calculateNukeFactor(tokenId);

    // Ensure the token can be nuked
    expect(await nukeFund.canTokenBeNuked(tokenId)).to.be.true;

    // Nuke the token
    await expect(() =>
      nukeFund.connect(owner).nuke(tokenId)
    ).to.changeEtherBalance(
      user1,
      ethers.utils.parseEther((nukeFactor * 0.01).toString())
    );

    // Check if the token is burned
    expect(await erc721Contract.ownerOf(tokenId)).to.equal(
      ethers.constants.AddressZero
    );

    // Check if the fund balance is updated
    expect(await nukeFund.getFundBalance()).to.equal(0);
  });
});
