# CIV-PC 测试服联调完成清单

> 测试服：`https://activity-api-test.mars-era.cn`  
> 活动 source：`140011140100489`（以 `.env.development` / Apifox 环境为准）  
> 完成日期：2026-08-18

---

## 一、Apifox 接口联调

| 模块 | 接口 | 状态 | 备注 |
|------|------|------|------|
| 基础 | `GET /time/get-timestamp` | ✅ | |
| 基础 | `GET /activities/time-config` | ✅ | 需 `gamecode` + `activity_id` |
| 登录 | `PUT /oauth/login-and-bind-roles` | ✅ | |
| 角色 | `GET /games/{gameCode}/players/{playerId}/roles` | ✅ | `gameCode`/`playerId` 不能为空 |
| 角色 | `POST /user/change-user` | ✅ | |
| 角色 | `GET /games/get-binded-roles` | ⚠️ 跳过 | 测试服 400，`source missing in data`（服务端问题） |
| 用户 | `GET /user/user-extend-info` | ⚠️ 404 | 测试服路由未部署（服务端问题） |
| 签到 | `POST /check-in/queued-clock-in` | ✅ | |
| 签到 | `POST /games/get-by-check-in-num` | ✅ | |
| 转盘 | `POST /games/lottery-submit` | ✅ | |
| 累充 | `GET /recharge/get-activity-period-record` | ✅ | 使用 `oldSource` |
| 累充 | `POST /recharge/get-activity-period-rewards` | ✅ | `level`=档位值；已领报 400 |

**未测（新页面未用，可跳过）：** 充值抽奖、感谢礼包、拼图系列、`fb/report-info`

---

## 二、浏览器联调（`npm run dev` + `VITE_USE_MOCK=false`）

| 项目 | 状态 | 验证方式 |
|------|------|----------|
| 启动加载 `get-timestamp` / `time-config` | ✅ | Network 200；活动时间非占位文案 |
| UTC-5 当前时间 | ✅ | 签到区每秒跳动 |
| 登录 + 选角 | ✅ | `login-and-bind-roles` / `change-user` |
| 签到 Day1–Day10 / 累计领奖 | ✅ | 操作后 UI 更新 |
| 幸运转盘单抽/十连 | ✅ | 次数减少、结果展示 |
| 累充进度 / 领取 | ✅ | Apifox 已通；浏览器可冒烟 |
| **刷新后状态保持** | ✅ | F5 后签到/转盘次数仍在 |
| sessionStorage 持久化 | ✅ | `civ_legacy_role_cache` 有值 |
| 刷新自动 re-login | ✅ | `user-extend-info` 404 后自动 `login-and-bind-roles` 200 |

### 可选冒烟（建议抽测）

- [ ] 切换角色 → 数据刷新
- [ ] 退出登录 → `civ_legacy_role_cache` 清除
- [ ] 换账号登录 → 无旧账号数据残留
- [ ] Token 过期（403）→ 重新登录/token

---

## 三、前端实现要点

| 能力 | 实现位置 |
|------|----------|
| Legacy 适配层 | `src/api/legacy/` |
| Mock / Legacy 切换 | `VITE_USE_MOCK=false` → 走 legacy |
| 活动时间解析 | `mappers.js` `parseTimeRange`（支持 `DD/MM/YYYY -` 与 `~`） |
| 刷新保态 | `roleCache.js` sessionStorage + `legacyFetchSession` 自动 re-login |
| 角色列表 fallback | `get-binded-roles` 失败 → `allRoles` |

---

## 四、已知限制（非联调阻塞）

| 问题 | 影响 | 当前处理 |
|------|------|----------|
| `user-extend-info` 404 | 无法直接拉用户聚合状态 | 刷新时 auto `login-and-bind-roles` |
| `get-binded-roles` 400 | 无法拉已绑定列表 | fallback `allRoles` + 登录响应 `roles` |
| 测试服每次刷新多 1 次 login | Network 多一个请求 | 上线 `user-extend-info` 后可消除 |
| Token 约 2h 过期 | 403 | 更新 `VITE_DEV_ACCESS_TOKEN` 或重新登录 |

---

## 五、环境配置速查

```env
# .env.development
VITE_USE_MOCK=false
VITE_API_BASE=/api
VITE_APP_SOURCE=140011140100489
VITE_APP_OLD_SOURCE=140011140100489
VITE_APP_GAME=mpopen
VITE_DEV_ACCESS_TOKEN=<有效 JWT>
```

Apifox 集合：`docs/apifox/CIV-All-In-One.postman_collection.json`  
字段映射：`docs/API_FIELD_MAPPING.md`

---

## 六、待后端跟进

1. 测试服部署 `GET /api/user/user-extend-info`
2. 修复 `GET /api/games/get-binded-roles` 无法读取 query `source`
3. 确认累充 `oldSource` 是否与主 `source` 长期一致

---

## 七、联调结论

**Apifox 主链路 + 浏览器真实操作 + 刷新保态均已通过，测试服对接可结案。**

后续：生产/预发部署 `user-extend-info` 后，验证是否可移除刷新时的 auto re-login 降级逻辑。
