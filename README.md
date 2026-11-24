# dsh-skin — DSH Web UI 换肤插件

给 DSH Web 界面换肤：**完整主题包 + 简约皮肤（主题色/背景图）**，设置面板即改即生效，配置存浏览器本地（localStorage）。

- **完整主题包（pack）**：自带全部 CSS/DOM 装饰/observer 生命周期的整包皮肤，昼夜自动跟随官方亮暗切换。内置：
  - `深海女仆工坊 · 完整主题`：**按已安装的 `@smalltailqwq/dsh-client-ui-skin-maid-atelier@0.1.9` 移植**（CSS 约 152KB / 699 条规则，素材 29 个文件经 Host 只读路由发放）。运行时由 `scripts/transplant-maid.mjs` 机械搬运，去掉改窗口标题 / 换 favicon+manifest / 同步 theme-color 三类浏览器头部行为，其余装饰保持原样（素材 CC BY-NC-SA 4.0，署名链见 `src/client/packs/maid-atelier/NOTICE.md`）
  - `鲸鱼娘昼夜工坊 · 场景版`：按上游 0.1.12 的预览适配 DSH 0.2.x。白昼水晶工坊与夜晚月潮观测室随原生亮暗切换，同步应用侧栏伙伴和飘带、输入框顶饰、会话卡片饰边。素材由 `assets/deep-whale-day-night/` 本地提供（CC BY-NC-SA 4.0，署名链见该 pack 的 `NOTICE.md`）
  - `达妮娅 · 虚无之泡`：来自 Ewnscat 的 v1.0.0 双形态皮肤。保留背景、左右立绘、Q 版动图、泡泡和锁链，跟随 DSH 原生亮暗切换。[署名及许可](src/client/packs/denia/NOTICE.md)
  - `芙宁娜 · 冰海天穹`：原创整套装饰 + 本机素材槽（立绘/背景仅本机使用，不入库）
- **简约皮肤（simple）**：取色器 / 预设色板，自动生成 DeepSeek 风格 11 级色阶并覆盖 `--dsw-*` 设计 token（亮/暗两套）；上传背景图（≤2.5MB，存 localStorage）+ 全屏固定层 + 透明度滑块
- **SkinManager 互斥调度**：同一时刻只有一个皮肤生效，切换 = 先 dispose 旧皮肤再 apply 新皮肤，热切换/卸载不留样式与 DOM 残留
- 设置入口：`设置 → 外观皮肤`（注册进官方 settings.section 槽，非覆盖官方页面）
- 零侵入：不碰 DSH 核心，卸载即净，升级 DSH 不受影响（peerDeps 全为范围声明）

## 结构

```
dsh-skin/
├── lib/                     # 预构建产物（已提交，开箱即用）
│   ├── index.js             # host 侧：生命周期占位 + 两组 /skin-assets/* 只读素材路由
│   └── client.js            # client 侧（皮肤中心 + 全部预设，ModuleLoader bundle）
├── assets/
│   ├── maid-atelier/        # 女仆工坊素材（29 个内容哈希文件）
│   └── deep-whale-day-night/ # 昼夜工坊素材（25 个内容哈希文件 + 2 张预览）
├── src/
│   ├── index.ts             # host
│   └── client/              # client（React + tsdown 打包）
│       ├── index.tsx        #   装配 + 设置面板（皮肤中心）
│       ├── core/            #   config（localStorage）/ manager（SkinManager）/ types（双层预设）
│       ├── simple/          #   简约皮肤引擎（色阶 + 背景 + token 覆盖）
│       ├── presets/         #   统一注册表 + 简约预设 + 背景素材（generated）
│       └── packs/           #   整包皮肤：maid-atelier / deep-whale-day-night / odeta + css-pack 工厂
├── install.ps1              # 其它电脑一键安装
└── scripts/
    ├── build.sh             # host 重建（需 DSH checkout，仅开发用）
    ├── extract-presets.mjs  # 从 .tmp-skins 提取/再生成预设素材与整包 CSS
    └── transplant-maid.mjs  # 从已安装的女仆工坊包重新移植（CSS/运行时/素材）
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
# host：用 DSH 源码 checkout 的 tsc 编译（无 checkout 可跳过——lib/index.js 无运行时依赖，可直接改）
node <checkout>/node_modules/typescript/bin/tsc -p tsconfig.json
# client：tsdown 构建（需先 npm install --legacy-peer-deps）
npm run build:client
# 注入器环境：改完 build 后 dev_reload_package @dsh-external/dsh-skin（或自动 watch ~1.5s）
```

改完记得把 `lib/` 一并提交，保持"clone 即用"。

### 更新女仆工坊皮肤（对齐已安装的新版）

```bash
# 缺省从 profile 的 node_modules 找包；也可以显式传目录
node scripts/transplant-maid.mjs [@smalltailqwq/dsh-client-ui-skin-maid-atelier 目录]
npm run build:client
```

脚本做三件事：把该包 `lib/client.js` 的 factory 主体搬成 `packs/maid-atelier/upstream.ts`（去掉
Cordis 装配壳，改为 pack 的 `apply`）；去掉改标题 / favicon+manifest / theme-color 三类头部行为；
把 `assets/runtime/` 的素材同步到 `assets/maid-atelier/`。`upstream.ts` 是生成物，不要手改。

## 配置说明

- 配置存在浏览器 `localStorage`（键 `dsh-skin:config`），换浏览器/换电脑需重新设置。
- 预设只持久化 `presetId`（预设素材不复制进 localStorage）；在预设基础上手动微调才会把当时的生效值固化为自定义配置。
- 自定义背景图建议 ≤2.5MB（localStorage 配额约 5MB）。
- 整包皮肤生效期间，主题色/背景图/透明度等自定义选项停用（整包自带全部样式）。

## 新增一个整包皮肤（pack）

**必读：`src/client/packs/GUIDELINES.md`（整包皮肤开发规范）**——包含块禁令、
状态投影、dispose 语义、署名链，每条都来自真实事故；提交前过一遍文末自查清单。

- **纯 CSS 皮肤**（只有配色/纹理，没有 DOM 装饰）：用 `src/client/packs/css-pack.ts` 的
  `makeCssPack()`，每套只要两个文件——`style.ts`（CSS 字符串）与 `index.ts`（元数据 + 调工厂），
  再在 `src/client/presets/index.ts` 的 `SKIN_PRESETS` 里注册。工厂负责设 body 属性、注入
  `<style>`、按 `dispose` 收回，并用主色生成卡片缩略图（无需素材文件）。
- **带 DOM 装饰的皮肤**：以 `src/client/packs/odeta/` 为骨架（四件套：`art.ts` / `style.ts` /
  `runtime.ts` / `index.ts`），`maid-atelier/` 是完整参照实现。

生命周期规范：dispose 只恢复本次 activation 改过的状态（快照原值、逆序清理、单项失败不波及其余）。

## 兼容性

- DSH：0.2.x（实测 0.2.2-rc.5；peerDependencies 为范围声明，不硬编码版本）
- 依赖注入：`@deepseek-ai/dsh-client-ui-slots` 与 `layout`（官方内置）——无需额外安装
- 女仆工坊 / 昼夜工坊两个 pack 需要 Host 半注册 `/skin-assets/maid-atelier/*` 与 `/skin-assets/deep-whale-day-night/*` 路由；若被其它插件占用同一前缀，路由注册会冲突，需要改前缀并同步对应 `upstream.ts` 里的素材 URL

## 许可证

MIT
