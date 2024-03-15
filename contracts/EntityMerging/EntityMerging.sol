// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IEntityMerging.sol";
import "../TraitForgeNft/ITraitForgeNft.sol";

contract EntityMerging is IEntityMerging, ReentrancyGuard, Ownable {
    uint256 private _currentTokenId = 0;

    ITraitForgeNft public nftContract;
    address payable public nukeFundAddress;

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => uint256) forgerListingFee;
    mapping(uint256 => uint8) public breedingCounts; // track breedPotential
    mapping(uint256 => uint256) private lastBreedResetTimestamp;

    constructor(address _traitForgeNft) Ownable(msg.sender) {
        nftContract = ITraitForgeNft(_traitForgeNft);
    }

    // allows the owner to set NukeFund address
    function setNukeFundAddress(
        address payable _nukeFundAddress
    ) external onlyOwner {
        nukeFundAddress = _nukeFundAddress;
    }

    function listForBreeding(uint256 tokenId, uint256 fee) public {
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Caller must own the token"
        );
        _resetBreedingCountIfNeeded(tokenId);
        uint256 entropy = nftContract.getTokenEntropy(tokenId); // Retrieve entropy for tokenId
        uint8 forgePotential = uint8((entropy / 10000) % 10); // Extract the 5th digit from the entropy
        require(
            breedingCounts[tokenId] < forgePotential,
            "Entity has reached its breeding limit"
        );

        bool isSire = (entropy % 3) == 0; // Determine if the token is a forger based on entropy
        require(isSire, "Only forgers can list for breeding");

        listings[tokenId] = Listing(true, fee);
        emit ListedForBreeding(tokenId, fee);
    }

    function breedWithListed(
        uint256 forgerTokenId,
        uint256 mergerTokenId
    ) external payable nonReentrant returns (uint256) {
        require(
            listings[forgerTokenId].isListed,
            "Forger's entity not listed for breeding"
        );
        uint256 breedingFee = listings[forgerTokenId].fee;
        require(msg.value >= breedingFee, "Insufficient fee for breeding");
        _resetBreedingCountIfNeeded(forgerTokenId); // Reset for forger if needed
        _resetBreedingCountIfNeeded(mergerTokenId); // Reset for merger if needed

        // Check forger's breed count increment but do not check forge potential here
        // as it is already checked in listForBreeding for the forger
        breedingCounts[forgerTokenId]++;

        // Check and update for merger token's breed potential
        uint256 mergerEntropy = nftContract.getTokenEntropy(mergerTokenId);
        uint8 mergerForgePotential = uint8((mergerEntropy / 10000) % 10); // Extract the 5th digit from the entropy
        breedingCounts[mergerTokenId]++;
        if (breedingCounts[mergerTokenId] > mergerForgePotential) {
            nftContract.burn(mergerTokenId); // Burn the merger token if exceeded forge potential
            return 0; // Handle the burning case as needed
        }

        uint256 devFee = breedingFee / 10;
        uint256 forgerShare = breedingFee - devFee;
        nukeFundAddress.transfer(devFee); // Transfer dev fee to NukeFund

        address payable forgerOwner = payable(
            nftContract.ownerOf(forgerTokenId)
        );
        forgerOwner.transfer(forgerShare);

        emit FeePaid(forgerTokenId, mergerTokenId, breedingFee);

        return breedingFee;
    }

    function cancelListingForBreeding(uint256 tokenId) public {
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Caller must own the token"
        );
        require(listings[tokenId].isListed, "Token not listed for breeding");
        delete listings[tokenId];
        emit ListedForBreeding(tokenId, 0); // Emitting with 0 fee to denote cancellation
    }

    function _resetBreedingCountIfNeeded(uint256 tokenId) private {
        uint256 oneYear = 365 days;
        if (block.timestamp >= lastBreedResetTimestamp[tokenId] + oneYear) {
            uint256 entropy = nftContract.getTokenEntropy(tokenId);
            uint8 forgePotential = uint8((entropy / 10000) % 10);
            breedingCounts[tokenId] = forgePotential; // Reset to the forge potential
            lastBreedResetTimestamp[tokenId] = block.timestamp;
        }
    }
}
