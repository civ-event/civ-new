# 游戏活动页面 — SDK 登录接入操作手册

> 适用场景：Vue 3 + Vite 项目，对接公司后端活动 API（`activity-api-test.mars-era.cn`）  
> 登录方式：**URL 拼接 token**（推荐） + **环境变量注入 token**（开发调试用）

---

## 一、整体架构

```
┌───────────────────────────────────────────────────────┐
│  游戏客户端 / 外部登录页                                │
│  用户完成登录，拿到 accessToken（JWT）                    │
└───────────────┬───────────────────────────────────────┘
                │  打开活动页 URL，token 拼在参数里
                ▼
┌───────────────────────────────────────────────────────┐
│  活动页面 http://xxx/?player_token=JWT                  │
│                                                        │
│  ① 页面加载 → 从 URL 取 player_token                    │
│  ② 调后端 PUT /api/oauth/login-and-bind-roles           │
│  ③ 后端返回新 accessToken + 用户信息 + 角色列表           │
│  ④ 保存 token 到 localStorage                           │
│  ⑤ 后续所有 API 请求自动带 accessToken 请求头             │
└───────────────────────────────────────────────────────┘
```

---

## 二、新项目接入步骤（6 步）

> **联调前置：** 配置 `/etc/hosts`，见 [HOSTS.md](./HOSTS.md)

### 第 1 步：配置环境变量

创建 `.env.development` 文件：

```env
# 关闭 mock，走真实后端
VITE_USE_MOCK=false

# Vite 代理前缀（避免 CORS）
VITE_API_BASE=/api

# ── 活动配置（根据具体游戏/活动修改）──
VITE_APP_SOURCE=140011140100489
VITE_APP_OLD_SOURCE=140011140100489
VITE_APP_GAME=mpopen
VITE_APP_LIMIT_LEVEL=5
VITE_APP_DEBUG=false

# ── 开发调试用 token（可选，方便不拼 URL 也能登录）──
# 从老项目 localStorage 或后端获取，填入后直接 npm run dev 即可登录
VITE_DEV_ACCESS_TOKEN=
```

**说明：**
- `VITE_APP_SOURCE`：活动 ID，每个活动不同，找后端确认
- `VITE_APP_GAME`：游戏代号，如 `mpopen`
- `VITE_DEV_ACCESS_TOKEN`：开发时的快捷登录 token，**生产环境不要填**

---

### 第 2 步：配置 Vite 代理

在 `vite.config.js` 中添加代理，避免浏览器 CORS 限制：

```javascript
export default defineConfig({
  // ...
  server: {
    host: '0.0.0.0',
    port: 5176,
    proxy: {
      '/api': {
        target: 'https://activity-api-test.mars-era.cn', // 测试服
        // target: 'https://activity-api.mars-era.cn',    // 正式服
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
```

**原理：** 浏览器请求 `http://localhost:5176/api/xxx` → Vite 代理转发到 `https://activity-api-test.mars-era.cn/api/xxx`

---

### 第 3 步：创建 token 解析工具

创建 `src/api/legacy/config.js`：

```javascript
export const legacyConfig = {
  source: import.meta.env.VITE_APP_SOURCE || '',
  oldSource: import.meta.env.VITE_APP_OLD_SOURCE || import.meta.env.VITE_APP_SOURCE || '',
  gameCode: import.meta.env.VITE_APP_GAME || 'mpopen',
  limitLevel: Number(import.meta.env.VITE_APP_LIMIT_LEVEL || 5),
};

/** 从 URL 读取参数 */
export function readUrlParams() {
  const search = new URLSearchParams(window.location.search);
  return {
    playerToken: search.get('player_token') || '',
    roleId: search.get('role_id') || '',
    gameCode: search.get('game_code') || '',
    serverId: search.get('server_id') || '',
  };
}

/**
 * token 获取优先级：
 * 1. 代码传入的 payload.accessToken
 * 2. URL 参数 ?player_token=xxx
 * 3. .env 中的 VITE_DEV_ACCESS_TOKEN
 * 4. localStorage 缓存的 accessToken
 */
export function resolveAccessToken(payload = {}) {
  return (
    payload.accessToken
    || readUrlParams().playerToken
    || import.meta.env.VITE_DEV_ACCESS_TOKEN
    || localStorage.getItem('accessToken')
    || ''
  );
}
```

---

### 第 4 步：创建 axios 请求封装

创建 `src/api/legacy/http.js`：

```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  timeout: 30000,
});

// 请求拦截器：自动带上 accessToken
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.accessToken = token;
  }
  return config;
});
```

**关键点：**
- `baseURL` 使用 `/api`，配合 Vite 代理
- 每个请求自动从 localStorage 读取 `accessToken` 放到请求头
- 请求头字段名是 `accessToken`（不是 `Authorization`）

---

### 第 5 步：实现登录 API

```javascript
// 登录接口
export async function legacyLogin(payload = {}) {
  const accessToken = resolveAccessToken(payload);
  if (!accessToken) {
    throw new Error('缺少 accessToken');
  }

  // 调后端登录接口
  const { data } = await instance.put('/oauth/login-and-bind-roles', {
    accessToken,
    roleId: payload.roleId || readUrlParams().roleId || undefined,
    source: legacyConfig.source,
  });

  // 保存 token 到 localStorage
  const newToken = data?.accessToken ?? accessToken;
  localStorage.setItem('accessToken', newToken);

  return data;
}
```

