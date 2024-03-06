const hre = require("hardhat");

async function main() {
  // Deploy EntropyGenerator
  const EntropyGenerator = await hre.ethers.getContractFactory("EntropyGenerator");
  const entropyGenerator = await EntropyGenerator.deploy(/* CustomERC721 Address Placeholder */);
  await entropyGenerator.deployed();
  console.log("EntropyGenerator deployed to:", entropyGenerator.address);

  // Deploy CustomERC721 with EntropyGenerator address
  const CustomERC721 = await hre.ethers.getContractFactory("CustomERC721");
  const customERC721 = await CustomERC721.deploy(/* Owner Address */, /* NukeFund Address Placeholder */, entropyGenerator.address);
  await customERC721.deployed();
  console.log("CustomERC721 deployed to:", customERC721.address);

  // Update EntropyGenerator with correct CustomERC721 address
  const updateEntropyGeneratorTx = await entropyGenerator.setAllowedCaller(customERC721.address);
  await updateEntropyGeneratorTx.wait();

  // Deploy DAOFund with your token address
  const DAOFund = await hre.ethers.getContractFactory("DAOFund");
  const daoFund = await DAOFund.deploy(/* Token Address Placeholder */);
  await daoFund.deployed();
  console.log("DAOFund deployed to:", daoFund.address);

  // Deploy EntityMerging with necessary addresses
  const EntityMerging = await hre.ethers.getContractFactory("EntityMerging");
  const entityMerging = await EntityMerging.deploy(/* Owner Address */, /* NukeFund Address Placeholder */, entropyGenerator.address, customERC721.address);
  await entityMerging.deployed();
  console.log("EntityMerging deployed to:", entityMerging.address);

  // Deploy NukeFund with CustomERC721 address
  const NukeFund = await hre.ethers.getContractFactory("NukeFund");
  const nukeFund = await NukeFund.deploy(customERC721.address);
  await nukeFund.deployed();
  console.log("NukeFund deployed to:", nukeFund.address);

  // Set DAOFund and EntityMerging addresses in CustomERC721
  const setDAOFundTx = await customERC721.setDAOFundAddress(daoFund.address);
  await setDAOFundTx.wait();
  
  const setEntityMergingTx = await customERC721.setEntityMergingContract(entityMerging.address);
  await setEntityMergingTx.wait();

  // Additional setups like setting other contract addresses or initial states can be added here
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
