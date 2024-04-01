// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Trait is ERC20 {
  uint8 private _decimals;

  constructor(
    string memory _name,
    string memory _symbol,
    uint8 _decimal,
    uint256 _totalSupply
  ) ERC20(_name, _symbol) {
    _decimals = _decimal;
    _mint(msg.sender, _totalSupply);
  }

  function decimals() public view virtual override returns (uint8) {
    return _decimals;
  }
}
