// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract EntropyGenerator is Ownable {
    uint256[770] private entropySlots;
    uint256 private lastInitializedIndex = 0;
    uint256 private currentSlotIndex = 0;
    uint256 private currentNumberIndex = 0;
    uint256 private constant MAX_SLOT_INDEX = 770; 
    uint256 private constant MAX_NUMBER_INDEX = 13; 
    
    address private allowedCaller;

    event AllowedCallerUpdated(address allowedCaller);


    constructor(address _CustomERC721, address initialOwner) Ownable(initialOwner) {
    allowedCaller = _CustomERC721;
}

     modifier onlyAllowedCaller() {
        require(msg.sender == allowedCaller, "Caller is not allowed");
        _;
    }

    function setAllowedCaller(address _allowedCaller) external onlyOwner {
    allowedCaller = _allowedCaller;
    emit AllowedCallerUpdated(_allowedCaller); // Emit an event for this update.
}

    function writeEntropyBatch1() public {
        require(lastInitializedIndex < 256, "Batch 1 already initialized.");

        uint256 endIndex = lastInitializedIndex + 256; 
        unchecked {
        for (uint256 i = lastInitializedIndex; i < endIndex; i++) {
            uint256 pseudoRandomValue = uint256(keccak256(abi.encodePacked(block.number, i))) % uint256(10)**78;
            require(pseudoRandomValue != 999999, "Invalid value, retry.");
            entropySlots[i] = pseudoRandomValue;
        }
        }
        lastInitializedIndex = endIndex;
    }

    function writeEntropyBatch2() public {
        require(lastInitializedIndex >= 256 && lastInitializedIndex < 512, "Batch 2 not ready or already initialized.");

        uint256 endIndex = lastInitializedIndex + 256; 
        unchecked {
        for (uint256 i = lastInitializedIndex; i < endIndex; i++) {
            uint256 pseudoRandomValue = uint256(keccak256(abi.encodePacked(block.number, i))) % uint256(10)**78;
            require(pseudoRandomValue != 999999, "Invalid value, retry.");
            entropySlots[i] = pseudoRandomValue;
        }
        }
        lastInitializedIndex = endIndex;
        }


    function writeEntropyBatch3() internal  {
    require(lastInitializedIndex >= 512 && lastInitializedIndex < 770, "Batch 3 not ready or already completed.");
    unchecked {
        for (uint256 i = lastInitializedIndex; i < 770; i++) { 
        uint256 pseudoRandomValue = uint256(keccak256(abi.encodePacked(block.number, i))) % uint256(10)**78;
        entropySlots[i] = pseudoRandomValue;
            }
        }
        lastInitializedIndex = 770; 
    }

    function setEntropySlot(uint256 index, uint256 value) public {
        require(index < 770, "Index out of bounds.");
        entropySlots[index] = value % uint256(10)**78;
    }

    function getNextEntropy() public  onlyAllowedCaller returns (uint256) {
        require(currentSlotIndex <= MAX_SLOT_INDEX, "Max slot index reached.");
        uint256 entropy = getEntropy(currentSlotIndex, currentNumberIndex);

        if (currentNumberIndex >= MAX_NUMBER_INDEX) {
        currentNumberIndex = 0;
        if (currentSlotIndex >= MAX_SLOT_INDEX - 1) { 
            currentSlotIndex = 0; 
        } else {
            currentSlotIndex++;
        }
    } else {
        currentNumberIndex++;
    }return entropy;
    }

    function getEntropy(uint256 slotIndex, uint256 numberIndex) private view returns (uint256) {
    require(slotIndex <= MAX_SLOT_INDEX, "Slot index out of bounds.");
    if (slotIndex == 516 && numberIndex == 3) {
        return 999999; 
    }
    
    uint256 position = numberIndex * 6;
    require(position <= 72, "Position calculation error");
    
    uint256 slotValue = entropySlots[slotIndex];
    uint256 entropy = (slotValue / (10**(72 - position))) % 1000000;
    uint256 paddedEntropy = entropy * (10 ** (6 - numberOfDigits(entropy)));

    return paddedEntropy;
    }

    function getPublicEntropy(uint256 slotIndex, uint256 numberIndex) public view returns (uint256) {
    return getEntropy(slotIndex, numberIndex);
    }

    function numberOfDigits(uint256 number) private pure returns (uint256) {
        uint256 digits = 0;
        while (number != 0) {
            number /= 10;
            digits++;
        }
        return digits;
    }

    function getFirstDigit(uint256 number) private pure returns (uint256) {
        while (number >= 10) {
            number /= 10;
        }
        return number;
    }

    function getLastInitializedIndex() public view returns (uint256) {
        return lastInitializedIndex;
    }

    function deriveTokenParameters(uint256 slotIndex, uint256 numberIndex) public view returns (uint256 nukeFactor, uint256 breedPotential, uint256 performanceFactor, bool isSire) {
        uint256 entropy = getEntropy(slotIndex, numberIndex);

        nukeFactor = entropy / 4000000;
        breedPotential = getFirstDigit(entropy);
        performanceFactor = entropy % 10;

        uint256 gender = entropy % 3;
        isSire = gender == 0;

        return (nukeFactor, breedPotential, performanceFactor, isSire);
    }
}