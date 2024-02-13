// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ITokenPool is IERC721 {
    function getTokenAttribute1(uint256 tokenId) external view returns (uint256 claimShare, uint256 breedPotential, uint256 generation, uint256 age);
    function availableForBreeding(uint256 tokenId) external view returns (bool);
    function currentGeneration() external view returns (uint256);
    function setTokenAvailabilityForBreeding(uint256 tokenId, bool available) external;
    function generateTokenData(uint256 tokenId) external;
    function updateTokenData(uint256 tokenId, uint256 newCLaimShare, uint256 newBreedPotential, uint256 newGeneration) external;
    function updateGeneration(uint256 newGeneration) external;
    function advanceGeneration() external;
}

contract TokenPool is ERC721Enumerable, ReentrancyGuard, Ownable, ITokenPool {
    struct TokenData {
        uint256 claimShare;
        uint256 breedPotential;
        uint256 generation;
        uint256 age;
        bool availableForBreeding;
        uint256 currentGeneration;
    }
    uint256 private constant MAX_INDIVIDUAL_CLAIM_SHARE = 5000;
    uint256 public constant MAX_TOKEN = 10000;
    uint256 public currentGeneration = 1;
    mapping(uint256 => TokenData) private nftData;
    mapping(uint256 => bool) public availableForBreeding;
    mapping(uint256 => TokenData) private tokenData;
    mapping(uint256 => uint256) public mintedTokensPerGeneration;

    address private addressOfMintContract;

    constructor() ERC721("Token", "TKN") Ownable(msg.sender) {}

function tokenExists(uint256 tokenId) public view returns (bool) {
    try this.ownerOf(tokenId) returns (address) {
        return true;
    } catch {
        return false;
    }
}

    function setAddressOfMintContract(address _mintContract) external onlyOwner {
        addressOfMintContract = _mintContract;
    }
    function advanceGeneration() external onlyOwner {
        require(msg.sender == addressOfMintContract || msg.sender == owner(), "Unauthorized");
        currentGeneration += 1;
    }
    function updateGeneration(uint256 newGeneration) external {
        require(msg.sender == addressOfMintContract, "Unauthorized");
        currentGeneration = newGeneration;
    }
    function updateTokenData(uint256 tokenId, uint256 newClaimShare, uint256 newBreedPotential, uint256 newGeneration) external override {
    require(tokenExists(tokenId), "TokenPool: tokenId does not exist");
    require(msg.sender == owner() || msg.sender == address(this), "TokenPool: unauthorized");
    require(newClaimShare <= MAX_INDIVIDUAL_CLAIM_SHARE, "Claim share exceeds maximum limit");
    
    TokenData storage data = tokenData[tokenId];
    data.claimShare = newClaimShare;
    data.breedPotential = newBreedPotential;
    data.generation = newGeneration;
}
    function generateTokenData(uint256 tokenId) external onlyOwner {
    uint256 initialClaimShare = calculatePresetClaimShare(tokenId);
    require(
        msg.sender == owner() || msg.sender == addressOfMintContract,
        "Unauthorized"
    );
    require(tokenId <= MAX_TOKEN, "MAX limit reached");
    require(nftData[tokenId].age == 0, "Token data already generated");
    require(
        initialClaimShare <= MAX_INDIVIDUAL_CLAIM_SHARE,
        "Claim share exceeds maximum limit"
    );
    require(
        currentGeneration == currentGeneration,
        "TokenPool: Incorrect generation"
    );

    mintedTokensPerGeneration[currentGeneration] += 1;

    nftData[tokenId] = TokenData({
        claimShare: calculatePresetClaimShare(tokenId) +
            (100 * currentGeneration),
        breedPotential: calculatePresetBreedPotential(tokenId) +
            (2 * currentGeneration),
        generation: currentGeneration,
        age: block.timestamp,
        availableForBreeding: false,
        currentGeneration: currentGeneration
    });
    }

    function calculatePresetClaimShare(uint256 tokenId) private pure returns (uint256) {
        uint256 hash = uint256(keccak256(abi.encodePacked(tokenId)));
        return (hash % 2401) + 100;
    }

    function calculatePresetBreedPotential(uint256 tokenId) private pure returns (uint256) {
        uint256 hash = uint256(keccak256(abi.encodePacked(tokenId, "breedPotential")));
        return (hash % 15) + 2;
    }

    function getTokenAttribute1(uint256 tokenId) external view override returns (uint256 claimShare, uint256 breedPotential, uint256 generation, uint256 age) {
        require(tokenId <= MAX_TOKEN, "Token ID out of bounds");
        TokenData storage data = nftData[tokenId];
        require(data.age != 0, "Token data not generated");
        return (data.claimShare, data.breedPotential, data.generation, data.age);
    }

    function setTokenAvailabilityForBreeding(uint256 tokenId, bool available) external onlyOwner {
        require(tokenId <= MAX_TOKEN, "Token Id out of bounds");
        nftData[tokenId].availableForBreeding = available;
    }
}

