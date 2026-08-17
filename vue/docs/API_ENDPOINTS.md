# CIV 活动接口清单

> 便于联调查阅。本仓库 **`VITE_USE_MOCK=false` 时已对接 civ-event 旧版测试服 API**（`src/api/legacy/` 适配层）。

---

## 当前对接模式

| 模式 | 环境变量 | 说明 |
|---|---|---|
| **civ-event 测试服（默认）** | `VITE_USE_MOCK=false` | 走 `src/api/legacy/*`，鉴权 Header 为 `accessToken` |
| **本地 Mock** | `VITE_USE_MOCK=true` | 走 `mock/`，契约见 `API_CONTRACT.md` |

### 联调前置

1. `/etc/hosts`：`10.1.1.25 activity-api-test.mars-era.cn`
2. `.env.development` 中配置正确的 `VITE_APP_SOURCE` / `VITE_APP_OLD_SOURCE`（与 civ-event 一致）
3. 登录需 `accessToken`：URL 带 `?player_token=xxx`，或配置 `VITE_DEV_ACCESS_TOKEN`

---

## 环境信息

| 项 | 值 |
|---|---|
| 测试服域名 | `https://activity-api-test.mars-era.cn` |
| 内网 IP | `10.1.1.25`（需 `/etc/hosts` 映射） |
| 开发代理 | Vite `proxy: /api → https://activity-api-test.mars-era.cn` |
| 本仓库 Base | `VITE_API_BASE=/api` |
| 完整契约 | [`API_CONTRACT.md`](./API_CONTRACT.md) |

### 通用约定（本仓库）

- **响应格式**：`{ "code": 0, "data": {...}, "msg": "ok" }`
- **鉴权**：`Authorization: Bearer <token>`（localStorage: `civ_event_token`）
- **活动接口前置**：已登录 + 已选角色 + 等级 ≥ 5

---

## 一、本仓库接口（civ-pc/vue，共 16 个）

> 定义于 `src/api/*`，契约见 `docs/API_CONTRACT.md`。  
> **当前测试服尚未部署这些路由**（探测均为 404）。

### 1. 活动

| 方法 | 路径 | 前端方法 | 鉴权 | 说明 |
|---|---|---|---|---|
| GET | `/activity/info` | `fetchActivityInfo()` | 否 | 活动状态、起止时间 |

### 2. 用户 / 登录

| 方法 | 路径 | 前端方法 | 鉴权 | 请求体 |
|---|---|---|---|---|
| GET | `/user/session` | `fetchSession()` | 否 | — |
| POST | `/user/login` | `login(payload)` | 否 | `{}` 或 SDK 字段 |
| POST | `/user/logout` | `logout()` | 是 | — |
| GET | `/user/roles` | `fetchRoles()` | 是 | — |
| POST | `/user/select-role` | `selectRole({ roleId })` | 是 | `{ roleId: string }` |

### 3. 签到

| 方法 | 路径 | 前端方法 | 鉴权 | 请求体 |
|---|---|---|---|---|
| GET | `/checkin/status` | `fetchCheckinStatus()` | 是 | — |
| POST | `/checkin/daily` | `dailyCheckin()` | 是 | — |
| POST | `/checkin/claim-milestone` | `claimCheckinMilestone({ days })` | 是 | `{ days: 7 \| 10 }` |
| GET | `/checkin/history` | `fetchCheckinHistory()` | 是 | — |

### 4. 转盘

| 方法 | 路径 | 前端方法 | 鉴权 | 请求体 |
|---|---|---|---|---|
| GET | `/wheel/info` | `fetchWheelInfo()` | 是 | — |
| POST | `/wheel/spin` | `spinWheel({ times })` | 是 | `{ times: 1 \| 10 }` |
| GET | `/wheel/ticket-history` | `fetchTicketHistory()` | 是 | — |
| GET | `/wheel/win-history` | `fetchWinHistory()` | 是 | — |

