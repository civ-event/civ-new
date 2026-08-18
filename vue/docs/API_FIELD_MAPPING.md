# 新项目 ↔ civ-event 老后端 字段映射

> 适配层代码：`src/api/legacy/mappers.js`、`src/api/legacy/index.js`  
> Apifox 联调：`docs/apifox/README.md`（集合 `CIV-All-In-One` + 环境 `CIV-Test-Env`）

---

## 通用约定

| 项 | 老后端 | 新项目前端 |
|---|---|---|
| Base URL | `https://activity-api-test.mars-era.cn` | `VITE_API_BASE=/api`（Vite 代理） |
| 鉴权 Header | `accessToken: <JWT>` | `localStorage.accessToken` |
| 活动 source | `110060763128467` | `VITE_APP_SOURCE` |
| 累充 source | `120058564090281` | `VITE_APP_OLD_SOURCE` |
| 游戏 code | `mpopen` | `VITE_APP_GAME` |
| GET 公共 Query | `time`, `source` | `getLegacyTimeParam()` + `withSource()` |
| POST Body | `application/x-www-form-urlencoded` | `legacyPost()` 自动转换 |
| PUT Body | `application/json` | `legacyPut()` |
| 成功响应 | `code: 200` 或 无 code 直出 | `legacy/http.js` unwrap |

### 两种 Token

| Token | 用途 | 来源 |
|---|---|---|
| OAuth token | 仅 `PUT /oauth/login-and-bind-roles` Body | 游戏登录 |
| Activity token | 所有后续接口 Header | 登录响应最外层 `accessToken` |

---

## 1. 活动信息

### 前端：`fetchActivityInfo()` → `{ status, startAt, endAt, timezone, serverTime }`

| 老接口 | 映射来源 | 前端字段 |
|---|---|---|
| `GET /time/get-timestamp` | `timestamp.time` | `serverTime`（转 UTC-5 ISO） |
| `GET /activities/time-config` | `time_config.sign_activity_time` | `startAt` / `endAt` / `status` |

`sign_activity_time` 格式：`"2026-01-01 00:00:00 ~ 2026-01-31 23:59:59"`

---

## 2. 登录 / 会话 / 角色

### 2.1 登录 `login()` ↔ `PUT /oauth/login-and-bind-roles`

**请求 Body（JSON）：**

| 字段 | 说明 |
|---|---|
| `accessToken` | 游戏 OAuth token |
| `source` | `110060763128467` |
| `roleId` | 可选，URL 参数带入 |

**响应 → 前端：**

| 老字段 | 前端字段 |
|---|---|
| `accessToken` | `token`（存 localStorage） |
| `user_info.player_id` | 缓存 `playerId` |
| `user_info.username` | 缓存 `userName` |
| `roles[0]` | `role`（有则自动选中） |
| — | `isLoggedIn: true` |

**老角色对象 → 前端 role：**

| 老字段 | 前端字段 |
|---|---|
| `role_id` / `roleId` | `roleId` |
| `role_name` / `roleName` | `roleName` |
| `server_id` / `serverId` | `serverId` |
| `server_name` / `servername` | `serverName` |
| `role_level` / `roleLevel` | `level` |

### 2.2 会话 `fetchSession()` ↔ `GET /user/user-extend-info`

**请求：** Query `time`, `source`；Header `accessToken`

**响应 data 结构（常见）：**

```json
{
  "code": 200,
  "data": {
    "userInfo": { "role_id", "role_name", "server_id", "role_level", "checkIn", "lottery", "points", "depletionPoints" },
    "roles": [ ... ]
  }
}
```

**→ 前端 session：**

| 前端字段 | 来源 |
|---|---|
| `isLoggedIn` | 有 token 即为 true |
| `token` | localStorage |
| `role` | `userInfo` 或 `roles[0]` 经 `mapLegacyRole()` |

### 2.3 角色列表 `fetchRoles()`

| 步骤 | 老接口 | 说明 |
|---|---|---|
| 1 | `GET /games/get-binded-roles` | 已绑定列表 |
| 2 | `GET /games/{gameCode}/players/{playerId}/roles` | 无绑定时查全部 |

**→ 前端：** `{ roles: [{ roleId, roleName, serverId, serverName, level }] }`

### 2.4 选角 `selectRole({ roleId })`

| 场景 | 老接口 | Body |
|---|---|---|
| 已绑定 | `POST /user/change-user` | `role_id`, `server_id`, `time`, `source` |
| 未绑定 | `PUT /games/bind-server` | JSON: `role_id`, `server_id`, `server_name`, `source` |

**→ 前端：** `{ role: { roleId, roleName, serverId, serverName, level } }`

---

## 3. 签到

### 3.1 状态 `fetchCheckinStatus()` ← `user-extend-info.userInfo.checkIn`

| 老字段 | 前端字段 |
|---|---|
| `checkIn.totalCount` | `checkedDays` |
| `checkIn.isCheckInToday` | `todayChecked` |
| `checkIn.gifts[]` | 推导 `dailyRewards[].status`、`milestones[].status` |

**status 枚举：** `locked` | `claimable` | `claimed`

### 3.2 每日签到 `dailyCheckin()` ↔ `POST /check-in/queued-clock-in`

