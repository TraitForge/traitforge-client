// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CustomERC721.sol";

contract EntityTrading is ReentrancyGuard, Ownable {
    CustomERC721 public customERC721;

    struct Listing {
        address seller;
        uint256 price;
        bool isActive;
    }

    address payable public nukeFundAddress;

    mapping(uint256 => Listing) public listings;

    event NFTListed(
        uint256 indexed tokenId,
        address indexed seller,
        uint256 price
    );
    event NFTSold(
        uint256 indexed tokenId,
        address indexed seller,
        address indexed buyer,
        uint256 price,
        uint256 nukeFundContribution
    );
    event ListingCanceled(uint256 indexed tokenId, address indexed seller);

    constructor(address customERC721Address) Ownable(msg.sender) {
        customERC721 = CustomERC721(customERC721Address);
    }

    function setNukeFundAddress(
        address payable _nukeFundAddress
    ) external onlyOwner {
        nukeFundAddress = _nukeFundAddress;
    }

    function listNFTForSale(
        uint256 tokenId,
        uint256 price
    ) public nonReentrant {
        require(price > 0, "Price must be greater than zero");
        require(
            customERC721.ownerOf(tokenId) == msg.sender,
            "Sender must be the NFT owner."
        );
        require(
            customERC721.getApproved(tokenId) == address(this) ||
                customERC721.isApprovedForAll(msg.sender, address(this)),
            "Contract must be approved to transfer the NFT."
        );

        customERC721.transferFrom(msg.sender, address(this), tokenId);
        listings[tokenId] = Listing(msg.sender, price, true);

        emit NFTListed(tokenId, msg.sender, price);
    }

    function buyNFT(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(
            msg.value == listing.price,
            "ETH sent does not match the listing price"
        );
        require(listing.seller != address(0), "NFT is not listed for sale.");

        //transfer eth to seller (distribute to nukefund)
        uint256 nukeFundContribution = msg.value / 10;
        uint256 sellerProceeds = msg.value - nukeFundContribution;
        transferToNukeFund(nukeFundContribution);

        // transfer NFT from contract to buyer
        payable(listing.seller).transfer(sellerProceeds);
        customERC721.transferFrom(address(this), msg.sender, tokenId);

        delete listings[tokenId];

        emit NFTSold(
            tokenId,
            listing.seller,
            msg.sender,
            msg.value,
            nukeFundContribution
        );
    }

    function cancelListing(uint256 tokenId) public nonReentrant {
        Listing storage listing = listings[tokenId];

        // check if caller is the seller and listing is acivte
        require(
            listing.seller == msg.sender,
            "Only the seller can canel the listing."
        );
        require(listing.isActive, "Listing is not active.");

        // transfer the nft back to seller
        customERC721.transferFrom(address(this), msg.sender, tokenId);
        // mark the listing as inactive or delete it
        delete listings[tokenId];

        emit ListingCanceled(tokenId, msg.sender);
    }

    function transferToNukeFund(uint256 amount) private {
        require(nukeFundAddress != address(0), "NukeFund address not set");
        payable(nukeFundAddress).transfer(amount);
    }
}
