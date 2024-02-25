// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
    const Ownable = await ethers.getContractFactory("Ownable");
    const ownable = await Ownable.deploy();
    await ownable.deployed();
    console.log("Ownable deployed to:", ownable.address);

    const EntropyGenerator = await ethers.getContractFactory("EntropyGenerator");
    const entropyGenerator = await EntropyGenerator.deploy();
    await entropyGenerator.deployed();
    console.log("EntropyGenerator deployed to:", entropyGenerator.address);

    const NukeFund = await ethers.getContractFactory("NukeFund");
    const nukeFund = await NukeFund.deploy(CustomERC721);
    await nukeFund.deployed();
    console.log("NukeFund deployed to:", nukeFund.address);

    const CustomERC721 = await ethers.getContractFactory("CustomERC721");
    const customERC721 = await CustomERC721.deploy(ownable.address, nukeFund.address, entropyGenerator.address);
    await customERC721.deployed();
    console.log("CustomERC721 deployed to:", customERC721.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
