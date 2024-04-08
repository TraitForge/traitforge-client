const hre = require('hardhat');

const CustomERC721ABI =
  require('../artifacts/contracts/CustomERC721.sol/CustomERC721.json').abi;

async function main() {
  const customERC721Address = '0x1291Be112d480055DaFd8a610b7d1e203891C274';

  // Get the contract instance
  const customERC721 = await hre.ethers.getContractAt(
    CustomERC721ABI,
    customERC721Address
  );

  // Minting a token with a manual gas limit
  const mintTx = await customERC721.mintToken(
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    {
      value: hre.ethers.utils.parseEther('0.01'),
      gasLimit: 500000, // Manually set gas limit
    }
  );

  await mintTx.wait();
  console.log('Token minted successfully.');
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
