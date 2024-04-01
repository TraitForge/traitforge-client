const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DAOFund", function () {
  let owner, addr1, addr2;
  let daoFundContract, tokenContract;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploying ERC20 token contract
    const Token = await ethers.getContractFactory("ERC20FixedSupply");
    tokenContract = await Token.deploy("Test Token", "TT", 18);

    // Deploying DAOFund contract
    const DAOFund = await ethers.getContractFactory("DAOFund");
    daoFundContract = await DAOFund.deploy(tokenContract.address);

    // Transfer tokens to DAO contract
    await tokenContract.transfer(
      daoFundContract.address,
      ethers.utils.parseEther("1000000")
    );

    // Populating developers and investors array
    await daoFundContract.setDevelopersMultisig(owner.address);
    await daoFundContract.startAirdrop();
    await daoFundContract.updateEntropyForAddress(owner.address, 10);
    await daoFundContract.updateEntropyForAddress(addr1.address, 20);
    await daoFundContract.updateEntropyForAddress(addr2.address, 30);
  });

  it("should stake and unstake tokens", async function () {
    await daoFundContract.stake(ethers.utils.parseEther("100"));
    await daoFundContract.unstake(ethers.utils.parseEther("50"));

    const userBalance = await tokenContract.balanceOf(owner.address);
    expect(userBalance).to.equal(ethers.utils.parseEther("999950"));
  });

  it("should distribute tokens to developers and investors", async function () {
    await daoFundContract.distributeTokens();

    const devBalance = await tokenContract.balanceOf(owner.address);
    const investorBalance1 = await tokenContract.balanceOf(addr1.address);
    const investorBalance2 = await tokenContract.balanceOf(addr2.address);

    expect(devBalance).to.equal(ethers.utils.parseEther("400000"));
    expect(investorBalance1).to.equal(ethers.utils.parseEther("200000"));
    expect(investorBalance2).to.equal(ethers.utils.parseEther("200000"));
  });

  it("should distribute airdrop tokens to a specific recipient", async function () {
    await daoFundContract.distributeAirdropToAddress(addr1.address);

    const recipientBalance = await tokenContract.balanceOf(addr1.address);
    expect(recipientBalance).to.equal(ethers.utils.parseEther("40000"));
  });
});
