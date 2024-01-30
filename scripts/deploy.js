const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  const NukeFundFactory = await ethers.getContractFactory("NukeFund");
  const nukeFund = await NukeFundFactory.deploy(deployer.address);
  await nukeFund.deployed();
  console.log("NukeFund deployed to:", nukeFund.address);

  const BreedableTokenFactory = await ethers.getContractFactory("BreedableToken");
  const breedableToken = await BreedableTokenFactory.deploy(
    "BreedableTokenName", 
    "BT",                
    nukeFund.address,    
    deployer.address     
  );
  await breedableToken.deployed();
  console.log("BreedableToken deployed to:", breedableToken.address);

  const MintFactory = await ethers.getContractFactory("Mint");
  const mint = await MintFactory.deploy(nukeFund.address, deployer.address, breedableToken.address);
  await mint.deployed();
  console.log("Mint deployed to:", mint.address);

  const EntityTradingFactory = await ethers.getContractFactory("EntityTrading");
const entityTrading = await EntityTradingFactory.deploy(breedableToken.address, deployer.address, nukeFund.address);
await entityTrading.deployed();
console.log("EntityTrading deployed to:", entityTrading.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
