// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CustomERC721.sol";

// Interface to interact with the CustomERC721 contract
interface ICustomERC721 {
    function ownerOf(uint256 tokenId) external view returns (address);
    function getTokenAge(uint256 tokenId) external view returns (uint256);
    function burn(uint256 tokenId) external;
    function getEntropy(uint256 tokenId) external view returns (uint256); // Add this line
    function getTokenCreationTimestamp(uint256 tokenId) external view returns (uint256);
}

contract NukeFund is ReentrancyGuard, Ownable {
    uint256 private fund;
    ICustomERC721 public erc721Contract;
    address payable public devAddress;

    // Constructor now properly passes the initial owner address to the Ownable constructor
    constructor(address _erc721Address, address payable _devAddress) Ownable(_devAddress) {
        erc721Contract = ICustomERC721(_erc721Address);
        devAddress = _devAddress; // Set the developer's address
    }
    // Events for logging contract activities
    event FundBalanceUpdated(uint256 newBalance);
    event FundReceived(address from, uint256 amount);
    event Nuked(address indexed owner, uint256 tokenId, uint256 nukeAmount);
    event DevShareDistributed(uint256 devShare);
    event ERC721ContractAddressUpdated(address indexed newAddress);

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
    function setERC721ContractAddress(address _erc721Address) external onlyOwner {
        erc721Contract = ICustomERC721(_erc721Address);
        emit ERC721ContractAddressUpdated(_erc721Address); // Emit an event when the address is updated.
    }

    // View function to see the current balance of the fund
    function getFundBalance() public view returns (uint256) {
        return fund;
    }

    // Calculate the age of a token based on its creation timestamp and current time
    function calculateAge(uint256 tokenId) public view returns (uint256) {
        require(erc721Contract.ownerOf(tokenId) != address(0), "Token does not exist");

        uint256 daysOld = (block.timestamp - erc721Contract.getTokenCreationTimestamp(tokenId)) / 60 / 60 / 24; 
        uint256 perfomanceFactor = erc721Contract.getEntropy(tokenId) % 10;

        uint256 age = (daysOld * perfomanceFactor) / 365;
        return age;
    }

    // Calculate the nuke factor of a token, which affects the claimable amount from the fund
    function calculateNukeFactor(uint256 tokenId) public view returns (uint256) {
    require(erc721Contract.ownerOf(tokenId) != address(0), "ERC721: operator query for nonexistent token");

    uint256 entropy = erc721Contract.getEntropy(tokenId); // Corrected line
    // Assume this is stored within NukeFund or accessible somehow
    // Use getTokenAge from the ERC721 contract (ICustomERC721) to get the age in seconds
    uint256 ageInSeconds = erc721Contract.getTokenAge(tokenId);

    uint256 ageInDays = ageInSeconds / (24 * 60 * 60); // convert age from seconds to days 
    uint256 initialNukeFactor = entropy / 4; // calcualte initalNukeFactor based on entropy 

    uint256 finalNukeFactor = ((ageInDays * 250) / 10000) + initialNukeFactor; 

    return finalNukeFactor;
}

function nuke(uint256 tokenId) public nonReentrant {
    require(erc721Contract.ownerOf(tokenId) == msg.sender, "Not the owner");
    require(canTokenBeNuked(tokenId), "Token is not mature yet");
    
    uint256 finalNukeFactor = calculateNukeFactor(tokenId); 
    uint256 potentialClaimAmount = (fund * finalNukeFactor) / 100000; // Calculate the potential claim amount based on the finalNukeFactor
    uint256 maxAllowedClaimAmount = fund / 2; // Define a maximum allowed claim amount as 50% of the current fund size

    // Directly assign the value to claimAmount based on the condition, removing the redeclaration
    uint256 claimAmount = finalNukeFactor > 50000 ? maxAllowedClaimAmount : potentialClaimAmount;

    fund -= claimAmount; // Deduct the claim amount from the fund
    payable(msg.sender).transfer(claimAmount); // Transfer the claim amount to the player 

    erc721Contract.burn(tokenId); // Burn the token

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