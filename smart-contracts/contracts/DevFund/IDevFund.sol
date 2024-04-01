// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IDevFund {
  struct DevInfo {
    uint256 rewardDebt;
    uint256 pendingRewards;
  }

  event AddDev(address indexed dev);
  event RemoveDev(address indexed dev);
  event Claim(address indexed dev, uint256 amount);
  event FundReceived(address indexed from, uint256 amount); // Log the received funds

  receive() external payable;

  function addDev(address user) external;

  function removeDev(address user) external;

  function claim() external;

  function pendingRewards(address user) external view returns (uint256);
}
