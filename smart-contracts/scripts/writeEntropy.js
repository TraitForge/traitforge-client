// scripts/writeEntropyBatches.js
async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Executing batch writing with the account:', deployer.address);

  const contractAddress = '0x51A1ceB83B83F1985a81C295d1fF28Afef186E02';
  const Contract = await ethers.getContractFactory('EntropyGenerator');
  const contract = await Contract.attach(contractAddress);

  console.log('Writing entropy batch 1...');
  await contract.writeEntropyBatch1();
  console.log('Entropy batch 1 written successfully.');

  console.log('Writing entropy batch 2...');
  await contract.writeEntropyBatch2();
  console.log('Entropy batch 2 written successfully.');

  console.log('Writing entropy batch 3...');
  await contract.writeEntropyBatch3();
  console.log('Entropy batch 3 written successfully.');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
