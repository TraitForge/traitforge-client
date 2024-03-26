// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ERC20FixedSupply is IERC20 {
    uint256 public override totalSupply;
    mapping(address => uint256) public override balanceOf;
    mapping(address => mapping(address => uint256)) public override allowance;

    string public name;
    string public symbol;
    uint8 public decimals;

    constructor(string memory _name, string memory _symbol, uint8 _decimals) {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        totalSupply = 1e9 * 10 ** uint256(decimals); // 1 billion tokens, adjusted for decimals
        balanceOf[msg.sender] = totalSupply; // Assign the entire supply to the deployer
        emit Transfer(address(0), msg.sender, totalSupply); // Emit a transfer event from the zero address
    }

    function transfer(
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        require(
            balanceOf[msg.sender] >= amount,
            "ERC20: transfer amount exceeds balance"
        );
        balanceOf[msg.sender] -= amount;
        balanceOf[recipient] += amount;
        emit Transfer(msg.sender, recipient, amount);
        return true;
    }

    function approve(
        address spender,
        uint256 amount
    ) external override returns (bool) {
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external override returns (bool) {
        require(
            balanceOf[sender] >= amount,
            "ERC20: transfer amount exceeds balance"
        );
        require(
            allowance[sender][msg.sender] >= amount,
            "ERC20: transfer amount exceeds allowance"
        );
        balanceOf[sender] -= amount;
        balanceOf[recipient] += amount;
        allowance[sender][msg.sender] -= amount;
        emit Transfer(sender, recipient, amount);
        return true;
    }

    function burn(address from, uint256 amount) external {
        require(
            balanceOf[from] >= amount,
            "ERC20: burn amount exceeds balance"
        );
        balanceOf[from] -= amount;
        totalSupply -= amount;
        emit Transfer(from, address(0), amount);
    }
}