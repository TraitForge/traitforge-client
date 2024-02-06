// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface IMint is IERC721 {
    function someFunction() external;
    function calculateClaimShare(uint256 tokenId) external view returns (uint256);
    function burnToken(uint256 tokenId) external;
    function tokenMintTimeStamp(uint256 tokenid) external view returns (uint256);
}
contract NukeFund is ReentrancyGuard, Ownable {
    IMint public mintContract;
    uint256 public fund;
    mapping(uint256 => uint256) public tokenMaturityTime;

    event Nuked(address indexed owner, uint256 tokenId, uint256 claimAmount);
    event depositEvent(address indexed sender, uint256 amount);
    event withdrawalEvent(address indexed recipient, uint256 amount);
    event FundBalanceUpdated(uint256 newBalance);

    constructor(address _mintContractAddress) Ownable(msg.sender){
        mintContract = IMint(_mintContractAddress);
    }
    function deposit() external payable {
        require(msg.sender == address(mintContract) || msg.sender == owner(), "Unauthorized");
        fund += msg.value;
        emit depositEvent(msg.sender, msg.value);
        emit FundBalanceUpdated(fund);
    }
    function nuke(uint256 tokenId) public nonReentrant {
        require(mintContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        uint256 claimAmount = mintContract.calculateClaimShare(tokenId);
        require(claimAmount <= fund, "Insufficient fund");
        require(block.timestamp >= tokenMaturityTime[tokenId], "Token is not mature yet");
        
        fund -= claimAmount;
        payable(msg.sender).transfer(claimAmount);
        mintContract.burnToken(tokenId);

        emit Nuked(msg.sender, tokenId, claimAmount);
    }
    function withdraw(uint256 amount) public onlyOwner nonReentrant {
        require(amount <= fund, "Insufficient fund");
        fund -= amount;
        payable(owner()).transfer(amount);
        emit withdrawalEvent(owner(),amount);
    }
    function getFundBalance() public view returns (uint256) {
        return fund;
    }
    function canTokenbeNuked(uint256 tokenId) public view returns (bool) {
        uint256 mintTime = mintContract.tokenMintTimeStamp(tokenId);
        require(mintTime > 0, "Token does not exist or mint time not recorded");
        return (block.timestamp>= mintTime + 3 days);
    }
}