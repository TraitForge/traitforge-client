// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./TokenPool.sol";

contract BreedableToken is ReentrancyGuard {
    using Address for address payable;
    uint256 public breedingFee;

    ITokenPool public tokenPool;

    struct SireListing {
        uint256 tokenId;
        uint256 price;
        address owner;
    }

    mapping(uint256 => SireListing) public sireListing;

    event SireListed(uint256 tokenId, uint256 price, address owner);
    event TokenBred(uint256 newTokenid, uint256 parent1, uint256 parent2, address breeder);

    constructor(address _tokenPoolAddress, address payable _devAddress) {
        devAddress = _devAddress;
        tokenPool = ITokenPool(_tokenPoolAddress);
    }

    function listSireListing(uint256 tokenId, uint256 price) external {
        sireListing[tokenId] = SireListing({
            tokenId: tokenId,
            price: price,
            owner: msg.sender
        });
        emit SireListed(tokenId, price, msg.sender);
    }
function breed(uint256 sireTokenId, uint256 breederTokenId) external payable nonReentrant {
        SireListing memory listing = sireListings[sireTokenId];

        require(listing.price > 0, "Breeding must have a fee greater than 0");
        require(msg.vlaue >= listing.price, "Insufficient payment");

        uint256 ownerShare = (msg.value * 95) / 100; // 95% eth to sire
        uint256 devShare = msg.value - ownerShare; // remaning 5% to the devs

        if(listing.price > 0) {
            require(msg.value >= listing.price, "Insufficient payment"); // If there's a listed price for the sire, ensure the payment matches
        }

        require(tokenPool.availableForBreeding(sireTokenId) && tokenPool.availableForBreeding(breederTokenId), "One or both tokens not available for breeding"); // Ensure both tokens are eligible for breeding

        (,,uint256 sireGeneration,) = tokenPool.getTokenAttribute1(sireTokenId); // Perform generation check and other validations as needed
        (,,uint256 breederGeneration,) = tokenPool.getTokenAttribute1(breederTokenId);
        require(sireGeneration == breederGeneration, "Tokens must be of the same generation to breed");

        uint256 offspringTokenId = _selectTokenForBreeding();
        (uint256 newClaimShare, uint256 newBreedPotential) = _calculateNewAttributes(sireTokenId, breederTokenId); // Select an available token for repurposing as offspring

        tokenPool.updateTokenAttributes(offspringTokenId, newClaimShare, newBreedPotential, tokenPool.currentGeneration() + 1); // Update the offspring token with new attributes

        if(listing.price > 0) {
            payable(listing.owner).sendValue(msg.value); // Transfer breeding fee to sire owner if applicable
        }

        tokenPool.setTokenAvailabilityForBreeding(offspringTokenId, false); // Mark the offspring token as unavailable for further breeding if necessary

        emit TokenBred(offspringTokenId, sireTokenId, breederTokenId, msg.sender); // Emit an event for successful breeding
    }



function _updateTokenForNextGeneration(uint256 sireClaimShare, uint256 sireBreedPotential, uint256 breederClaimShare, uint256 breederBreedPotential) internal returns (uint256) {
    uint256 tokenIdToUpdate = _selectTokenForBreeding(); // logic to selected token from pool
    uint256 newClaimShare = (sireClaimShare + breederClaimShare) / 2;
    uint256 newBreedPotential = (sireBreedPotential + breederBreedPotential) / 2;

    tokenPool.updateTokenData(tokenIdToUpdate, newClaimShare, newBreedPotential, tokenPool.currentGeneration() + 1);
    
    return tokenIdToUpdate;
}
function _selecetTokenForBreeding() internal view returns (uint256) {
    return 0;
}

}
