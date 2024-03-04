// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ICustomERC721 {
    function isForger(uint256 tokenId) external view returns (bool);
}

contract EntityMerging is ERC721URIStorage, Ownable {
    uint256 private _currentTokenId = 0;

    struct Listing {
        uint256 entropy;
        bool isListed;
        uint256 fee;
    }

    address public customERC721Address;

    mapping(uint256 => Listing) public listings;
    mapping(uint256 => uint256) forgerListingFee;

    event ListedForBreeding(uint256 tokenId, uint256 fee);
    event EntityMerged(uint256 indexed newTokenid, uint256 parent1Id, uint256 parent2Id, uint256 newEntropy);
    event CancelledListingForBreeding(uint256 tokenId);

    constructor(address _customERC721Address) ERC721("Entity", "ENT") Ownable(msg.sender) {
     customERC721Address = _customERC721Address;
}
    
function listForBreeding(uint256 tokenId, uint256 fee, uint256 entropy) public {
    require(ICustomERC721(customERC721Address).isForger(tokenId), "Only forgers can list for breeding");
    require(ownerOf(tokenId) == msg.sender, "Caller must own the token");

    listings[tokenId] = Listing(entropy, true, fee); // Corrected to match struct order
    emit ListedForBreeding(tokenId, fee);
}

    function getListingDetails(uint256 tokenId) external view returns (bool, uint256) {
        Listing memory listing = listings[tokenId];
        return (listing.isListed, listing.fee);
    }

function cancelListingForBreeding(uint256 tokenId) public {
    require(ownerOf(tokenId) == msg.sender, "Caller must own the token");
    require(listings[tokenId].isListed, "Token is not listed for breeding");

    listings[tokenId].isListed = false;
    emit CancelledListingForBreeding(tokenId); // You might want to declare this event
}

    function setCustomERC721Address(address _customERC721Address) external onlyOwner {
        customERC721Address = _customERC721Address;
    }
}