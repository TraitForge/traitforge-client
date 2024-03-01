// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CustomERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

interface ICustomERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getTokenAge(uint256 tokenId) external view returns (uint256);
    function burn(uint256 tokenId) external;
    function getEntropy(uint256 tokenId) external view returns (uint256); // Add this line
    function getTokenCreationTimestamp(uint256 tokenId) external view returns (uint256);
}

contract NukeFund is ReentrancyGuard {
    uint256 private fund;
    ICustomERC721 public erc721Contract;
    address payable public devAddress;

    event FundBalanceUpdated(uint256 newBalance);
    event FundReceived(address from, uint256 amount);
    event Nuked(address indexed owner, uint256 tokenId, uint256 nukeAmount);
    event DevShareDistributed(uint256 devShare);

constructor(address _erc721Address)     
// Pass the address of the deployed CustomERC721 contract
ReentrancyGuard() 
{
    erc721Contract = ICustomERC721(_erc721Address);
}
function setERC721ContractAddress(address _erc721Address) external {
        erc721Contract = ICustomERC721(_erc721Address);
    }

    receive() external payable {
        uint256 devShare = msg.value / 10;
        uint256 remainingFund = msg.value - devShare;

        fund += remainingFund;
        devAddress.transfer(devShare);

        emit FundReceived(msg.sender, msg.value); // Log the received funds
        emit DevShareDistributed(devShare);
        emit FundBalanceUpdated(fund); // Update the fund balance
    }
    
    function getFundBalance() public view returns (uint256) {
        return fund;
    }

    function calculateNukeFactor(uint256 tokenId) public view returns (uint256) {
    require(erc721Contract.ownerOf(tokenId) != address(0), "ERC721: operator query for nonexistent token");

    uint256 entropy = erc721Contract.getEntropy(tokenId); // Corrected line
 // Assume this is stored within NukeFund or accessible somehow
    // Use getTokenAge from the ERC721 contract (ICustomERC721) to get the age in seconds
    uint256 ageInSeconds = erc721Contract.getTokenAge(tokenId);

    // Example calculation (this needs to be adjusted according to your logic)
    uint256 ageInDays = ageInSeconds / (24 * 60 * 60);
    uint256 initialNukeFactor = entropy / 4; 
    uint256 agingFactor = entropy % 10;
    uint256 finalNukeFactor = ((agingFactor * ageInDays) + initialNukeFactor) / 4;

    // Conversion to basis points
    return finalNukeFactor;
}

function nuke(uint256 tokenId) public nonReentrant {
    require(erc721Contract.ownerOf(tokenId) == msg.sender, "Not the owner");
    require(canTokenBeNuked(tokenId), "Token is not mature yet");
    
    uint256 finalNukeFactor = calculateNukeFactor(tokenId); 
    uint256 potentialClaimAmount = (fund * finalNukeFactor) / 100000; 

    uint256 maxAllowedClaimAmount = fund / 2;
    uint256 claimAmount;

    if (potentialClaimAmount > maxAllowedClaimAmount) { // Cap the claim amount at 50% of the fund if the potential claim amount exceeds the maximum allowed
        claimAmount = maxAllowedClaimAmount;
    } else {
        claimAmount = potentialClaimAmount;
    }

    fund -= claimAmount; // Deduct the claim amount from the fund
    payable(msg.sender).transfer(claimAmount); // Transfer the claim amount to the player 

    erc721Contract.burn(tokenId); // Correctly calls the burn function on the ERC721 contract
 // Burn the token

    emit Nuked(msg.sender, tokenId, claimAmount); // Emit the event with the actual claim amount
    emit FundBalanceUpdated(fund); // Update the fund balance
}

function canTokenBeNuked(uint256 tokenId) public view returns (bool) {
    // Ensure the token exists
    require(erc721Contract.ownerOf(tokenId) != address(0), "ERC721: operator query for nonexistent token");

    // Get the age of the token in seconds from the ERC721 contract
    uint256 tokenAgeInSeconds = erc721Contract.getTokenAge(tokenId);

    // Assuming tokenAgeInSeconds is the age of the token since its creation, check if it's at least 3 days old
    return tokenAgeInSeconds >= 3 days;
}

}