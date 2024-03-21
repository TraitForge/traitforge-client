const hre = require("hardhat");

async function main() {
  // Deploy CustomERC721 without setting the nukeFundAddress and entropyGeneratorAddress initially
  const CustomERC721 = await hre.ethers.getContractFactory("CustomERC721");
  const customERC721 = await CustomERC721.deploy(
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    ethers.constants.AddressZero,
    ethers.constants.AddressZero
  );
  await customERC721.deployed();
  console.log("CustomERC721 deployed to:", customERC721.address);

  // Deploy NukeFund with the address of the CustomERC721
  const NukeFund = await hre.ethers.getContractFactory("NukeFund");
  const nukeFund = await NukeFund.deploy(customERC721.address);
  await nukeFund.deployed();
  console.log("NukeFund deployed to:", nukeFund.address);

  const EntityTrading = await hre.ethers.getContractFactory("EntityTrading");
  const tradeEntities = await EntityTrading.deploy(nukeFund.address);
  await tradeEntities.deployed();
  console.log("TradeEntities deployed to:", tradeEntities.address);

  // Deploy EntropyGenerator with the address of the CustomERC721
  const EntropyGenerator = await hre.ethers.getContractFactory(
    "EntropyGenerator"
  );
  const entropyGenerator = await EntropyGenerator.deploy(
    customERC721.address,
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"
  );
  await entropyGenerator.deployed();
  console.log("EntropyGenerator deployed to:", entropyGenerator.address);

  // Now that NukeFund and EntropyGenerator are deployed, set their addresses in CustomERC721
  await customERC721.setNukeFundContract(nukeFund.address);
  console.log("NukeFundContract set in CustomERC721");

  await customERC721.setEntropyGeneratorAddress(entropyGenerator.address);
  console.log("EntropyGeneratorAddress set in CustomERC721");

  // Assume DAOFund and EntityMerging contracts also need to be deployed and connected

  // Deploy DAOFund potentially with some initial configuration
  // Replace "TokenAddress" with the actual ERC20 token address for DAOFund
  const DAOFund = await hre.ethers.getContractFactory("DAOFund");
  const daoFund = await DAOFund.deploy(
    "0x4826533B4897376654Bb4d4AD88B7faFD0C98528"
  );
  await daoFund.deployed();
  console.log("DAOFund deployed to:", daoFund.address);

  // Deploy EntityMerging and configure it if needed
  // Note: If EntityMerging contract requires addresses of other contracts in its constructor, pass them similarly
  const EntityMerging = await hre.ethers.getContractFactory("EntityMerging");
  const entityMerging = await EntityMerging.deploy(
    customERC721.address,
    nukeFund.address,
    entropyGenerator.address
  );
  await entityMerging.deployed();
  console.log("EntityMerging deployed to:", entityMerging.address);

  // After all deployments, set the relevant addresses in CustomERC721 if needed
  // For example, if you need to connect CustomERC721 with the deployed DAOFund and EntityMerging
  await customERC721.setDAOFundAddress(daoFund.address);
  console.log("DAOFundAddress set in CustomERC721");

  await customERC721.setEntityMergingContract(entityMerging.address);
  console.log("EntityMergingContract set in CustomERC721");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
