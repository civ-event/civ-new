# Apifox 联调配置（新项目 + 老项目共用）

---

## 重要：1KB 是正常的

| 文件 | 大小 | 原因 |
|---|---|---|
| `CIV-Test-Env.postman_environment.json` | ~1KB | 只有 11 个变量，没有接口定义 |
| `CIV-All-In-One.postman_collection.json` | ~45KB | 含全部接口，所以大 |

**环境文件小 ≠ 有问题。**

---

## 方案 A（推荐）：只导入集合，不用环境文件

`CIV-All-In-One` **集合里已内置全部变量**（baseUrl、source、accessToken 等），不导入环境也能用。

### 步骤

1. Apifox → **导入** → **Postman 集合** →  
   `CIV-All-In-One.postman_collection.json`

2. 右上角环境选 **「未选择环境」**（不要选 Production）

3. 左侧点集合名 → **集合设置** → **变量** 标签  
   填写：
   - `oauthToken` = 游戏 OAuth JWT
   - `accessToken` = 登录响应 JWT

4. 从 **`A-新项目 CIV-PC`** 开始联调

> 集合变量在「未选择环境」时生效，避免 Production 覆盖。

---

## 方案 B：手动建环境（Apifox 导入 env 失败时用）

1. 左侧 **环境** → **+ 新建环境** → 命名 **`civ-测试服`**

2. 点 **批量编辑**

3. 打开 `civ-测试服-环境批量编辑.txt`，复制内容粘贴

4. 把 `oauthToken`、`accessToken` 改成真实 JWT

5. **保存** → 右上角选 **`civ-测试服`**

---

## 方案 C：从「项目设置」导入环境文件

⚠️ **不要**在「导入集合」弹窗里选环境文件，会失败。

正确入口：

1. 左侧 **项目设置**（或集合名旁设置图标）
2. **导入数据** → **Postman**
3. 上传 `CIV-Test-Env.postman_environment.json`
4. 导入后在 **环境管理** 里应出现 **`civ-测试服`**

---

## 集合结构

```
CIV 测试服（新项目+老项目合一）
├── A-新项目 CIV-PC（联调顺序）
└── B-老项目 civ-event（全量）
```

---

## 变量说明

| 变量 | 默认值 | 说明 |
|---|---|---|
| baseUrl | https://activity-api-test.mars-era.cn | 测试服 |
| source | 110060763128467 | 活动 ID |
| oldSource | 120058564090281 | 累充 source |
| oauthToken | 手动填 | 登录 Body |
| accessToken | 手动填 | 登录响应 Header |

---

## 常见问题

| 现象 | 处理 |
|---|---|
| 环境 json 导入失败 | 用 **方案 A** 或 **方案 B** |
| Invalid URI `%7B%7BbaseUrl%7D%7D` | 选「未选择环境」+ 集合变量有值，或选 civ-测试服 |
| Production 里没有 civ | 用方案 A/B，别依赖 Production |
| 400 source missing | 确认 source 在集合变量或环境里 |
