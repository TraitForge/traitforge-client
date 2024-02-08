// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
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
    function updateTokenURI(uint256 tokenId, string calldata newTokenURI) external;
    function updateGeneration(uint256 newGeneration) external;
}

contract TokenPool is ERC721URIStorage, ReentrancyGuard, Ownable, ITokenPool {
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
    mapping(uint256 => TokenData) private tokenData;
    address private addressOfMintContract;

    constructor() ERC721("Token", "TKN") Ownable(msg.sender) {}

    function updateTokenURI(uint256 tokenId, string calldata newTokenURI) external override {
        require(tokenExists(tokenId), "TokenPool: URI set of nonexistent token");
        require(ownerOf(tokenId) == msg.sender || owner() == msg.sender, "TokenPool: caller is not token owner nor contract owner");

        _setTokenURI(tokenId, newTokenURI);
    }

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

    function updateGeneration(uint256 newGeneration) external {
        require(msg.sender == addressOfMintContract, "Unauthorized");
        currentGeneration = newGeneration;
    }
    function updateTokenData(uint256 tokenId, uint256 newClaimShare, uint256 newBreedPotential, uint256 newGeneration) external override {
    require(tokenExists(tokenId), "TokenPool: tokenId does not exist");
    require(msg.sender == owner() || msg.sender == address(this), "TokenPool: unauthorized");
    
    TokenData storage data = tokenData[tokenId];
    data.claimShare = newClaimShare;
    data.breedPotential = newBreedPotential;
    data.generation = newGeneration;
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
