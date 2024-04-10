import { HardhatEthersSigner } from '@nomicfoundation/hardhat-ethers/signers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { DAOFund, Trait } from '../typechain-types';

describe('DAOFund', function () {
  let owner: HardhatEthersSigner;
  let daoFund: DAOFund;
  let token: Trait;

  before(async () => {
    [owner] = await ethers.getSigners();

    const ROUTER_ADDRESS = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

    token = await ethers.deployContract('Trait', [
      'Trait',
      'TRAIT',
      18,
      ethers.parseEther('1000000'),
    ]);
    const router = await ethers.getContractAt(
      'IUniswapV2Router02',
      ROUTER_ADDRESS
    );
    await token.increaseAllowance(
      await router.getAddress(),
      ethers.parseEther('1000')
    );
    await router.addLiquidityETH(
      await token.getAddress(),
      ethers.parseEther('1000'),
      0,
      0,
      owner.address,
      1712681984,
      { value: ethers.parseEther('100') }
    );

    daoFund = await ethers.deployContract('DAOFund', [
      await token.getAddress(),
      ROUTER_ADDRESS,
    ]);
  });

  it('should swap tokens and burn with received ETH', async () => {
    const totalSupplyBefore = await token.totalSupply();
    await owner.sendTransaction({
      to: await daoFund.getAddress(),
      value: ethers.parseEther('1'),
    });
    const totalSupplyAfter = await token.totalSupply();
    expect(totalSupplyBefore - totalSupplyAfter).to.gt(0);
  });
});
