// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IEntityMerging {
    struct Listing {
        bool isListed;
        uint fee;
    }

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

    // allows the owner to set NukeFund address
    function setNukeFundAddress(address payable _nukeFundAddress) external;

    function listForBreeding(uint256 tokenId, uint256 fee) external;

    function breedWithListed(
        uint256 forgerTokenId,
        uint256 mergerTokenId
    ) external payable returns (uint256);

    function cancelListingForBreeding(uint256 tokenId) external;
}