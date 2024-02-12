// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "./TokenPool.sol";

contract BreedableToken is ERC721Enumerable, ReentrancyGuard {
    using Address for address payable;
    address payable public devAddress;
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

    constructor(
        string memory name_,
        string memory symbol_,
        address _tokenPoolAddress,
        address payable _devAddress,
        uint256 _breedingFee
    ) ERC721(name_, symbol_) {
        require(_tokenPoolAddress != address(0), "TokenPool address cannot be the zero address");
        require(_devAddress != address(0), "Dev address cannot be the zero address");
        tokenPool = ITokenPool(_tokenPoolAddress);
        _devAddress = _devAddress;
        breedingFee = _breedingFee;
    }
function _selectTokenForBreeding() internal pure returns (uint256) {
    return 0;
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
    SireListing memory listing = sireListing[sireTokenId];

    require(listing.price > 0, "Breeding must have a fee greater than 0");
    require(msg.value >= listing.price, "Insufficient payment");

    uint256 devShare = (msg.value * 5) / 100; // 5% to the developer
    uint256 ownerShare = msg.value - devShare; // Remaining 95% to the sire's owner

    devAddress.sendValue(devShare);

    if(listing.price > 0) {
        require(msg.value >= listing.price, "Insufficient payment");
    }

    require(tokenPool.availableForBreeding(sireTokenId) && tokenPool.availableForBreeding(breederTokenId), "One or both tokens not available for breeding");
    (,,uint256 sireGeneration,) = tokenPool.getTokenAttribute1(sireTokenId);
    (,,uint256 breederGeneration,) = tokenPool.getTokenAttribute1(breederTokenId);
    require(sireGeneration == breederGeneration, "Tokens must be of the same generation to breed");

    uint256 offspringTokenId = _selectTokenForBreeding();
    payable(listing.owner).sendValue(ownerShare);
    emit TokenBred(offspringTokenId, sireTokenId, breederTokenId, msg.sender);
}

function _calculateNewAttributes(uint256 sireTokenId, uint256 breederTokenId) internal view returns (uint256 newClaimShare, uint256 newBreedPotential) {
    (uint256 sireClaimShare, uint256 sireBreedPotential,,) = tokenPool.getTokenAttribute1(sireTokenId);
    
    (uint256 breederClaimShare, uint256 breederBreedPotential,,) = tokenPool.getTokenAttribute1(breederTokenId);

    newClaimShare = (sireClaimShare + breederClaimShare) / 2;
    newBreedPotential = (sireBreedPotential + breederBreedPotential) / 2;

    return (newClaimShare, newBreedPotential);
}
function _updateTokenForNextGeneration(uint256 sireClaimShare, uint256 sireBreedPotential, uint256 breederClaimShare, uint256 breederBreedPotential) internal returns (uint256) {
    uint256 tokenIdToUpdate = _selectTokenForBreeding(); 
    uint256 newClaimShare = (sireClaimShare + breederClaimShare) / 2;
    uint256 newBreedPotential = (sireBreedPotential + breederBreedPotential) / 2;

    // Correctly call currentGeneration() as a function from the tokenPool instance
    uint256 currentGen = tokenPool.currentGeneration();
    // Then use that current generation to calculate the next generation
    uint256 nextGeneration = currentGen + 1;

    // Now call updateTokenData to update the token's information for the next generation
    tokenPool.updateTokenData(tokenIdToUpdate, newClaimShare, newBreedPotential, nextGeneration);
    
    return tokenIdToUpdate;
}
}