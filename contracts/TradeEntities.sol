// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./CustomERC721.sol";

contract EntityTrading is ReentrancyGuard, Ownable {
    CustomERC721 public customERC721;

    struct Listing {
        address seller; // address of NFT seller
        uint256 price; // Price of the NFT in wei
        bool isActive; // flag to check if the listing is active 
    }
    
    address payable public nukeFundAddress;

    mapping(uint256 => Listing) public listings;
    
    event NFTListed(uint256 indexed tokenId, address indexed seller, uint256 price);
    event NFTSold(uint256 indexed tokenId, address indexed seller, address indexed buyer, uint256 price, uint256 nukeFundContribution);
    event ListingCanceled(uint256 indexed tokenId, address indexed seller);
    event NukeFundContribution(address indexed from, uint256 amount);

    constructor(address customERC721Address) Ownable(msg.sender) {
    customERC721 = CustomERC721(customERC721Address);
}
    // allows the owner to set NukeFund address 
    function setNukeFundAddress(address payable _nukeFundAddress) external onlyOwner {
        nukeFundAddress = _nukeFundAddress;
    }

    // function to lsit NFT for sale 
    function listNFTForSale(uint256 tokenId, uint256 price) public nonReentrant {
        require(price > 0, "Price must be greater than zero");
        require(customERC721.ownerOf(tokenId) == msg.sender, "Sender must be the NFT owner.");
        require(customERC721.getApproved(tokenId) == address(this) || customERC721.isApprovedForAll(msg.sender, address(this)), "Contract must be approved to transfer the NFT.");

        customERC721.transferFrom(msg.sender, address(this), tokenId); // trasnfer NFT to contract
        listings[tokenId] = Listing(msg.sender, price, true); // create new listing 

        emit NFTListed(tokenId, msg.sender, price);
    }
    
    // function to buy an NFT listed for sale 
    function buyNFT(uint256 tokenId) external payable nonReentrant {
        Listing memory listing = listings[tokenId];
        require(msg.value == listing.price, "ETH sent does not match the listing price");
        require(listing.seller != address(0), "NFT is not listed for sale.");

        //transfer eth to seller (distribute to nukefund)
        uint256 nukeFundContribution = msg.value / 10;
        uint256 sellerProceeds = msg.value - nukeFundContribution;
        transferToNukeFund(nukeFundContribution); // transfer contribution to nukeFund 

        // transfer NFT from contract to buyer
        payable(listing.seller).transfer(sellerProceeds); // transfer proceeds to the seller
        customERC721.transferFrom(address(this), msg.sender, tokenId); // transfer NFT to the buyer

        delete listings[tokenId]; // remove listing 

        emit NFTSold(tokenId, listing.seller, msg.sender, msg.value, nukeFundContribution); // emit an event for the sale 
    }

    function cancelListing(uint256 tokenId) public nonReentrant {
        Listing storage listing = listings[tokenId];

        // check if caller is the seller and listing is acivte
        require(listing.seller == msg.sender, "Only the seller can canel the listing.");
        require(listing.isActive, "Listing is not active.");
        // Before transferring the NFT back, ensure the contract has permission
        require(customERC721.isApprovedForAll(listing.seller, address(this)) ||
               customERC721.getApproved(tokenId) == address(this),
               "Contract must have transfer approval");

        customERC721.transferFrom(address(this), msg.sender, tokenId); // transfer the nft back to seller
        
        delete listings[tokenId]; // mark the listing as inactive or delete it

        emit ListingCanceled(tokenId, msg.sender);

    }
    // Correct and secure version of transferToNukeFund function
    function transferToNukeFund(uint256 amount) private {
        require(nukeFundAddress != address(0), "NukeFund address not set");
        (bool success, ) = nukeFundAddress.call{value: amount}("");
        require(success, "Failed to send Ether to NukeFund");
        emit NukeFundContribution(address(this), amount);
    }


}
