// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

interface ITokenPool is IERC721 {
    function getTokenAttribute1(uint256 tokenId) external view returns (uint256 claimShare, uint256 breedPotential, uint256 generation, uint256 age);
    function calculateClaimShare(uint256 tokenId) external view returns (uint256);
    function updateTokenAttributes(uint256 tokenId, uint256 newClaimShare, uint256 newBreedPotential, uint256 newGeneration) external;
    function updateTokenData(uint256 tokenId, uint256 newClaimShare, uint256 newBreedPotential, uint256 newGeneration) external;

    function availableForBreeding(uint256 tokenId) external view returns (bool);
    function currentGeneration() external view returns (uint256);
    function setTokenAvailabilityForBreeding(uint256 tokenId, bool available) external;

    function generateTokenData(uint256 tokenId) external;
}

abstract contract TokenPool is ERC721, ReentrancyGuard, Ownable, ITokenPool {
    struct TokenData {
        uint256 claimShare;
        uint256 breedPotential;
        uint256 generation;
        uint256 age;
        bool availableForBreeding;
        uint256 currentGeneration;
    }

    uint256 public constant MAX_TOKEN = 10000;
    uint256 public currentGeneration = 1;
    mapping(uint256 => TokenData) private nftData;
    mapping(uint256 => bool) public availableForBreeding;
    address private addressOfMintContract;

    constructor() ERC721("Token", "TKN") Ownable(msg.sender) {}

    function setAddressOfMintContract(address _mintContract) external onlyOwner {
        addressOfMintContract = _mintContract;
    }

    function updateGeneration(uint256 newGeneration) external {
        require(msg.sender == addressOfMintContract, "Unauthorized");
        currentGeneration = newGeneration;
    }

    function generateTokenData(uint256 tokenId) external onlyOwner {
        require(tokenId <= MAX_TOKEN, "MAX limit reached");
        require(nftData[tokenId].age == 0, "Token data already generated");

        nftData[tokenId] = TokenData({
    claimShare: calculatePresetClaimShare(tokenId) + (100 * currentGeneration),
    breedPotential: calculatePresetBreedPotential(tokenId) + (2 * currentGeneration),
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