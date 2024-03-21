// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CustomERC721.sol";

contract EntityMerging is CustomERC721, IEntityMerging {
    IEntityMerging private entityMergingContract;
    uint256 private _currentTokenId = 0;

    struct Listing {
        bool isListed;
        uint fee;
    }

    address public customERC721ContractAddress;

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => uint256) forgerListingFee;
    mapping(uint256 => uint8) public breedingCounts; // track breedPotential
    mapping(uint256 => uint256) private lastBreedResetTimestamp;

    event ListedForBreeding(uint256 tokenId, uint256 fee);
    event EntityMerged(
        uint256 indexed newTokenid,
        uint256 parent1Id,
        uint256 parent2Id,
        uint256 newEntropy
    );
    event CancelledListingForBreeding(uint256 tokenId);
    event FeePaid(
        uint256 forgerTokenId,
        uint256 mergerTokenId,
        uint256 feePaid
    );

    constructor(
        address initialOwner,
        address payable nukeFundAddress,
        address entropyGeneratorAddress
    ) CustomERC721(initialOwner, nukeFundAddress, entropyGeneratorAddress) {}

    function setMergingContract(address _mergingContract) external onlyOwner {
        entityMergingContract = IEntityMerging(_mergingContract);
    }

    function listForBreeding(uint256 tokenId, uint256 fee) public {
        require(ownerOf(tokenId) == msg.sender, "Caller must own the token");
        _resetBreedingCountIfNeeded(tokenId);
        uint256 entropy = tokenEntropy[tokenId]; // Retrieve entropy for tokenId
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
        uint256 mergerEntropy = tokenEntropy[mergerTokenId];
        uint8 mergerForgePotential = uint8((mergerEntropy / 10000) % 10); // Extract the 5th digit from the entropy
        breedingCounts[mergerTokenId]++;
        if (breedingCounts[mergerTokenId] > mergerForgePotential) {
            _burn(mergerTokenId); // Burn the merger token if exceeded forge potential
            return 0; // Handle the burning case as needed
        }

        uint256 devFee = breedingFee / 10;
        uint256 forgerShare = breedingFee - devFee;
        nukeFundAddress.transfer(devFee); // Transfer dev fee to NukeFund

        address payable forgerOwner = payable(ownerOf(forgerTokenId));
        forgerOwner.transfer(forgerShare);

        emit FeePaid(forgerTokenId, mergerTokenId, breedingFee);

        return breedingFee;
    }

    function getEntropiesForTokens(
        uint256 forgerTokenId,
        uint256 mergerTokenId
    )
        public
        view
        override
        returns (uint256 forgerEntropy, uint256 mergerEntropy)
    {
        forgerEntropy = tokenEntropy[forgerTokenId];
        mergerEntropy = tokenEntropy[mergerTokenId];
    }

    function cancelListingForBreeding(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Caller must own the token");
        require(listings[tokenId].isListed, "Token not listed for breeding");
        delete listings[tokenId];
        emit ListedForBreeding(tokenId, 0); // Emitting with 0 fee to denote cancellation
    }

    function _resetBreedingCountIfNeeded(uint256 tokenId) private {
        uint256 oneYear = 365 days;
        if (block.timestamp >= lastBreedResetTimestamp[tokenId] + oneYear) {
            uint256 entropy = tokenEntropy[tokenId];
            uint8 forgePotential = uint8((entropy / 10000) % 10);
            breedingCounts[tokenId] = forgePotential; // Reset to the forge potential
            lastBreedResetTimestamp[tokenId] = block.timestamp;
        }
    }
}
