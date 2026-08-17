# CIV 网页活动 API 契约（Mock / 真接口共用）

> Phase B 产出。所有接口统一响应格式，Mock 与真实后端共用同一套方法签名（`src/api/*`）。

## 通用约定

### Base URL

| 环境 | `VITE_API_BASE` | 说明 |
|---|---|---|
| development | `/api` | 由 `vite-plugin-mock` 拦截 |
| production | 由部署配置注入 | 指向真实后端 |

### 统一响应格式

```json
{
  "code": 0,
  "data": {},
  "msg": "ok"
}
```

- `code = 0`：成功
- `code != 0`：业务失败，`msg` 为可展示文案

### 鉴权

- Header：`Authorization: Bearer <token>`
- 活动类接口（除登录、活动信息）需：**已登录 + 已选角色 + 角色等级 ≥ 5**

### 时间

- 活动展示时区：`UTC-5`
- 时间字段：ISO 8601，带 `-05:00` 偏移

---

## 错误码

| code | 含义 |
|---|---|
| 0 | 成功 |
| 1 | 未知错误 |
| 1001 | 未登录 |
| 1002 | 未选角色 |
| 1003 | 角色等级不足（< 5） |
| 1004 | Token 无效 |
| 2001 | 活动未开始 |
| 2002 | 活动已结束 |
| 3001 | 今日已签到 |
| 3002 | 累计签到天数不足 |
| 3003 | 奖励已领取 |
| 3004 | 签到天数未解锁 |
| 4001 | 抽奖券不足 |
| 4002 | 大奖已获得过 |
| 4003 | 抽奖次数无效（仅支持 1 / 10） |
| 5001 | 累充档位未达到 |
| 5002 | 累充档位已领取 |
| 5003 | 无效累充档位 |

前端错误处理：`src/utils/errorCodes.js` + `request.js` 拦截器会将 `code/msg` 透传。

---

## 活动

### GET `/activity/info`

**鉴权**：否

**响应 data**：

```ts
{
  status: 'not_started' | 'active' | 'ended',
  startAt: string,
  endAt: string,
  timezone: 'UTC-5',
  serverTime: string
}
```

---

## 用户 / 登录

### GET `/user/session`

**鉴权**：否（根据 token 判断）

**响应 data**：

```ts
{
  isLoggedIn: boolean,
  token: string | null,
  role: RoleInfo | null
}
```

### POST `/user/login`

**鉴权**：否

**请求 body**：预留 SDK 字段，Mock 阶段可为空 `{}`

**响应 data**：

```ts
{
  token: string,
  isLoggedIn: true
}
```

### POST `/user/logout`

**响应 data**：`{ ok: true }`

### GET `/user/roles`

**鉴权**：是

**响应 data**：

```ts
{
  roles: RoleInfo[]
}
```

### POST `/user/select-role`

**鉴权**：是

**请求 body**：

```ts
{ roleId: string }
```

**响应 data**：

```ts
{ role: RoleInfo }
```

---

## 签到

### GET `/checkin/status`

**响应 data**：

```ts
{
  checkedDays: number,
  todayChecked: boolean,
  dailyRewards: Array<{
    day: number,
    status: 'locked' | 'claimable' | 'claimed',
    itemId: number,
    name: string,
    quantity: number
  }>,
  milestones: Array<{
    days: 7 | 10,
    status: 'locked' | 'claimable' | 'claimed',
    itemId: number,
    name: string,
    quantity: number
  }>
}
```

### POST `/checkin/daily`

**响应 data**：

```ts
{
  day: number,
  ticketReward: 3,
  ticketsTotal: number,
  reward: { itemId, name, quantity },
  claimedAt: string
}
```

**错误**：3001 今日已签到

### POST `/checkin/claim-milestone`

**请求 body**：`{ days: 7 | 10 }`

**响应 data**：

```ts
{
  days: 7 | 10,
  reward: { itemId, name, quantity },
  claimedAt: string
}
```

### GET `/checkin/history`

**响应 data**：

```ts
{
  records: Array<{
    claimedAt: string,
    type: 'daily' | 'milestone',
    rewardName: string,
    days?: number
  }> // 按 claimedAt 倒序（最新在前）
}
```

---

## 转盘

### GET `/wheel/info`

**响应 data**：

```ts
{
  tickets: number,
  grandPrizeWon: boolean,
  prizes: Array<{
    prizeId: string,
    itemId: number,
    name: string,
    quantity: number,
    probability: number,
    isGrandPrize?: boolean
  }>
}
```

### POST `/wheel/spin`

**请求 body**：`{ times: 1 | 10 }`

**响应 data**：

```ts
{
  times: 1 | 10,
  results: Array<{ prizeId, itemId, name, quantity }>,
  ticketsLeft: number,
  spunAt: string
}
```

**错误**：4001 券不足；4003 次数无效

### GET `/wheel/ticket-history`

**响应 data**：

```ts
{
  records: Array<{
    obtainedAt: string,
    amount: number,
    source: 'checkin' | 'game_login'
  }> // 按 obtainedAt 倒序（最新在前）
}
```

### GET `/wheel/win-history`

**响应 data**：

```ts
{
  records: Array<{
    wonAt: string,
    prizeName: string,
    quantity: number
  }> // 按 wonAt 倒序（最新在前）
}
```

---

## 累充

### GET `/topup/progress`

**响应 data**：

```ts
{
  totalTopup: number,
  tiers: Array<{
    amount: number,
    status: 'locked' | 'claimable' | 'claimed',
    itemId: number,
    name: string,
    quantity: number
  }>
}
```

### POST `/topup/claim`

**请求 body**：`{ amount: 499 | 999 | 1999 | 2999 | 4999 | 9999 }`

**响应 data**：

```ts
{
  amount: number,
  reward: { itemId, name, quantity },
  claimedAt: string
}
```

---

## 开发专用（仅 Mock）

### POST `/mock/reset`

重置 Mock 内存状态到初始场景。

### POST `/mock/scenario`

**请求 body 示例**：

```json
{
  "activityStatus": "active",
  "tickets": 7,
  "checkedDays": 3,
  "todayChecked": false,
  "topupTotal": 999
}
```

**预设场景（`preset`）**：

| preset | 说明 |
|---|---|
| `checkin_milestone_7` | 已签 7 天，7/10 天里程碑均未领取 |
| `checkin_milestone_10` | 已签 10 天，7/10 天里程碑均未领取 |

设置 `checkedDays` 时会自动同步 `claimedDailyDays` 为 `[1..N]`，除非显式传入 `claimedDailyDays`。

**签到历史排序**：`GET /checkin/history` 返回 `records` 按 `claimedAt` **倒序**（最新在前）。

## 类型定义

详见 `src/api/types.js`（JSDoc）。

## Mock 实现

| 文件 | 说明 |
|---|---|
| `mock/_catalog.js` | 奖励静态配置（来自需求文档） |
| `mock/_state.js` | 可交互内存状态 |
| `mock/_guards.js` | 鉴权 / 活动守卫 |
| `mock/*.js` | 各模块路由 |

## 前端调用

统一通过 `src/api/index.js` 导出方法，例如：

```js
import { fetchWheelInfo, spinWheel, ErrorCode } from '@/api';
```

切换真实接口：仅需修改 `VITE_USE_MOCK=false` 并保持后端响应格式一致。
