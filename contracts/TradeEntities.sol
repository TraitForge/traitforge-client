// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Mint.sol";

contract EntityTrading is ReentrancyGuard, Ownable {
    IERC721 public entityContract;

    address public nukeFundAddress;

    struct Listing {
        address seller;
        uint256 price;
        bool isActive;
    }

    mapping(uint256 => Listing) public listings;
    uint256 public constant NUKEFUND_SHARE_PERCENTAGE = 10;
    uint256 public constant DEV_SHARE_PERCENTAGE = 10;

    event EntityListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event EntitySold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price);
    event ListingCancelled(uint256 indexed tokenId);
    event TokenReceived(uint256 indexed tokenId, address indexed fromAddress, address indexed toAddress);

    constructor(address _entityContractAddress, address _nukeFundAddress, address _initialOwner) Ownable(_initialOwner) {
    entityContract = IERC721(_entityContractAddress);
    nukeFundAddress = _nukeFundAddress;
    }
    function listEntityForSale(uint256 tokenId, uint256 price) public nonReentrant {
        require(price > 0, "Price must be greater than zero");
        require(entityContract.getApproved(tokenId) == address(this) || entityContract.isApprovedForAll(msg.sender, address(this)), "Contract must be approved to transfer token");
        require(entityContract.ownerOf(tokenId) == msg.sender, "You must own the entity");
        entityContract.transferFrom(msg.sender, address(this), tokenId);
    
        emit TokenReceived(tokenId, msg.sender, address(this));
        listings[tokenId] = Listing(msg.sender, price, true);

        emit EntityListed(tokenId, msg.sender, price);
}

    function buyEntity(uint256 tokenId) public payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.isActive, "Entity not for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        
        uint256 devShare = listing.price * DEV_SHARE_PERCENTAGE / 100;
        uint256 nukeFundShare = listing.price * NUKEFUND_SHARE_PERCENTAGE / 100;
        uint256 sellerShare = listing.price - (devShare + nukeFundShare);

        transferToNukeFund(nukeFundShare);
        transferToDev(devShare);
        payable(listing.seller).transfer(sellerShare);

        listing.isActive = false;
        listings[tokenId] = listing;
        entityContract.transferFrom(address(this), msg.sender, tokenId);

        emit EntitySold(tokenId, listing.seller, msg.sender, listing.price);
    }
    function transferToNukeFund(uint256 amount) private {
        require(nukeFundAddress !=address(0), "NukeFund address not set");
        payable(nukeFundAddress).transfer(amount);
    }
    function transferToDev(uint256 amount) private {
        payable(owner()).transfer(amount);
    }

    function cancelListing(uint256 tokenId) public nonReentrant {
        Listing memory listing = listings[tokenId];
        require(listing.seller == msg.sender, "You are not the seller");
        require(listing.isActive, "Listing is not active");

        listing.isActive = false;
        listings[tokenId] = listing;
        entityContract.transferFrom(address(this), msg.sender, tokenId);

        emit ListingCancelled(tokenId);
    }
}