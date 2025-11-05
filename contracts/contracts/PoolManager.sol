// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PoolManager
 * @dev Manages collaborative savings pools on Celo blockchain
 * @notice Allows users to create pools, contribute funds, and withdraw when goals are reached
 */
contract PoolManager {
    // Pool structure
    struct Pool {
        uint256 id;
        address creator;
        string name;
        uint256 targetAmount;
        uint256 currentAmount;
        uint256 contributionAmount;
        uint256 maxMembers;
        uint256 currentMembers;
        uint256 deadline;
        bool isActive;
        bool isCompleted;
        mapping(address => bool) contributors;
        address[] memberList;
    }

    // State variables
    uint256 public poolCount;
    mapping(uint256 => Pool) public pools;
    mapping(address => uint256[]) public userPools;

    // Events
    event PoolCreated(
        uint256 indexed poolId,
        address indexed creator,
        string name,
        uint256 targetAmount,
        uint256 contributionAmount,
        uint256 maxMembers,
        uint256 deadline
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

    // Modifiers
    modifier validPool(uint256 _poolId) {
        require(_poolId > 0 && _poolId <= poolCount, "Pool does not exist");
        require(pools[_poolId].isActive, "Pool is not active");
        _;
    }

    modifier onlyCreator(uint256 _poolId) {
        require(
            pools[_poolId].creator == msg.sender,
            "Only pool creator can perform this action"
        );
        _;
    }

    /**
     * @dev Create a new savings pool
     * @param _name Name of the pool
     * @param _targetAmount Target amount to reach (in wei)
     * @param _contributionAmount Amount each member should contribute (in wei)
     * @param _maxMembers Maximum number of members allowed
     * @param _deadline Deadline timestamp (Unix timestamp)
     */
    function createPool(
        string memory _name,
        uint256 _targetAmount,
        uint256 _contributionAmount,
        uint256 _maxMembers,
        uint256 _deadline
    ) public {
        require(bytes(_name).length > 0, "Pool name cannot be empty");
        require(_targetAmount > 0, "Target amount must be greater than 0");
        require(
            _contributionAmount > 0,
            "Contribution amount must be greater than 0"
        );
        require(_maxMembers > 0, "Max members must be greater than 0");
        require(
            _deadline > block.timestamp,
            "Deadline must be in the future"
        );
        require(
            _targetAmount >= _contributionAmount,
            "Target amount must be at least equal to contribution amount"
        );

        poolCount++;
        Pool storage newPool = pools[poolCount];

        newPool.id = poolCount;
        newPool.creator = msg.sender;
        newPool.name = _name;
        newPool.targetAmount = _targetAmount;
        newPool.currentAmount = 0;
        newPool.contributionAmount = _contributionAmount;
        newPool.maxMembers = _maxMembers;
        newPool.currentMembers = 0;
        newPool.deadline = _deadline;
        newPool.isActive = true;
        newPool.isCompleted = false;

        userPools[msg.sender].push(poolCount);

        emit PoolCreated(
            poolCount,
            msg.sender,
            _name,
            _targetAmount,
            _contributionAmount,
            _maxMembers,
            _deadline
        );
    }

    /**
     * @dev Contribute to a pool
     * @param _poolId ID of the pool to contribute to
     */
    function contribute(uint256 _poolId) public payable validPool(_poolId) {
        Pool storage pool = pools[_poolId];

        require(
            block.timestamp <= pool.deadline,
            "Pool deadline has passed"
        );
        require(!pool.isCompleted, "Pool is already completed");
        require(
            pool.currentMembers < pool.maxMembers,
            "Pool has reached maximum members"
        );
        require(
            msg.value == pool.contributionAmount,
            "Contribution amount must match pool requirement"
        );
        require(
            !pool.contributors[msg.sender],
            "You have already contributed to this pool"
        );

        pool.currentAmount += msg.value;
        pool.contributors[msg.sender] = true;
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

    /**
     * @dev Withdraw funds from a completed pool
     * @param _poolId ID of the pool to withdraw from
     */
    function withdraw(uint256 _poolId) public validPool(_poolId) {
        Pool storage pool = pools[_poolId];

        require(pool.isCompleted, "Pool is not completed yet");
        require(
            pool.contributors[msg.sender],
            "You have not contributed to this pool"
        );

        uint256 amount = pool.contributionAmount;
        pool.contributors[msg.sender] = false;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Withdrawal failed");

        emit FundsWithdrawn(_poolId, msg.sender, amount);
    }

    /**
     * @dev Cancel a pool (only by creator, before contributions)
     * @param _poolId ID of the pool to cancel
     */
    function cancelPool(
        uint256 _poolId
    ) public validPool(_poolId) onlyCreator(_poolId) {
        Pool storage pool = pools[_poolId];

        require(pool.currentMembers == 0, "Cannot cancel pool with members");
        require(!pool.isCompleted, "Cannot cancel completed pool");

        pool.isActive = false;

        emit PoolCancelled(_poolId, msg.sender);
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
    function getPoolBasicInfo(
        uint256 _poolId
    )
        public
        view
        returns (
            uint256 id,
            address creator,
            string memory name,
            uint256 deadline,
            bool isActive,
            bool isCompleted
        )
    {
        require(_poolId > 0 && _poolId <= poolCount, "Pool does not exist");
        Pool storage pool = pools[_poolId];

        return (
            pool.id,
            pool.creator,
            pool.name,
            pool.deadline,
            pool.isActive,
            pool.isCompleted
        );
    }

    /**
     * @dev Get financial information about a pool
     * @param _poolId ID of the pool
     * @return targetAmount Target amount
     * @return currentAmount Current amount collected
     * @return contributionAmount Required contribution amount
     */
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
        require(_poolId > 0 && _poolId <= poolCount, "Pool does not exist");
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
    function getPoolMemberInfo(
        uint256 _poolId
    ) public view returns (uint256 maxMembers, uint256 currentMembers) {
        require(_poolId > 0 && _poolId <= poolCount, "Pool does not exist");
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
     * @dev Get pool members list
     * @param _poolId ID of the pool
     * @return Array of member addresses
     */
    function getPoolMembers(
        uint256 _poolId
    ) public view returns (address[] memory) {
        require(_poolId > 0 && _poolId <= poolCount, "Pool does not exist");
        return pools[_poolId].memberList;
    }

    /**
     * @dev Emergency withdraw function for stuck funds (only for testing)
     * @notice This function should be removed or restricted in production
     */
    function emergencyWithdraw() public {
        // Only allow in testnet or with proper access control
        payable(msg.sender).transfer(address(this).balance);
    }
}

