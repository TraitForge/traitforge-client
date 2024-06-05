// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import './ITraitForgeNft.sol';
import '../EntityForging/IEntityForging.sol';
import '../EntropyGenerator/IEntropyGenerator.sol';
import '../Airdrop/IAirdrop.sol';

contract TraitForgeNft is
  ITraitForgeNft,
  ERC721Enumerable,
  ReentrancyGuard,
  Ownable,
  Pausable
{
  // Constants for token generation and pricing
  uint256 public maxTokensPerGen = 10000;
  uint256 public startPrice = 0.01 ether;
  uint256 public priceIncrement = 0.01 ether;

  IEntityForging public entityForgingContract;
  IEntropyGenerator public entropyGenerator;
  IAirdrop public airdropContract;
  address public nukeFundAddress;

  // Variables for managing generations and token IDs
  uint256 public currentGeneration = 1;

  // Mappings for token metadata
  mapping(uint256 => uint256) public tokenCreationTimestamps;
  mapping(uint256 => uint256) public tokenEntropy;
  mapping(uint256 => uint256) public generationMintCounts;
  mapping(uint256 => uint256) public tokenGenerations;
  mapping(uint256 => address) public initialOwners;

  uint256 private _tokenIds;

  constructor() ERC721('TraitForgeNft', 'TFGNFT') {}

  // Function to set the nuke fund contract address, restricted to the owner
  function setNukeFundContract(
    address payable _nukeFundAddress
  ) external onlyOwner {
    nukeFundAddress = _nukeFundAddress;
    emit NukeFundContractUpdated(_nukeFundAddress); // Consider adding an event for this.
  }

  // Function to set the entity merging (breeding) contract address, restricted to the owner
  function setEntityForgingContract(
    address _entityForgingAddress
  ) external onlyOwner {
    entityForgingContract = IEntityForging(_entityForgingAddress);
  }

  function setEntropyGenerator(
    address _entropyGeneratorAddress
  ) external onlyOwner {
    entropyGenerator = IEntropyGenerator(_entropyGeneratorAddress);
  }

  function setAirdropContract(address _airdrop) external onlyOwner {
    airdropContract = IAirdrop(_airdrop);
  }

  function startAirdrop(uint256 amount) external whenNotPaused onlyOwner {
    airdropContract.startAirdrop(amount);
  }

  function setStartPrice(uint256 _startPrice) external onlyOwner {
    startPrice = _startPrice;
  }

  function setPriceIncrement(uint256 _priceIncrement) external onlyOwner {
    priceIncrement = _priceIncrement;
  }

  function getGeneration() public view returns (uint256) {
    return currentGeneration;
  }

  function isApprovedOrOwner(
    address spender,
    uint256 tokenId
  ) public view returns (bool) {
    return _isApprovedOrOwner(spender, tokenId);
  }

  function burn(uint256 tokenId) external whenNotPaused nonReentrant {
    require(
      isApprovedOrOwner(msg.sender, tokenId),
      'ERC721: caller is not token owner or approved'
    );
    if (!airdropContract.airdropStarted()) {
      uint256 entropy = getTokenEntropy(tokenId);
      airdropContract.subUserAmount(initialOwners[tokenId], entropy);
    }
    _burn(tokenId);
  }

  function forge(
    uint256 parent1Id,
    uint256 parent2Id,
    string memory
  ) external whenNotPaused nonReentrant returns (uint256) {
    require(
      msg.sender == address(entityForgingContract),
      'unauthorized caller'
    );

    // Calculate the new entity's entropy
    (uint256 forgerEntropy, uint256 mergerEntropy) = getEntropiesForTokens(
      parent1Id,
      parent2Id
    );
    uint256 newEntropy = (forgerEntropy + mergerEntropy) / 2;
    uint256 newGeneration = getTokenGeneration(parent1Id) + 1;

    // Mint the new entity
    uint256 newTokenId = _mintNewEntity(newEntropy, newGeneration);

    emit EntityForged(newTokenId, parent1Id, parent2Id, newEntropy);

    return newTokenId;
  }

  function mintToken() public payable whenNotPaused nonReentrant {
    uint256 mintPrice = calculateMintPrice();
    require(msg.value >= mintPrice, 'Insufficient ETH send for minting.');

    _mintInternal(msg.sender, mintPrice);

    uint256 excessPayment = msg.value - mintPrice;
    if (excessPayment > 0) {
      (bool refundSuccess, ) = msg.sender.call{ value: excessPayment }('');
      require(refundSuccess, 'Refund of excess payment failed.');
    }
  }

  function mintWithBudget() public payable whenNotPaused nonReentrant {
    uint256 mintPrice = calculateMintPrice();
    uint256 amountMinted = 0;
    uint256 budgetLeft = msg.value;

    while (budgetLeft >= mintPrice && _tokenIds < maxTokensPerGen) {
      _mintInternal(msg.sender, mintPrice);
      amountMinted++;
      budgetLeft -= mintPrice;
      mintPrice = calculateMintPrice();
    }
    if (budgetLeft > 0) {
      (bool refundSuccess, ) = msg.sender.call{ value: budgetLeft }('');
      require(refundSuccess, 'Refund failed.');
    }
  }

  function calculateMintPrice() public view returns (uint256) {
    uint256 currentGenMintCount = generationMintCounts[currentGeneration];
    uint256 priceIncrease = priceIncrement * currentGenMintCount;
    uint256 price = startPrice + priceIncrease;
    return price;
  }

  function getTokenEntropy(uint256 tokenId) public view returns (uint256) {
    require(
      ownerOf(tokenId) != address(0),
      'ERC721: query for nonexistent token'
    );
    return tokenEntropy[tokenId];
  }

  function getTokenGeneration(uint256 tokenId) public view returns (uint256) {
    return tokenGenerations[tokenId];
  }

  function getEntropiesForTokens(
    uint256 forgerTokenId,
    uint256 mergerTokenId
  ) public view returns (uint256 forgerEntropy, uint256 mergerEntropy) {
    forgerEntropy = getTokenEntropy(forgerTokenId);
    mergerEntropy = getTokenEntropy(mergerTokenId);
  }

  function getTokenAge(uint256 tokenId) public view returns (uint256) {
    require(
      ownerOf(tokenId) != address(0),
      'ERC721: query for nonexistent token'
    );
    return block.timestamp - tokenCreationTimestamps[tokenId];
  }

  function getTokenCreationTimestamp(
    uint256 tokenId
  ) public view returns (uint256) {
    require(
      ownerOf(tokenId) != address(0),
      'ERC721: query for nonexistent token'
    );
    return tokenCreationTimestamps[tokenId];
  }

  function isForger(uint256 tokenId) public view returns (bool) {
    uint256 entropy = tokenEntropy[tokenId];
    uint256 roleIndicator = entropy % 3;
    return roleIndicator == 0;
  }

  function _mintInternal(address to, uint256 mintPrice) internal {
    if (generationMintCounts[currentGeneration] >= maxTokensPerGen) {
      _incrementGeneration();
    }
    uint256 newItemId = _tokenIds++;
    _mint(to, newItemId);
    uint256 entropyValue = entropyGenerator.getNextEntropy();

    tokenCreationTimestamps[newItemId] = block.timestamp;
    tokenEntropy[newItemId] = entropyValue;
    tokenGenerations[newItemId] = currentGeneration;
    generationMintCounts[currentGeneration]++;
    initialOwners[newItemId] = to;

    if (!airdropContract.airdropStarted()) {
      airdropContract.addUserAmount(to, entropyValue);
    }

    emit Minted(msg.sender, newItemId, entropyValue);

    _distributeFunds(mintPrice);
  }

  function _mintNewEntity(
    uint256 entropy,
    uint256 gen
  ) private returns (uint256) {
    require(
      generationMintCounts[gen] < maxTokensPerGen,
      'Exceeds maxTokensPerGen'
    );

    uint256 newTokenId = _tokenIds++;
    _mint(msg.sender, newTokenId);

    tokenEntropy[newTokenId] = entropy;
    tokenGenerations[newTokenId] = gen;
    generationMintCounts[gen]++;
    initialOwners[newTokenId] = msg.sender;

    if (
      generationMintCounts[gen] >= maxTokensPerGen && gen == currentGeneration
    ) {
      _incrementGeneration();
    }

    if (!airdropContract.airdropStarted()) {
      airdropContract.addUserAmount(msg.sender, entropy);
    }

    emit NewEntityMinted(msg.sender, newTokenId, entropy, gen);
    return newTokenId;
  }

  function _incrementGeneration() private {
    require(
      generationMintCounts[currentGeneration] >= maxTokensPerGen,
      'Generation limit not yet reached'
    );
    currentGeneration++;
    generationMintCounts[currentGeneration] = 0;
    entropyGenerator.initializeAlphaIndices();
    emit GenerationIncremented(currentGeneration);
  }

  // distributes funds to nukeFund contract, where its then distrubted 10% dev 90% nukeFund
  function _distributeFunds(uint256 totalAmount) private {
    require(address(this).balance >= totalAmount, 'Insufficient balance');

    (bool success, ) = nukeFundAddress.call{ value: totalAmount }('');
    require(success, 'ETH send failed');

    emit FundsDistributedToNukeFund(nukeFundAddress, totalAmount);
  }

  function _beforeTokenTransfer(
    address from,
    address to,
    uint256 firstTokenId,
    uint256 batchSize
  ) internal virtual override {
    super._beforeTokenTransfer(from, to, firstTokenId, batchSize);

    require(!paused(), 'ERC721Pausable: token transfer while paused');
  }
}
