// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract DAOFund is Ownable, ReentrancyGuard {
    // constants in the contract
    string public constant name = "TraitForge";
    string public constant symbol = "TFG";
    IERC20 public token;

    uint256 public totalEntropy; // total entropy accumulated by the dao
    // constants for token allcation
    uint256 public constant TOTAL_SUPPLY = 1e9 * 1e18;
    uint256 public constant AIRDROP_AMOUNT = (TOTAL_SUPPLY * 40) / 100;
    uint256 public constant DEV_AMOUNT = (TOTAL_SUPPLY * 40) / 100;
    uint256 public constant INVESTORS_AMOUNT = (TOTAL_SUPPLY * 20) / 100;
    bool public airdropStarted = false; // Flag to indicate if the airdrop has started

    address[] public developers; // need to populate this with developer addresses
    address[] public investors; // need to populate this with investor addresses
    address public developersMultisig;
    uint256 public airdropped = 0;

    mapping(address => uint256) public totalEntropyByAddress;
    mapping(address => bool) public addressMinted;
    mapping(address => uint256) public addressToEntropy;

    event TokensDistributed(address recipient, uint256 amount);
    event TokenAddressUpdated(address tokenAddress);
    event EntropyUpdated(address indexed minter, uint256 entropyValue);

    // staking variables
    uint256 public totalStaked;
    uint256 public lastRewardTime;
    uint256 public rewardPool;
    uint256 public accTokenPerShare;
    uint256 public constant LOCK_UP_PERIOD = 90 days;

    mapping(address => uint256) public stakedBalances;
    mapping(address => uint256) public rewardDebt;
    mapping(address => uint256) public stakeTimestamp;

    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 reward);

    constructor(address tokenAddress) Ownable(msg.sender) {
        require(tokenAddress != address(0), "Token address cannot be zero");
        token = IERC20(tokenAddress);
    }

    // internal function to update the reard pool and calcualte the accumalted tokens per share
    function updatePool() internal {
        if (block.timestamp <= lastRewardTime) {
            return;
        }
        if (totalStaked == 0) {
            lastRewardTime = block.timestamp;
            return;
        }

        uint256 deltaTime = block.timestamp - lastRewardTime;
        uint256 tokenReward = deltaTime * rewardPool; // Simplified, replace with actual reward calculation
        accTokenPerShare += (tokenReward * 1e12) / totalStaked;
        lastRewardTime = block.timestamp;
    }

    function stake(uint256 _amount) external nonReentrant {
        stakeTimestamp[msg.sender] = block.timestamp;
        updatePool();
        token.transferFrom(msg.sender, address(this), _amount);

        //calculate pending rewards
        uint256 pending = (stakedBalances[msg.sender] * accTokenPerShare) /
            1e12 -
            rewardDebt[msg.sender];
        if (pending > 0) {
            token.transfer(msg.sender, pending);
            emit RewardClaimed(msg.sender, pending);
        }

        stakedBalances[msg.sender] += _amount;
        totalStaked += _amount;
        rewardDebt[msg.sender] =
            (stakedBalances[msg.sender] * accTokenPerShare) /
            1e12;

        emit Staked(msg.sender, _amount); // Corrected the typo in event call
    }

    function unstake(uint256 _amount) external nonReentrant {
        require(
            stakedBalances[msg.sender] >= _amount,
            "Unstaking amount exceeds balance"
        ); // Fixed the typo in the require
        require(
            stakedBalances[msg.sender] >= _amount,
            "Unstaking amount exceeds balance"
        );
        require(
            block.timestamp >= stakeTimestamp[msg.sender] + LOCK_UP_PERIOD,
            "Tokens are locked"
        );

        updatePool();
        uint256 pending = (stakedBalances[msg.sender] * accTokenPerShare) /
            1e12 -
            rewardDebt[msg.sender];

        stakedBalances[msg.sender] -= _amount;
        totalStaked -= _amount; // Corrected the typo, changed 'amount' to '_amount'
        rewardDebt[msg.sender] =
            (stakedBalances[msg.sender] * accTokenPerShare) /
            1e12;

        if (pending > 0) {
            token.transfer(msg.sender, pending);
            emit RewardClaimed(msg.sender, pending);
        }

        token.transfer(msg.sender, _amount);
        emit Unstaked(msg.sender, _amount); // Corrected the typo in event call
    }

    // allows the contract owner to update token address
    function setTokenAddress(address _tokenAddress) external onlyOwner {
        token = IERC20(_tokenAddress);
        emit TokenAddressUpdated(_tokenAddress); // Emit an event when the address is updated.
    }

    // function to start AirDrop
    function startAirdrop() external onlyOwner {
        airdropStarted = true;
    }

    // updates the entropy for a given address, can be called by the owner
    function updateEntropyForAddress(
        address minter,
        uint256 entropyValue
    ) external onlyOwner {
        addressToEntropy[minter] = entropyValue;

        emit EntropyUpdated(minter, entropyValue);
    }

    // set the devs mulisig wallet waddress, ensures the airdop has started
    function setDevelopersMultisig(address _multisig) public onlyOwner {
        require(airdropStarted, "Airdrop has not started");
        require(_multisig != address(0), "Invalid address");
        developersMultisig = _multisig;
    }

    // distributes tokens to devs and investors from the allcoated amounts
    function distributeTokens() external onlyOwner {
        require(airdropStarted, "Airdrop has not started");
        uint256 totalRequired = DEV_AMOUNT + (INVESTORS_AMOUNT);
        require(
            token.balanceOf(address(this)) >= totalRequired,
            "Insufficient tokens for distribution"
        );

        require(developersMultisig != address(0), "Multisig address not set");
        token.transfer(developersMultisig, DEV_AMOUNT); // Transfer developers' share

        uint256 amountPerInvestor = INVESTORS_AMOUNT / investors.length;
        for (uint i = 0; i < investors.length; i++) {
            token.transfer(investors[i], amountPerInvestor); // Distribute investors' share evenly

            emit TokensDistributed(developersMultisig, DEV_AMOUNT);
            emit TokensDistributed(investors[i], amountPerInvestor);
        }
    }

    // Distribute airdrop tokens to a specific recipient based on their entropy value
    function distributeAirdropToAddress(
        address recipient
    ) external onlyOwner nonReentrant {
        require(airdropStarted, "Airdrop has not started");
        require(totalEntropy > 0, "Total entropy not set");

        uint256 recipientEntropy = addressToEntropy[recipient];
        require(recipientEntropy > 0, "Recipient has no entropy");

        uint256 totalAirdropAmount = AIRDROP_AMOUNT; // Total tokens allocated for airdrop
        uint256 recipientTokens = (recipientEntropy * totalAirdropAmount) /
            totalEntropy;

        require(
            token.balanceOf(address(this)) >= recipientTokens,
            "Insufficient tokens for distribution"
        );

        token.transfer(recipient, recipientTokens);
        emit TokensDistributed(recipient, recipientTokens);
    }
}
