// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './IDAOFund.sol';

contract DAOFund is IDAOFund, Ownable, ReentrancyGuard {
  uint256 public totalAmount;
  uint256 public rewardPerShare;
  mapping(address => UserInfo) public userInfo;

  receive() external payable {
    if (totalAmount > 0) {
      rewardPerShare += msg.value / totalAmount;
    } else {
      payable(owner()).transfer(msg.value);
    }
    emit FundReceived(msg.sender, msg.value);
  }

  function deposit(uint256 amount) external nonReentrant {
    require(amount > 0, 'Invalid amount');

    UserInfo storage user = userInfo[msg.sender];

    user.pendingRewards = rewardPerShare * user.amount - user.rewardDebt;
    user.rewardDebt = rewardPerShare * user.amount;
    user.amount += amount;
    totalAmount += amount;

    emit Deposit(msg.sender, amount);
  }

  function withdraw(uint256 amount) external nonReentrant {
    UserInfo storage user = userInfo[msg.sender];

    require(amount > 0, 'Invalid amount');
    require(user.amount >= amount, 'Invalid amount');

    user.pendingRewards = rewardPerShare * user.amount - user.rewardDebt;
    user.rewardDebt = rewardPerShare * user.amount;
    user.amount -= amount;
    totalAmount -= amount;

    emit Withdraw(msg.sender, amount);
  }

  function claim() external nonReentrant {
    UserInfo storage user = userInfo[msg.sender];

    uint256 pending = user.pendingRewards +
      (rewardPerShare * user.amount - user.rewardDebt);

    if (pending > 0) {
      uint256 claimedAmount = safeRewardTransfer(msg.sender, pending);
      user.pendingRewards = pending - claimedAmount;
      emit Claim(msg.sender, claimedAmount);
    }

    user.rewardDebt = rewardPerShare * user.amount;
  }

  function pendingRewards(address account) external view returns (uint256) {
    UserInfo storage user = userInfo[account];
    return
      user.pendingRewards + (rewardPerShare * user.amount - user.rewardDebt);
  }

  function safeRewardTransfer(
    address to,
    uint256 amount
  ) internal returns (uint256) {
    uint256 _rewardBalance = payable(address(this)).balance;
    if (amount > _rewardBalance) amount = _rewardBalance;
    payable(to).transfer(amount);
    return amount;
  }
}
