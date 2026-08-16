# dsh-skin — DSH Web UI 换肤插件

给 DSH Web 界面换肤：**完整主题包 + 简约皮肤（主题色/背景图）**，设置面板即改即生效，配置存浏览器本地（localStorage）。

- **完整主题包（pack）**：自带全部 CSS/DOM 装饰/observer 生命周期的整包皮肤，昼夜自动跟随官方亮暗切换。内置：
  - `深海女仆工坊 · 完整主题`：双女仆立绘 + 金框侧栏 + 蕾丝帘饰带 + 缎带选中态（素材 CC BY-NC-SA 4.0，署名链见 `src/client/packs/maid-atelier/NOTICE.md`）
  - `青瓷·月门（示例整包）`：原创纯 CSS/SVG（月门环/梅枝/印章/玉色 token），可作为新皮肤的参考骨架
- **简约皮肤（simple）**：取色器 / 预设色板，自动生成 DeepSeek 风格 11 级色阶并覆盖 `--dsw-*` 设计 token（亮/暗两套）；上传背景图（≤2.5MB，存 localStorage）+ 全屏固定层 + 透明度滑块
- **SkinManager 互斥调度**：同一时刻只有一个皮肤生效，切换 = 先 dispose 旧皮肤再 apply 新皮肤，热切换/卸载不留样式与 DOM 残留
- 设置入口：`设置 → 外观皮肤`（注册进官方 settings.section 槽，非覆盖官方页面）
- 零侵入：不碰 DSH 核心，卸载即净，升级 DSH 不受影响（peerDeps 全为范围声明）

## 结构

```
dsh-skin/
├── lib/                     # 预构建产物（已提交，开箱即用）
│   ├── index.js             # host 侧（占位，无工具）
│   └── client.js            # client 侧（皮肤中心 + 全部预设，ModuleLoader bundle）
├── src/
│   ├── index.ts             # host
│   └── client/              # client（React + tsdown 打包）
│       ├── index.tsx        #   装配 + 设置面板（皮肤中心）
│       ├── core/            #   config（localStorage）/ manager（SkinManager）/ types（双层预设）
│       ├── simple/          #   简约皮肤引擎（色阶 + 背景 + token 覆盖）
│       ├── presets/         #   统一注册表 + 简约预设 + 背景素材（generated）
│       └── packs/           #   整包皮肤：maid-atelier（完整移植）/ celadon（原创示例）
├── install.ps1              # 其它电脑一键安装
└── scripts/
    ├── build.sh             # host 重建（需 DSH checkout，仅开发用）
    └── extract-presets.mjs  # 从 .tmp-skins 提取/再生成预设素材与整包 CSS
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

- 配置存在浏览器 `localStorage`（键 `dsh-skin:config`），换浏览器/换电脑需重新设置。
- 预设只持久化 `presetId`（预设素材不复制进 localStorage）；在预设基础上手动微调才会把当时的生效值固化为自定义配置。
- 自定义背景图建议 ≤2.5MB（localStorage 配额约 5MB）。
- 整包皮肤生效期间，主题色/背景图/透明度等自定义选项停用（整包自带全部样式）。

## 新增一个整包皮肤（pack）

**必读：`src/client/packs/GUIDELINES.md`（整包皮肤开发规范）**——包含块禁令、
状态投影、dispose 语义、署名链，每条都来自真实事故；提交前过一遍文末自查清单。

实现上照抄 `src/client/packs/celadon/` 即可，四件套：

1. `art.ts` —— 素材（SVG/位图 data URI）
2. `style.ts` —— 整包 CSS（根作用域 `body[data-dsh-<skin>]`，状态全部走 data-* 钩子）
3. `runtime.ts` —— `apply(ctx: PackContext)`：先登记清理再写入；装饰节点带 `data-skin-owner` 并在 observer 里忽略自身插入
4. `index.ts` —— 在 `presets/index.ts` 的 `SKIN_PRESETS` 里注册

生命周期规范：dispose 只恢复本次 activation 改过的状态（快照原值、逆序清理、单项失败不波及其余）。

## 兼容性

- DSH：0.1.0-rc.x（peerDependencies 范围声明，不硬编码版本）
- 依赖注入：`@deepseek-ai/dsh-client-ui-slots`（官方内置）——无需额外安装

## 许可证

MIT
