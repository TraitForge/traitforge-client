const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();

  const TokenPoolFactory = await ethers.getContractFactory("TokenPool");
  const tokenPool = await TokenPoolFactory.deploy(); 
  await tokenPool.deployed();
  console.log("TokenPool deployed to:", tokenPool.address);

  const NukeFundFactory = await ethers.getContractFactory("NukeFund");
  const nukeFund = await NukeFundFactory.deploy(deployer.address);
  await nukeFund.deployed();
  console.log("NukeFund deployed to:", nukeFund.address);

  const BreedableTokenFactory = await ethers.getContractFactory("BreedableToken");
  const breedableToken = await BreedableTokenFactory.deploy(
    "BreedableTokenName", 
    "BT",                
    tokenPool.address,   
    deployer.address,  
    ethers.utils.parseEther("0.01") 
  );
  await breedableToken.deployed();
  console.log("BreedableToken deployed to:", breedableToken.address);

  const MintFactory = await ethers.getContractFactory("Mint");
  const mint = await MintFactory.deploy(tokenPool.address, deployer.address); 
  await mint.deployed();
  console.log("Mint deployed to:", mint.address);

  const EntityTradingFactory = await ethers.getContractFactory("EntityTrading");
  const entityTrading = await EntityTradingFactory.deploy(mint.address, deployer.address, deployer.address);
  await entityTrading.deployed();
  console.log("EntityTrading deployed to:", entityTrading.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });