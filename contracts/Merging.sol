// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EntiityMerging is ERC721URIStorage, Ownable {
    uint256 private _currentTokenId = 0;

    struct Listing {
        uint256 entropy;
        bool isListed;
        uint fee;
    }

    address public customERC721Address;

    mapping(uint256 => Listings) public listings;
    mapping(uint256 => uint256) forgerListingFee;

    event ListedForBreeding(uint256 tokenId, uint256 fee);
    event EntityMerged(uint256 indexed newTokenid, uint256 parent1Id, uint256 parent2Id, uint256 newEntropy);

    constructor() ERC721("Entity", "ENT") {
    customERC721Address = _customERC721Address;
    }
    
    function listForBreeding(uint256 tokenId, uint256 fee) public {
    // This example assumes there's a mapping that tracks roles based on token ID
    // uint256 role = roles[tokenId];
    // require(role == FORGER_ROLE, "Only forgers can list for breeding");

    // Alternatively, if you encode the role in the token ID or another on-chain accessible attribute
    uint256 roleIndicator = tokenId % 3; // Example rule, adjust based on your encoding
    require(roleIndicator == 0, "Only forgers can list for breeding");

    require(ownerOf(tokenId) == msg.sender, "Caller must own the token");

    listings[tokenId] = Listing(true, fee);
    emit ListedForBreeding(tokenId, fee);
}

    function getListingDetails(uint256 tokenId) external view returns (bool, uint256) {
        Listing memory listing = listings[tokenId];
        return (listing.isListed, listing.fee);
    }

    function cancelListingForBreeding(uint256 tokenId) public {

    }

    function setCustomERC721Address(address _customERC721Address) external onlyOwner {
        customERC721Address = _customERC721Address;
    }


}