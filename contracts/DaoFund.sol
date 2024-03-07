// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./CustomERC721.sol";

contract DAOFund is Ownable, ReentrancyGuard  {
string public constant name = "TraitForge";
string public constant symbol = "TFG";
IERC20 public token;

uint256 public totalEntropy;
uint256 public constant TOTAL_SUPPLY = 1e9 * 1e18;
uint256 public constant AIRDROP_AMOUNT = TOTAL_SUPPLY * 40 / 100;
uint256 public constant DEV_AMOUNT = TOTAL_SUPPLY * 40 /100;
uint256 public constant INVESTORS_AMOUNT = TOTAL_SUPPLY * 20 / 100;
uint256 public constant AirdropShare = TOTAL_SUPPLY * 40 / 100;
bool public airdropStarted = false;

address[] public developers; // You need to populate this with developer addresses
address[] public investors; // You need to populate this with investor addresses
address public developersMultisig;
uint256 public airdropped = 0; 

mapping(address => uint256) public totalEntropyByAddress;
mapping(address => bool) public addressMinted;

event TokensDistributed(address recipient, uint256 amount);
event TokenAddressUpdated(address tokenAddress);

constructor(address tokenAddress) Ownable(msg.sender) { // Pass the deploying address as the initial owner
        require(tokenAddress != address(0), "Token address cannot be zero");
        token = IERC20(tokenAddress);
    }

function setTokenAddress(address _tokenAddress) external onlyOwner {
    token = IERC20(_tokenAddress);
    emit TokenAddressUpdated(_tokenAddress); // Emit an event when the address is updated.
}


function startAirdrop() external onlyOwner {
    airdropStarted = true;
}

function updateEntropyForAddress(uint256 _totalEntropy) external onlyOwner {
        totalEntropy = _totalEntropy;
}

function setDevelopersMultisig(address _multisig) public onlyOwner {
    require(airdropStarted, "Airdrop has not started");
    require(_multisig != address(0), "Invalid address");
    developersMultisig = _multisig;
}

function distributeTokens() external onlyOwner {
    require(airdropStarted, "Airdrop has not started");
    uint256 totalRequired = DEV_AMOUNT + (INVESTORS_AMOUNT);
    require(token.balanceOf(address(this)) >= totalRequired, "Insufficient tokens for distribution");

    require(developersMultisig != address(0), "Multisig address not set");
    token.transfer(developersMultisig, DEV_AMOUNT);

    uint256 amountPerInvestor = INVESTORS_AMOUNT / investors.length;
    for(uint i = 0; i < investors.length; i++) {
        token.transfer(investors[i], amountPerInvestor);

    emit TokensDistributed(developersMultisig, DEV_AMOUNT);
    emit TokensDistributed(investors[i], amountPerInvestor);
    }
}

function distributeAirdropToAddress(address recipient) external onlyOwner nonReentrant {
    require(totalEntropy > 0, "Total entropy not set");
    uint256 recipientEntropy = totalEntropyByAddress[recipient];
    require(recipientEntropy > 0, "Recipient has no entropy");
    uint256 recipientTokens = (recipientEntropy * AIRDROP_AMOUNT) / totalEntropy;
    // Ensure there are enough tokens for distribution
    require(token.balanceOf(address(this)) >= recipientTokens, "Infufficient tokens for distribution");
    // Transfer tokens to the recipient
    token.transfer(recipient, recipientTokens);
    // Emit an event for the distribution
    emit TokensDistributed(recipient, recipientTokens);

}
} 