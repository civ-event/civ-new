# civ-pc — Vue 版本

本目录由 `psd2code` 的 `vue` target 自动生成。

## 快速开始

```bash
cd vue
npm install        # 或 pnpm install / yarn
npm run dev        # 本地预览
npm run build      # 生产构建，产物在 dist/
```

## 目录结构

```
output/<psd>/
├── html/                # HTML 版本（由 psd2code 同一次调用生成，供对照/降级使用）
│   ├── index.html
│   ├── style.css
│   ├── index_optimized.html
│   ├── style_optimized.css
│   └── images/
└── vue/                 # 本目录
    ├── index.html       # Vite 模板
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.js      # 入口：挂载 <App />
        ├── App.vue      # 自动生成：PSD → SFC（template + style 全局）
        └── assets/images/   # 自动复制：来自 ../../html/images/
```

## 重新生成

```bash
python3 psd_to_code.py path/to/your.psd --target vue
```

> 注意：App.vue / assets/images/ 会被覆盖。
> 自定义逻辑请在 App.vue 之外的文件中编写，或 fork 目录保留副本。

## 设计说明

- 结构与 HTML target 完全一致：根节点为 ``<div id="canvas">``，
  所有图层以 BEM 类名 + 绝对定位排布。
- ``<style>`` **未加 ``scoped``**，因为 HTML target 已保证类名全局唯一，
  并且样式表大量使用属性选择器（如 ``[class*="__image"]``），scoped 会破坏匹配。
- ``<script setup>`` 留空，作为后续接入交互的扩展点。
- 重复组 / 列表的展开已在 HTML target 阶段完成，模板中都是实例化后的节点。

（由 psd2code 自动生成）
