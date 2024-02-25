// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ICustomERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getTokenAge(uint256 tokenId) external view returns (uint256);
    function getTokenCreationTimestamp(uint256 tokenId) external view returns (uint256);
    function getEntropy(uint256 tokenId) external view returns (uint256); 
    function burn(uint256 tokenId) external; 
}

contract NukeFund is ReentrancyGuard {
    uint256 private fund;
    ICustomERC721 public erc721Contract;

    event FundBalanceUpdated(uint256 newBalance);
    event FundReceived(address from, uint256 amount);
    event Nuked(address indexed owner, uint256 tokenId, uint256 nukeAmount);

    constructor(address _erc721Address) {
        erc721Contract = ICustomERC721(_erc721Address);
    }

    receive() external payable {
        fund += msg.value;
        emit FundReceived(msg.sender, msg.value);
        emit FundBalanceUpdated(fund);
    }

    function getFundBalance() public view returns (uint256) {
        return fund;
    }

    function calculateNukeFactor(uint256 tokenId) public view returns (uint256) {
        require(erc721Contract.ownerOf(tokenId) != address(0), "ERC721: operator query for nonexistent token");

        uint256 entropy = erc721Contract.getEntropy(tokenId);
        uint256 ageInSeconds = erc721Contract.getTokenAge(tokenId);
        uint256 ageInDays = ageInSeconds / (24 * 60 * 60);
        uint256 initialNukeFactor = entropy / 4;
        uint256 agingFactor = entropy % 10;
        uint256 finalNukeFactor = ((agingFactor * ageInDays) + initialNukeFactor) / 4;
        uint256 finalNukeFactorBasisPoints = finalNukeFactor * 10000;

        return finalNukeFactorBasisPoints;
    }

    function nuke(uint256 tokenId) public nonReentrant {
        require(erc721Contract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(canTokenBeNuked(tokenId), "Token is not mature yet");

        uint256 nukeFactorBasisPoints = calculateNukeFactor(tokenId);
        uint256 claimAmount = (fund * nukeFactorBasisPoints) / 1000000; 

        fund -= claimAmount;
        payable(msg.sender).transfer(claimAmount);
        erc721Contract.burn(tokenId); 

        emit Nuked(msg.sender, tokenId, claimAmount);
        emit FundBalanceUpdated(fund);
    }

    function canTokenBeNuked(uint256 tokenId) public view returns (bool) {
        uint256 tokenCreationTimestamp = erc721Contract.getTokenCreationTimestamp(tokenId);
        uint256 tokenMintingAge = block.timestamp - tokenCreationTimestamp;
        return tokenMintingAge >= 3 * 86400;
    }

    function setERC721ContractAddress(address _erc721Address) external {
        erc721Contract = ICustomERC721(_erc721Address);
    }
}
