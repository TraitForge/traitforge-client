async function main() {
  const [deployer] = await ethers.getSigners();
  console.log('Using the account:', deployer.address);

  const CustomERC721 = await ethers.getContractFactory('CustomERC721');
  const customERC721 = await CustomERC721.attach(
    '0x5FbDB2315678afecb367f032d93F642f64180aa3'
  );

  const currentGeneration = await customERC721.currentGeneration();
  const mintCount = await customERC721.generationMintCounts(currentGeneration);
  console.log(
    `Mint Count for Generation ${currentGeneration}:`,
    mintCount.toString()
  );
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
