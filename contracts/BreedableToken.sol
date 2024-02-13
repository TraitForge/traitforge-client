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
    require(tokenPool.availableForBreeding(sireTokenId) && tokenPool.availableForBreeding(breederTokenId), "One or both tokens not available for breeding");
    SireListing memory listing = sireListing[sireTokenId];
    require(listing.price > 0 && msg.value >= listing.price, "Breeding requirements not met");
    
    // Use token IDs to calculate new attributes for the offspring
    (uint256 newClaimShare, uint256 newBreedPotential) = _calculateNewAttributes(sireTokenId, breederTokenId);

    // Fetch the generation of the sire to determine the generation of the offspring
    (,,uint256 sireGeneration,) = tokenPool.getTokenAttribute1(sireTokenId);
    uint256 offspringGeneration = sireGeneration + 1; // Offspring is the next generation

    // Mint a new token for the offspring
    uint256 newTokenId = totalSupply() + 1; // Assuming sequential token IDs
    _mint(msg.sender, newTokenId); // Mint the new token to the caller

    // Update the offspring's attributes in the TokenPool
    tokenPool.updateTokenData(newTokenId, newClaimShare, newBreedPotential, offspringGeneration);

    // Distribute the breeding fee between the developer and the sire's owner
    _distributeBreedingFees(msg.value, sireTokenId);

    // Emit an event to log the breeding action
    emit TokenBred(newTokenId, sireTokenId, breederTokenId, msg.sender);
}
function _distributeBreedingFees(uint256 listingPrice, uint256 sireTokenId) private {
    uint256 devShare = (listingPrice * 5) / 100; // 5% to the developer
    uint256 ownerShare = listingPrice - devShare; // Remaining 95% to the sire's owner

    payable(devAddress).transfer(devShare);
    address sireOwner = tokenPool.ownerOf(sireTokenId);
    payable(sireOwner).transfer(ownerShare);
}

function _calculateNewAttributes(uint256 sireTokenId, uint256 breederTokenId) internal view returns (uint256 newClaimShare, uint256 newBreedPotential) {
    (uint256 sireClaimShare, uint256 sireBreedPotential,,) = tokenPool.getTokenAttribute1(sireTokenId);
    (uint256 breederClaimShare, uint256 breederBreedPotential,,) = tokenPool.getTokenAttribute1(breederTokenId);

    newClaimShare = (sireClaimShare + breederClaimShare) / 2;
    newBreedPotential = (sireBreedPotential + breederBreedPotential) / 2;

    return (newClaimShare, newBreedPotential);
}

}