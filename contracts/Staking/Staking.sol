// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Staking is Ownable, ReentrancyGuard {
    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 pendingRewards;
        uint256 lastAction;
    }

    uint256 public constant CONST_MULTIPLIER = 1e20;

    IERC20 public stakeToken;
    IERC20 public rewardToken;
    uint256 public rewardPerBlock;
    uint256 public lockupDuration;
    uint256 public lastRewardBlock;
    uint256 public accTokenPerShare;
    uint256 public depositedAmount;

    mapping(address => UserInfo) public userInfo;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event EmergencyWithdraw(address indexed user, uint256 amount);
    event Claim(address indexed user, uint256 amount);

    constructor(
        address _stakeToken,
        address _rewardToken,
        uint256 _rewardPerBlock,
        uint256 _lockupDuration
    ) Ownable(msg.sender) {
        require(_stakeToken != address(0), "Token address cannot be zero");
        require(_rewardToken != address(0), "Token address cannot be zero");
        stakeToken = IERC20(_stakeToken);
        rewardToken = IERC20(_rewardToken);
        rewardPerBlock = _rewardPerBlock;
        lockupDuration = _lockupDuration;
        lastRewardBlock = block.number;
    }

    receive() external payable {}

    function pendingRewards(address _user) external view returns (uint256) {
        UserInfo storage user = userInfo[_user];
        uint256 _accTokenPerShare = accTokenPerShare;
        if (block.number > lastRewardBlock && depositedAmount != 0) {
            uint256 multiplier = block.number - (lastRewardBlock);
            uint256 tokenReward = multiplier * (rewardPerBlock);
            _accTokenPerShare =
                _accTokenPerShare +
                (tokenReward * CONST_MULTIPLIER) /
                depositedAmount;
        }
        return
            (user.amount * accTokenPerShare) /
            CONST_MULTIPLIER -
            user.rewardDebt +
            user.pendingRewards;
    }

    function deposit(uint256 amount) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];

        _updatePool();

        if (user.amount > 0) {
            uint256 pending = (user.amount * accTokenPerShare) /
                CONST_MULTIPLIER -
                user.rewardDebt;

            if (pending > 0) {
                user.pendingRewards = user.pendingRewards + pending;
            }
        }

        if (amount > 0) {
            stakeToken.transferFrom(msg.sender, address(this), amount);

            user.amount = user.amount + amount;
            depositedAmount = depositedAmount + amount;
        }

        user.rewardDebt = (user.amount * accTokenPerShare) / CONST_MULTIPLIER;
        user.lastAction = block.timestamp;

        emit Deposit(msg.sender, amount);
    }

    function withdraw(uint256 amount) external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];

        require(user.amount >= amount, "Withdrawing more than you have!");
        require(
            user.lastAction + lockupDuration <= block.timestamp,
            "You cannot withdraw yet!"
        );

        _updatePool();

        uint256 pending = (user.amount * accTokenPerShare) /
            CONST_MULTIPLIER -
            user.rewardDebt;

        if (pending > 0) {
            user.pendingRewards = user.pendingRewards + pending;
        }

        if (amount > 0) {
            user.amount = user.amount - amount;
            depositedAmount = depositedAmount - amount;
            stakeToken.transfer(msg.sender, amount);
        }

        user.rewardDebt = (user.amount * accTokenPerShare) / CONST_MULTIPLIER;
        user.lastAction = block.timestamp;

        emit Withdraw(msg.sender, amount);
    }

    // User withdraw without claiming rewards
    function emergencyWithdraw() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];

        _updatePool();

        if (user.amount > 0) {
            depositedAmount = depositedAmount - user.amount;
            stakeToken.transfer(msg.sender, user.amount);
        }

        user.pendingRewards = 0;
        user.rewardDebt = 0;
        user.amount = 0;
        user.lastAction = block.timestamp;

        emit EmergencyWithdraw(msg.sender, user.amount);
    }

    function claim() external nonReentrant {
        UserInfo storage user = userInfo[msg.sender];

        _updatePool();

        uint256 pending = (user.amount * accTokenPerShare) /
            CONST_MULTIPLIER -
            user.rewardDebt;

        if (pending > 0 || user.pendingRewards > 0) {
            user.pendingRewards = user.pendingRewards + pending;
            uint256 claimedAmount = safeRewardTransfer(
                rewardToken,
                msg.sender,
                user.pendingRewards
            );
            user.pendingRewards = user.pendingRewards - claimedAmount;
            emit Claim(msg.sender, claimedAmount);
        }

        user.rewardDebt = (user.amount * accTokenPerShare) / CONST_MULTIPLIER;
    }

    function ownerWithdraw(
        IERC20 token,
        uint256 _amount
    ) external onlyOwner nonReentrant {
        uint256 _bal = token.balanceOf(address(this));
        if (_amount > _bal) _amount = _bal;

        token.transfer(_msgSender(), _amount);
    }

    function safeRewardTransfer(
        IERC20 token,
        address to,
        uint256 amount
    ) internal returns (uint256) {
        uint256 _rewardBalance = token.balanceOf(address(this));
        if (amount > _rewardBalance) amount = _rewardBalance;
        token.transfer(to, amount);
        return amount;
    }

    function _updatePool() internal {
        if (depositedAmount == 0) {
            lastRewardBlock = block.number;
            return;
        }

        uint256 multiplier = block.number - lastRewardBlock;
        uint256 tokenReward = multiplier * rewardPerBlock;
        accTokenPerShare =
            accTokenPerShare +
            (tokenReward * CONST_MULTIPLIER) /
            depositedAmount;
        lastRewardBlock = block.number;
    }
}
