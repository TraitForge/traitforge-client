// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./EntropyGenerator.sol";
interface INukeFund {
    function receiveFunds() external payable;
}
interface IDAOFund {
    function updateEntropyForAddress(address minter, uint256 entropyValue) external;
}
interface IEntropyGenerator {
    function getNextEntropy() external returns (uint256);
}

interface IEntityMerging {
    function breedWithListed(uint256 forgerTokenId, uint256 mergerTokenId) external payable returns (uint256);
    function getEntropiesForTokens(uint256 forgerTokenId, uint256 mergerTokenId) 
        external 
        view 
        returns (uint256 forgerEntropy, uint256 mergerEntropy);
}

contract CustomERC721 is ERC721URIStorage, ReentrancyGuard, Ownable {
    IEntityMerging private entityMergingContract;
    IDAOFund public daoFund;
    INukeFund public nukeFundContract;
    
    IEntropyGenerator private entropyGenerator;

    address payable public nukeFundAddress;

    uint256 public constant MAX_TOKENS_PER_GEN = 10000;
    uint256 public constant START_PRICE = 0.01 ether;
    uint256 public constant PRICE_INCREMENT = 0.01 ether;
    uint256 public currentGeneration = 1;
    uint256 private _tokenIds;
    uint256 public totalGenerationCirculation = 0;
    uint256 private totalSupplyCount;


    mapping(uint256 => uint256) public tokenCreationTimestamps;
    mapping(uint256 => uint256) public tokenEntropy;
    mapping(uint256 => uint256) public generationMintCounts;

    event Minted(address indexed minter, uint256 indexed itemId, uint256 entropyValue);
    event GenerationIncremented(uint256 newGeneration);
    event FundsDistributedToNukeFund(address indexed to, uint256 amount);
    event Entitybred(uint256 indexed newTokenId, uint256 parent1id, uint256 parent2Id, uint256 newEntropy);
    
    constructor(
        address initialOwner,
        address payable _nukeFundAddress,
        address _entropyGeneratorAddress
    ) ERC721("CustomERC721", "C721") Ownable(initialOwner) {
        nukeFundContract = INukeFund(_nukeFundAddress);
        entropyGenerator = IEntropyGenerator(_entropyGeneratorAddress);
    }

    function setEntityMergingContract(address _entityMergingAddress) external onlyOwner {
        entityMergingContract = IEntityMerging(_entityMergingAddress);
    }

    function setDAOFundAddress(address _daoFundAddress) external onlyOwner {
        daoFund = IDAOFund(_daoFundAddress);
    }

    function someFunctionThatUpdatesEntropy( address minter, uint256 entropyValue) public {
        require(address(daoFund) != address(0), "DAOFund address not set");
        daoFund.updateEntropyForAddress(minter, entropyValue);
    }

    function incrementGeneration() public onlyOwner {
        require(currentGeneration >= MAX_TOKENS_PER_GEN, "Generation limit not yet reached");
        currentGeneration++;
        emit GenerationIncremented(currentGeneration);
    }

    function getTokenEntropy(uint256 tokenId) public view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "ERC721: query for nonexistent token");
        return tokenEntropy[tokenId];
    }

    function getTokenAge(uint256 tokenId) public view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "ERC721: query for nonexistent token");
        return block.timestamp - tokenCreationTimestamps[tokenId];
    }

    function fetchEntropies(uint256 forgerTokenId, uint256 mergerTokenId) external view returns (uint256, uint256) {
        (uint256 forgerEntropy, uint256 mergerEntropy) = entityMergingContract.getEntropiesForTokens(forgerTokenId, mergerTokenId);
        return (forgerEntropy, mergerEntropy);
    }

    function breed(uint256 parent1Id, uint256 parent2Id, string memory baseTokenURI) external payable nonReentrant returns (uint256) {
       entityMergingContract.breedWithListed{value: msg.value}(parent1Id, parent2Id);
       require(msg.sender == address(entityMergingContract), "unauthorized caller");
       
        // Calculate the new entity's entropy
        (uint256 forgerEntropy, uint256 mergerEntropy) = entityMergingContract.getEntropiesForTokens(parent1Id, parent2Id);
        uint256 newEntropy = (forgerEntropy + mergerEntropy) / 2;
        
        // Mint the new entity
        uint256 newTokenId = _mintNewEntity(newEntropy, baseTokenURI);

        // Update generation and circulation
        currentGeneration++;
        totalGenerationCirculation++;

        emit Entitybred(newTokenId, parent1Id, parent2Id, newEntropy);

        return newTokenId;
    }

    function _mintNewEntity(uint256 entropy, string memory baseTokenURI) private returns (uint256) {
        totalSupplyCount++;
        uint256 newTokenId = totalSupplyCount;
        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, string(abi.encodePacked(baseTokenURI, Strings.toString(newTokenId), ".json")));
        tokenEntropy[newTokenId] = entropy;
        return newTokenId;
    }

    function calculateMintPrice() public view returns (uint256) {
        uint256 currentGenMintCount = generationMintCounts[currentGeneration];
        uint256 priceIncrease = PRICE_INCREMENT * currentGenMintCount;
        uint256 price = START_PRICE + priceIncrease;
        return price;
    }

    function mintToken(address to, string memory baseTokenURI) public payable nonReentrant {
        uint256 currentMintPrice = calculateMintPrice();
        require(msg.value >= currentMintPrice, "Insufficient ETH sent; transaction reverted.");
        require(generationMintCounts[currentGeneration] < MAX_TOKENS_PER_GEN, "Current generation is full. Wait for next generation.");

        uint256 entropyValue = entropyGenerator.getNextEntropy();
        uint256 newItemId = _tokenIds;
        _tokenIds++;

        string memory finalTokenURI = string(abi.encodePacked(baseTokenURI, Strings.toString(newItemId), ".json"));
        _mint(to, newItemId);
        _setTokenURI(newItemId, finalTokenURI);

        tokenCreationTimestamps[newItemId] = block.timestamp;
        tokenEntropy[newItemId] = entropyValue;
        generationMintCounts[currentGeneration]++;

        if(address(daoFund) != address(0)) {
            daoFund.updateEntropyForAddress(to, entropyValue);
        }
        distributeFunds(msg.value);

        emit Minted(to, newItemId, entropyValue);
    }

    function distributeFunds(uint256 totalAmount) private {
        require(address(this).balance >= totalAmount, "Insufficient balance");
        
         nukeFundContract.receiveFunds{value: totalAmount}();

        emit FundsDistributedToNukeFund(nukeFundAddress, totalAmount);
    }

    function getTokenCreationTimestamp(uint256 tokenId) public view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "ERC721: query for nonexistent token");
        return tokenCreationTimestamps[tokenId];
    }

    function isForger(uint256 tokenId) public view returns (bool) {
        uint256 entropy = tokenEntropy[tokenId];
        uint256 roleIndicator = entropy % 3;
        return roleIndicator == 0; // Adjust logic as needed
}


}