**Body：**

| 字段 | 值 |
|---|---|
| `server_id` | 当前角色 |
| `role_id` | 当前角色 |
| `sub_type` | `checkedDays + 1`（第几天） |
| `time`, `source` | 公共参数 |

**响应 → 前端：**

| 前端字段 | 来源 |
|---|---|
| `day` | 请求 sub_type |
| `ticketReward` | 固定 3 |
| `ticketsTotal` | `roles[0].points - depletionPoints` |
| `reward` | 本地 catalog 按 day 匹配 |
| `claimedAt` | 当前时间 UTC-5 |

### 3.3 累计领奖 `claimCheckinMilestone({ days })` ↔ `POST /games/get-by-check-in-num`

**Body：** `check_in_num` = `7` 或 `10`

**→ 前端：** `{ days, reward: { itemId, name, quantity }, claimedAt }`

### 3.4 签到历史 `fetchCheckinHistory()` ← `checkIn.gifts`

| 老字段 | 前端字段 |
|---|---|
| `createdAt` | `claimedAt` |
| `type` CHECK_IN / MILESTONE | `daily` / `milestone` |
| `rewardName` / `checkDay` | `rewardName`, `days` |

---

## 4. 幸运转盘

### 4.1 转盘信息 `fetchWheelInfo()` ← `userInfo`

| 老字段 | 前端字段 |
|---|---|
| `points - depletionPoints` | `tickets` |
| `lottery.winningPrizeRecords` 含 prizeId=11 | `grandPrizeWon` |
| — | `prizes` 来自本地 `WHEEL_PRIZES` catalog |

### 4.2 抽奖 `spinWheel({ times })` ↔ `POST /games/lottery-submit`

**Body：** `server_id`, `role_id`, `times`（1|10）, `source`

**响应 → 前端：**

| 老字段 | 前端字段 |
|---|---|
| `winningPrizes[]`（数字序号） | `results[].prizeId/itemId/name/quantity` |
| `roles[0]` 券余额 | `ticketsLeft` |
| — | `times`, `spunAt` |

### 4.3 券记录 `fetchTicketHistory()` ← `lottery.ticketsRecords`

| 老字段 | 前端字段 |
|---|---|
| `createdAt` | `obtainedAt` |
| `points` | `amount` |
| `type` LOGIN_GAME / 其他 | `game_login` / `checkin` |

### 4.4 中奖记录 `fetchWinHistory()` ← `lottery.winningPrizeRecords`

| 老字段 | 前端字段 |
|---|---|
| `createdAt` | `wonAt` |
| `prizeId` | `prizeName`, `quantity` |

---

## 5. 累充

> **注意：** 累充接口 `source` 用 `VITE_APP_OLD_SOURCE`（`120058564090281`），与其他模块不同。

### 5.1 进度 `fetchTopupProgress()` ↔ `GET /recharge/get-activity-period-record`

**Query：**

| 参数 | 说明 |
|---|---|
| `source` | **oldSource** |
| `role_id`, `server_id`, `player_id`, `game_code` | 当前角色上下文 |
| `time` | Unix 秒 |

**响应 → 前端：**

| 老字段 | 前端字段 |
|---|---|
| `total_virtual_goods` | `totalTopup` |
| `milestones[].level` | 对应 tier `amount`（499~9999） |
| `milestones[].status` claimed | tier `status: claimed` |
| 金额达标未领 | `status: claimable` |
| 未达标 | `status: locked` |

### 5.2 领奖 `claimTopupReward({ amount })` ↔ `POST /recharge/get-activity-period-rewards`

**Body：** `level` = amount（499|999|…），`source` = oldSource

**→ 前端：** `{ amount, reward: { itemId, name, quantity }, claimedAt }`

---

## 6. Apifox 导入步骤

1. 导入环境：`docs/apifox/CIV-Test-Env.postman_environment.json`（Postman 环境）
2. 导入集合：`docs/apifox/CIV-All-In-One.postman_collection.json`（Postman 集合）
3. 右上角选择环境 **`civ-测试服`**，在共享值中配置：

```text
baseUrl       = https://activity-api-test.mars-era.cn
source        = 110060763128467
oldSource     = 120058564090281
gameCode      = mpopen
oauthToken    = <游戏OAuth token>
accessToken   = <登录响应 token，跑完登录接口后填>
playerId      = <登录响应 user_info.player_id>
roleId        = <绑定时填>
serverId      = <绑定时填>
serverName    = <绑定时填>
time          = <Unix秒，可填当前时间戳>
```

4. 按 **`A-新项目`** 文件夹顺序联调：`0-基础` → `1-登录与角色` → …

登录接口自带后置脚本：成功时自动把 `accessToken`、`playerId` 写入集合变量。

---

## 7. 联调检查清单

- [ ] 登录 Body 用 `oauthToken`，Header 用响应 `accessToken`
- [ ] 所有 GET 带 Query：`time` + `source`
- [ ] 累充接口 `source` 换 `oldSource`
- [ ] POST 除 login/bind 外均为 form-urlencoded
- [ ] 角色 `level >= 5` 才能参与玩法
- [ ] token 约 2 小时过期，403 需重新登录
