async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const EntropyGenerator = await ethers.getContractFactory("EntropyGenerator");
  const entropyGenerator = await EntropyGenerator.deploy();

  console.log("EntropyGenerator address:", entropyGenerator.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
