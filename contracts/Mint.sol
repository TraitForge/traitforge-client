// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "./CustomOwnable.sol";
import "./BreedableToken.sol";

interface IHoneypot {
    function deposit() external payable;
    
}
contract Mint is ERC721, CustomOwnable, ReentrancyGuard {
    enum EntityType { Sire, Breeder }
    uint256 public generation;
    uint256 public activeGeneration =1;
    address breedableTokenAddress; 

    struct Entity {
        EntityType entityType;
        uint256 claimShare; 
        uint256 breedPotential;  
        uint256 birthBlock;
        uint256 lastUpdateBlock;
        uint256 generation;
        uint256 lastBreedPotentialUpdate; 
    }
    IHoneypot public honeypotContract;
    mapping(uint256 => Entity) public entities;
    mapping(uint256 => uint256) public lastNukeTime;
    mapping(uint256 => uint256) public entitiesPerGenerationCount;


    uint256 public constant MAX_ENTITIES = 10000;
    uint256 public mintedCount = 0;
    uint256 public constant START_PRICE = 0.01 ether;
    uint256 public constant PRICE_INCREMENT = 0.01 ether;
    address public honeypotAddress;
    uint256 public totalRaised;
    uint256 public constant annualBlocks = 2400000;

    event AttributesUpdated(uint256 indexed tokenId, uint256 newClaimShare, uint256 newBreedPotential);
    event Entityminted(uint256 indexed tokenId, EntityType entityType, uint256 claimShare, uint256 breedPotential, uint256 generation);
    event AttributesQueried(uint256 indexed tokenId, uint256 currentClaimShare, uint256 currentBreedPotential);
    event TokenBurned(uint256 indexed tokenId);
    event ClaimShareIncreased(uint256 indexed tokenId, uint256 newClaimShare);
    event BreedingOpportunitiesIncreased(uint256 indexed tokenId, uint256 newBreedPotential);
    

    constructor(address _honeypotAddress, address _breedableTokenAddress, address initialOwner) 
        ERC721("Gen1Entity", "G1E") 
        CustomOwnable(initialOwner) 
    {
        honeypotAddress = _honeypotAddress;
        honeypotContract = IHoneypot(_honeypotAddress);
        breedableTokenAddress = _breedableTokenAddress;
    }
    function mint() public payable nonReentrant stopInEmergency {
        uint256 currentPrice = START_PRICE + (mintedCount * PRICE_INCREMENT);
        require(mintedCount < MAX_ENTITIES, "All entities minted");
        require(msg.value >= currentPrice, "Ether sent is not correct");

        uint256 devShare = msg.value / 10;
        uint256 honeypotShare = msg.value - devShare;
        uint256 tokenId = mintedCount + 1;
        uint256 claimShare = randomClaimShare();
        uint256 breedPotential = randomBreedPotential();

        EntityType entityType = mintedCount % 2 == 0 ? EntityType.Sire : EntityType.Breeder;
        entities[tokenId] = Entity(entityType, claimShare, breedPotential, block.number, block.number, generation, block.number);
        entitiesPerGenerationCount[generation]++;

        mintedCount++;
        totalRaised += msg.value;

        payable(owner()).transfer(devShare);
        honeypotContract.deposit{value: honeypotShare}();
    }
    function calculateCurrentAttributes(uint256 tokenId) public returns (uint256 currentClaimShare, uint256 currentBreedPotential) {
        Entity storage entity = entities[tokenId];
        uint256 blocksPassed = block.number - entity.lastUpdateBlock;

        if (blocksPassed > 0) {
            uint256 annualIncrease = blocksPassed * entity.claimShare / 2400000 / 100;
            entity.claimShare += annualIncrease;
            entity.lastUpdateBlock = block.number;
        }
        return (entity.claimShare, entity.breedPotential);
    }
    function someFunction(uint256 tokenId) public {
        calculateCurrentAttributes(tokenId);
    }
    function getCurrentAttributes(uint256 tokenId) public view returns (uint256 currentClaimShare, uint256 currentBreedPotential) {
        Entity memory entity = entities[tokenId];
        uint256 blocksPassed = block.number - entity.lastUpdateBlock;
        uint256 annualIncrease = blocksPassed * entity.claimShare / 2400000 / 100;

        if (blocksPassed > 0 ) {
            uint256 yearFraction = blocksPassed * 100 / annualBlocks;
            uint256 increase = (entity.claimShare * 10 /100 * yearFraction) / 100;
            entity.claimShare += increase;
            entity.lastUpdateBlock = block.number;

        currentClaimShare = entity.claimShare + annualIncrease;
        currentBreedPotential = entity.breedPotential;
        }

        return (currentClaimShare, currentBreedPotential);
    }
    function randomClaimShare() private view returns (uint256) {
        uint256 minClaimShare = 1;
        uint256 maxClaimShare = 2500;
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % (maxClaimShare - minClaimShare);
        return random + minClaimShare;
    }

    function randomBreedPotential() private view returns (uint256) {
        uint256 minBreed = 2;
        uint256 maxBreed = 16;
        uint256 random = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender))) % (maxBreed - minBreed);
        return random + minBreed;
    }
    function advanceGeneration() external {
        require(msg.sender == address(breedableTokenAddress), "Unauthorized");
        activeGeneration++;
    }
    function updateBreedPotential(uint256 tokenId) public {
        Entity storage entity = entities[tokenId];
        uint256 blocksPassed = block.number - entity.lastBreedPotentialUpdate;

        if (blocksPassed >= annualBlocks) {
            uint256 yearsPassed = blocksPassed / annualBlocks;
            entity.breedPotential += 2 * yearsPassed;
            entity.lastBreedPotentialUpdate = block.number;

            emit BreedingOpportunitiesIncreased(tokenId, entity.breedPotential);
        }
    }
    function burnToken(uint256 tokenId) public view {
        address owner = ownerOf(tokenId);
        require(
            _msgSender() == owner ||
            getApproved(tokenId) == _msgSender() ||
            isApprovedForAll(owner, _msgSender()),
            "caller is not owner nor approved"
        );
    }
}
