// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface ITraitForgeNft is IERC721 {
    // Events for logging contract activities
    event Minted(
        address indexed minter,
        uint256 indexed itemId,
        uint256 entropyValue
    );
    event GenerationIncremented(uint256 newGeneration);
    event FundsDistributedToNukeFund(address indexed to, uint256 amount);
    event Entitybred(
        uint256 indexed newTokenId,
        uint256 parent1id,
        uint256 parent2Id,
        uint256 newEntropy
    );
    event NukeFundContractUpdated(address nukeFundAddress);

    // Function to set the nuke fund contract address, restricted to the owner
    function setNukeFundContract(address payable _nukeFundAddress) external;

    // Function to set the entity merging (breeding) contract address, restricted to the owner
    function setEntityMergingContract(address _entityMergingAddress) external;

    function setEntropyGenerator(address _entropyGeneratorAddress) external;

    // Function to increment the generation of tokens, restricted to the owner
    function incrementGeneration() external;

    function getTokenEntropy(uint256 tokenId) external view returns (uint256);

    function getEntropiesForTokens(
        uint256 forgerTokenId,
        uint256 mergerTokenId
    ) external view returns (uint256 forgerEntropy, uint256 mergerEntropy);

    function getTokenAge(uint256 tokenId) external view returns (uint256);

    function breed(
        uint256 parent1Id,
        uint256 parent2Id,
        string memory baseTokenURI
    ) external payable returns (uint256);

    function calculateMintPrice() external view returns (uint256);

    function mintToken(address to) external payable;

    function getTokenCreationTimestamp(
        uint256 tokenId
    ) external view returns (uint256);

    function isForger(uint256 tokenId) external view returns (bool);

    function calculateTokenParamters(
        uint256 tokenId
    )
        external
        view
        returns (
            uint256 finalNukeFactor,
            bool isForgerResult,
            uint8 forgePotential,
            uint256 performanceFactor
        );

    function burn(uint256 tokenId) external;
}