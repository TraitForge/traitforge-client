// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import './IDevFund.sol';

contract DevFund is IDevFund, Ownable, ReentrancyGuard, Pausable {
  uint256 public totalDevCount;
  uint256 public rewardPerDev;
  mapping(address => bool) public isDev;
  mapping(address => DevInfo) public devInfo;

  receive() external payable {
    if (totalDevCount > 0) {
      rewardPerDev += msg.value / totalDevCount;
    } else {
      (bool success, ) = payable(owner()).call{ value: msg.value }('');
      require(success, 'Failed to send Ether to owner');
    }
    emit FundReceived(msg.sender, msg.value);
  }

  function addDev(address user) external onlyOwner {
    require(!isDev[user], 'Already registered');
    isDev[user] = true;
    totalDevCount += 1;
    devInfo[user].rewardDebt = rewardPerDev;
    emit AddDev(user);
  }

  function removeDev(address user) external onlyOwner {
    require(isDev[user], 'Not dev address');
    isDev[user] = false;
    totalDevCount -= 1;
    devInfo[user].pendingRewards += rewardPerDev - devInfo[user].rewardDebt;
    devInfo[user].rewardDebt = rewardPerDev;
    emit RemoveDev(user);
  }

  function claim() external whenNotPaused nonReentrant {
    DevInfo storage info = devInfo[msg.sender];

    uint256 pending = info.pendingRewards + (rewardPerDev - info.rewardDebt);

    if (pending > 0) {
      uint256 claimedAmount = safeRewardTransfer(msg.sender, pending);
      info.pendingRewards = pending - claimedAmount;
      emit Claim(msg.sender, claimedAmount);
    }

    info.rewardDebt = rewardPerDev;
  }

  function pendingRewards(address user) external view returns (uint256) {
    return
      devInfo[user].pendingRewards + (rewardPerDev - devInfo[user].rewardDebt);
  }

  function safeRewardTransfer(
    address to,
    uint256 amount
  ) internal returns (uint256) {
    uint256 _rewardBalance = payable(address(this)).balance;
    if (amount > _rewardBalance) amount = _rewardBalance;
    (bool success, ) = payable(to).call{ value: amount }('');
    require(success, 'Failed to send Reward');
    return amount;
  }
}
