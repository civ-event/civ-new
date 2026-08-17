/**
 * @typedef {'not_started' | 'active' | 'ended'} ActivityStatus
 * @typedef {'locked' | 'claimable' | 'claimed'} RewardStatus
 * @typedef {'daily' | 'milestone'} CheckinRewardType
 * @typedef {'checkin' | 'game_login'} TicketSource
 */

/**
 * @typedef {Object} ApiResponse
 * @property {number} code
 * @property {unknown} data
 * @property {string} msg
 */

/**
 * @typedef {Object} ActivityInfo
 * @property {ActivityStatus} status
 * @property {string} startAt
 * @property {string} endAt
 * @property {string} timezone
 * @property {string} serverTime
 */

/**
 * @typedef {Object} RoleInfo
 * @property {string} serverId
 * @property {string} serverName
 * @property {string} roleId
 * @property {string} roleName
 * @property {number} level
 */

/**
 * @typedef {Object} UserSession
 * @property {boolean} isLoggedIn
 * @property {string | null} token
 * @property {RoleInfo | null} role
 */

/**
 * @typedef {Object} RewardItem
 * @property {number} itemId
 * @property {string} name
 * @property {number} quantity
 */

/**
 * @typedef {Object} DailyCheckinReward
 * @property {number} day
 * @property {RewardStatus} status
 * @property {number} itemId
 * @property {string} name
 * @property {number} quantity
 */

/**
 * @typedef {Object} CheckinMilestone
 * @property {7 | 10} days
 * @property {RewardStatus} status
 * @property {number} itemId
 * @property {string} name
 * @property {number} quantity
 */

/**
 * @typedef {Object} CheckinStatus
 * @property {number} checkedDays
 * @property {boolean} todayChecked
 * @property {DailyCheckinReward[]} dailyRewards
 * @property {CheckinMilestone[]} milestones
 */

/**
 * @typedef {Object} CheckinHistoryRecord
 * @property {string} claimedAt
 * @property {CheckinRewardType} type
 * @property {string} rewardName
 * @property {number} [days]
 */

/**
 * @typedef {Object} WheelPrize
 * @property {string} prizeId
 * @property {number} itemId
 * @property {string} name
 * @property {number} quantity
 * @property {number} probability
 * @property {boolean} [isGrandPrize]
 */

/**
 * @typedef {Object} WheelInfo
 * @property {number} tickets
 * @property {boolean} grandPrizeWon
 * @property {WheelPrize[]} prizes
 */

/**
 * @typedef {Object} SpinResultItem
 * @property {string} prizeId
 * @property {number} itemId
 * @property {string} name
 * @property {number} quantity
 */

/**
 * @typedef {Object} TicketHistoryRecord
 * @property {string} obtainedAt
 * @property {number} amount
 * @property {TicketSource} source
 */

/**
 * @typedef {Object} WinHistoryRecord
 * @property {string} wonAt
 * @property {string} prizeName
 * @property {number} quantity
 */

/**
 * @typedef {Object} TopupTier
 * @property {number} amount
 * @property {RewardStatus} status
 * @property {number} itemId
 * @property {string} name
 * @property {number} quantity
 */

/**
 * @typedef {Object} TopupProgress
 * @property {number} totalTopup
 * @property {TopupTier[]} tiers
 */

export {};
