// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "./CustomOwnable.sol";
import "./Mint.sol";
interface INukeFund {
    function deposit() external payable;
}
contract BreedableToken is ERC721Enumerable, ReentrancyGuard, CustomOwnable {
    enum EntityType { Sire, Breeder }
    struct Entity {
        EntityType entityType;
        uint256 claimShare;
        uint256 breedPotential;
        uint256 birthBlock;
        uint256 generation;
    }
    INukeFund public nukeFundContract;
    address public mintContractAddress;

    mapping(uint256 => Entity) public entities;
    mapping(uint256 => uint8) public breedCount;
    mapping(uint256 => uint256) public tokenBreedingFees;
    mapping(uint256 => uint256) public generationMintedCount;
    uint256 public listingFee; 
    uint256 public breedingFee;
    uint256 private tokenIdCounter;

    event NewEntityBorn(uint256 tokenId, uint256 generation);
    event EntityDied(uint256 tokenId);
    event EntityUpdated(uint256 tokenId, uint256 newClaimShare, uint256 newBreedPotential);
    event Breed(uint256 indexed sireTokenId, uint256 indexed breederToken, uint256 newEntityId);
    event EntityTransfer(uint256 indexed tokenId, address from, address to);
    event FeeUpdated(string feeType, uint256 newFeeAmount);
    event EntityOwnershipChanged(uint256 indexed tokenId, address newOwner);
    event BreedingFeeUpdated(uint256 indexed tokenId, uint256 newFee);

    constructor(
        string memory  name,
        string memory symbol,
        address _nukeFundContract,
        address initialOwner
    )
    ERC721(name, symbol) 
        CustomOwnable(initialOwner)
    {
     tokenIdCounter = 0;
     nukeFundContract = INukeFund(_nukeFundContract);
    }

    function createEntity(uint256 tokenId, EntityType entityType, uint256 claimShare, uint256 breedPotential, uint256 generation) internal returns (uint256) {
    entities[tokenId] = Entity(entityType, claimShare, breedPotential, block.number, generation);
    breedCount[tokenId] = 0;
    _mint(msg.sender, tokenId);

    tokenIdCounter++;
    return tokenId;
}

    function breed(uint256 sireTokenId, uint256 breederTokenId) public payable stopInEmergency {
        require(msg.value == breedingFee, "Incorrect breeding fee");
        require(entities[sireTokenId].entityType == EntityType.Sire, "Not a sire");
        require(entities[breederTokenId].entityType == EntityType.Breeder, "Not a breeder");
        require(breedCount[sireTokenId] < entities[sireTokenId].breedPotential, "Sire breed potential reached");
        require(breedCount[breederTokenId] < entities[breederTokenId].breedPotential, "Breeder breed potential reached");
        require(entities[sireTokenId].generation == entities[breederTokenId].generation, "Tokens must be the same generation");
        uint256 newGeneration = max(entities[sireTokenId].generation, entities[breederTokenId].generation) + 1;
        require(generationMintedCount[newGeneration] < 10000, "Generation cap reached");

        uint256 newClaimShare = (entities[sireTokenId].claimShare + entities[breederTokenId].claimShare) / 2;
        uint256 newBreedPotential = (entities[sireTokenId].breedPotential + entities[breederTokenId].breedPotential) / 2;
        uint256 devShare = msg.value * 10 / 100;
        uint256 nukeFundShare = msg.value * 10 / 100;
        uint256 sireBreederShare = msg.value - (devShare + nukeFundShare);
        
        address sireOwner = ownerOf(sireTokenId);
        require(sireOwner != address(0), "Sire owner is invalid");
        payable(sireOwner).transfer(sireBreederShare);
        payable(owner()).transfer(devShare);
        nukeFundContract.deposit{value: nukeFundShare}();
        payable(msg.sender).transfer(sireBreederShare);

        breedCount[sireTokenId]++;
        breedCount[breederTokenId]++;
        generationMintedCount[newGeneration]++;

        if (breedCount[breederTokenId] >= entities[breederTokenId].breedPotential) {
            _burn(breederTokenId);
            emit EntityDied(breederTokenId);

        uint256 newTokenId = createEntity(tokenIdCounter, EntityType.Breeder, newClaimShare, newBreedPotential, newGeneration);
        emit NewEntityBorn(newTokenId, newGeneration);
        if (generationMintedCount[newGeneration] >= 10000) {
            Mint(mintContractAddress).advanceGeneration();
        }
    }
    }

    function setBreedingFee(uint256 tokenId, uint256 fee) public {
        require(ownerOf(tokenId) == msg.sender, "Only token owner can set breeding fee");
        require(fee > 0, "Fee must be greater than 0");
        tokenBreedingFees[tokenId] = fee;
        emit BreedingFeeUpdated(tokenId, fee);
    }

    function max(uint256 a, uint256 b) private pure returns (uint256) {
        return a > b ? a : b;
    }
}