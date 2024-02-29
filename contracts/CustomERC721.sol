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

contract CustomERC721 is ERC721URIStorage, ReentrancyGuard, Ownable {
    IDAOFund public daoFund;
    INukeFund public nukeFundContract;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    IEntropyGenerator private entropyGenerator;

    address payable public nukeFundAddress;
    address payable public devAddress;

    uint256 public constant MAX_TOKENS_PER_GEN = 10000;
    uint256 public constant START_PRICE = 0.01 ether;
    uint256 public constant PRICE_INCREMENT = 0.01 ether;
    uint256 public currentGeneration = 1;


    mapping(uint256 => uint256) public tokenCreationTimestamps;
    mapping(uint256 => uint256) public tokenEntropy;
    mapping(uint256 => uint256) public generationMintCounts;

    event Minted(address indexed minter, uint256 indexed itemId, uint256 entropyValue);
    event GenerationIncremented(uint256 newGeneration);
    event FundsDistributedToNukeFund(address indexed to, uint256 amount);
    event FundsDistributedToDev(address indexed to, uint256 amount);
    

    constructor(
        address initialOwner,
        address payable _nukeFundAddress,
        address payable _devAddress,
        address _entropyGeneratorAddress
    ) ERC721("CustomERC721", "C721") Ownable(initialOwner) {
        nukeFundContract = INukeFund(_nukeFundAddress);
        devAddress = _devAddress;
        entropyGenerator = IEntropyGenerator(_entropyGeneratorAddress);
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

    function getEntropy(uint256 tokenId) public view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "ERC721: query for nonexistent token");
        return tokenEntropy[tokenId];
    }

    function getTokenAge(uint256 tokenId) public view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "ERC721: query for nonexistent token");
        return block.timestamp - tokenCreationTimestamps[tokenId];
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
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

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
        uint256 nukeFundShare = (totalAmount * 90) / 100;
        uint256 devShare = totalAmount - nukeFundShare;
        
        nukeFundContract.receiveFunds{value: nukeFundShare}();
        payable(devAddress).transfer(devShare);

        emit FundsDistributedToNukeFund(nukeFundAddress, nukeFundShare);
        emit FundsDistributedToDev(devAddress, devShare);
    }

    function getTokenCreationTimestamp(uint256 tokenId) public view returns (uint256) {
        require(ownerOf(tokenId) != address(0), "ERC721: query for nonexistent token");
        return tokenCreationTimestamps[tokenId];
    }

}