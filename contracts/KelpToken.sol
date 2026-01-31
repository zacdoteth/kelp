// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title KelpToken - The yield token of KelpFi
/// @notice Kelp grows in the ocean. Molts eat kelp. This is the circle of life.
/// @dev Mint restricted to owner (KelpForest/MasterChef). Fixed max supply.
contract KelpToken is ERC20, Ownable {
    uint256 public constant MAX_SUPPLY = 100_000_000 ether; // 100M KELP total, ever.
    uint256 public totalMinted;

    constructor() ERC20("Kelp", "KELP") Ownable(msg.sender) {}

    /// @notice Mint kelp. Only the forest (MasterChef) can grow kelp.
    /// @param _to Recipient
    /// @param _amount Amount to mint
    function mint(address _to, uint256 _amount) external onlyOwner {
        require(totalMinted + _amount <= MAX_SUPPLY, "the ocean is empty");
        totalMinted += _amount;
        _mint(_to, _amount);
    }
}
