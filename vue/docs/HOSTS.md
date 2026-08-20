# 本地联调 Hosts 配置清单

> 测试服内网 IP：`10.1.1.25`  
> 适用：CIV 活动页（PC + 移动端）、Pop Epoch SDK WebView、Passport / 支付周边联调

---

## 一键复制（完整版）

将以下内容追加到系统 hosts 文件（macOS / Linux：`/etc/hosts`；Windows：`C:\Windows\System32\drivers\etc\hosts`）：

```
# ── CIV 活动 API（必配）────────────────────────────
10.1.1.25 activity-api-test.mars-era.cn

# ── Passport / 账号（登录 token 校验）──────────────
10.1.1.25 passport-test.mars-era.cn

# ── 支付 / 收银台 ───────────────────────────────────
10.1.1.25 gamekit-paypage.mars-era.cn
10.1.1.25 channel-pay-test.mars-era.cn
10.1.1.25 pay-api-test.mars-era.cn

# ── 内部 / 面板 / UDP（按需）────────────────────────
10.1.1.25 udp6-test.mars-era.cn
10.1.1.25 udp7-test.mars-era.cn
10.1.1.25 odp-panel-test.mars-era.cn
```

保存后无需改前端代码；重启 `npm run dev` 即可。

---

## 按用途分类

| 域名 | 是否 CIV 活动页必需 | 说明 |
|------|---------------------|------|
| `activity-api-test.mars-era.cn` | **必需** | 活动后端 API。Vite 代理目标，见 `vite.config.js` |
| `passport-test.mars-era.cn` | **推荐** | Passport 测试服。活动登录 `PUT /oauth/login-and-bind-roles` 校验 SDK token 时，后端会访问 |
| `gamekit-paypage.mars-era.cn` | 可选 | GameKit 支付页 |
| `channel-pay-test.mars-era.cn` | 可选 | 渠道支付测试 |
| `pay-api-test.mars-era.cn` | 可选 | 支付 API 测试 |
| `udp6-test.mars-era.cn` | 可选 | 内部 UDP 服务 |
| `udp7-test.mars-era.cn` | 可选 | 内部 UDP 服务 |
| `odp-panel-test.mars-era.cn` | 可选 | ODP 面板 |

### CIV 活动页最小配置

若只做活动页 H5 联调（浏览器 + Pop Epoch WebView），至少配置：

```
10.1.1.25 activity-api-test.mars-era.cn
10.1.1.25 passport-test.mars-era.cn
```

---

## 与本项目的对应关系

```
浏览器 / WebView
    │
    ▼
localhost:5176（PC）或 localhost:5175（移动端）
    │  VITE_API_BASE=/api
    ▼
Vite proxy  /api → https://activity-api-test.mars-era.cn
    │  （hosts 解析到 10.1.1.25）
    ▼
活动后端 civ-event
    │  校验 accessToken
    ▼
passport-test.mars-era.cn（后端侧，非 H5 直连）
```

| 配置文件 | 相关项 |
|----------|--------|
| `vue/vite.config.js` | `proxy['/api'].target` → `activity-api-test.mars-era.cn` |
| `mobile/.../vue/vite.config.js` | 同上 |
| `.env.development` | `VITE_API_BASE=/api`、`VITE_APP_GAME=mpopen` 等 |

---

## 编辑 hosts 的方法

### macOS / Linux

```bash
sudo nano /etc/hosts
# 或
sudo vim /etc/hosts
```

保存后刷新 DNS 缓存（macOS）：

```bash
sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
```

### Windows

1. 以管理员身份打开记事本
2. 打开 `C:\Windows\System32\drivers\etc\hosts`
3. 追加域名映射并保存

---

## 验证是否生效

```bash
# 1. 解析是否指向内网 IP
ping -c 1 activity-api-test.mars-era.cn
ping -c 1 passport-test.mars-era.cn

# 2. 活动 API 是否可达（应返回 JSON 时间戳）
curl -sk "https://activity-api-test.mars-era.cn/api/time/get-timestamp"

# 3. Passport 是否可达（返回 HTTP 头即可）
curl -sk -I "https://passport-test.mars-era.cn"
```

本地 dev 启动后，活动页能正常加载、登录不报 Passport 相关错误，即表示配置有效。

---

## 常见问题

| 现象 | 可能原因 | 处理 |
|------|----------|------|
| 活动页接口全部失败 | 未配 `activity-api-test` | 补 hosts 并重启 dev |
| 登录报 passport / secret 相关错误 | 未配 `passport-test` 或后端未注册 gamecode | 补 hosts；确认 `VITE_APP_GAME=mpopen` |
| curl 证书警告 | 测试服自签证书 | 正常；Vite 已设 `secure: false` |
| 改了 hosts 仍不通 | DNS 缓存 | 执行 flush 命令或重启浏览器 |
| 手机 WebView 联调不通 | 手机 hosts 未改 | 手机需同网段且单独改 hosts，或通过内网 DNS / 代理 |

> **注意**：Pop Epoch App 内 WebView 打开的是你的 dev 地址（如 `http://电脑IP:5176`），活动 API 仍由电脑上的 Vite 代理转发；hosts 配在**运行 dev 的那台电脑**上即可。

---

## 相关文档

- [API_ENDPOINTS.md](./API_ENDPOINTS.md) — 接口清单与联调前置
- [SDK接入操作手册.md](./SDK接入操作手册.md) — Bridge / WebView 联调
- [INTEGRATION_CHECKLIST.md](./INTEGRATION_CHECKLIST.md) — 对接检查项
