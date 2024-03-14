const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EntropyGenerator", function () {
  let EntropyGenerator;
  let entropyGenerator;
  let owner;
  let allowedCaller;
  let user;

  before(async function () {
    [owner, allowedCaller, user] = await ethers.getSigners();

    // Deploy the contract
    EntropyGenerator = await ethers.getContractFactory("EntropyGenerator");
    entropyGenerator = await EntropyGenerator.deploy(
      allowedCaller.address,
      owner.address
    );

    await entropyGenerator.deployed();
  });

  it("should set the allowed caller", async function () {
    const newAllowedCaller = user.address;
  
    await entropyGenerator.connect(owner).setAllowedCaller(newAllowedCaller);
  
    // Use the new getter function to retrieve the allowedCaller
    const updatedCaller = await entropyGenerator.getAllowedCaller();
    expect(updatedCaller).to.equal(newAllowedCaller);
  });
  
  it("should write entropy batches", async function () {
    // Write entropy batch 1
    await entropyGenerator.writeEntropyBatch1();
    expect((await entropyGenerator.getLastInitializedIndex()).toNumber()).to.equal(256);
    const lastIndex = (await entropyGenerator.getLastInitializedIndex()).toNumber();
    expect(lastIndex).to.equal(256);

    // Write entropy batch 2
    await entropyGenerator.writeEntropyBatch2();
    const lastIndexAfterBatch2 = (await entropyGenerator.getLastInitializedIndex()).toNumber();
    expect(lastIndexAfterBatch2).to.equal(512);

    // Write entropy batch 3
    await entropyGenerator.writeEntropyBatch3();
    const lastIndexAfterBatch3 = (await entropyGenerator.getLastInitializedIndex()).toNumber();
    expect(lastIndexAfterBatch3).to.equal(770);
  });

  it("check allowed caller", async function () {
    const currentAllowedCaller = await entropyGenerator.getAllowedCaller();
    console.log(currentAllowedCaller); // Or compare directly: expect(currentAllowedCaller).to.equal(allowedCaller.address);
  });
  

  it("should retrieve the next entropy", async function () {
    // Setup: Make sure allowedCaller is set appropriately before this test
    await entropyGenerator.connect(owner).setAllowedCaller(allowedCaller.address);

    // Call getNextEntropy and wait for the transaction to be mined
    const tx = await entropyGenerator.connect(allowedCaller).getNextEntropy();
    const receipt = await tx.wait(); // Wait for the transaction to be mined

    // Find the EntropyRetrieved event in the transaction receipt
    const foundEvent = receipt.events.find(e => e.event === "EntropyRetrieved");
    expect(foundEvent, "EntropyRetrieved event not found").to.not.be.undefined;

    // Additional check: You can also verify the entropy value if you have expected criteria
    const entropyValue = foundEvent.args.entropy;
    expect(ethers.BigNumber.isBigNumber(entropyValue)).to.equal(true);

    // If you have specific expectations about the entropy value, compare it here
    // For example: expect(entropyValue).to.equal(expectedValue);
});

  it("should derive token parameters", async function () {
    const slotIndex = 42;
    const numberIndex = 7;

    const [nukeFactor, breedPotential, performanceFactor, isSire] =
      await entropyGenerator.deriveTokenParameters(slotIndex, numberIndex);

      expect(ethers.BigNumber.isBigNumber(nukeFactor)).to.equal(true);
      expect(ethers.BigNumber.isBigNumber(breedPotential)).to.equal(true);
      expect(ethers.BigNumber.isBigNumber(performanceFactor)).to.equal(true);
      
    expect(isSire).to.be.a("boolean");
  });
});