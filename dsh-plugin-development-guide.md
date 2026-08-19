# DSH 插件开发学习文档（以 dsh-skin 为例）

> 本文档以 `dsh-skin` 项目为解剖对象，讲清「DSH 插件」从零到发布的完整链路：
> 插件是什么、目录怎么搭、双端（host / client）怎么分工、皮肤插件的核心机制、
> 怎么构建、怎么安装分发、以及怎么照葫芦画瓢开发一个新功能。
>
> 读代码时建议打开 `D:\Project\tools\dsh-tools\dsh-skin\` 对照；本文所有文件路径都相对该项目。
> 姊妹项目 `D:\Project\tools\dsh-tools\dsh-git\` 作为「host 工具 + client 面板」的 hybrid 对照。

---

## 目录

1. [DSH 插件生态总览](#1-dsh-插件生态总览)
2. [一个插件的解剖：目录与 package.json](#2-一个插件的解剖目录与-packagejson)
3. [host 侧入口：src/index.ts](#3-host-侧入口srcindexts)
4. [client 侧入口：src/client/index.tsx](#4-client-侧入口srcclientindextsx)
5. [换肤插件的核心机制](#5-换肤插件的核心机制)
6. [构建与生成](#6-构建与生成)
7. [安装与分发](#7-安装与分发)
8. [实战：从零开发一个新皮肤](#8-实战从零开发一个新皮肤)
9. [常见坑与规范（来自真实事故）](#9-常见坑与规范来自真实事故)
10. [延伸：写一个 hybrid 插件（工具 + 面板）](#10-延伸写一个-hybrid-插件工具--面板)
11. [速查表](#11-速查表)

---

## 1. DSH 插件生态总览

### 1.1 DSH 是什么

DSH（DeepSeek Harness）是基于 **Cordis** 的插件化应用。Cordis 是一个插件容器框架
（Koishi 同源），核心概念：

- **插件（plugin）**：一段带生命周期、可独立安装/卸载/升级的功能单元。
- **Context（ctx）**：插件运行时拿到的上下文对象，用它访问服务、注册工具、挂卸载钩子。
- **依赖注入**：插件声明 `inject`，运行时自动注入对应服务。
- **生命周期**：`apply(ctx)` 在插件启动时调用；`ctx.effect(...)` / `ctx.on('dispose')`
  登记卸载时的清理逻辑。

DSH 插件有**两种形态**（一个插件可以同时具备两种）：

| 形态 | 运行位置 | 能力 | 入口文件 |
|---|---|---|---|
| **host（服务端）** | Node.js 进程 | 注册模型工具（`ctx.tools`）、HTTP API（`ctx.webServer`）、读写文件/跑命令 | `lib/index.js`（由 `src/index.ts` 编译） |
| **client（浏览器端）** | Web 界面 | 注入 UI 槽位、React 组件、改 DOM/样式、localStorage | `lib/client.js`（由 `src/client/` 打包） |

`dsh-skin` 几乎纯 client（视觉插件）；`dsh-git` 是 hybrid（host 注册 git 工具 + HTTP API，
client 挂一个 Git 面板）。**一份代码两处入口**，靠 `package.json` 的 `exports` 区分。

### 1.2 为什么先学 dsh-skin

- 它是**最小的完整插件**：host 侧只有占位（`src/index.ts` 不到 20 行），client 侧自包含。
- 它覆盖了 client 插件的全部核心知识点：`slots` 槽注入、`ctx.effect` 生命周期、
  React 设置面板、localStorage 持久化、DOM/CSS 运行时注入。
- 它的 `packs/celadon/` 是一个**刻意精简的新皮肤骨架**，配套 `GUIDELINES.md` 规范，
  是「照着写」的完美模板。

---

## 2. 一个插件的解剖：目录与 package.json

### 2.1 目录结构（dsh-skin）

```
dsh-skin/
├── lib/                     # 预构建产物（已提交，clone 即用）
│   ├── index.js             # host 侧产物（tsc 编译 src/index.ts）
│   ├── client.js            # client 侧产物（tsdown 打包 src/client/index.tsx）
│   └── types/               # host 的 .d.ts 声明
├── src/
│   ├── index.ts             # host 入口（占位）
│   └── client/              # client 全部源码
│       ├── index.tsx        #   装配 + 设置面板（React）
│       ├── core/            #   config（localStorage）/ manager（SkinManager）/ types（类型）
│       ├── simple/          #   简约皮肤引擎（token 覆盖）
│       ├── presets/         #   预设注册表 + 背景素材（generated）
│       └── packs/           #   整包皮肤：maid-atelier（完整）/ celadon（示例骨架）
├── install.ps1              # Windows 一键安装
└── scripts/
    ├── build.sh             # host 重建（需 DSH checkout）
    └── extract-presets.mjs  # 从 .tmp-skins 生成 *.generated.ts
