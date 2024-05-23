// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/security/ReentrancyGuard.sol';
import './INukeFund.sol';
import '../TraitForgeNft/ITraitForgeNft.sol';
import '../Airdrop/IAirdrop.sol';

contract NukeFund is INukeFund, ReentrancyGuard, Ownable {
  uint256 private fund;
  ITraitForgeNft public nftContract;
  IAirdrop public airdropContract;
  address payable public devAddress;
  address payable public daoAddress;

  // Constructor now properly passes the initial owner address to the Ownable constructor
  constructor(
    address _traitForgeNft,
    address _airdrop,
    address payable _devAddress,
    address payable _daoAddress
  ) {
    nftContract = ITraitForgeNft(_traitForgeNft);
    airdropContract = IAirdrop(_airdrop);
    devAddress = _devAddress; // Set the developer's address
    daoAddress = _daoAddress;
  }

  // Fallback function to receive ETH and update fund balance
  receive() external payable {
    uint256 devShare = msg.value / 10; // Calculate developer's share (10%)
    uint256 remainingFund = msg.value - devShare; // Calculate remaining funds to add to the fund

    fund += remainingFund; // Update the fund balance

    if (!airdropContract.airdropStarted()) {
      (bool success, ) = devAddress.call{ value: devShare }('');
      require(success, 'ETH send failed');
      emit DevShareDistributed(devShare);
    } else if (!airdropContract.daoFundAllowed()) {
      (bool success, ) = payable(owner()).call{ value: devShare }('');
      require(success, 'ETH send failed');
    } else {
      (bool success, ) = daoAddress.call{ value: devShare }('');
      require(success, 'ETH send failed');
      emit DevShareDistributed(devShare);
    }

    emit FundReceived(msg.sender, msg.value); // Log the received funds
    emit FundBalanceUpdated(fund); // Update the fund balance
  }

  // Allow the owner to update the reference to the ERC721 contract
  function setTraitForgeNftContract(address _traitForgeNft) external onlyOwner {
    nftContract = ITraitForgeNft(_traitForgeNft);
    emit TraitForgeNftAddressUpdated(_traitForgeNft); // Emit an event when the address is updated.
  }

  function setAirdropContract(address _airdrop) external onlyOwner {
    airdropContract = IAirdrop(_airdrop);
    emit AirdropAddressUpdated(_airdrop); // Emit an event when the address is updated.
  }

  function setDevAddress(address payable account) external onlyOwner {
    devAddress = account;
    emit DevAddressUpdated(account);
  }

  function setDaoAddress(address payable account) external onlyOwner {
    daoAddress = account;
    emit DaoAddressUpdated(account);
  }

  // View function to see the current balance of the fund
  function getFundBalance() public view returns (uint256) {
    return fund;
  }

  // Calculate the age of a token based on its creation timestamp and current time
  function calculateAge(uint256 tokenId) public view returns (uint256) {
    require(nftContract.ownerOf(tokenId) != address(0), 'Token does not exist');

    uint256 daysOld = (block.timestamp -
      nftContract.getTokenCreationTimestamp(tokenId)) /
      60 /
      60 /
      24;
    uint256 perfomanceFactor = nftContract.getTokenEntropy(tokenId) % 10;

    uint256 age = (daysOld * perfomanceFactor * 10000) / 365;
    return age;
  }

  // Calculate the nuke factor of a token, which affects the claimable amount from the fund
  function calculateNukeFactor(uint256 tokenId) public view returns (uint256) {
    require(
      nftContract.ownerOf(tokenId) != address(0),
      'ERC721: operator query for nonexistent token'
    );

    uint256 entropy = nftContract.getTokenEntropy(tokenId); // Corrected line
    // Assume this is stored within NukeFund or accessible somehow
    // Use getTokenAge from the ERC721 contract (ICustomERC721) to get the age in seconds
    uint256 ageInDays = calculateAge(tokenId);
    uint256 initialNukeFactor = entropy / 4; // calcualte initalNukeFactor based on entropy

    uint256 finalNukeFactor = ((ageInDays * 250) / 10000) + initialNukeFactor;

    return finalNukeFactor;
  }

  function nuke(uint256 tokenId) public nonReentrant {
    require(
      nftContract.isApprovedOrOwner(msg.sender, tokenId),
      'ERC721: caller is not token owner or approved'
    );
    require(
      nftContract.getApproved(tokenId) == address(this) ||
        nftContract.isApprovedForAll(msg.sender, address(this)),
      'Contract must be approved to transfer the NFT.'
    );
    require(canTokenBeNuked(tokenId), 'Token is not mature yet');

    uint256 finalNukeFactor = calculateNukeFactor(tokenId);
    uint256 potentialClaimAmount = (fund * finalNukeFactor) / 1000000; // Calculate the potential claim amount based on the finalNukeFactor
    uint256 maxAllowedClaimAmount = fund / 2; // Define a maximum allowed claim amount as 50% of the current fund size

    // Directly assign the value to claimAmount based on the condition, removing the redeclaration
    uint256 claimAmount = finalNukeFactor > 50000
      ? maxAllowedClaimAmount
      : potentialClaimAmount;

    fund -= claimAmount; // Deduct the claim amount from the fund

    nftContract.burn(tokenId); // Burn the token
    payable(msg.sender).transfer(claimAmount); // Transfer the claim amount to the player

    emit Nuked(msg.sender, tokenId, claimAmount); // Emit the event with the actual claim amount
    emit FundBalanceUpdated(fund); // Update the fund balance
  }

  function canTokenBeNuked(uint256 tokenId) public view returns (bool) {
    // Ensure the token exists
    require(
      nftContract.ownerOf(tokenId) != address(0),
      'ERC721: operator query for nonexistent token'
    );
    // Get the age of the token in seconds from the ERC721 contract
    uint256 tokenAgeInSeconds = nftContract.getTokenAge(tokenId);
    // Assuming tokenAgeInSeconds is the age of the token since its creation, check if it's at least 3 days old
    return tokenAgeInSeconds >= 3 days;
  }
}