### 5. 累充

| 方法 | 路径 | 前端方法 | 鉴权 | 请求体 |
|---|---|---|---|---|
| GET | `/topup/progress` | `fetchTopupProgress()` | 是 | — |
| POST | `/topup/claim` | `claimTopupReward({ amount })` | 是 | `{ amount: 499\|999\|1999\|2999\|4999\|9999 }` |

### 6. 开发专用（仅 Mock，后端无需实现）

| 方法 | 路径 | 说明 |
|---|---|---|
| POST | `/mock/reset` | 重置 Mock 状态 |
| POST | `/mock/scenario` | 切换测试场景 |

---

## 二、civ-event 旧版实际后端接口（共 20 个）

> 来源：`/Users/a/civ-event/src/api/index.js`  
> 测试服 Base：`VUE_APP_URL=https://activity-api-test.mars-era.cn/`  
> 鉴权：`accessToken` Header（非 Bearer）  
> 请求体：多数 POST 为 `application/x-www-form-urlencoded`，带 `source` 参数

### 登录 / 用户

| 方法 | 路径 | 前端方法 | 说明 |
|---|---|---|---|
| PUT | `/api/oauth/login-and-bind-roles` | `login()` | 登录并绑定角色 |
| GET | `/api/user/user-extend-info` | `userInfo()` | 用户扩展信息（含签到/转盘/累充状态） |
| POST | `/api/user/change-user` | `changeUser()` | 切换角色 |
| POST | `/api/user/fb/report-info` | `reportInfo()` | FB 上报 |

### 角色

| 方法 | 路径 | 前端方法 | 说明 |
|---|---|---|---|
| GET | `/api/games/{gameCode}/players/{playerId}/roles` | `allRoles()` | 全部角色 |
| GET | `/api/games/get-binded-roles` | `bindedRoles()` | 已绑定角色 |
| PUT | `/api/games/bind-server` | `bind()` | 绑定区服 |

### 签到

| 方法 | 路径 | 前端方法 | 说明 |
|---|---|---|---|
| POST | `/api/check-in/queued-clock-in` | `sign()` | 每日签到 |
| POST | `/api/games/get-by-check-in-num` | `acSign()` | 累计签到领奖（7/10 天） |

### 转盘 / 抽奖

| 方法 | 路径 | 前端方法 | 说明 |
|---|---|---|---|
| POST | `/api/games/lottery-submit` | `lotterySubmit()` | 幸运转盘抽奖 |
| POST | `/api/games/recharge-lottery-submit` | `rechargeLotterySubmit()` | 充值抽奖 |
| POST | `/api/games/get-recharge-lottery-milestone-reward` | `getRechargeLotteryReward()` | 充值抽奖里程碑 |

### 累充

| 方法 | 路径 | 前端方法 | 说明 |
|---|---|---|---|
| GET | `/api/recharge/get-activity-period-record` | `getRechargeInfo()` | 累充进度 |
| POST | `/api/recharge/get-activity-period-rewards` | `getRechargeReward()` | 领取累充档位 |

### 拼图

| 方法 | 路径 | 前端方法 | 说明 |
|---|---|---|---|
| POST | `/api/puzzle/complete-task` | `completeTask()` | 完成任务 |
| POST | `/api/puzzle/place-piece` | `placePiece()` | 放置拼图 |
| POST | `/api/puzzle/claim-milestone` | `claimPuzzleMilestone()` | 领取拼图里程碑 |

### 其他

| 方法 | 路径 | 前端方法 | 说明 |
|---|---|---|---|
| POST | `/api/games/get-thank-you-reward` | `getThankYouReward()` | 感谢礼包 |
| GET | `/api/time/get-timestamp` | `getTimestamp()` | 服务器时间戳 |
| GET | `/api/activities/time-config` | `getTimeConfig()` | 各模块活动时间配置 |

### civ-event 环境变量（联调常用）

