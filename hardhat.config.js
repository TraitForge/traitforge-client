require("@nomiclabs/hardhat-ethers");


module.exports = {
  solidity: "0.8.20", 
  networks: {
    goerli: {
      url: "https://goerli.infura.io/v3/3f27d7e6326b43c5b77e16ac62188640",
      accounts: ["3877ce0010738652fdc3b8ca6750812600f833f2482d7d6e40e09f869e478a37"],
    }
  }
};
