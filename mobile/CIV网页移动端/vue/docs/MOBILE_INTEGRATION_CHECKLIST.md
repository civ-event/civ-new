# CIV 移动端（H5）测试服联调清单

> 项目路径：`civ-pc/mobile/CIV网页移动端/vue`  
> 测试服：`https://activity-api-test.mars-era.cn`（Vite proxy）  
> dev 端口：**5175**（PC 为 5176，可同时开）  
> Apifox / 字段映射：复用 PC 文档 `../../../vue/docs/`

---

## 零、启动前配置

**Hosts（必做）：** 见 PC 文档 [`vue/docs/HOSTS.md`](../../../vue/docs/HOSTS.md)

```bash
cd civ-pc/mobile/CIV网页移动端/vue
cp .env.development.example .env.development
# 编辑 .env.development：VITE_USE_MOCK=false，填入 VITE_DEV_ACCESS_TOKEN（与 PC 相同即可）
npm run dev
```

| 访问方式 | URL |
|----------|-----|
| 本机 | http://localhost:5175 |
| 手机同 WiFi | 终端显示的 Network 地址，如 `http://10.x.x.x:5175` |

---

## 一、Apifox（不必重测）

移动端与 PC **共用同一套 civ-event 接口**，PC Apifox 已通过即可。  
详见：`../../../vue/docs/INTEGRATION_CHECKLIST.md` 第一节。

---

## 二、浏览器联调（必做）

打开 DevTools → **Network**，勾选 Preserve log。建议同时开 **手机模式**（375×812 等）。

| # | 检查项 | 预期 | 你的结果 |
|---|--------|------|----------|
| 1 | 启动 `get-timestamp` / `time-config` | 200；活动时间非占位文案 | ☐ |
| 2 | 签到区 UTC-5 时间 | 每秒跳动 | ☐ |
| 3 | 点击登录 | `login-and-bind-roles` 200 | ☐ |
| 4 | 选角 | `change-user` 200 | ☐ |
| 5 | 每日签到 | `queued-clock-in` 200；Day 高亮 | ☐ |
| 6 | 转盘抽奖 | `lottery-submit` 200；次数减少 | ☐ |
| 7 | 累充进度 | `get-activity-period-record` 200 | ☐ |
| 8 | **F5 刷新** | 签到/转盘状态仍在 | ☐ |
| 9 | 刷新 Network | `user-extend-info` 404 + **`login-and-bind-roles` 200** | ☐ |
| 10 | Application → Session Storage | 有 `civ_legacy_role_cache` | ☐ |

---

## 三、移动端特有（UI/交互）

| # | 检查项 | 预期 | 你的结果 |
|---|--------|------|----------|
| 1 | 竖屏首屏 | 模块完整、无横向溢出 | ☐ |
| 2 | 登录 / 选角弹窗 | 可关闭、可滚动、按钮可点 | ☐ |
| 3 | 签到日历横滑 | 切换正常 | ☐ |
| 4 | 转盘旋转动画 | 抽奖后动画与结果一致 | ☐ |
| 5 | 底部 / 浮层按钮 | 不被遮挡、点击区域足够 | ☐ |
| 6 | 真机 Safari/Chrome（可选） | 与模拟器行为一致 | ☐ |

---

## 四、可选冒烟

- [ ] 切换角色 → 各模块数据刷新
- [ ] 退出登录 → `civ_legacy_role_cache` 清除
- [ ] 换账号 → 无旧数据残留
- [ ] Token 403 → 更新 token 或重新登录

---

## 五、与 PC 的差异

| 项 | 移动端 |
|----|--------|
| 端口 | 5175 |
| Legacy 代码 | `src/api/legacy/`（自 PC 同步） |
| sessionStorage | 与 PC **不同源**（端口不同），互不影响 |
| Mock 开关 | `.env.development` 中 `VITE_USE_MOCK=false` 才连测试服 |

---

## 六、已知限制（同 PC）

- `user-extend-info` 测试服 404 → 刷新时自动 `login-and-bind-roles`
- `get-binded-roles` 400 → fallback `allRoles`
- Token 约 2h 过期需更新

---

## 七、联调结论（测试后填写）

- 测试日期：__________
- 测试人：__________
- 浏览器联调：☐ 通过　☐ 有问题（备注：__________）
- 移动端 UI：☐ 通过　☐ 有问题（备注：__________）

**全部勾选通过后，移动端联调可与 PC 一并结案。**