```env
VUE_APP_URL=https://activity-api-test.mars-era.cn/
VUE_APP_SOURCE=110060763128467        # 活动 source ID
VUE_APP_OLD_SOURCE=120058564090281    # 累充模块 source ID
VUE_APP_GAME=mpopen
VUE_APP_LIMIT_LEVEL=5
```

---

## 三、新旧接口对照（功能映射）

| 功能 | 本仓库（新契约） | civ-event（旧后端） |
|---|---|---|
| 活动信息 | `GET /activity/info` | `GET /api/activities/time-config` + `GET /api/time/get-timestamp` |
| 登录 | `POST /user/login` | `PUT /api/oauth/login-and-bind-roles` |
| 会话/用户信息 | `GET /user/session` | `GET /api/user/user-extend-info` |
| 角色列表 | `GET /user/roles` | `GET /api/games/get-binded-roles` |
| 选角色 | `POST /user/select-role` | `PUT /api/games/bind-server` / `POST /api/user/change-user` |
| 签到状态 | `GET /checkin/status` | 合并在 `user-extend-info` |
| 每日签到 | `POST /checkin/daily` | `POST /api/check-in/queued-clock-in` |
| 累计签到领奖 | `POST /checkin/claim-milestone` | `POST /api/games/get-by-check-in-num` |
| 转盘信息 | `GET /wheel/info` | 合并在 `user-extend-info` |
| 抽奖 | `POST /wheel/spin` | `POST /api/games/lottery-submit` |
| 累充进度 | `GET /topup/progress` | `GET /api/recharge/get-activity-period-record` |
| 累充领奖 | `POST /topup/claim` | `POST /api/recharge/get-activity-period-rewards` |

> **重要**：两套接口路径、鉴权方式、响应结构均不同。当前测试服部署的是 **civ-event 旧接口**，本仓库新契约需后端另行开发或提供 BFF 适配层。

---

## 四、测试服探测结果（2026-08-17）

| 路径 | HTTP | 结果 |
|---|---|---|
| `/api/time/get-timestamp` | 200 | ✅ 可用 |
| `/api/recharge/get-activity-period-record` | 403 | ✅ 路由存在，需 JWT |
| `/api/check-in/queued-clock-in` | 405 | ✅ 路由存在（需 POST） |
| `/api/games/lottery-submit` | 405 | ✅ 路由存在（需 POST） |
| `/api/oauth/login-and-bind-roles` | 405 | ✅ 路由存在（需 PUT） |
| `/api/user/user-extend-info` | 404 | ⚠️ GET 不可用（可能需带 query 参数） |
| `/api/activity/info` | 404 | ❌ 新契约未部署 |
| `/api/checkin/status` | 404 | ❌ 新契约未部署 |

---

## 五、快速 curl 自测

### 旧后端（civ-event 风格）

```bash
# 服务器时间（无需登录）
curl -sk "https://activity-api-test.mars-era.cn/api/time/get-timestamp"

# 活动时间配置（需正确的 gamecode + activity_id）
curl -sk "https://activity-api-test.mars-era.cn/api/activities/time-config?gamecode=mpopen&activity_id=<活动ID>"

# 需 accessToken 的接口
curl -sk "https://activity-api-test.mars-era.cn/api/recharge/get-activity-period-record?time=$(date +%s)" \
  -H "accessToken: <你的token>"
```

### 新契约（本仓库）

```bash
curl -sk "https://activity-api-test.mars-era.cn/api/activity/info"
curl -sk -X POST "https://activity-api-test.mars-era.cn/api/user/login" \
  -H "Content-Type: application/json" -d '{}'
```

---

## 六、代码位置

| 仓库 | 文件 |
|---|---|
| civ-pc/vue（本仓库） | `src/api/activity.js`、`user.js`、`checkin.js`、`wheel.js`、`topup.js` |
| civ-event（旧版） | `/Users/a/civ-event/src/api/index.js` |
