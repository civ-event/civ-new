import {
  CHECKIN_DAILY_REWARDS,
  CHECKIN_MILESTONES,
  TOPUP_TIERS,
  WHEEL_PRIZES,
} from '../../../mock/_catalog.js';
import { ActivityStatus, ClaimStatus } from '../../utils/constants.js';
import { getRoleCache } from './roleCache.js';

function unixToIso(unixSeconds) {
  if (!unixSeconds) return null;
  const ms = Number(unixSeconds) * 1000;
  if (Number.isNaN(ms)) return null;
  const date = new Date(ms);
  const utc = date.getTime() + date.getTimezoneOffset() * 60000;
  return new Date(utc - 5 * 3600000).toISOString().replace('Z', '-05:00');
}

/** 将 civ-event time-config 各日期格式转为 UTC-5 ISO 字符串 */
function parseLegacyDateTime(raw) {
  const text = raw.trim();
  // DD/MM/YYYY HH:mm[:ss]
  let match = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    const [, day, month, year, hour, minute, second = '00'] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute}:${second.padStart(2, '0')}-05:00`;
  }
  // YYYY-MM-DD HH:mm[:ss]
  match = text.match(/^(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (match) {
    const [, year, month, day, hour, minute, second = '00'] = match;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute}:${second.padStart(2, '0')}-05:00`;
  }
  if (text.includes('T')) {
    return text.includes('-05:00') ? text : `${text}-05:00`;
  }
  return `${text.replace(' ', 'T')}-05:00`;
}

