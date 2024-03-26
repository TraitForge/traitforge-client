// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./INukeFund.sol";
import "../TraitForgeNft/ITraitForgeNft.sol";

contract NukeFund is INukeFund, ReentrancyGuard, Ownable {
    uint256 private fund;
    ITraitForgeNft public nftContract;
    address payable public devAddress;

    // Constructor now properly passes the initial owner address to the Ownable constructor
    constructor(address _traitForgeNft, address payable _devAddress) {
        nftContract = ITraitForgeNft(_traitForgeNft);
        devAddress = _devAddress; // Set the developer's address
    }

    // Fallback function to receive ETH and update fund balance
    receive() external payable {
        uint256 devShare = msg.value / 10; // Calculate developer's share (10%)
        uint256 remainingFund = msg.value - devShare; // Calculate remaining funds to add to the fund

        fund += remainingFund; // Update the fund balance
        devAddress.transfer(devShare); // Transfer dev's share

        emit FundReceived(msg.sender, msg.value); // Log the received funds
        emit DevShareDistributed(devShare);
        emit FundBalanceUpdated(fund); // Update the fund balance
    }

    // Allow the owner to update the reference to the ERC721 contract
    function setTraitForgeNftContract(
        address _traitForgeNft
    ) external onlyOwner {
        nftContract = ITraitForgeNft(_traitForgeNft);
        emit TraitForgeNftAddressUpdated(_traitForgeNft); // Emit an event when the address is updated.
    }

    // View function to see the current balance of the fund
    function getFundBalance() public view returns (uint256) {
        return fund;
    }

    // Calculate the age of a token based on its creation timestamp and current time
    function calculateAge(uint256 tokenId) public view returns (uint256) {
        require(
            nftContract.ownerOf(tokenId) != address(0),
            "Token does not exist"
        );

        uint256 daysOld = (block.timestamp -
            nftContract.getTokenCreationTimestamp(tokenId)) /
            60 /
            60 /
            24;
        uint256 perfomanceFactor = nftContract.getTokenEntropy(tokenId) % 10;

        uint256 age = (daysOld * perfomanceFactor) / 365;
        return age;
    }

    // Calculate the nuke factor of a token, which affects the claimable amount from the fund
    function calculateNukeFactor(
        uint256 tokenId
    ) public view returns (uint256) {
        require(
            nftContract.ownerOf(tokenId) != address(0),
            "ERC721: operator query for nonexistent token"
        );

        uint256 entropy = nftContract.getTokenEntropy(tokenId); // Corrected line
        // Assume this is stored within NukeFund or accessible somehow
        // Use getTokenAge from the ERC721 contract (ICustomERC721) to get the age in seconds
        uint256 ageInSeconds = nftContract.getTokenAge(tokenId);

        uint256 ageInDays = ageInSeconds / (24 * 60 * 60); // convert age from seconds to days
        uint256 initialNukeFactor = entropy / 4; // calcualte initalNukeFactor based on entropy

        uint256 finalNukeFactor = ((ageInDays * 250) / 10000) +
            initialNukeFactor;

        return finalNukeFactor;
    }

    function nuke(uint256 tokenId) public nonReentrant {
        require(nftContract.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(canTokenBeNuked(tokenId), "Token is not mature yet");

        uint256 finalNukeFactor = calculateNukeFactor(tokenId);
        uint256 potentialClaimAmount = (fund * finalNukeFactor) / 100000; // Calculate the potential claim amount based on the finalNukeFactor
        uint256 maxAllowedClaimAmount = fund / 2; // Define a maximum allowed claim amount as 50% of the current fund size

        // Directly assign the value to claimAmount based on the condition, removing the redeclaration
        uint256 claimAmount = finalNukeFactor > 50000
            ? maxAllowedClaimAmount
            : potentialClaimAmount;

        fund -= claimAmount; // Deduct the claim amount from the fund
        payable(msg.sender).transfer(claimAmount); // Transfer the claim amount to the player

        nftContract.burn(tokenId); // Burn the token

        emit Nuked(msg.sender, tokenId, claimAmount); // Emit the event with the actual claim amount
        emit FundBalanceUpdated(fund); // Update the fund balance
    }

    function canTokenBeNuked(uint256 tokenId) public view returns (bool) {
        // Ensure the token exists
        require(
            nftContract.ownerOf(tokenId) != address(0),
            "ERC721: operator query for nonexistent token"
        );
        // Get the age of the token in seconds from the ERC721 contract
        uint256 tokenAgeInSeconds = nftContract.getTokenAge(tokenId);
        // Assuming tokenAgeInSeconds is the age of the token since its creation, check if it's at least 3 days old
        return tokenAgeInSeconds >= 3 days;
    }
}