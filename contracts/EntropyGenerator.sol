// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EntropyGenerator {
    uint256[770] private entropySlots;
    uint256 private lastInitializedIndex = 0;
    uint256 private currentSlotIndex = 0;
    uint256 private currentNumberIndex = 0;
    uint256 private constant MAX_SLOT_INDEX = 769; 
    uint256 private constant MAX_NUMBER_INDEX = 12; 

    constructor() {
    }

    function writeEntropy() public {
        require(lastInitializedIndex < 770, "All slots already initialized.");

        uint256 startIndex = lastInitializedIndex;
        uint256 endIndex;

        unchecked {
            endIndex = lastInitializedIndex + 390 < 770 ? lastInitializedIndex + 390 : 770;
        }

        for (uint256 i = startIndex; i < endIndex; i++) {
            uint256 pseudoRandomValue;
            unchecked {
                pseudoRandomValue = uint256(keccak256(abi.encodePacked(block.timestamp, i))) % uint256(10)**78;
            }
            entropySlots[i] = pseudoRandomValue;
            lastInitializedIndex = i + 1;
        }
    }

    function setEntropySlot(uint256 index, uint256 value) public {
        require(index < 770, "Index out of bounds.");
        entropySlots[index] = value % uint256(10)**78;
    }


    function getNextEntropy() public returns (uint256) {
        require(currentSlotIndex <= MAX_SLOT_INDEX, "Max slot index reached.");
        uint256 entropy = getEntropy(currentSlotIndex, currentNumberIndex);

        // Increment indices for the next call
        if (currentNumberIndex >= MAX_NUMBER_INDEX) {
            currentNumberIndex = 0;
            currentSlotIndex++;
        } else {
            currentNumberIndex++;
        }

        return entropy;
    }

    function getEntropy(uint256 slotIndex, uint256 numberIndex) private view returns (uint256) {
        require(slotIndex <= MAX_SLOT_INDEX, "Slot index out of bounds.");
        uint256 position = numberIndex * 6;
        require(position <= 72, "Position calculation error");
        
        uint256 slotValue = entropySlots[slotIndex];
        uint256 entropy = (slotValue / (10**(72 - position))) % 1000000;
        uint256 paddedEntropy = entropy * (10 ** (6 - numberOfDigits(entropy)));

        return paddedEntropy;
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
