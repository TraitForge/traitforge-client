// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './IUniswapV2Router.sol';
import '../Trait/ITrait.sol';

contract DAOFund is Ownable, ReentrancyGuard {
  ITrait token;
  IUniswapV2Router01 public uniswapV2Router =
    IUniswapV2Router02(0xf012702a5f0e54015362cBCA26a26fc90AA832a3);

  receive() external payable {
    address[] memory path = new address[](2);
    path[1] = uniswapV2Router.WETH();
    path[0] = address(token);

    uniswapV2Router.swapExactETHForTokens(
      0,
      path,
      address(this),
      block.timestamp
    );

    require(
      token.burn(token.balanceOf(address(this))) == true,
      'Token burn failed'
    );
  }
}