```

关键点：**`lib/` 要提交进仓库**。DSH 加载插件读的是 `lib/`，用户 clone 下来不需要任何
构建工具链就能跑。只有改源码才需要重新构建。

### 2.2 package.json 关键字段

```jsonc
{
  "name": "@dsh-external/dsh-skin",
  "type": "module",
  "main": "./lib/index.js",              // host 入口
  "exports": {
    ".":            { "default": "./lib/index.js" },   // host 侧 import
    "./client":     { "default": "./lib/client.js" },  // client 侧 import
    "./package.json": "./package.json"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh-llm": ">=0.0.1-rc <2",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc <2",
    "cordis": ">=4.0.0-rc <5",
    "schemastery": "^3.18.0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.0.1-rc <2"
  },
  "dsh": {                              // DSH 插件专属字段
    "client": {
      "inject": [                       // client 侧依赖注入的服务
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "platform": "web"
    }
  }
}
```

要点：

- **`name` 要带 scope**：`@dsh-external/<id>` 是外置插件约定前缀（`dsh plugin --profile web
  remove @dsh-external/dsh-skin` 卸载时按这个名字找）。
- **`peerDependencies` 全用范围声明**（`>=0.0.1-rc <2`），不硬编码版本——保证 DSH 升级时
  插件不破。`@deepseek-ai/dsh-client-ui-slots` 是官方内置的槽服务，无需安装。
- **`dsh.client.inject`** 声明 client 侧需要的基础服务；`platform: "web"` 表示目标是
  Web 形态。`exports["./client"]` 让 DSH 的 client loader 能找到浏览器端 bundle。
- 依赖包用 `devDependencies`（typescript / tsdown / @types/node），运行时依赖全是 peer。

### 2.3 tsconfig 分工

`tsconfig.json` 只编译 `src/index.ts`（host），并且 `exclude: ["src/client"]`：

```jsonc
{
  "compilerOptions": {
    "module": "NodeNext",
    "target": "ES2023",
    "lib": ["ES2023", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "declaration": true,
    "declarationDir": "lib/types",
    "outDir": "lib"
  },
  "include": ["src"],
  "exclude": ["src/client"]
}
```

client 侧不进 tsc，由 **tsdown**（见第 6 节）单独打包。host/client 的代码要避免互相
import——它们跑在两个完全不同的环境（Node 与浏览器）。

---

## 3. host 侧入口：src/index.ts

host 侧入口极简，是 Cordis 插件的标准三件套：

```ts
import type { Context } from 'cordis'

export const name = '@dsh-external/dsh-skin'   // 插件名（与 package.json 一致）
export const inject: string[] = []             // 依赖的服务列表（此处无）
export function apply(ctx: Context): void {    // 插件启动入口
  ctx.logger?.info?.('[dsh-skin] 换肤插件已激活（使用：设置 → 外观皮肤）')
}
```

- `name`：注册到 Cordis 的名字。
- `inject`：声明要用哪些服务；`ctx` 会自动带上它们。dsh-skin 全在 client，所以为空。
- `apply(ctx)`：插件启动时执行。**如果插件在 apply 期间不注册任何资源，它就是一个纯
  占位 host**——皮肤逻辑全在 client。但 apply 不能省略，Cordis 靠它拉起插件。

### 3.1 进阶：host 侧能干什么（以 dsh-git 为例）

真正的 host 插件通常用 `ctx.tools.register` 注册**模型工具**，以及 `ctx.webServer`
挂 HTTP API：

```ts
// dsh-git/src/index.ts
export const inject = ['tools', 'webServer', 'workspaceRegistry']

export function apply(ctx: Context): void {
  const toolsDispose = registerGitTools(ctx)          // 1) 模型可见的 git 工具
  const apiDispose = mountGitApi(ctx)                 // 2) HTTP 面板 API
  ctx.on('dispose' as any, () => {                    // 3) 卸载清理
    try { toolsDispose() } catch {}
    try { apiDispose() } catch {}
  })
}
```

工具注册（`dsh-git/src/tools.ts`）：

```ts
ctx.tools.register(defineTool({
  name: 'git_status',
  description: '查看一个 git 仓库的状态……',
  parameters: { path: { type: 'string', description: '目标仓库绝对路径' } },
  output: {
    schema: { type: 'object', properties: { branch: { type: 'string' }, /* ... */ } },
    render(args, value) { return [{ type: 'text', text: `分支 ${value.branch} …` }] },
  },
  async execute(args) {
    return { branch: ..., ahead: ..., behind: ... }
  },
}))
```

`defineTool` 来自 `@deepseek-ai/dsh-tools`。这样模型在对话里就能直接 `git_status`
调你的工具。client 面板则通过 `fetch('/@dsh-external/dsh-git/api/status')` 复用同一套逻辑。

---

## 4. client 侧入口：src/client/index.tsx

client 侧是浏览器里的 React 代码。它被 `window.__ModuleLoader__` 以 CommonJS 模块加载
（详见第 6 节构建）。入口文件做的事情可以用一句话概括：
**「把皮肤按已存配置立即生效，并在设置面板里注册一个『外观皮肤』section」**。

### 4.1 装配骨架

```tsx
// dsh-skin/src/client/index.tsx 末尾
type SkinClientContext = {
  slots: SlotsLike
  effect(fn: () => (() => void) | void, label?: string): void
}

export const inject = ['slots']          // client 侧依赖：槽服务

export function apply(ctx: SkinClientContext): void {
  // 1) 立即按已存配置生效（不依赖用户打开面板）
  manager.activate(loadConfig((id) => findPreset(id) !== undefined))
  // 2) 插件卸载时整体还原（dispose 语义）
  ctx.effect(() => () => manager.deactivate(), 'dsh-skin: skin lifecycle')

  // 3) 往「设置」页注入一个 section
  ctx.effect(() => ctx.slots.inject('settings.section', () =>
    ctx.slots.register({
      name: 'settings.section',
      id: 'skin',
      order: 10,
      label: () => '外观皮肤',
    }, SkinSection),
  ) as unknown as () => void, 'dsh-skin: settings section')
}
```

**两个关键 API：**

| API | 作用 |
|---|---|
| `ctx.effect(fn, label)` | 语义对齐 Cordis 的 `ctx.effect`：立即执行 `fn`；若 `fn` 返回清理函数则登记，插件卸载时按逆序调用。**先登记清理、再做写入**是防残留的铁律。 |
| `ctx.slots.inject(slot, factory)` | 把 `factory()` 的返回值注入到名为 `slot` 的列表槽。`factory` 返回 `ctx.slots.register(options, component)` 的结果。 |

**槽（slot）** 是 DSH UI 的扩展点。`register` 的参数：

```ts
{ name: 'settings.section',   // 槽名（哪个扩展点）
  id: 'skin',                 // 唯一 id
  order: 10,                  // 排序权重（越小越靠前）
  label: () => '外观皮肤' }    // 显示标题
```

`dsh-git` 用了另一个槽 `conversation.view`（会话标签页环，多一个 Git 页）：

```ts
ctx.slots.inject('conversation.view', () =>
  ctx.slots.register({ name: 'conversation.view', id: '@dsh-external/dsh-git-panel', label: () => 'Git' }, GitPanel),
)
```

**槽组件契约 = React 组件 `(props) => ReactNode`**。所以 dsh-skin 的设置面板、
dsh-git 的 Git 面板都是标准 React 函数组件 + hooks，毫无特殊。

### 4.2 设置面板：标准 React 组件

`SkinSection` 是一个普通 React 组件：`useState` 存配置、`useEffect` 同步生效、
`<input type="color">` 取色、`<input type="file">` 上传背景图、`FileReader` 转 data URI。

```tsx
const [cfg, setCfg] = useState<SkinConfig>(() => loadConfig(...))

useEffect(() => {
  manager.activate(cfg)     // 配置一变，立即换肤
  saveConfig(cfg)           // 并持久化到 localStorage
}, [cfg])
```

注意点：

- **样式全部用 DSH 设计 token**（见 5.1），所以面板自动适配亮/暗主题，例如
  `var(--dsw-alias-label-primary)`、`var(--dsw-alias-bg-layer-2)`。
- 组件 CSS 可以内联 `<style>{CSS}</style>`（dsh-git 的做法），或直接写 inline style。
- **不碰 React 内部**：皮肤层用 `body[data-...]` 属性钩子 + 原生 DOM 操作（见第 5 节），
  而非入侵组件树。

---

## 5. 换肤插件的核心机制

这是 dsh-skin 最值得学的部分。它回答了：「一个视觉插件，怎么做到**改样式但零残留、
热切换、跟随官方亮暗、不破坏官方浮层**」。

### 5.1 设计 token 体系 `--dsw-*`

DSH 的组件样式**全部消费 CSS 自定义属性（design token）**，token 名以 `--dsw-` 开头：

- 色阶：`--dsw-static-deepseek-50 … -900`（11 级）
- 品牌别名：`--dsw-alias-brand-primary`、`--dsw-alias-button-primary-hover`…
- 背景别名：`--dsw-alias-bg-base / bg-layer-1/2/3 / bg-overlay / bg-module-platform`
- 具体组件：`--dsw-specific-sidebar-fill`、`--dsw-specific-input-major`、`--dsw-specific-menu`

**所以换肤 = 覆盖 token。** 一处覆盖，全局组件跟着变。`simple/engine.ts` 的核心就是
生成一条 `body[data-dsh-skin] { --dsw-static-deepseek-500: <你的主题色>; ... }` 规则。

官方亮/暗的切换靠 `body[data-ds-dark-theme]` 属性。插件不写任何 JS 亮暗判断，
只用 CSS 特异性分支：

```css
/* 亮色分支 */
body[data-dsh-skin] { --dsw-alias-brand-primary: ...; }
/* 暗色分支：更高特异性压过官方暗色块 */
body[data-ds-dark-theme][data-dsh-skin] { --dsw-alias-brand-primary: ...; }
```

### 5.2 双层预设：SimplePreset 与 PackPreset

`src/client/core/types.ts` 定义了统一的预设类型：

```ts
interface PresetBase { id: string; name: string; desc: string; credit: string; preview: string }

export interface SimplePreset extends PresetBase {
  kind: 'simple'          // 纯数据：主题色 + 背景图 + 透明度
  accent: string
  bgImage: string
  bgOpacity: number
  uiAlpha: number
}

export interface PackPreset extends PresetBase {
  kind: 'pack'            // 完整皮肤包：自带 CSS/DOM/observer 生命周期
  apply(ctx: PackContext): void
}
```

**为什么要两层？**

- **SimplePreset** 是「轻量皮肤」：只换色 + 背景，成本极低（重建一个 `<style>`），
  用户可手动微调。
- **PackPreset** 是「整包皮肤」：自带全部样式、装饰 DOM、MutationObserver，像
  maid-atelier 那样双女仆立绘 + 金框侧栏。它拿到一个 `PackContext`，自己负责
  生命周期（登记清理）。

统一注册表在 `src/client/presets/index.ts`：

```ts
export const SKIN_PRESETS: SkinPreset[] = [
  MAID_ATELIER_PACK, CELADON_PACK, ODETA_PACK,   // pack 在前
  ...SIMPLE_PRESETS,                              // simple 在后
]
export function findPreset(id: string): SkinPreset | undefined {
  return SKIN_PRESETS.find((p) => p.id === id)
}
```

### 5.3 SkinManager：互斥调度与生命周期

`src/client/core/manager.ts`。**不变量：同一时刻至多一个皮肤生效；切换 = 先 dispose 旧
皮肤再 apply 新皮肤。**

```ts
export class SkinManager {
  activate(cfg: SkinConfig): void {
    const preset = cfg.presetId !== null ? this.resolve(cfg.presetId) : undefined
    if (cfg.enabled && preset?.kind === 'pack') { this.activatePack(preset); return }
    this.activateSimple(cfg, preset?.kind === 'simple' ? preset : undefined)
  }
  deactivate(): void {
    this.active?.dispose()      // 插件卸载/关闭皮肤时整体还原
    this.active = null
  }
}
```

`PackContextImpl` 实现了 `PackContext.effect`：把每个 setup 返回的清理函数登记成列表，
`dispose()` 时**逆序执行、单项抛错不波及其余**——这是 Cordis 生命周期语义的迷你复刻：

```ts
class PackContextImpl implements PackContext {
  effect(setup, label?) {
    let cleanup
    try { cleanup = setup() }            // setup 失败只记错误，不阻断后续登记
    catch (err) { console.error(...); return }
    if (typeof cleanup === 'function') this.cleanups.push({ label, fn: cleanup })
  }
  dispose() {
    for (const { label, fn } of this.cleanups.splice(0).reverse()) {
      try { fn() } catch (err) { console.error(...) }   // 单项失败不影响其余
    }
  }
}
```

### 5.4 简约皮肤引擎 `simple/engine.ts`

`applySimple(values)` 干三件事：

1. `body.setAttribute('data-dsh-skin', 'on')` —— 挂根作用域钩子。
2. 往 `document.head` 注入一个 `<style id="dsh-skin-style">`，内容是由 `buildCss(values)`
   生成的 CSS。
3. 返回 `dispose`：`removeAttribute('data-dsh-skin')` + `remove()` 那个 `<style>`。

`buildCss` 用 `mix()` 工具函数把主题色展开成 11 级色阶（对应 `--dsw-static-deepseek-*`），
再覆盖品牌 token 和背景 token，最后用 `body::before` 做全屏固定背景层（`z-index:-1`，
`pointer-events:none`）。

关键技巧：**背景图用 `body::before` 而不是直接改 `body` 的 `background-image`**，因为
官方可能自己设置了 body 背景，直接覆盖会留下冲突；伪元素层可以独立控制
`position:fixed; inset:0; z-index:-1; pointer-events:none`，安全铺在内容底下。

### 5.5 整包皮肤（pack）四件套

以 `packs/celadon/`（原创示例骨架）为模板，一个 pack 由四件套组成：

| 文件 | 职责 |
|---|---|
| `art.ts` | 素材：SVG / 位图，全部编码成 **data URI** 内联（`svgUri()` 辅助函数） |
| `style.ts` | 整包 CSS：根作用域 `body[data-dsh-<id>]`，亮/暗双套走 `[data-ds-dark-theme]` 分支 |
| `runtime.ts` | `apply(ctx: PackContext)`：先登记清理，再注入样式、装饰 DOM、observer |
| `index.ts` | 组装成 `PackPreset` 并在 `presets/index.ts` 注册 |

#### index.ts —— 注册一个 pack

```ts
export const CELADON_PACK: PackPreset = {
  kind: 'pack',
  id: 'celadon-moon-gate',       // 会变成 body[data-dsh-celadon] 的属性名
  name: '青瓷·月门（示例整包）',
  desc: '原创纯 CSS/SVG：月门环 · 梅枝 · 印章 · 玉色 token，昼夜自动跟随',
  credit: 'dsh-skin 原创示例（MIT）',
  preview: CELADON_PREVIEW,       // 皮肤中心卡片缩略图
  apply: applyCeladon,            // 运行时入口
}
```

#### runtime.ts —— 生命周期范式

这是 pack 开发最核心、最易踩坑的文件。标准骨架：

```ts
export function applyCeladon(ctx: PackContext): void {
  const body = document.body
  const ownedNodes = new Set<Element>()          // 皮肤自有节点，统一摘除
  const previousArt = new Map<string, string>()  // 快照所有要改的 style 原值
  for (const property of CHROME_ART_PROPERTIES) {
    previousArt.set(property, body.style.getPropertyValue(property))
  }

  // ① 第一步就登记总清理（D1：先登记，再写入）
  ctx.effect(() => () => {
    delete body.dataset.dshCeladon                       // 摘根作用域
    if (!hadChatActive) body.removeAttribute('data-celadon-chat-active')
    if (previousSidebarSize === null) body.removeAttribute('data-celadon-sidebar')
    else body.setAttribute('data-celadon-sidebar', previousSidebarSize)
    observer?.disconnect()                               // 断 observer
    resizeObserver?.disconnect()
    for (const [property, value] of previousArt)         // 恢复快照
      body.style.setProperty(property, value)
    ownedNodes.forEach((el) => el.remove())              // 摘注入节点
  }, 'pack/celadon: celadon moon gate')

  // ② 再写样式与素材
  const styleTag = document.createElement('style')
  styleTag.dataset.skinOwner = SKIN_OWNER               // 标记皮肤自有，observer 忽略
  styleTag.textContent = CELADON_CSS
  ownedNodes.add(styleTag)
  document.head.append(styleTag)

  body.dataset.dshCeladon = ''
  body.style.setProperty('--celadon-moon-gate-art', `url("${CELADON_MOON_GATE}")`)

  // ③ 装饰节点：兄弟节点 + data-skin-owner + aria-hidden + pointer-events:none
  const moon = makeChrome('div', 'moon-gate')
  ownedNodes.add(moon)
  body.prepend(moon)

  // ④ observer：忽略皮肤自有节点，按 record 归类后同步
  const isSkinChrome = (node) => node instanceof Element
    && node.getAttribute('data-skin-owner') === SKIN_OWNER
  observer = new MutationObserver((records) => {
    // 归类 → 各调一次同步函数（不在循环里改 DOM）
  })
  observer.observe(body, { attributes: true, attributeFilter: [...], childList: true, subtree: true })
}
```

**为什么装饰节点要「兄弟节点 + data-skin-owner」？**
- 装饰是 `body.prepend(...)` 的独立层，不是改官方节点的属性/子节点，避免与 React 渲染
  冲突。
- 带 `data-skin-owner` 后，MutationObserver 里的 `isSkinChrome()` 能忽略皮肤自己插入的
  节点——否则「装饰触发 observer → observer 再装饰」会无限循环（C2）。
- 带 `aria-hidden="true"` + CSS 里 `pointer-events:none`，不让屏幕阅读器和鼠标误触。

**decorate 类函数要幂等**（D4）：插入前查 `[data-skin-chrome='xxx']` 是否已存在。

### 5.6 状态投影（state projection）

JS **只往 body 上写 `data-*` 属性表示状态，样式全部交给 CSS 消费这些钩子**（C1）。
JS 从不写具体样式值。celadon 的例子：

```ts
const applySidebarWidth = (width: number): void => {
  if (width <= 0) return
  // 只写状态属性，不做布局
  body.dataset.celadonSidebar = width <= 120 ? 'rail' : width <= 220 ? 'narrow' : 'wide'
}
```

CSS 侧：

```css
body[data-dsh-celadon][data-celadon-sidebar='rail'] [data-celadon-chrome='seal'] {
  display: none;
}
body[data-dsh-celadon][data-celadon-chat-active] [data-celadon-chrome='moon-gate'] {
  opacity: 0.16;
  transform: translateY(-50%) translateX(8vmin) scale(0.96);
}
```

**为什么？** 把「状态」与「样式」解耦后：
- 亮/暗、rail/wide、会话进行中……这些状态变化统一走 CSS，可复用、可组合、可预测。
- 不同 pack 可以各自定义自己的 `data-*` 命名空间（celadon 用 `data-celadon-*`，
  maid 用 `data-maid-*`），互不打架。

**每帧级联动**（比如跟随侧栏宽度）不写 attribute/style（会触发其它 observer），而是写
CSSOM `insertRule`（maid 的 `widthSheet.sheet!.insertRule('body { --maid-sidebar-width: ... }')`），
Chrome autofill 的 observer 不会逐帧放大（C3）。

### 5.7 配置持久化 `core/config.ts`

配置存浏览器 `localStorage`，键 `dsh-skin:config`。要点：

- **预设只持久化 `presetId`**，不把预设的 data URI 背景复制进 localStorage——
  否则一张 1MB 的背景图 x 5 个预设就把 ~5MB 配额顶爆。
- `loadConfig` 做**防御性校验**：类型不对/非法就回落默认值。
- 用户在预设基础上手动微调（改色/换图）就**退出预设模式**（`presetId: null`），
  并把当时的生效值固化为自定义配置。

```ts
export function loadConfig(isValidPreset: (id: string) => boolean): SkinConfig {
  const p = JSON.parse(raw) as Partial<SkinConfig>
  return {
    enabled: typeof p.enabled === 'boolean' ? p.enabled : true,
    presetId: typeof p.presetId === 'string' && isValidPreset(p.presetId) ? p.presetId : null,
    accent: /^#[0-9a-fA-F]{6}$/.test(p.accent) ? p.accent : '#3964fe',
    // ...
  }
}
```

---

## 6. 构建与生成

### 6.1 两条构建链路

| 产物 | 工具 | 输入 → 输出 | 何时用 |
|---|---|---|---|
| `lib/index.js`（host） | **tsc** | `src/index.ts` → `lib/` | 编译 host 侧 |
| `lib/client.js`（client） | **tsdown** | `src/client/index.tsx` → `lib/client.js` | 打包浏览器端 |

命令（见 package.json scripts）：

```bash
npm run build          # = bash scripts/build.sh（host，需要 DSH checkout）
npm run typecheck      # tsc --noEmit
npm run build:client   # tsdown（需要先 npm install --legacy-peer-deps）
```

`scripts/build.sh` 会把 DSH checkout（`$HOME/dsh-harness` 或 `DSH_CHECKOUT` 环境变量）
里的 `cordis` / `schemastery` / `@deepseek-ai/*` symlink 到本项目的 `node_modules`，
再用 checkout 自带的 tsc 编译。**没有 checkout 可以跳过 host 构建**——`lib/index.js`
只是占位、无运行时依赖。

### 6.2 tsdown 与 `__ModuleLoader__`

`tsdown.config.ts` 是 client 构建配置，最值得注意的是它的 banner/footer 包裹：

```ts
outputOptions: {
  entryFileNames: 'client.js',
  banner: 'window.__ModuleLoader__.load({ id: "@dsh-external/dsh-skin", factory: (require) => {',
  footer: 'return module.exports; } });',
  intro: 'var module = { exports: {} }; var exports = module.exports;',
  codeSplitting: false,
}
```

这行代码说明 client 侧**不是普通 script 标签加载**，而是通过 `window.__ModuleLoader__`
注册一个模块。这个 loader 是 DSH client runtime 提供的——所以 `dsh.client.inject` 里
必须注入 `@deepseek-ai/dsh-client-runtime`。

`deps.neverBundle` 列出的包（`react`、`cordis`、`@deepseek-ai/dsh-client-ui-slots` 等）
**不打包进产物**，运行时由 DSH 提供；其余（皮肤代码）全部打进 `client.js`。

### 6.3 `*.generated.ts` 与 extract-presets.mjs

`presets/backgrounds.generated.ts`、`packs/maid-atelier/*.generated.ts` 等文件都是
**生成的**，不要手改：

```bash
node scripts/extract-presets.mjs
```

它从 `.tmp-skins/` 下的第三方皮肤仓库源码里提取：
- 简约预设背景 → base64 内嵌的 `backgrounds.generated.ts`
- maid 整包素材/样式 → `art.generated.ts` / `css.generated.ts`
- 每个导出带文件头声明「请勿手改，重新生成」

`.tmp-skins/` 是工作区缓存（被 gitignore），里面是 `git clone` 来的第三方皮肤仓库。

---

## 7. 安装与分发

三种方式（README 的「在其它电脑上安装」一节）：

### 方式 A：官方装配（最省事，重启后常驻）

```powershell
git clone <本仓库地址>  # 或下载 ZIP
cd dsh-skin
.\install.ps1           # = dsh plugin --profile web add <目录>
```

然后**重启 DSH** → 浏览器打开 → `设置 → 外观皮肤`。

### 方式 B：注入器免重启（已装 dsh-routing-suite 时）

在 DSH 会话里对 AI 说：

```
dev_inject_plugin {"dir": "dsh-skin 目录的绝对路径"}
```

立即生效、无需重启；要重启也常驻，再让 AI 跑 `dev_install_package`（同一参数）。
开发迭代时可以 `dev_reload_package @dsh-external/dsh-skin`（或自动 watch ~1.5s）。

### 方式 C：下载 Release 包

仓库 Releases 里有 `dsh-external-dsh-skin-<ver>.tgz`，解压后按 A 或 B 操作。

### 卸载

```powershell
dsh plugin --profile web remove @dsh-external/dsh-skin
```

注入器环境的免重启卸载：对 AI 说 `dev_uninject_plugin dsh-skin`。

**设计目标：卸载即净。** 因为所有样式/DOM 都登记进了 `ctx.effect` 的清理，卸载时
dispose 全部还原，浏览器刷新后回到官方默认外观。

---

## 8. 实战：从零开发一个新皮肤

以「新增一个整包皮肤（pack）」为例，照抄 `packs/celadon/`：

**必读：`src/client/packs/GUIDELINES.md`**——整包皮肤开发规范，每条都来自真实事故，
提交前过一遍文末自查清单。

四件套步骤：

1. **`art.ts`** —— 素材。原创 SVG 用 `svgUri()` 编码成 data URI；位图转 webp/base64。
   第三方素材必须许可证兼容（CC BY-NC-SA 4.0 / BSD-3-Clause），并在 pack 目录放
   `NOTICE.md` 记录完整署名链，在 `presets/README.md` 登记（F2）。
2. **`style.ts`** —— 整包 CSS。根作用域 `body[data-dsh-<skin-id>]`；状态全部走
   `data-*` 钩子；亮/暗双套经 `body[data-ds-dark-theme]` 分支（E1）。
3. **`runtime.ts`** —— `apply(ctx: PackContext)`：**先登记清理（ctx.effect）再写入**；
   装饰节点带 `data-skin-owner` 并在 observer 里忽略自身插入；decorate 幂等。
4. **`index.ts`** —— 组装 `PackPreset`，在 `presets/index.ts` 的 `SKIN_PRESETS` 里注册。

生命周期规范（D 节）：dispose 只恢复本次 activation 改过的状态（快照原值、逆序清理、
单项失败不波及其余）。简洁地说就是：

> 「**我碰过的东西，我来恢复；我只恢复我碰过的东西。**」

### 提交前自查清单（GUIDELINES.md 文末）

```bash
# 1. 包含块属性只落在皮肤自有节点
grep -n 'backdrop-filter\|will-change\|contain:\|isolation\|perspective' style.css
# 2. 手动验证：开/关设置弹窗、Cordis 审批面板 → 位置不偏移、不被装饰层压住
# 3. 亮/暗切换、侧栏 rail↔wide 拖动、hero↔会话态切换 → 装饰跟随且无残留
# 4. 切到别的皮肤再切回来 → 无样式/DOM 残留，无重复装饰
```

---

## 9. 常见坑与规范（来自真实事故）

这些不是「最佳实践」，是**真实踩过的坑**。遵守它们能避开 90% 的皮肤 bug。

### 9.1 包含块与层叠（B 节，最高优先级）

**事故**：DSH 的设置弹窗、Cordis 审批面板等浮层以 `position: fixed` 挂载在**侧栏 DOM
子树内**（非 document portal）。祖先链上一旦出现 `transform / filter / backdrop-filter /
perspective / will-change / contain / opacity<1 / isolation / 非 auto z-index`，
fixed 的包含块就从视口变成该祖先，浮层被挤进侧栏宽度、错位到屏幕左侧。

**规矩**：
- 绝不给应用容器（`[data-pane='sidebar']`、`#root`、消息气泡等 React 节点）设置上述属性。
- 装饰一律是**皮肤自有兄弟节点**（prepend/append，带 `data-skin-chrome` + `pointer-events:none`），
  毛玻璃/投影/位移全用在皮肤自己的节点上。
- `position: relative`（不设 z-index）是唯一允许的例外。
- z-index 分层：皮肤背景层 `-1/0`，装饰层 `1~20`，永不把应用容器抬进 overlay（≥40）。

### 9.2 状态投影（C 节）

- JS 只往 body 写 `data-*` 状态属性，样式全在 CSS 里消费（C1）。
- MutationObserver 忽略 `data-skin-owner` 节点；按 record 归类后各调一次同步函数，
  不在循环里改 DOM（C2）。
- 每帧级联动写 CSSOM `insertRule`，不写 attribute/style（C3）。

### 9.3 生命周期（D 节）

- 先登记总清理，再做任何可能失败的写入（D1）。
- 快照并恢复所有触碰过的原值：`body.style`、`body` 属性、`document.title`、
  `theme-color` meta（D2）。
- 注入节点全部登记统一摘除；observer / ResizeObserver / timer / rAF / 事件监听全部断开；
  清理逆序执行，单项失败不波及其余（D3）。
- decorate 幂等：插入前查是否已存在（D4）。
- apply 部分失败也必须能干净回退（D5）。

### 9.4 素材与署名（F 节）

- 素材全部 data URI 内联（F1），不依赖远程运行时素材。
- 第三方素材必须许可证兼容 + `NOTICE.md` 署名链 + `presets/README.md` 登记（F2）。
- `*.generated.ts` 由脚本生成，不手改（F3）。

---

## 10. 延伸：写一个 hybrid 插件（工具 + 面板）

以 `dsh-git` 为模板，一个「既给模型工具、又给人类面板」的插件，分工是：

| 端 | 文件 | 做什么 |
|---|---|---|
| host | `src/index.ts` | 装配：`inject = ['tools','webServer','workspaceRegistry']` |
| host | `src/tools.ts` | `ctx.tools.register(defineTool({...}))` 注册 git 工具 |
| host | `src/api.ts` | `ctx.webServer` 挂 `/@dsh-external/dsh-git/api/*` JSON API |
| host | `src/git.ts` | git 命令 runner（工具与 API 共用，一次封装双端复用） |
| client | `src/client/index.tsx` | 挂 `conversation.view` 槽，React 面板 `fetch` host API |

工具（模型驱动）与面板（人类驱动）复用同一套 runner，这就是「一次封装、双端复用」。

`peerDependencies` 里 `@deepseek-ai/dsh-llm`、`@deepseek-ai/dsh-tools` 用 `optional: true`
标记（见 dsh-git 的 `peerDependenciesMeta`），因为 host 工具和 client 面板可能分别存在。

---

## 11. 速查表

### 常用槽位（client slot）

| 槽名 | 作用 | 示例 |
|---|---|---|
| `settings.section` | 设置页的 section 列表 | dsh-skin：外观皮肤 |
| `conversation.view` | 会话标签页环 | dsh-git：Git 页 |

### client 依赖注入（dsh.client.inject）

- `@deepseek-ai/dsh-client-runtime` —— 提供 `__ModuleLoader__`、client runtime
- `@deepseek-ai/dsh-client-ui-slots` —— 提供 `slots` 服务

### 常用设计 token（`--dsw-*`）

| 类别 | 示例 |
|---|---|
| 静态色阶 | `--dsw-static-deepseek-50 … 900` |
| 品牌 | `--dsw-alias-brand-primary`、`--dsw-alias-button-primary-hover` |
| 背景 | `--dsw-alias-bg-base`、`--dsw-alias-bg-layer-1/2/3` |
| 文字 | `--dsw-alias-label-primary/secondary/tertiary` |
| 具体组件 | `--dsw-specific-sidebar-fill`、`--dsw-specific-input-major` |

### 常用 DOM 钩子

| 钩子 | 含义 |
|---|---|
| `body[data-ds-dark-theme]` | 官方暗色模式开启 |
| `body[data-dsh-<skin-id>]` | 皮肤根作用域（pack 自己设置） |
| `[data-pane='sidebar']` / `[class*='sidebarCol']` | 侧栏列（稳定语义钩子） |
| `[data-slot='...']` | 槽位容器（如 `sidebar.settings`） |
| `[data-phase='hero'|'active']` | 输入区 phase（欢迎页 / 会话中） |
| `[role='treeitem'][aria-selected='true']` | 会话行选中态 |

### 术语表

| 术语 | 含义 |
|---|---|
| host | 服务端（Node.js）形态，能注册工具/API |
| client | 浏览器端形态，能注入 UI/改样式 |
| slot | DSH UI 的扩展点（列表槽），`slots.inject` + `slots.register` |
| `ctx.effect` | 登记清理的生命周期钩子，插件卸载时逆序执行 |
| design token | `--dsw-*` CSS 变量，组件样式的唯一真相 |
| SimplePreset | 轻量皮肤（纯数据：色 + 背景 + 透明度） |
| PackPreset | 整包皮肤（自带 CSS/DOM/observer 生命周期） |
| `data-skin-owner` | 标记皮肤自有节点的属性，observer 用它忽略自身插入 |
| 状态投影 | JS 只写 body 的 `data-*` 状态钩子，样式全由 CSS 消费 |
| `.generated.ts` | 由 `extract-presets.mjs` 生成的素材文件，勿手改 |

---

### 学习路径建议

1. **先跑起来**：`install.ps1` 装上 dsh-skin → 设置里切几个皮肤 → 感受「热切换、卸载即净」。
2. **读懂装配**：`src/client/index.tsx` 的 `apply()` 三行（activate / effect / slot）。
3. **读懂 manager**：`core/manager.ts` 的互斥调度 + `PackContextImpl`。
4. **抄一个 pack**：复制 `packs/celadon/`，改成自己的配色/装饰，过一遍自查清单。
5. **再看 maid**：`packs/maid-atelier/runtime.ts` 是完整参照实现（状态投影、CSSOM、
   窗口控件 overlay、rail 搜索焦点修复等实战细节）。
6. **最后读 GUIDELINES.md**：带着「我已经踩过坑」的心态再读一遍规范，印象最深。