**注意事项：**
- 登录接口是 **PUT** 方法，不是 POST
- 响应体直接是 `{ user_info, roles, accessToken }`，**没有 `code` 字段包裹**
- 响应中的 `accessToken` 可能和传入的不同（服务端会刷新），要用新的保存

---

### 第 6 步：页面加载时自动登录

在 `App.vue` 或入口组件的 `onMounted` 中：

```javascript
import { resolveAccessToken } from './api/legacy/config.js';

onMounted(async () => {
  // 自动登录：从 URL / env / localStorage 获取 token
  if (!userStore.isLoggedIn) {
    try {
      const token = resolveAccessToken();
      if (token) {
        await userStore.login({ accessToken: token });
      }
    } catch (e) {
      console.warn('[auto-login] failed', e);
    }
  }
});
```

---

## 三、使用方式

### 方式 1：URL 拼接 token（推荐，生产环境使用）

```
http://活动域名/?player_token=eyJ0eXAiOiJKV1Q...
```

可选参数：
```
?player_token=JWT_TOKEN    （必填）登录凭证
&role_id=123456            （可选）指定绑定的角色
&game_code=mpopen          （可选）游戏代号
&server_id=1               （可选）服务器 ID
```

**适用场景：**
- 游戏客户端 WebView 打开活动页
- 外部登录页登录后跳转回来
- 测试时手动拼 URL

### 方式 2：环境变量 token（仅开发调试用）

在 `.env.development` 中填入 token：
```env
VITE_DEV_ACCESS_TOKEN=eyJ0eXAiOiJKV1Q...
```

然后直接 `npm run dev`，打开 `http://localhost:5176/` 即可自动登录。

**获取 token 方法：**
1. 启动老项目 → 登录 → F12 → Application → Local Storage → 复制 `accessToken`
2. 或者找后端要一个测试 token

### 方式 3：localStorage 缓存（自动）

登录成功后 token 会保存在 localStorage，刷新页面会自动读取并登录。

---

## 四、Token 获取优先级

```
代码传入 > URL ?player_token > .env VITE_DEV_ACCESS_TOKEN > localStorage
```

---

## 五、退出登录

```javascript
function logout() {
  localStorage.removeItem('accessToken');

  // 清除 URL 中的 token 参数，避免刷新页面又自动登录
  const url = new URL(window.location.href);
  ['player_token', 'role_id', 'game_code', 'server_id'].forEach(key => {
    url.searchParams.delete(key);
  });
  window.location.href = url.href;
}
```

---

## 六、后端 API 清单

| 接口 | 方法 | 路径 | 用途 |
|---|---|---|---|
| 登录绑角色 | PUT | `/api/oauth/login-and-bind-roles` | 登录并绑定游戏角色 |
| 获取用户信息 | GET | `/api/user/user-extend-info` | 获取当前用户角色详情 |
| 获取已绑角色 | GET | `/api/games/get-binded-roles` | 获取已绑定的角色列表 |
| 获取所有角色 | GET | `/api/games/{gameCode}/players/{playerId}/roles` | 获取玩家所有角色 |
| 切换角色 | POST | `/api/user/change-user` | 切换当前活动角色 |
| 绑定服务器 | PUT | `/api/games/bind-server` | 绑定新角色到活动 |
| 签到 | POST | `/api/check-in/queued-clock-in` | 每日签到 |
| 签到累计奖励 | POST | `/api/games/get-by-check-in-num` | 领取累计签到奖励 |
| 转盘抽奖 | POST | `/api/games/lottery-submit` | 转盘抽奖 |
| 累充记录 | GET | `/api/recharge/get-activity-period-record` | 获取累充进度和领取状态 |
| 领累充奖励 | POST | `/api/recharge/get-activity-period-rewards` | 领取累充档位奖励 |
| 获取时间戳 | GET | `/api/time/get-timestamp` | 服务端时间同步 |
| 活动时间配置 | GET | `/api/activities/time-config` | 获取各活动开始/结束时间 |

**所有接口通用规则：**
- 请求头带 `accessToken: JWT_TOKEN`
- GET 请求带 `source` 和 `t`（时间戳防缓存）参数
- POST 请求用 `application/x-www-form-urlencoded` 格式
- 403 错误 = token 过期/无效，需要重新登录

---

## 七、常见问题

### Q1: token 过期了怎么办？
token 有效期 2 小时（7200 秒）。过期后需要重新从游戏客户端获取，或重新登录老项目复制新 token。

### Q2: 新 token 为什么和传入的不一样？
`login-and-bind-roles` 接口会返回一个刷新后的 `accessToken`，应该保存这个新的。

### Q3: 为什么有些 API 返回 404？
`user-extend-info` 在测试帐号没有绑定游戏角色时会返回 404，这是正常的。代码中已用 `legacyGetOptional` 做了容错处理。

### Q4: CORS 报错怎么解决？
确保 `vite.config.js` 中配置了 `/api` 代理，且 `baseURL` 使用的是 `/api` 而不是完整的后端地址。

### Q5: 如何对接新的游戏活动？
1. 修改 `.env.development` 中的 `VITE_APP_SOURCE`、`VITE_APP_GAME` 等
2. 修改 `vite.config.js` 中的代理 `target` 地址
3. 重新获取对应游戏的 token 测试
