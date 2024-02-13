require("@nomiclabs/hardhat-ethers");
require("dotenv").config();

const { SEPOLIA_RPC_URL, PRIVATE_KEY } = process.env;

module.exports = {
  solidity: "0.8.20",
  defaultNetwork: "hardhat",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL || "https://sepolia.infura.io/v3/3f27d7e6326b43c5b77e16ac62188640",
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
};
