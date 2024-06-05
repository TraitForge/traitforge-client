// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/Pausable.sol';
import './IEntityForging.sol';
import '../TraitForgeNft/ITraitForgeNft.sol';

contract EntityForging is IEntityForging, ReentrancyGuard, Ownable, Pausable {
  ITraitForgeNft public nftContract;
  address payable public nukeFundAddress;
  uint256 public taxCut = 10;
  uint256 public oneYearInDays = 365 days;
  uint256 public listingCount = 0;
  uint256 public minimumListFee = 0.01 ether;

  mapping(uint256 => uint256) public listedTokenIds;
  mapping(uint256 => Listing) public listings;
  mapping(uint256 => uint256) forgerListingFee;
  mapping(uint256 => uint8) public forgingCounts; // track forgePotential
  mapping(uint256 => uint256) private lastForgeResetTimestamp;

  constructor(address _traitForgeNft) {
    nftContract = ITraitForgeNft(_traitForgeNft);
  }

  // allows the owner to set NukeFund address
  function setNukeFundAddress(
    address payable _nukeFundAddress
  ) external onlyOwner {
    nukeFundAddress = _nukeFundAddress;
  }

  function setTaxCut(uint256 _taxCut) external onlyOwner {
    taxCut = _taxCut;
  }

  function setOneYearInDays(uint256 value) external onlyOwner {
    oneYearInDays = value;
  }

  function setMinimumListingFee(uint256 _fee) external onlyOwner {
    minimumListFee = _fee;
  }

  function fetchListings() external view returns (Listing[] memory _listings) {
    _listings = new Listing[](listingCount);
    for (uint256 i = 0; i < listingCount; i++) {
      uint256 tokenId = listedTokenIds[i];
      _listings[i] = listings[tokenId];
    }
  }

  function listForForging(
    uint256 tokenId,
    uint256 fee
  ) public whenNotPaused nonReentrant {
    require(!listings[tokenId].isListed, 'Token is already listed for forging');
    require(
      nftContract.ownerOf(tokenId) == msg.sender,
      'Caller must own the token'
    );
    require(
      fee >= minimumListFee,
      'Fee should be higher than minimum listing fee'
    );

    _resetForgingCountIfNeeded(tokenId);

    uint256 entropy = nftContract.getTokenEntropy(tokenId); // Retrieve entropy for tokenId
    uint8 forgePotential = uint8((entropy / 10) % 10); // Extract the 5th digit from the entropy
    require(
      forgePotential > 0 && forgingCounts[tokenId] <= forgePotential,
      'Entity has reached its forging limit'
    );

    bool isForger = (entropy % 3) == 0; // Determine if the token is a forger based on entropy
    require(isForger, 'Only forgers can list for forging');

    listings[tokenId] = Listing(msg.sender, tokenId, true, fee);
    listedTokenIds[listingCount] = tokenId;
    listingCount++;

    emit ListedForForging(tokenId, fee);
  }

  function forgeWithListed(
    uint256 forgerTokenId,
    uint256 mergerTokenId
  ) external payable whenNotPaused nonReentrant returns (uint256) {
    require(
      listings[forgerTokenId].isListed,
      "Forger's entity not listed for forging"
    );
    require(
      nftContract.ownerOf(mergerTokenId) == msg.sender,
      'Caller must own the merger token'
    );
    require(
      nftContract.ownerOf(forgerTokenId) != msg.sender,
      'Caller should be different from forger token owner'
    );
    require(
      nftContract.getTokenGeneration(mergerTokenId) ==
        nftContract.getTokenGeneration(forgerTokenId),
      'Invalid token generation'
    );

    uint256 forgingFee = listings[forgerTokenId].fee;
    require(msg.value >= forgingFee, 'Insufficient fee for forging');

    _resetForgingCountIfNeeded(forgerTokenId); // Reset for forger if needed
    _resetForgingCountIfNeeded(mergerTokenId); // Reset for merger if needed

    // Check forger's breed count increment but do not check forge potential here
    // as it is already checked in listForForging for the forger
    forgingCounts[forgerTokenId]++;

    // Check and update for merger token's forge potential
    uint256 mergerEntropy = nftContract.getTokenEntropy(mergerTokenId);
    require(mergerEntropy % 3 != 0, 'Not merger');
    uint8 mergerForgePotential = uint8((mergerEntropy / 10) % 10); // Extract the 5th digit from the entropy
    forgingCounts[mergerTokenId]++;
    require(
      mergerForgePotential > 0 &&
        forgingCounts[mergerTokenId] <= mergerForgePotential,
      'forgePotential insufficient'
    );

    uint256 devFee = forgingFee / taxCut;
    uint256 forgerShare = forgingFee - devFee;
    address payable forgerOwner = payable(nftContract.ownerOf(forgerTokenId));

    uint256 newTokenId = nftContract.forge(forgerTokenId, mergerTokenId, '');
    (bool success, ) = nukeFundAddress.call{ value: devFee }('');
    require(success, 'Failed to send to NukeFund');
    (bool success_forge, ) = forgerOwner.call{ value: forgerShare }('');
    require(success_forge, 'Failed to send to Forge Owner');

    emit FeePaid(forgerTokenId, mergerTokenId, forgingFee);

    return newTokenId;
  }

  function cancelListingForForging(
    uint256 tokenId
  ) public whenNotPaused nonReentrant {
    require(
      nftContract.ownerOf(tokenId) == msg.sender,
      'Caller must own the token'
    );
    require(listings[tokenId].isListed, 'Token not listed for forging');
    delete listings[tokenId];
    emit ListedForForging(tokenId, 0); // Emitting with 0 fee to denote cancellation
  }

  function _resetForgingCountIfNeeded(uint256 tokenId) private {
    uint256 oneYear = oneYearInDays;
    if (lastForgeResetTimestamp[tokenId] == 0) {
      lastForgeResetTimestamp[tokenId] = block.timestamp;
    } else if (block.timestamp >= lastForgeResetTimestamp[tokenId] + oneYear) {
      forgingCounts[tokenId] = 0; // Reset to the forge potential
      lastForgeResetTimestamp[tokenId] = block.timestamp;
    }
  }
}
