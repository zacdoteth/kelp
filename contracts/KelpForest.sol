// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./KelpToken.sol";

/// @title KelpForest - Where molts come to farm kelp
/// @notice Fork of SushiSwap MasterChef, adapted for the molt ecosystem.
/// @dev Stake MOLT, MOLT/WETH LP, KELP/WETH LP, or agent tokens to earn KELP.
///      Emissions halve weekly. Treasury takes a 2% harvest fee and buys MOLT.
contract KelpForest is Ownable, ReentrancyGuard {
    using SafeERC20 for IERC20;

    // --- Structs ---
    struct UserInfo {
        uint256 amount;     // How much LP/token the user has staked
        uint256 rewardDebt; // Reward debt (see MasterChef math)
    }

    struct PoolInfo {
        IERC20 stakedToken;     // Address of staked token
        uint256 allocPoint;     // Allocation points for this pool
        uint256 lastRewardBlock;// Last block rewards were calculated
        uint256 accKelpPerShare;// Accumulated KELP per share, times 1e12
    }

    // --- State ---
    KelpToken public kelp;
    address public treasury;  // Receives 2% harvest fee, buys MOLT
    address public devFund;   // Receives 10% of all emissions

    uint256 public kelpPerBlock;          // Current KELP emission per block
    uint256 public constant HALVING_PERIOD = 201_600; // ~7 days at 3s blocks on Base
    uint256 public startBlock;
    uint256 public lastHalvingBlock;
    uint256 public halvingCount;
    uint256 public constant MAX_HALVINGS = 8; // Emissions end after 8 halvings (~56 days)

    uint256 public constant HARVEST_FEE_BPS = 200; // 2% harvest fee to treasury
    uint256 public constant DEV_FUND_BPS = 1000;  // 10% of emissions to dev fund
    uint256 public constant BPS = 10000;

    PoolInfo[] public poolInfo;
    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    uint256 public totalAllocPoint;

    // --- Events ---
    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event Harvest(address indexed user, uint256 indexed pid, uint256 amount, uint256 fee);
    event EmergencyWithdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event PoolAdded(uint256 indexed pid, address stakedToken, uint256 allocPoint);
    event Halving(uint256 newKelpPerBlock, uint256 halvingCount);

    constructor(
        KelpToken _kelp,
        address _treasury,
        address _devFund,
        uint256 _kelpPerBlock,
        uint256 _startBlock
    ) Ownable(msg.sender) {
        kelp = _kelp;
        treasury = _treasury;
        devFund = _devFund;
        kelpPerBlock = _kelpPerBlock;
        startBlock = _startBlock;
        lastHalvingBlock = _startBlock;
    }

    // --- Pool Management ---

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    /// @notice Add a new pool. Only owner.
    /// @param _allocPoint Allocation points for this pool
    /// @param _stakedToken Token to stake (MOLT, LP tokens, agent tokens)
    function addPool(uint256 _allocPoint, IERC20 _stakedToken) external onlyOwner {
        _massUpdatePools();
        uint256 lastRewardBlock = block.number > startBlock ? block.number : startBlock;
        totalAllocPoint += _allocPoint;
        poolInfo.push(PoolInfo({
            stakedToken: _stakedToken,
            allocPoint: _allocPoint,
            lastRewardBlock: lastRewardBlock,
            accKelpPerShare: 0
        }));
        emit PoolAdded(poolInfo.length - 1, address(_stakedToken), _allocPoint);
    }

    /// @notice Update allocation points for a pool
    function setPool(uint256 _pid, uint256 _allocPoint) external onlyOwner {
        _massUpdatePools();
        totalAllocPoint = totalAllocPoint - poolInfo[_pid].allocPoint + _allocPoint;
        poolInfo[_pid].allocPoint = _allocPoint;
    }

    /// @notice Update treasury address
    function setTreasury(address _treasury) external onlyOwner {
        treasury = _treasury;
    }

    /// @notice Update dev fund address
    function setDevFund(address _devFund) external onlyOwner {
        devFund = _devFund;
    }

    // --- Halving Logic ---

    /// @notice Check and apply halvings if needed
    function _checkHalving() internal {
        while (
            halvingCount < MAX_HALVINGS &&
            block.number >= lastHalvingBlock + HALVING_PERIOD
        ) {
            lastHalvingBlock += HALVING_PERIOD;
            halvingCount++;
            kelpPerBlock = kelpPerBlock / 2;
            emit Halving(kelpPerBlock, halvingCount);
        }
    }

    // --- View Functions ---

    /// @notice View pending KELP for a user in a pool
    function pendingKelp(uint256 _pid, address _user) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accKelpPerShare = pool.accKelpPerShare;
        uint256 stakedSupply = pool.stakedToken.balanceOf(address(this));
        if (block.number > pool.lastRewardBlock && stakedSupply != 0) {
            uint256 blocks = block.number - pool.lastRewardBlock;
            // Note: this is approximate for view (doesn't account for mid-period halvings)
            uint256 kelpReward = blocks * kelpPerBlock * pool.allocPoint / totalAllocPoint;
            accKelpPerShare += kelpReward * 1e12 / stakedSupply;
        }
        return user.amount * accKelpPerShare / 1e12 - user.rewardDebt;
    }

    // --- Core Functions ---

    /// @notice Update all pools. Gas intensive — call sparingly.
    function _massUpdatePools() internal {
        _checkHalving();
        for (uint256 pid = 0; pid < poolInfo.length; pid++) {
            _updatePool(pid);
        }
    }

    /// @notice Update reward variables for a single pool
    function _updatePool(uint256 _pid) internal {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) return;

        uint256 stakedSupply = pool.stakedToken.balanceOf(address(this));
        if (stakedSupply == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }

        uint256 blocks = block.number - pool.lastRewardBlock;
        uint256 kelpReward = blocks * kelpPerBlock * pool.allocPoint / totalAllocPoint;

        // Mint kelp — forest grows
        uint256 devShare = kelpReward * DEV_FUND_BPS / BPS;
        kelp.mint(devFund, devShare);
        kelp.mint(address(this), kelpReward);

        pool.accKelpPerShare += kelpReward * 1e12 / stakedSupply;
        pool.lastRewardBlock = block.number;
    }

    /// @notice Deposit tokens into the forest to grow kelp
    function deposit(uint256 _pid, uint256 _amount) external nonReentrant {
        _checkHalving();
        _updatePool(_pid);

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        // Harvest existing kelp first
        if (user.amount > 0) {
            uint256 pending = user.amount * pool.accKelpPerShare / 1e12 - user.rewardDebt;
            if (pending > 0) {
                _safeKelpTransfer(msg.sender, pending);
            }
        }

        if (_amount > 0) {
            pool.stakedToken.safeTransferFrom(msg.sender, address(this), _amount);
            user.amount += _amount;
        }

        user.rewardDebt = user.amount * pool.accKelpPerShare / 1e12;
        emit Deposit(msg.sender, _pid, _amount);
    }

    /// @notice Withdraw staked tokens and harvest kelp
    function withdraw(uint256 _pid, uint256 _amount) external nonReentrant {
        _checkHalving();
        _updatePool(_pid);

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "not enough staked");

        // Harvest
        uint256 pending = user.amount * pool.accKelpPerShare / 1e12 - user.rewardDebt;
        if (pending > 0) {
            _safeKelpTransfer(msg.sender, pending);
        }

        if (_amount > 0) {
            user.amount -= _amount;
            pool.stakedToken.safeTransfer(msg.sender, _amount);
        }

        user.rewardDebt = user.amount * pool.accKelpPerShare / 1e12;
        emit Withdraw(msg.sender, _pid, _amount);
    }

    /// @notice Harvest kelp from a pool (no withdraw)
    function harvest(uint256 _pid) external nonReentrant {
        _checkHalving();
        _updatePool(_pid);

        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];

        uint256 pending = user.amount * pool.accKelpPerShare / 1e12 - user.rewardDebt;
        require(pending > 0, "no kelp to harvest");

        // 2% fee to treasury (buys MOLT)
        uint256 fee = pending * HARVEST_FEE_BPS / BPS;
        uint256 userAmount = pending - fee;

        _safeKelpTransfer(msg.sender, userAmount);
        _safeKelpTransfer(treasury, fee);

        user.rewardDebt = user.amount * pool.accKelpPerShare / 1e12;
        emit Harvest(msg.sender, _pid, userAmount, fee);
    }

    /// @notice Emergency withdraw. Forfeit rewards. Safety first.
    function emergencyWithdraw(uint256 _pid) external nonReentrant {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        pool.stakedToken.safeTransfer(msg.sender, amount);
        emit EmergencyWithdraw(msg.sender, _pid, amount);
    }

    /// @notice Safe KELP transfer — handles rounding edge cases
    function _safeKelpTransfer(address _to, uint256 _amount) internal {
        uint256 kelpBal = kelp.balanceOf(address(this));
        if (_amount > kelpBal) {
            kelp.transfer(_to, kelpBal);
        } else {
            kelp.transfer(_to, _amount);
        }
    }
}
