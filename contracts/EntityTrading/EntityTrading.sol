// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./IEntityTrading.sol";
import "../TraitForgeNft/ITraitForgeNft.sol";

contract EntityTrading is IEntityTrading, ReentrancyGuard, Ownable {
    ITraitForgeNft public nftContract;
    address payable public nukeFundAddress;

    mapping(uint256 => Listing) public listings;

    constructor(address _traitForgeNft) Ownable(msg.sender) {
        nftContract = ITraitForgeNft(_traitForgeNft);
    }

    // allows the owner to set NukeFund address
    function setNukeFundAddress(
        address payable _nukeFundAddress
    ) external onlyOwner {
        nukeFundAddress = _nukeFundAddress;
    }

    // function to lsit NFT for sale
    function listNFTForSale(
        uint256 tokenId,
        uint256 price
    ) public nonReentrant {
        require(price > 0, "Price must be greater than zero");
        require(
            nftContract.ownerOf(tokenId) == msg.sender,
            "Sender must be the NFT owner."
        );
        require(
            nftContract.getApproved(tokenId) == address(this) ||
                nftContract.isApprovedForAll(msg.sender, address(this)),
            "Contract must be approved to transfer the NFT."
        );

        nftContract.transferFrom(msg.sender, address(this), tokenId); // trasnfer NFT to contract
        listings[tokenId] = Listing(msg.sender, price, true); // create new listing

        emit NFTListed(tokenId, msg.sender, price);
    }

    // function to buy an NFT listed for sale
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
        transferToNukeFund(nukeFundContribution); // transfer contribution to nukeFund

        // transfer NFT from contract to buyer
        payable(listing.seller).transfer(sellerProceeds); // transfer proceeds to the seller
        nftContract.transferFrom(address(this), msg.sender, tokenId); // transfer NFT to the buyer

        delete listings[tokenId]; // remove listing

        emit NFTSold(
            tokenId,
            listing.seller,
            msg.sender,
            msg.value,
            nukeFundContribution
        ); // emit an event for the sale
    }

    function cancelListing(uint256 tokenId) public nonReentrant {
        Listing storage listing = listings[tokenId];

        // check if caller is the seller and listing is acivte
        require(
            listing.seller == msg.sender,
            "Only the seller can canel the listing."
        );
        require(listing.isActive, "Listing is not active.");
        // Before transferring the NFT back, ensure the contract has permission
        require(
            nftContract.isApprovedForAll(listing.seller, address(this)) ||
                nftContract.getApproved(tokenId) == address(this),
            "Contract must have transfer approval"
        );

        nftContract.transferFrom(address(this), msg.sender, tokenId); // transfer the nft back to seller

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
