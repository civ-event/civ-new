/** 签到每日奖励（需求文档 2.3） */
export const CHECKIN_DAILY_REWARDS = [
  { day: 1, itemId: 4, name: 'Diamond x100', quantity: 1 },
  { day: 2, itemId: 11011, name: 'Rough Brush x50', quantity: 50 },
  { day: 3, itemId: 11021, name: 'Fine Clay x1', quantity: 1 },
  { day: 4, itemId: 10006, name: 'Signet Ring x3', quantity: 3 },
  { day: 5, itemId: 11022, name: 'Norman Oak x10', quantity: 10 },
  { day: 6, itemId: 11015, name: 'Genesis Shovel x1', quantity: 1 },
  { day: 7, itemId: 4, name: 'Diamond x100', quantity: 100 },
  { day: 8, itemId: 11023, name: 'Copper Axis x1', quantity: 1 },
  { day: 9, itemId: 11024, name: 'Humanities Shovel x1', quantity: 1 },
  { day: 10, itemId: 4, name: 'Diamond x300', quantity: 300 },
];

/** 累计签到奖励 */
export const CHECKIN_MILESTONES = [
  { days: 7, itemId: 11021, name: 'Fine Clay x3', quantity: 3 },
  { days: 10, itemId: 11015, name: 'Genesis Shovel x3', quantity: 3 },
];

/** 转盘奖品池（需求文档 4.3） */
export const WHEEL_PRIZES = [
  { prizeId: 'p1', itemId: 11011, name: 'Rough Brush x30', quantity: 30, probability: 0.15 },
  { prizeId: 'p2', itemId: 11016, name: 'Olive Branch x3', quantity: 3, probability: 0.15 },
  { prizeId: 'p3', itemId: 11012, name: 'Basic Brush x10', quantity: 10, probability: 0.1 },
  { prizeId: 'p4', itemId: 11008, name: 'Trade License x3', quantity: 3, probability: 0.1 },
  { prizeId: 'p5', itemId: 10007, name: 'Contract x50', quantity: 50, probability: 0.1 },
  { prizeId: 'p6', itemId: 10006, name: 'Signet Ring x3', quantity: 3, probability: 0.1 },
  { prizeId: 'p7', itemId: 10004, name: 'Random Resource Chest x30', quantity: 30, probability: 0.2 },
  { prizeId: 'p8', itemId: 11021, name: 'Fine Clay x3', quantity: 3, probability: 0.03 },
  { prizeId: 'p9', itemId: 11018, name: 'Tribute Plate x5', quantity: 5, probability: 0.05 },
  { prizeId: 'p10', itemId: 4, name: 'Diamond x300', quantity: 300, probability: 0.0167 },
  {
    prizeId: 'p11',
    itemId: 0,
    name: 'Top-Up Coupon (Valid for the $19.99 tier only) x1',
    quantity: 1,
    probability: 0.0033,
    isGrandPrize: true,
  },
];

/** 累充档位（需求文档 3.3） */
export const TOPUP_TIERS = [
  { amount: 499, itemId: 13405, name: 'Chat Bubble x1', quantity: 1 },
  { amount: 999, itemId: 11021, name: 'Fine Clay x5', quantity: 5 },
  { amount: 1999, itemId: 11158, name: 'Emoji Chest x3', quantity: 3 },
  { amount: 2999, itemId: 13305, name: 'Avatar Frame x1', quantity: 1 },
  { amount: 4999, itemId: 11021, name: 'Fine Clay x20', quantity: 20 },
  { amount: 9999, itemId: 20003, name: 'Protagonist Skin Chest', quantity: 1 },
];

/** Mock 可选角色 */
export const MOCK_ROLES = [
  { serverId: 's1', serverName: 'Server 1', roleId: 'r1', roleName: 'Chieftain', level: 10 },
  { serverId: 's2', serverName: 'Server 2', roleId: 'r2', roleName: 'Explorer', level: 4 },
  { serverId: 's3', serverName: 'Server 3', roleId: 'r3', roleName: 'Warlord', level: 15 },
];
