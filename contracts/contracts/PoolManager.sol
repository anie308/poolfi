// SPDX-License-Identifier: MIT
pragma solidity ^0.8.30;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable2Step.sol";

/// @title PoolManager
/// @author PoolFi Team
/// @notice Manages collaborative savings pools on Celo blockchain
/// @dev Allows users to create pools, contribute funds, and withdraw when goals are reached
contract PoolManager is ReentrancyGuard, Ownable2Step {
    /// @notice Minimum time before deadline when contributions are allowed (prevents front-running)
    uint256 private constant MIN_CONTRIBUTION_TIME_BEFORE_DEADLINE = 1 hours;
    
    /// @notice Pool structure for managing savings pools
    struct Pool {
        uint256 id;
        address creator;
        string name;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 contributionAmount;
        uint256 maxMembers;
        uint256 currentMembers;
        uint48 deadline; // Optimized: uint48 sufficient for timestamps
        bool isActive;
        bool isCompleted;
        bool isRefundable; // True if pool failed and contributors can get refunds
        mapping(address => bool) contributors;
        mapping(address => uint256) contributions; // Track individual contribution amounts
        address[] memberList;
    }

    /// @notice Total number of pools created
    uint256 public poolCount;
    /// @notice Mapping from pool ID to Pool struct
    mapping(uint256 => Pool) public pools;
    /// @notice Mapping from user address to array of pool IDs they're involved in
    mapping(address => uint256[]) public userPools;

    /// @notice Constructor sets the initial owner
    /// @dev Emits ownership transfer event
    constructor() payable Ownable(msg.sender) {
    }

    /// @notice Emitted when a new pool is created
    event PoolCreated(
        uint256 indexed poolId,
        address indexed creator,
        string name,
        uint256 targetAmount,
        uint256 contributionAmount,
        uint256 maxMembers,
        uint48 deadline
    );

    event ContributionMade(
        uint256 indexed poolId,
        address indexed contributor,
        uint256 amount,
        uint256 totalContributed
    );

    event PoolCompleted(uint256 indexed poolId, uint256 totalAmount);

    event FundsWithdrawn(
        uint256 indexed poolId,
        address indexed recipient,
        uint256 amount
    );

    event PoolCancelled(uint256 indexed poolId, address indexed creator);

    event PoolFailed(uint256 indexed poolId, uint256 totalAmount);
    
    event RefundIssued(
        uint256 indexed poolId,
        address indexed contributor,
        uint256 amount
    );

    /// @notice Modifier to validate pool exists and is active
    /// @param _poolId Pool ID to validate
    modifier validPool(uint256 _poolId) {
        require(_poolId != 0 && _poolId <= poolCount, "Pool does not exist");
        require(pools[_poolId].isActive, "Pool is not active");
        _;
    }

    /// @notice Modifier to restrict function to pool creator
    /// @param _poolId Pool ID to check creator
    modifier onlyCreator(uint256 _poolId) {
        require(
            pools[_poolId].creator == msg.sender,
            "Only pool creator"
        );
        _;
    }

    /// @notice Create a new savings pool
    /// @param _name Name of the pool
    /// @param _targetAmount Target amount to reach (in wei)
    /// @param _contributionAmount Amount each member should contribute (in wei)
    /// @param _maxMembers Maximum number of members allowed
    /// @param _deadline Deadline timestamp (Unix timestamp)
    function createPool(
        string memory _name,
        uint256 _targetAmount,
        uint256 _contributionAmount,
        uint256 _maxMembers,
        uint256 _deadline
    ) public {
        require(msg.sender != address(0), "Invalid sender");
        require(bytes(_name).length != 0, "Name required");
        require(_targetAmount != 0, "Target > 0");
        require(_contributionAmount != 0, "Contrib > 0");
        require(_maxMembers != 0, "Max > 0");
        require(_deadline > block.timestamp, "Deadline future");
        require(_targetAmount >= _contributionAmount, "Target >= Contrib");

        uint256 _poolCount = ++poolCount;
        Pool storage newPool = pools[_poolCount];

        newPool.id = _poolCount;
        newPool.creator = msg.sender;
        newPool.name = _name;
        newPool.targetAmount = _targetAmount;
        delete newPool.currentAmount; // Gas optimization
        newPool.contributionAmount = _contributionAmount;
        newPool.maxMembers = _maxMembers;
        delete newPool.currentMembers; // Gas optimization
        newPool.deadline = uint48(_deadline); // Safe cast
        newPool.isActive = true;
        newPool.isCompleted = false;
        newPool.isRefundable = false;

        userPools[msg.sender].push(poolCount);

        emit PoolCreated(
            _poolCount,
            msg.sender,
            _name,
            _targetAmount,
            _contributionAmount,
            _maxMembers,
            uint48(_deadline)
        );
    }

    /// @notice Contribute to a pool
    /// @param _poolId ID of the pool to contribute to
    /// @notice Prevents front-running by requiring contributions at least 1 hour before deadline
    function contribute(uint256 _poolId) public payable validPool(_poolId) {
        require(msg.sender != address(0), "Invalid sender");
        require(msg.value != 0, "Contrib > 0");
        
        Pool storage pool = pools[_poolId];
        uint48 poolDeadline = pool.deadline;

        require(block.timestamp < poolDeadline, "Deadline passed");
        require(
            block.timestamp < poolDeadline - MIN_CONTRIBUTION_TIME_BEFORE_DEADLINE,
            "Too close"
        );
        require(!pool.isCompleted, "Completed");
        require(!pool.isRefundable, "Refundable");
        require(pool.currentMembers < pool.maxMembers, "Max members");
        require(msg.value == pool.contributionAmount, "Amount mismatch");
        require(!pool.contributors[msg.sender], "Already contributed");

        pool.currentAmount += msg.value;
        pool.contributors[msg.sender] = true;
        pool.contributions[msg.sender] = msg.value; // Track individual contribution
        pool.memberList.push(msg.sender);
        pool.currentMembers++;

        userPools[msg.sender].push(_poolId);

        emit ContributionMade(
            _poolId,
            msg.sender,
            msg.value,
            pool.currentAmount
        );

        // Check if pool is completed
        if (pool.currentAmount >= pool.targetAmount) {
            pool.isCompleted = true;
            pool.isActive = false;
            emit PoolCompleted(_poolId, pool.currentAmount);
        }
    }

    /// @notice Withdraw funds from a completed pool
    /// @param _poolId ID of the pool to withdraw from
    /// @notice Protected against reentrancy attacks
    function withdraw(uint256 _poolId) public nonReentrant {
        require(msg.sender != address(0), "Invalid sender");
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        Pool storage pool = pools[_poolId];

        require(pool.isCompleted, "Not completed");
        require(pool.contributors[msg.sender], "Not contributor");

        uint256 amount = pool.contributions[msg.sender];
        require(amount != 0, "No funds");
        
        // Update state before external call (Checks-Effects-Interactions pattern)
        pool.contributors[msg.sender] = false;
        delete pool.contributions[msg.sender]; // Gas optimization
        pool.currentAmount -= amount;

        address recipient = msg.sender;
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(_poolId, recipient, amount);
    }

    /// @notice Cancel a pool (only by creator, before contributions)
    /// @param _poolId ID of the pool to cancel
    function cancelPool(
        uint256 _poolId
    ) public validPool(_poolId) onlyCreator(_poolId) {
        Pool storage pool = pools[_poolId];

        require(pool.currentMembers == 0, "Has members");
        require(!pool.isCompleted, "Completed");
        require(!pool.isRefundable, "Refundable");

        pool.isActive = false;

        emit PoolCancelled(_poolId, msg.sender);
    }
    
    /// @notice Mark a pool as failed and enable refunds
    /// @param _poolId ID of the pool that failed
    /// @notice Can be called by anyone after deadline if pool didn't reach target
    function markPoolAsFailed(uint256 _poolId) public {
        require(msg.sender != address(0), "Invalid sender");
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        Pool storage pool = pools[_poolId];
        
        require(pool.isActive, "Not active");
        require(!pool.isCompleted, "Completed");
        require(!pool.isRefundable, "Already failed");
        require(block.timestamp > pool.deadline, "Deadline passed");
        require(pool.currentAmount < pool.targetAmount, "Target reached");
        
        pool.isActive = false;
        pool.isRefundable = true;
        
        emit PoolFailed(_poolId, pool.currentAmount);
    }
    
    /// @notice Refund contribution from a failed pool
    /// @param _poolId ID of the pool to get refund from
    /// @notice Protected against reentrancy attacks
    function refund(uint256 _poolId) public nonReentrant {
        require(msg.sender != address(0), "Invalid sender");
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        Pool storage pool = pools[_poolId];
        
        require(pool.isRefundable, "Not refundable");
        require(pool.contributors[msg.sender], "Not contributor");
        
        uint256 amount = pool.contributions[msg.sender];
        require(amount != 0, "No funds");
        
        // Update state before external call (Checks-Effects-Interactions pattern)
        pool.contributors[msg.sender] = false;
        delete pool.contributions[msg.sender]; // Gas optimization
        pool.currentAmount -= amount;
        pool.currentMembers--;
        
        address recipient = msg.sender;
        (bool success, ) = recipient.call{value: amount}("");
        require(success, "Transfer failed");
        
        emit RefundIssued(_poolId, recipient, amount);
    }

    /**
     * @dev Get basic information about a pool
     * @param _poolId ID of the pool
     * @return id Pool ID
     * @return creator Creator address
     * @return name Pool name
     * @return deadline Pool deadline
     * @return isActive Whether pool is active
     * @return isCompleted Whether pool is completed
     */
    /// @notice Get basic information about a pool
    /// @param _poolId ID of the pool
    /// @return id Pool ID
    /// @return creator Creator address
    /// @return name Pool name
    /// @return deadline Pool deadline
    /// @return isActive Whether pool is active
    /// @return isCompleted Whether pool is completed
    /// @return isRefundable Whether pool is refundable
    function getPoolBasicInfo(
        uint256 _poolId
    )
        public
        view
        returns (
            uint256 id,
            address creator,
            string memory name,
            uint48 deadline,
            bool isActive,
            bool isCompleted,
            bool isRefundable
        )
    {
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        Pool storage pool = pools[_poolId];

        return (
            pool.id,
            pool.creator,
            pool.name,
            pool.deadline,
            pool.isActive,
            pool.isCompleted,
            pool.isRefundable
        );
    }

    /**
     * @dev Get financial information about a pool
     * @param _poolId ID of the pool
     * @return targetAmount Target amount
     * @return currentAmount Current amount collected
     * @return contributionAmount Required contribution amount
     */
    /// @notice Get financial information about a pool
    /// @param _poolId ID of the pool
    /// @return targetAmount Target amount
    /// @return currentAmount Current amount collected
    /// @return contributionAmount Required contribution amount
    function getPoolFinancialInfo(
        uint256 _poolId
    )
        public
        view
        returns (
            uint256 targetAmount,
            uint256 currentAmount,
            uint256 contributionAmount
        )
    {
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        Pool storage pool = pools[_poolId];

        return (
            pool.targetAmount,
            pool.currentAmount,
            pool.contributionAmount
        );
    }

    /**
     * @dev Get member information about a pool
     * @param _poolId ID of the pool
     * @return maxMembers Maximum number of members
     * @return currentMembers Current number of members
     */
    /// @notice Get member information about a pool
    /// @param _poolId ID of the pool
    /// @return maxMembers Maximum number of members
    /// @return currentMembers Current number of members
    function getPoolMemberInfo(
        uint256 _poolId
    ) public view returns (uint256 maxMembers, uint256 currentMembers) {
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        Pool storage pool = pools[_poolId];

        return (pool.maxMembers, pool.currentMembers);
    }

    /**
     * @dev Get all pools created/joined by a user
     * @param _user User address
     * @return Array of pool IDs
     */
    function getUserPools(address _user) public view returns (uint256[] memory) {
        return userPools[_user];
    }

    /**
     * @dev Check if a user has contributed to a pool
     * @param _poolId ID of the pool
     * @param _user User address
     * @return Whether user has contributed
     */
    function hasUserContributed(
        uint256 _poolId,
        address _user
    ) public view returns (bool) {
        require(_poolId > 0 && _poolId <= poolCount, "Pool does not exist");
        return pools[_poolId].contributors[_user];
    }

    /**
     * @dev Get pool members list (backward compatible)
     * @param _poolId ID of the pool
     * @return Array of member addresses
     * @notice Returns all members. Use getPoolMembersPaginated() for gas optimization.
     */
    /// @notice Get pool members list (backward compatible)
    /// @param _poolId ID of the pool
    /// @return Array of member addresses
    /// @notice Returns all members. Use getPoolMembersPaginated() for gas optimization.
    function getPoolMembers(
        uint256 _poolId
    ) public view returns (address[] memory) {
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        return pools[_poolId].memberList;
    }

    /**
     * @dev Get pool members list with pagination (gas-optimized)
     * @param _poolId ID of the pool
     * @param _startIndex Starting index for pagination (0-based)
     * @param _endIndex Ending index for pagination (exclusive, use 0 for all)
     * @return Array of member addresses
     * @notice Use this for large pools to save gas. Returns empty array if no members.
     */
    /// @notice Get pool members list with pagination (gas-optimized)
    /// @param _poolId ID of the pool
    /// @param _startIndex Starting index for pagination (0-based)
    /// @param _endIndex Ending index for pagination (exclusive, use 0 for all)
    /// @return Array of member addresses
    /// @notice Use this for large pools to save gas. Returns empty array if no members.
    function getPoolMembersPaginated(
        uint256 _poolId,
        uint256 _startIndex,
        uint256 _endIndex
    ) public view returns (address[] memory) {
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        address[] storage allMembers = pools[_poolId].memberList; // Use storage for gas optimization
        uint256 totalMembers = allMembers.length;
        
        if (totalMembers == 0) {
            return new address[](0);
        }
        
        // If endIndex is 0, return all members
        if (_endIndex == 0) {
            _endIndex = totalMembers;
        }
        
        require(_startIndex < totalMembers, "Start OOB");
        require(_endIndex <= totalMembers, "End OOB");
        require(_startIndex < _endIndex, "Invalid range");
        
        uint256 resultLength = _endIndex - _startIndex;
        address[] memory result = new address[](resultLength);
        
        // Gas-optimized loop with unchecked increment
        uint256 startIdx = _startIndex; // Cache for gas optimization
        for (uint256 i = 0; i < resultLength;) {
            result[i] = allMembers[startIdx + i];
            unchecked {
                ++i;
            }
        }
        
        return result;
    }
    
    /**
     * @dev Get total number of members in a pool
     * @param _poolId ID of the pool
     * @return Total number of members
     */
    /// @notice Get total number of members in a pool
    /// @param _poolId ID of the pool
    /// @return Total number of members
    function getPoolMemberCount(uint256 _poolId) public view returns (uint256) {
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        return pools[_poolId].memberList.length;
    }

    /// @notice Emergency withdrawal delay (7-day time-lock)
    uint256 private constant EMERGENCY_WITHDRAW_DELAY = 7 days;
    uint256 public emergencyWithdrawCount;
    uint256 public emergencyWithdrawRequestedAt;
    mapping(uint256 => EmergencyWithdraw) public emergencyWithdrawals;
    
    struct EmergencyWithdraw {
        uint256 amount;
        uint256 timestamp;
        address recipient;
    }
    
    /// @notice Emitted when emergency withdrawal is requested
    event EmergencyWithdrawRequested(
        address indexed requester,
        uint256 requestedAt,
        uint256 unlockTime
    );
    
    /// @notice Emitted when emergency withdrawal is executed
    /// @dev block.timestamp is automatically included in event logs
    event EmergencyWithdrawExecuted(
        uint256 indexed withdrawalId,
        address indexed recipient,
        uint256 amount
    );
    
    /**
     * @dev Request emergency withdrawal (starts time-lock)
     * @notice Owner must call this first, then wait EMERGENCY_WITHDRAW_DELAY before executing
     */
    /// @notice Request emergency withdrawal (starts time-lock)
    /// @notice Owner must call this first, then wait EMERGENCY_WITHDRAW_DELAY before executing
    function requestEmergencyWithdraw() public onlyOwner {
        emergencyWithdrawRequestedAt = block.timestamp;
        emit EmergencyWithdrawRequested(
            msg.sender,
            block.timestamp,
            block.timestamp + EMERGENCY_WITHDRAW_DELAY
        );
    }
    
    /// @notice Emergency withdraw function for stuck funds (admin only)
    /// @notice Only contract owner can call this function. Requires time-lock period.
    /// @dev Emits event for transparency and tracks all emergency withdrawals
    function emergencyWithdraw() public nonReentrant onlyOwner {
        uint256 balance = address(this).balance;
        require(balance != 0, "No funds");
        
        // Time-lock check: ensure request was made and delay has passed
        require(
            emergencyWithdrawRequestedAt != 0,
            "Not requested"
        );
        require(
            block.timestamp >= emergencyWithdrawRequestedAt + EMERGENCY_WITHDRAW_DELAY,
            "Time-lock"
        );
        
        // Prevent withdrawal if there are pools with funds that haven't been distributed
        // Optimized: only check pools that could have funds (active, refundable, or completed with funds)
        bool hasPoolsWithFunds = false;
        uint256 _poolCount = poolCount; // Cache to save gas
        for (uint256 i = 1; i <= _poolCount;) {
            Pool storage pool = pools[i];
            // Only check pools that have funds
            if (pool.currentAmount > 0) {
                if (pool.isActive && !pool.isCompleted) {
                    // Active pool with funds
                    hasPoolsWithFunds = true;
                    break;
                } else if (pool.isRefundable) {
                    // Refundable pool - users still need to claim refunds
                    hasPoolsWithFunds = true;
                    break;
                } else if (pool.isCompleted) {
                    // Completed pool - conservative check
                    hasPoolsWithFunds = true;
                    break;
                }
            }
            unchecked {
                ++i; // Gas optimization: unchecked increment
            }
        }
        require(!hasPoolsWithFunds, "Pools with funds");
        
        // Reset the request timestamp after successful withdrawal
        delete emergencyWithdrawRequestedAt; // Gas optimization
        
        uint256 _withdrawCount = ++emergencyWithdrawCount;
        address _owner = owner(); // Cache owner() call
        emergencyWithdrawals[_withdrawCount].amount = balance;
        emergencyWithdrawals[_withdrawCount].timestamp = block.timestamp;
        emergencyWithdrawals[_withdrawCount].recipient = _owner;
        
        (bool success, ) = _owner.call{value: balance}("");
        require(success, "Transfer failed");
        
        emit EmergencyWithdrawExecuted(_withdrawCount, _owner, balance);
    }
    
    /**
     * @dev Get a contributor's contribution amount for a specific pool
     * @param _poolId ID of the pool
     * @param _contributor Address of the contributor
     * @return Amount contributed by the user
     */
    /// @notice Get a contributor's contribution amount for a specific pool
    /// @param _poolId ID of the pool
    /// @param _contributor Address of the contributor
    /// @return Amount contributed by the user
    function getContributionAmount(
        uint256 _poolId,
        address _contributor
    ) public view returns (uint256) {
        require(_poolId != 0 && _poolId <= poolCount, "Pool exists");
        require(_contributor != address(0), "Invalid address");
        return pools[_poolId].contributions[_contributor];
    }
    
    /// @notice Receive function to handle direct ETH transfers
    /// @notice Reverts to prevent accidental ETH deposits
    receive() external payable {
        revert("Direct ETH not allowed");
    }
    
    /// @notice Fallback function to handle unknown function calls
    /// @notice Reverts to prevent accidental ETH deposits
    fallback() external payable {
        revert("Function not found");
    }
    
    /**
     * @dev Get the unlock time for emergency withdrawal
     * @return unlockTime Timestamp when emergency withdrawal can be executed (0 if not requested)
     */
    /// @notice Get the unlock time for emergency withdrawal
    /// @return unlockTime Timestamp when emergency withdrawal can be executed (0 if not requested)
    function getEmergencyWithdrawUnlockTime() public view returns (uint256 unlockTime) {
        uint256 requestTime = emergencyWithdrawRequestedAt;
        if (requestTime == 0) {
            return 0;
        }
        unlockTime = requestTime + EMERGENCY_WITHDRAW_DELAY;
    }
}