function parseTimeRange(rangeText) {
  if (!rangeText || typeof rangeText !== 'string') {
    return { startAt: null, endAt: null };
  }

  const normalized = rangeText.replace(/\s*\(UTC[-+]?\d+(?::\d+)?\)\s*$/i, '').trim();
  if (!normalized) {
    return { startAt: null, endAt: null };
  }

  let startRaw;
  let endRaw;

  if (normalized.includes('~')) {
    [startRaw, endRaw] = normalized.split('~').map((part) => part.trim());
  } else {
    const ddmmRange = normalized.match(
      /^(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*(\d{1,2}\/\d{1,2}\/\d{4}\s+\d{1,2}:\d{2}(?::\d{2})?)$/,
    );
    if (ddmmRange) {
      [, startRaw, endRaw] = ddmmRange;
    } else {
      const isoRange = normalized.match(
        /^(\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?)\s*-\s*(\d{4}-\d{1,2}-\d{1,2}\s+\d{1,2}:\d{2}(?::\d{2})?)$/,
      );
      if (isoRange) {
        [, startRaw, endRaw] = isoRange;
      }
    }
  }

  return {
    startAt: startRaw ? parseLegacyDateTime(startRaw) : null,
    endAt: endRaw ? parseLegacyDateTime(endRaw) : null,
  };
}

export function mapActivityInfo(timeConfig = {}, timestamp = {}) {
  const signRange = parseTimeRange(timeConfig.sign_activity_time);
  const serverTime = unixToIso(timestamp.time ?? timestamp.timestamp);
  const nowSec = Number(timestamp.time ?? timestamp.timestamp ?? Math.floor(Date.now() / 1000));
  let status = ActivityStatus.ACTIVE;

  const startSec = signRange.startAt ? Date.parse(signRange.startAt) / 1000 : null;
  const endSec = signRange.endAt ? Date.parse(signRange.endAt) / 1000 : null;
  if (startSec && nowSec < startSec) status = ActivityStatus.NOT_STARTED;
  if (endSec && nowSec > endSec) status = ActivityStatus.ENDED;

  return {
    status,
    startAt: signRange.startAt,
    endAt: signRange.endAt,
    timezone: 'UTC-5',
    serverTime,
  };
}

export function mapLegacyRole(role) {
  if (!role) return null;
  return {
    serverId: String(role.serverId ?? role.server_id ?? ''),
    serverName: role.servername ?? role.serverName ?? role.server_name ?? '',
    roleId: String(role.roleId ?? role.role_id ?? ''),
    roleName: role.roleName ?? role.role_name ?? '',
    level: Number(role.roleLevel ?? role.role_level ?? 0),
  };
}

export function mapSessionFromRole(role, token) {
  const mappedRole = mapLegacyRole(role);
  return {
    isLoggedIn: Boolean(token),
    token: token || null,
    role: mappedRole,
  };
}

export function mapRolesList(roles = []) {
  return roles.map(mapLegacyRole).filter((role) => role.roleId);
}

function isMilestoneClaimed(gifts = [], days) {
  return gifts.some(
    (item) => item.type === 'MILESTONE' && String(item.checkDay) === String(days),
  );
}

function isDailyDayClaimed(gifts = [], day) {
  return gifts.some(
    (item) => item.type === 'CHECK_IN' && String(item.checkDay) === String(day),
  );
}

export function mapCheckinStatus(role) {
  const checkIn = role?.checkIn ?? {};
  const checkedDays = Number(checkIn.totalCount ?? 0);
  const todayChecked = Boolean(checkIn.isCheckInToday);
  const gifts = checkIn.gifts ?? [];

  const dailyRewards = CHECKIN_DAILY_REWARDS.map((reward) => {
    let status = ClaimStatus.LOCKED;
    if (isDailyDayClaimed(gifts, reward.day) || reward.day <= checkedDays) {
      status = ClaimStatus.CLAIMED;
    } else if (!todayChecked && reward.day === checkedDays + 1) {
      status = ClaimStatus.CLAIMABLE;
    }
    return { ...reward, status };
  });

  const milestones = CHECKIN_MILESTONES.map((item) => {
    let status = ClaimStatus.LOCKED;
    if (isMilestoneClaimed(gifts, item.days)) {
      status = ClaimStatus.CLAIMED;
    } else if (checkedDays >= item.days) {
      status = ClaimStatus.CLAIMABLE;
    }
    return { ...item, status };
  });

  return { checkedDays, todayChecked, dailyRewards, milestones };
}

export function mapCheckinHistory(role) {
  const gifts = role?.checkIn?.gifts ?? [];
  return gifts.map((item) => ({
    claimedAt: unixToIso(item.createdAt),
    type: item.type === 'MILESTONE' ? 'milestone' : 'daily',
    rewardName: item.rewardName || `Day ${item.checkDay}`,
    days: item.type === 'MILESTONE' ? Number(item.checkDay) : undefined,
  }));
}

export function mapWheelInfo(role) {
  const tickets = Math.max(0, Number(role?.points ?? 0) - Number(role?.depletionPoints ?? 0));
  const gifts = role?.lottery?.winningPrizeRecords ?? [];
  const grandPrizeWon = gifts.some((item) => Number(item.prizeId) === 11);
  return {
    tickets,
    grandPrizeWon,
    prizes: WHEEL_PRIZES.map((prize) => ({ ...prize })),
  };
}

function mapPrizeId(num) {
  const prize = WHEEL_PRIZES[Number(num) - 1];
  if (!prize) {
    return {
      prizeId: `p${num}`,
      itemId: 0,
      name: `Prize ${num}`,
      quantity: 1,
    };
  }
  return {
    prizeId: prize.prizeId,
    itemId: prize.itemId,
    name: prize.name,
    quantity: prize.quantity,
  };
}

export function mapSpinResult(data, times) {
  const winningPrizes = data?.winningPrizes ?? [];
  const role = data?.roles?.[0] ?? getRoleCache().role;
  const tickets = Math.max(0, Number(role?.points ?? 0) - Number(role?.depletionPoints ?? 0));
  return {
    times,
    results: winningPrizes.map((num) => mapPrizeId(num)),
    ticketsLeft: tickets,
    spunAt: new Date().toISOString().replace('Z', '-05:00'),
  };
}

export function mapTicketHistory(role) {
  const records = role?.lottery?.ticketsRecords ?? [];
  return records.map((item) => ({
    obtainedAt: unixToIso(item.createdAt),
    amount: Number(item.points ?? 0),
    source: item.type === 'LOGIN_GAME' ? 'game_login' : 'checkin',
  }));
}

export function mapWinHistory(role) {
  const records = role?.lottery?.winningPrizeRecords ?? [];
  return records.map((item) => {
    const prize = mapPrizeId(item.prizeId);
    return {
      wonAt: unixToIso(item.createdAt),
      prizeName: prize.name,
      quantity: prize.quantity,
    };
  });
}

export function mapTopupProgress(rechargeData) {
  const totalTopup = Number(rechargeData?.total_virtual_goods ?? getRoleCache().rechargeTotal ?? 0);
  const milestones = rechargeData?.milestones ?? getRoleCache().rechargeMilestones ?? [];

  const tiers = TOPUP_TIERS.map((tier) => {
    const milestone = milestones.find((item) => Number(item.level) === tier.amount);
    let status = ClaimStatus.LOCKED;
    if (milestone?.status === 'claimed') {
      status = ClaimStatus.CLAIMED;
    } else if (totalTopup >= tier.amount) {
      status = ClaimStatus.CLAIMABLE;
    }
    return { ...tier, status };
  });

  return { totalTopup, tiers };
}

export function mapTopupClaimReward(amount) {
  const tier = TOPUP_TIERS.find((item) => item.amount === amount);
  return {
    amount,
    reward: tier
      ? { itemId: tier.itemId, name: tier.name, quantity: tier.quantity }
      : { itemId: 0, name: `Tier ${amount}`, quantity: 1 },
    claimedAt: new Date().toISOString().replace('Z', '-05:00'),
  };
}

export function mapDailyCheckinResult(data, day) {
  const role = data?.roles?.[0] ?? getRoleCache().role;
  const rewardMeta = CHECKIN_DAILY_REWARDS.find((item) => item.day === day);
  const tickets = Math.max(0, Number(role?.points ?? 0) - Number(role?.depletionPoints ?? 0));
  return {
    day,
    ticketReward: 3,
    ticketsTotal: tickets,
    reward: rewardMeta
      ? { itemId: rewardMeta.itemId, name: rewardMeta.name, quantity: rewardMeta.quantity }
      : { itemId: 0, name: `Day ${day}`, quantity: 1 },
    claimedAt: new Date().toISOString().replace('Z', '-05:00'),
  };
}

export function mapMilestoneClaimResult(days) {
  const rewardMeta = CHECKIN_MILESTONES.find((item) => item.days === days);
  return {
    days,
    reward: rewardMeta
      ? { itemId: rewardMeta.itemId, name: rewardMeta.name, quantity: rewardMeta.quantity }
      : { itemId: 0, name: `Milestone ${days}`, quantity: 1 },
    claimedAt: new Date().toISOString().replace('Z', '-05:00'),
  };
}

export function applyRoleToCache(role) {
  if (!role) return null;
  const mapped = mapLegacyRole(role);
  return mapped;
}
