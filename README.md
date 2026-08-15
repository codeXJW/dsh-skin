# dsh-skin — DSH Web UI 换肤插件

给 DSH Web 界面换肤：**自定义主题色 + 上传背景图**，设置面板即改即生效，配置存浏览器本地（localStorage）。

- 主题色：取色器 / 8 个预设色板，自动生成 DeepSeek 风格 11 级色阶并覆盖 `--dsw-*` 设计 token（亮/暗两套），组件全部消费 token → 一处覆盖全局换肤
- 背景图：上传图片（≤2.5MB，存 localStorage），全屏固定层 + 主背景半透明化，附透明度滑块
- 设置入口：`设置 → 外观皮肤`（注册进官方 settings.section 槽，非覆盖官方页面）
- 零侵入：不碰 DSH 核心，卸载即净，升级 DSH 不受影响（peerDeps 全为范围声明）

## 结构

```
dsh-skin/
├── lib/                  # 预构建产物（已提交，开箱即用）
│   ├── index.js          # host 侧（占位，无工具）
│   └── client.js         # client 侧（样式注入 + 设置面板，ModuleLoader bundle）
├── src/                  # 源码（改样式/面板从这里改）
│   ├── index.ts          # host
│   └── client/index.tsx  # client（React）
├── install.ps1           # 其它电脑一键安装
└── scripts/build.sh      # 重建脚本（需 DSH checkout，仅开发用）
```

## 在其它电脑上安装（任选其一）

> 前提：目标电脑已装 DSH（0.1.0-rc.x，web 形态）。**不需要** DSH 源码、不需要 node 工具链。

### 方式 A：官方装配（最省事，重启后常驻）

```powershell
git clone <本仓库地址>  # 或下载 ZIP 解压
cd dsh-skin
.\install.ps1           # = dsh plugin --profile web add <目录>
```

然后**重启 DSH** → 浏览器打开 → `设置 → 外观皮肤`。

### 方式 B：注入器免重启（已装 dsh-routing-suite 时）

clone 后在 DSH 会话里对 AI 说：

```
dev_inject_plugin {"dir": "dsh-skin 目录的绝对路径"}
```

立即生效、无需重启；要重启后也常驻，再让 AI 跑 `dev_install_package`（同一参数）。

### 方式 C：下载 Release 包

仓库 Releases 里有 `dsh-external-dsh-skin-<ver>.tgz`，解压后按方式 A 或 B 操作。

## 卸载

```powershell
dsh plugin --profile web remove @dsh-external/dsh-skin   # 官方装配的卸载
# 注入器环境的免重启卸载：会话里对 AI 说 dev_uninject_plugin dsh-skin
```

卸载即净：样式、设置面板、注册表全部清理，浏览器刷新后还原官方默认外观。

## 开发 / 重建（仅改代码时需要）

```bash
# host：用 DSH 源码 checkout 的 tsc 编译（无 checkout 可跳过——lib/index.js 无运行时依赖）
node <checkout>/node_modules/typescript/bin/tsc -p tsconfig.json
# client：tsdown 构建（需先 npm install --legacy-peer-deps）
npm run build:client
# 注入器环境：改完 build 后 dev_reload_package @dsh-external/dsh-skin（或自动 watch ~1.5s）
```

改完记得把 `lib/` 一并提交，保持"clone 即用"。

## 配置说明

- 配置（主题色 / 背景图 data URI / 透明度 / 开关）存在浏览器 `localStorage`（键 `dsh-skin:config`），换浏览器/换电脑需重新设置。
- 背景图建议 ≤2.5MB（localStorage 配额约 5MB）。

## 兼容性

- DSH：0.1.0-rc.x（peerDependencies 范围声明，不硬编码版本）
- 依赖注入：`@deepseek-ai/dsh-client-ui-slots`（官方内置）——无需额外安装

## 许可证

MIT
