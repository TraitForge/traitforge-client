import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { DevFund } from '../typechain-types';

describe('DevFund', function () {
  let owner: HardhatEthersSigner;
  let user1: HardhatEthersSigner;
  let user2: HardhatEthersSigner;
  let devFund: DevFund;

  before(async () => {
    [owner, user1, user2] = await ethers.getSigners();

    devFund = await ethers.deployContract('DevFund');
  });

  it('should send the received fund to owner when there are no devs', async () => {
    const balanceBefore = await ethers.provider.getBalance(owner.address);
    await user2.sendTransaction({
      to: await devFund.getAddress(),
      value: ethers.parseEther('1'),
    });
    const balanceAfter = await ethers.provider.getBalance(owner.address);
    expect(balanceAfter - balanceBefore).to.eq(ethers.parseEther('1'));
  });

  it('should not add a dev from non-owner', async () => {
    await expect(devFund.connect(user2).addDev(user1.address)).to.revertedWith(
      'Ownable: caller is not the owner'
    );
  });

  it('should add a dev successfully', async () => {
    await expect(devFund.addDev(user1.address))
      .to.emit(devFund, 'AddDev')
      .withArgs(user1.address);

    await expect(devFund.addDev(user2.address))
      .to.emit(devFund, 'AddDev')
      .withArgs(user2.address);
  });

  it('should revert when the dev is already registered', async () => {
    await expect(devFund.addDev(user1.address)).to.revertedWith(
      'Already registered'
    );
  });

  it('should split the fund between devs when receiving fund', async () => {
    await owner.sendTransaction({
      to: await devFund.getAddress(),
      value: ethers.parseEther('1'),
    });

    expect(await devFund.pendingRewards(user1.address)).to.eq(
      ethers.parseEther('0.5')
    );
  });

  it('should claim successfully', async () => {
    const balanceBefore = await ethers.provider.getBalance(user1.address);
    await expect(devFund.connect(user1).claim())
      .to.emit(devFund, 'Claim')
      .withArgs(user1.address, ethers.parseEther('0.5'));
    const balanceAfter = await ethers.provider.getBalance(user1.address);
    expect(balanceAfter - balanceBefore).to.approximately(
      ethers.parseEther('0.5'),
      ethers.parseEther('0.05')
    );
  });

  it('should remove dev successfully', async () => {
    await expect(devFund.removeDev(user1.address))
      .to.emit(devFund, 'RemoveDev')
      .withArgs(user1.address);
    expect(await devFund.isDev(user1.address)).to.eq(false);
  });
});
