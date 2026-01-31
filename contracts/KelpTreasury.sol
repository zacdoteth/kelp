// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title KelpTreasury - Buys MOLT with harvest fees
/// @notice Receives KELP from harvest fees. Owner (governance) can execute
///         MOLT buybacks via Uniswap or allocate funds.
/// @dev In v1, buybacks are manual (owner-triggered). v2 can add auto-swap.
contract KelpTreasury is Ownable {
    using SafeERC20 for IERC20;

    IERC20 public kelp;
    IERC20 public molt;

    // Uniswap V2 Router interface (Base has multiple DEXes)
    IUniswapV2Router public router;

    uint256 public totalMoltBought;
    uint256 public totalKelpSpent;

    event MoltBuyback(uint256 kelpSpent, uint256 moltReceived);
    event TokensRecovered(address token, uint256 amount);

    constructor(
        address _kelp,
        address _molt,
        address _router
    ) Ownable(msg.sender) {
        kelp = IERC20(_kelp);
        molt = IERC20(_molt);
        router = IUniswapV2Router(_router);
    }

    /// @notice Buy MOLT with accumulated KELP fees
    /// @param _kelpAmount Amount of KELP to sell for MOLT
    /// @param _minMoltOut Minimum MOLT to receive (slippage protection)
    function buyMolt(uint256 _kelpAmount, uint256 _minMoltOut) external onlyOwner {
        require(kelp.balanceOf(address(this)) >= _kelpAmount, "not enough kelp");

        kelp.approve(address(router), _kelpAmount);

        address[] memory path = new address[](3);
        path[0] = address(kelp);
        path[1] = router.WETH();
        path[2] = address(molt);

        uint256 moltBefore = molt.balanceOf(address(this));

        router.swapExactTokensForTokens(
            _kelpAmount,
            _minMoltOut,
            path,
            address(this),
            block.timestamp + 300
        );

        uint256 moltReceived = molt.balanceOf(address(this)) - moltBefore;
        totalMoltBought += moltReceived;
        totalKelpSpent += _kelpAmount;

        emit MoltBuyback(_kelpAmount, moltReceived);
    }

    /// @notice Update router if needed
    function setRouter(address _router) external onlyOwner {
        router = IUniswapV2Router(_router);
    }

    /// @notice Recover any tokens sent here by mistake
    function recoverTokens(address _token, uint256 _amount) external onlyOwner {
        IERC20(_token).safeTransfer(owner(), _amount);
        emit TokensRecovered(_token, _amount);
    }

    /// @notice View KELP balance available for buybacks
    function kelpBalance() external view returns (uint256) {
        return kelp.balanceOf(address(this));
    }

    /// @notice View MOLT balance in treasury
    function moltBalance() external view returns (uint256) {
        return molt.balanceOf(address(this));
    }
}

/// @dev Minimal Uniswap V2 Router interface
interface IUniswapV2Router {
    function WETH() external pure returns (address);
    function swapExactTokensForTokens(
        uint256 amountIn,
        uint256 amountOutMin,
        address[] calldata path,
        address to,
        uint256 deadline
    ) external returns (uint256[] memory amounts);
}
