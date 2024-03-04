const { ethers } = require("hardhat");

async function main() {
  // Deploy the contracts without dependencies in their constructors
  const NukeFund = await ethers.getContractFactory("NukeFund");
  const nukeFund = await NukeFund.deploy();
  await nukeFund.deployed();
  console.log("NukeFund deployed to:", nukeFund.address);

  const EntropyGenerator = await ethers.getContractFactory("EntropyGenerator");
  const entropyGenerator = await EntropyGenerator.deploy();
  await entropyGenerator.deployed();
  console.log("EntropyGenerator deployed to:", entropyGenerator.address);

  const CustomERC721 = await ethers.getContractFactory("CustomERC721");
  const customERC721 = await CustomERC721.deploy();
  await customERC721.deployed();
  console.log("CustomERC721 deployed to:", customERC721.address);

  await customERC721.setNukeFundAddress(nukeFund.address);
  await customERC721.setEntropyGeneratorAddress(entropyGenerator.address);


  await entropyGenerator.setCustomERC721Address(customERC721.address);
  await nukeFund.setCustomERC721Address(customERC721.address);

  const DaoFund = await ethers.getContractFactory("DaoFund");
  const daoFund = await DaoFund.deploy(customERC721.address);
  await daoFund.deployed();
  console.log("DaoFund deployed to:", daoFund.address);

  const Merging = await ethers.getContractFactory("Merging");
  const merging = await Merging.deploy(customERC721.address);
  await merging.deployed();
  console.log("Merging deployed to:", merging.address);

  const TradeEntities = await ethers.getContractFactory("TradeEntities");
  const tradeEntities = await TradeEntities.deploy(customERC721.address);
  await tradeEntities.deployed();
  console.log("TradeEntities deployed to:", tradeEntities.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
