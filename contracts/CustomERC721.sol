// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./Ownable.sol"; 
import "./EntropyGenerator.sol";

interface IEntropyGenerator {
    function getNextEntropy() external returns (uint256);
}

contract CustomERC721 is ERC721URIStorage, ReentrancyGuard, Ownable {
    uint256 private _tokenIdCounter;

    IEntropyGenerator private entropyGenerator;

    address payable public nukeFundAddress;
    address payable public devAddress;

    uint256 public constant MAX_TOKENS_PER_GEN = 10000;
    uint256 public constant START_PRICE = 0.01 ether;
    uint256 public constant PRICE_INCREMENT = 0.01 ether;
    uint256 public currentGeneration = 1;
    uint256 public mintedCount = 0;

    mapping(uint256 => uint256) public tokenCreationTimestamps;
    mapping(uint256 => uint256) public tokenEntropy;

    event Minted(address indexed minter, uint256 indexed itemId, uint256 entropyValue);
    event GenerationIncremented(uint256 newGeneration);

    constructor(
        address initialOwner,
        address payable _nukeFundAddress,
        address payable _devAddress,
        address _entropyGeneratorAddress
    ) ERC721("CustomERC721", "C721") Ownable(initialOwner) {
        nukeFundAddress = _nukeFundAddress;
        devAddress = _devAddress;
        entropyGenerator = IEntropyGenerator(_entropyGeneratorAddress);
    }

    function incrementGeneration() public onlyOwner {
        require(mintedCount >= MAX_TOKENS_PER_GEN, "Generation limit not yet reached");
        currentGeneration++;
        mintedCount = 0;
        emit GenerationIncremented(currentGeneration);
    }

    function getEntropy(uint256 tokenId) public view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "ERC721: query for nonexistent token");
        return tokenEntropy[tokenId];
    }

    function getTokenAge(uint256 tokenId) public view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "ERC721: query for nonexistent token");
        return block.timestamp - tokenCreationTimestamps[tokenId];
    }

    function calculateMintPrice() public view returns (uint256) {
        uint256 priceIncrease = PRICE_INCREMENT * mintedCount;
        uint256 price = START_PRICE + priceIncrease;
        return price;
    }

   function mintToken(address to, string memory baseTokenURI) public payable nonReentrant {
    uint256 currentMintPrice = calculateMintPrice();
    require(msg.value >= currentMintPrice, "Insufficient ETH sent; transaction reverted.");
    require(mintedCount < MAX_TOKENS_PER_GEN, "Current generation is full. Wait for next generation.");

    uint256 entropyValue = entropyGenerator.getNextEntropy();
    // Correctly increment _tokenIdCounter before using it for the new item ID.
    _tokenIdCounter += 1;
    uint256 newItemId = _tokenIdCounter;

    string memory finalTokenURI = string(abi.encodePacked(baseTokenURI, Strings.toString(newItemId), ".json"));
    _mint(to, newItemId);
    _setTokenURI(newItemId, finalTokenURI);

    tokenCreationTimestamps[newItemId] = block.timestamp;
    tokenEntropy[newItemId] = entropyValue;
    mintedCount++;

    distributeFunds(msg.value);

    emit Minted(to, newItemId, entropyValue);
}

    function distributeFunds(uint256 totalAmount) private {
        uint256 nukeFundShare = (totalAmount * 90) / 100;
        uint256 devShare = totalAmount - nukeFundShare;
        
        nukeFundAddress.transfer(nukeFundShare);
        devAddress.transfer(devShare);
    }

    function getTokenCreationTimestamp(uint256 tokenId) public view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "ERC721: query for nonexistent token");
        return tokenCreationTimestamps[tokenId];
    }
}