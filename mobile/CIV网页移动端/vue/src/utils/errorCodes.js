/** @enum {number} */
export const ErrorCode = {
  SUCCESS: 0,
  UNKNOWN: 1,

  /** 用户 / 鉴权 */
  NOT_LOGGED_IN: 1001,
  NO_ROLE_SELECTED: 1002,
  LEVEL_TOO_LOW: 1003,
  INVALID_TOKEN: 1004,

  /** 活动 */
  ACTIVITY_NOT_STARTED: 2001,
  ACTIVITY_ENDED: 2002,

  /** 签到 */
  ALREADY_CHECKED_IN: 3001,
  MILESTONE_NOT_READY: 3002,
  REWARD_ALREADY_CLAIMED: 3003,
  CHECKIN_DAY_LOCKED: 3004,

  /** 转盘 */
  INSUFFICIENT_TICKETS: 4001,
  GRAND_PRIZE_ALREADY_WON: 4002,
  INVALID_SPIN_TIMES: 4003,

  /** 累充 */
  TOPUP_TIER_NOT_REACHED: 5001,
  TOPUP_ALREADY_CLAIMED: 5002,
  INVALID_TOPUP_TIER: 5003,
};

/** @type {Record<number, string>} */
export const ErrorI18nKey = {
  [ErrorCode.UNKNOWN]: 'errors.unknown',
  [ErrorCode.NOT_LOGGED_IN]: 'errors.pleaseLogin',
  [ErrorCode.NO_ROLE_SELECTED]: 'errors.selectCharacter',
  [ErrorCode.LEVEL_TOO_LOW]: 'errors.levelTooLow',
  [ErrorCode.INVALID_TOKEN]: 'errors.sessionExpired',
  [ErrorCode.ACTIVITY_NOT_STARTED]: 'errors.eventNotStarted',
  [ErrorCode.ACTIVITY_ENDED]: 'errors.eventEnded',
  [ErrorCode.ALREADY_CHECKED_IN]: 'errors.alreadyCheckedIn',
  [ErrorCode.MILESTONE_NOT_READY]: 'errors.milestoneNotReady',
  [ErrorCode.REWARD_ALREADY_CLAIMED]: 'errors.rewardClaimed',
  [ErrorCode.CHECKIN_DAY_LOCKED]: 'errors.checkinDayLocked',
  [ErrorCode.INSUFFICIENT_TICKETS]: 'errors.notEnoughTickets',
  [ErrorCode.GRAND_PRIZE_ALREADY_WON]: 'errors.grandPrizeWon',
  [ErrorCode.INVALID_SPIN_TIMES]: 'errors.invalidSpinTimes',
  [ErrorCode.TOPUP_TIER_NOT_REACHED]: 'errors.topupNotReached',
  [ErrorCode.TOPUP_ALREADY_CLAIMED]: 'errors.topupClaimed',
  [ErrorCode.INVALID_TOPUP_TIER]: 'errors.invalidTopupTier',
};

/** @type {Record<number, string>} */
export const ErrorMessage = {
  [ErrorCode.UNKNOWN]: 'Something went wrong. Please try again.',
  [ErrorCode.NOT_LOGGED_IN]: 'Please log in first.',
  [ErrorCode.NO_ROLE_SELECTED]: 'Please select a character first.',
  [ErrorCode.LEVEL_TOO_LOW]: 'Character level must be ≥ 5 to participate.',
  [ErrorCode.INVALID_TOKEN]: 'Session expired. Please log in again.',
  [ErrorCode.ACTIVITY_NOT_STARTED]: 'The event has not started yet.',
  [ErrorCode.ACTIVITY_ENDED]: 'The event has ended.',
  [ErrorCode.ALREADY_CHECKED_IN]: 'You have already checked in today.',
  [ErrorCode.MILESTONE_NOT_READY]: 'Cumulative check-in days not reached.',
  [ErrorCode.REWARD_ALREADY_CLAIMED]: 'This reward has already been claimed.',
  [ErrorCode.CHECKIN_DAY_LOCKED]: 'This check-in day is not available yet.',
  [ErrorCode.INSUFFICIENT_TICKETS]: 'Not enough Lucky Tickets.',
  [ErrorCode.GRAND_PRIZE_ALREADY_WON]: 'Grand prize can only be won once per character.',
  [ErrorCode.INVALID_SPIN_TIMES]: 'Invalid spin times.',
  [ErrorCode.TOPUP_TIER_NOT_REACHED]: 'Top-up amount has not reached this tier.',
  [ErrorCode.TOPUP_ALREADY_CLAIMED]: 'This tier reward has already been claimed.',
  [ErrorCode.INVALID_TOPUP_TIER]: 'Invalid top-up tier.',
};

/**
 * @param {number} code
 * @param {string} [override]
 */
export function getErrorMessageByCode(code, override) {
  if (override) return override;
  return ErrorMessage[code] ?? ErrorMessage[ErrorCode.UNKNOWN];
}
