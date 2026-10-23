# DSH 皮肤元素 / 变量总目录

> 目的：先确定「哪些 UI 元素适合做成皮肤变量」，再据此设计各类皮肤。
> 本目录只收录**有实证**的内容。三级证据来源，逐条标注：
>
> - **[本插件]** 本仓库代码：`src/client/simple/engine.ts`、`src/client/packs/*`、`GUIDELINES.md`
> - **[theme-spec]** token 契约：[orxz/deepseek-harness-themes · docs/theme-spec.md](https://github.com/orxz/deepseek-harness-themes/blob/main/docs/theme-spec.md)（其权威清单在 `packages/core/src/tokens.ts`）
> - **[yexueqing]** 成熟社区皮肤：[Bancott/dsh-yexueqing-skin](https://github.com/Bancott/dsh-yexueqing-skin)（README 含踩坑与断言）
>
> 未在上述来源出现的内容一律不写。

---

## 0. 皮肤变量的三个层级（先建立心智模型）

DSH 的皮肤可调面不是一堆散乱的 CSS，而是分层的。按「适合作为变量的程度」从高到低：

| 层级 | 是什么 | 适合做皮肤变量吗 | 机制 |
|---|---|---|---|
| **A. 语义 token** `--dsw-alias-*` / `--dsw-specific-*` | 组件消费的设计变量，一处覆盖全局换肤 | **最佳**：声明式、自动跟随亮/暗、无几何风险 | `overrideTokens` 覆盖层 或 body 上直接覆盖 |
| **B. 延伸/表外 token** | 注册表未公开但同样可下发的自定义属性 | **良好**：补齐细层级，但需理解边界 | 任何 CSS 自定义属性都能走 `overrideTokens` 下发 [yexueqing §5b] |
| **C. 元素级装饰** | 背景图、毛玻璃、立绘、滤镜、字体、选区/滚动条/焦点态 | **可用**：靠 DOM 装饰 + 伪元素，风险最高 | 皮肤自有兄弟节点 + `<style>`，受 `GUIDELINES.md` 约束 |
| **D. 不可变量** | 几何、结构、信息保真 token、fixed 包含块 | **不可**：改了就坏界面或调淡固定 UI | 见 §5 |

**核心原则**（[本插件 GUIDELINES.md] A3）：皮肤是**纯表现层**，只覆盖 token 与自有装饰节点，不碰 DSH 服务/事件/模型，不遮挡原生控件。

---

## 1. Tier A —— 官方语义 token 全表（首选皮肤变量面）

来自 [theme-spec]。前缀统一为 `--dsw-`。**必填集（REQUIRED）** 保证换肤一致性；**推荐集（RECOMMENDED）** 是其余全部宿主别名词汇。宿主的 `--dsw-static-*` 色阶**不属于**此契约（由宿主样式表拥有）。

### 1.1 必填集 REQUIRED（约 30 条，缺失会回退到宿主默认、破坏一致性）

| 分组 | token |
|---|---|
| 背景 Backgrounds | `bg-base` `bg-layer-1` `bg-layer-2` `bg-layer-3` `bg-overlay` |
| 文字 Labels | `label-primary` `label-secondary` `label-tertiary` |
| 品牌与状态 Brand & states | `brand-primary` `state-business-primary` `state-success-primary` `state-warn-primary` `state-error-primary` |
| 边框 Borders | `border-l1` `border-l2` |
| 交互 Interaction | `interactive-bg-hover` `interactive-bg-active` `button-primary-fill` `button-primary-hover` |
| 代码 Code | `markdown-code-block` `markdown-code-block-banner` `markdown-inline-code` `markdown-tag` |
| 滚动条 Scrollbars | `scrollbar-bg-l1` `scrollbar-hover-l1` |
| 表面 Surfaces | `tooltip-bg` `specific-bubble` `specific-bubble-highlight` `specific-sidebar-fill` `specific-sidebar-nav-item-active` |

### 1.2 推荐集 RECOMMENDED（补齐细层级）

| 分组 | token |
|---|---|
| 遮罩 Masks | `bg-mask-1` `bg-mask-2` `bg-mask-3` |
| 模块 Modules | `bg-module-platform` `bg-multi-select` `bg-skeleton` |
| 边框 Borders | `border-l3` `border-l4` `border-inverted` |
| 按钮 Buttons | `button-info-fill` `button-info-hover` `button-elevated-fill` `button-floating-fill` `button-floating-hover` |
| 交互 Interaction | `interactive-bg-hover-solid` `interactive-bg-hover-danger` `interactive-bg-hover-accent` |
| 文字 Labels | `label-caption` `label-primary-inverted` `label-primary-dimmed` `label-dimmed` |
| Markdown | `markdown-citation` `markdown-code-segment-selected` `markdown-code-segment-unselected` `markdown-placeholder` |
| 滚动条 Scrollbars | `scrollbar-bg-l2` `scrollbar-hover-l2` |
| 状态 States | `state-success-secondary` `state-warn-secondary` `state-error-secondary` `state-success-tertiary` `state-warn-tertiary` `state-business-tertiary` |
| 表面 Surfaces | `toast-bg` `specific-input-major` `specific-login-input` `specific-menu` `specific-selector` `specific-sidebar-nav-item-hover` `specific-tip` |

### 1.3 语义映射（做「语义化皮肤变量名」时对照）

| 皮肤概念 | 宿主 token |
|---|---|
| background | `bg-base` |
| foreground | `label-primary` |
| muted | `label-secondary` `label-tertiary` |
| primary | `brand-primary` |
| accent / info | `state-business-primary` |
| success / warn / error | `state-{success,warn,error}-primary` |
| user / assistant / thinking / tool 气泡 | `specific-bubble` `specific-bubble-highlight`（宿主**无**按角色别名） |
| code | `markdown-code-block` `markdown-inline-code` `markdown-tag` |
| diff_add / diff_delete | `state-success-primary` / `state-error-primary`（**无**专用 diff token） |
| border | `border-l1` `border-l2` |
| selection | **无**专用别名；可染 `interactive-bg-active` |
| statusbar | `specific-sidebar-fill` |

### 1.4 两个 token 的"爆炸半径"提示 [yexueqing 已知限制]

- `state-business-primary`：DSH 的「业务/强调」色，全 UI **约 140 处**在用（激活标签页、chip、链接、输入光标、焦点环…）。改它影响面极大，需成体系地改。
- `bg-base`：被 `.frame`、`.centerCol`、会话根、各页面用来铺满视口；**Windows 标题栏模式下全屏框架 `.frame` 用的是 `specific-sidebar-fill`，不是 `bg-base`** —— 想让背景透出，两者必须一起透明 [yexueqing 坑3]。

---

## 2. Tier B —— 注册表之外、但可覆盖的延伸 token

`overrideTokens` 文档语义是「在活动主题之上叠 partial 层，**不触碰注册表**」，而实现上**任何 CSS 自定义属性都能走这层下发**，自动获得「跟随明暗 + 随开关装卸 + 抢栈互斥」的好处 [yexueqing §5b]。

### 2.1 基础样式表实际消费、值得纳入皮肤变量的细层级

| token | 界面位置 | 备注 |
|---|---|---|
| `--dsw-alias-label-primary-dimmed` | 文件名、内容预览 | 色阶介于 primary 与 secondary 之间 |
| `--dsw-alias-button-elevated-fill` | 「新对话」按钮填色（原为原生灰） | 提亮可读性 |
| `--dsw-alias-interactive-bg-hover` | 悬停态填色 | |
| `--dsw-alias-settings-card-fill` / `-settings-card-stroke` | 设置卡片底/描边 | 承载正文，宜保持不透明 |
| `--dsw-alias-focus-ring-color` | 焦点环 | |
| `--dsw-alias-bg-document-selection` | 文档选区 | |
| `--dsw-alias-switch-thumb` | 开关滑块 | |
| `--dsw-elevation-stroke-color` | 高层级表面发丝描边（**受支持的重绑点**） | 面板边框随主题色 |

### 2.2 字体（唯一一个"换字体"入口）

- `--dsw-font-family`：换 UI 字体；`--dsw-font-family-brand` 派生自它，品牌文字跟随 [yexueqing §6]。
- 切回默认 = 从覆盖层**移除**该 token，让 base.css 原值生效，无需二次覆盖。

### 2.3 命名空间提示

`--dsh-*`（如 `--dsh-scrollbar-thumb` / `--dsh-scrollbar-thumb-hover`）与 `--dsw-*` 是**两套前缀**。菜单/高层级表面会把滚动条 thumb 重绑为 l2 [yexueqing 坑6]，`!important` 会压平这类**有意的局部重绑**——所以别用 `!important` 抢优先级。

---

## 3. Tier C —— 元素级装饰（token 改不了、需 DOM/伪元素）

这些是「适合做皮肤、但不是颜色 token」的元素。均有本插件与社区双重实证。

| 元素 | 实现要点 | 证据 |
|---|---|---|
| **全局背景图** | 固定层 `body::before`，`z-index:-1`，`background-size:cover`；挂在 `body` 而非 `html`（html 负层会被宿主注入的 `body` 背景盖住） | [本插件 engine.ts] [yexueqing §2/坑2] |
| **面板透明度** | 把 `bg-base/layer-1/2/3`、`sidebar-fill` 等改为带 alpha 的值，让背景图透出；透明度即 `uiAlpha` 旋钮 | [本插件 engine.ts] [本插件 SimplePreset] |
| **毛玻璃 / 背板模糊** | `backdrop-filter` 用在**皮肤自有节点**（非应用容器）；正文可读性靠"背板被模糊"而非高不透明度，填色可压到 0.46~0.58 | [yexueqing 已知限制] [本插件 GUIDELINES B2] |
| **立绘 / 角色装饰** | 皮肤自有兄弟节点，`position:absolute` 铺满，`pointer-events:none`；分「关闭/弱/中/强」档，四边显现、中心留白保正文可读 | [yexueqing 立绘分档] [本插件 maid/odeta] |
| **晕影 / 边饰 / 护罩** | `body::after`/`::before` 负 z-index 多层背景；晕影底色**采样**自画面中心区（非拍脑袋） | [yexueqing §2] |
| **滤镜 / 色调** | 全局 filter，需落在皮肤自有层 | [dsh-skin-master 描述] |
| **标题栏品牌** | 替换 titlebar 的 logo/brand（SVG 内联） | [本插件 maid titlebar-brand.generated] |
| **选区 / 滚动条 / 焦点态** | `::selection`、`::-webkit-scrollbar-thumb`、`input:focus-visible` 描边+外环，走皮肤自有 `<style>` | [yexueqing §7] |

**装饰硬约束**（[本插件 GUIDELINES.md]）：
- A1：所有 CSS 以 `body[data-dsh-<skin-id>]` 为根作用域，亮/暗经 `body[data-ds-dark-theme]` 分支，JS 不写明暗判断。
- A2：选择器优先用稳定语义钩子 `[data-pane]`/`[data-slot]`/`[role]`/`[data-phase]`，禁 nth-child/层级深度。
- B1：**永远不给应用拥有的容器**设 `transform`/`filter`/`backdrop-filter`/`perspective`/`will-change`/`contain`/`content-visibility`/`opacity<1`/`isolation`/非 auto `z-index` —— 会把 `position:fixed` 浮层的包含块从视口改成该祖先，导致弹窗错位。
- B4：z-index 分层：背景层 `-1/0`；装饰层 `1~20`；永不把应用容器抬进 overlay（≥40）。
- E：亮/暗双套；侧栏 rail/narrow/wide 三档适配；`prefers-reduced-motion` 关动画；装饰层 `pointer-events:none`。

---

## 4. 色阶与对比度约束（做配色类皮肤必须守）

- **单调色阶** [yexueqing 已知限制]：`label-primary > label-primary-dimmed > label-secondary > label-tertiary > label-caption`。提亮某一档若不动相邻档，会出现「hover 反而变暗」的倒挂（实测踩过）。
- **对比度下限** [theme-spec]：对 6 种正文承载面（`bg-base`/`bg-layer-1`/`bg-layer-2`/`bubble`/`markdown-code-block`/`sidebar-fill`）：
  - `label-primary`、`label-secondary` ≥ **4.5:1**（WCAG AA 正文）
  - `label-tertiary`、`label-caption` ≥ **3:1**（刻意降级的元信息）
  - `brand-primary`、各 `state-*-primary` ≥ **3:1**
- **暗色不比原生更暗** [yexueqing §3]：被覆盖颜色在暗色下取更亮值，避免「用皮肤后文字变淡」。

---

## 5. 不适合作为皮肤变量的元素（明确排除）

| 排除项 | 原因 | 证据 |
|---|---|---|
| **几何尺寸**（width/height/`transform:scaleX` 等） | token 只能改"可变量"，改不了几何 | [yexueqing 边界一] |
| **结构选择器**（nth-child、层级深度、完整哈希类名） | DSH 升版即失效；哈希前缀随版本变 | [本插件 A2] [yexueqing §5b] |
| **应用容器上的 transform/filter/backdrop/contain/opacity<1/非 auto z-index** | 破坏 fixed 包含块 → 浮层错位 | [本插件 B1] |
| **信息保真 token：`label-secondary`、`state-idle-primary`** | 这两者正是 DSH 表达「次要/未激活」的层级，覆盖 = 主动把权限/模型/账号/标签/轮数/上下文/输入框等固定 UI 调淡 | [yexueqing §3/坑7] |
| **固定 UI 文字颜色整体调淡** | 固定 UI 需保持原生对比度便于一眼扫读 | [yexueqing §3] |
| **注册表 token 用 `!important` 抢优先级** | 压平高层级表面的**有意局部重绑**（滚动条→l2、菜单→elevation-stroke） | [yexueqing 坑6] |

> 折中特例：turn rail（右侧对话定位横线）曾用一条**结构+后缀匹配**规则 `[class*="_marks"] button:before` 提亮加宽——只做结构匹配、不写完整哈希类名，失效也只影响观感不坏界面。这是「原则 vs 用户明确诉求」的有意取舍 [yexueqing §5b]。

---

## 6. 覆盖现状与缺口（你的 engine / packs vs 全量 token）

> 目的：把「哪些元素已是你能管的变量、还缺哪些」摊开，作为后续补齐清单。

### 6.1 `simple/engine.ts`（简约皮肤）当前覆盖

- 色阶：`--dsw-static-deepseek-{50..900}`（11 级，由 accent 混黑白生成）
- 品牌：`brand-primary` `brand-text` `button-primary-hover` `button-primary-dimmed` `label-primary-bluish`
- 背景/表面：`bg-base` `bg-layer-1/2/3` `specific-sidebar-fill` `bg-module-platform` `specific-menu` `bg-overlay`
- 旋钮：`dsh-skin-image` / `dsh-skin-image-opacity` / `dsh-skin-ui-alpha`

> ⚠️ **越界提示**：simple 引擎直接覆盖了 `--dsw-static-deepseek-*`。[theme-spec] 明确 `--dsw-static-*` 由宿主样式表拥有、**不属于**主题契约。在 body 上覆盖能生效，但属契约外操作，随 DSH 升版有回归风险。改配色应优先走 `--dsw-alias-*` 语义层。

### 6.2 `packs/*`（celadon / odeta / maid-atelier）覆盖（比 simple 全）

额外覆盖：`border-l1/l2/l3` `border-l2-darkmode-thin` `label-primary/secondary/tertiary/caption` `label-primary-bluish` `interactive-bg-hover/active/-solid` `button-elevated/floating-fill` `button-floating-hover` `button-info-fill/hover` `state-business-primary/tertiary` `specific-input-major` `specific-selector` `bg-module-platform` + 皮肤自有变量（`--maid-*` / `--celadon-*`）。

### 6.3 仍缺（两类皮肤都未覆盖 → 建议补入变量清单）

- **状态色**：`state-success-*` `state-warn-*` `state-error-*`（success/warn/error 全缺 → 代码 diff、错误提示仍是原生色）
- **代码块**：`markdown-code-block(-banner)` `markdown-inline-code` `markdown-tag`
- **滚动条**：`scrollbar-bg-l1/l2` `scrollbar-hover-l1/l2`（packs 未直接覆盖）
- **气泡/浮层**：`specific-bubble` `specific-bubble-highlight` `tooltip-bg` `toast-bg` `specific-tip`
- **遮罩**：`bg-mask-1/2/3`
- **延伸细层级**：`label-primary-dimmed` `label-dimmed` `label-primary-inverted` `focus-ring-color` `switch-thumb` `bg-document-selection` `settings-card-fill/stroke` `elevation-stroke-color`
- **字体**：`--dsw-font-family`（packs 均未接字体变量）

---

## 7. 面向「各类皮肤」的变量组合建议

按 Tier 组合，从轻到重三档——正好对应你的 `SimplePreset` / `PackPreset` 双层模型 [本插件 core/types.ts]：

| 皮肤类型 | 需要的变量层级 | 最小变量集 | 机制 |
|---|---|---|---|
| **① 纯配色** | Tier A 必填 + 推荐 | 1.1 全表 + 1.2 | `overrideTokens` 覆盖层，无 DOM；自动跟随亮/暗与开关 |
| **② 配色 + 背景/透明** | ① + Tier C 背景图/透明度 | ① + `bg-base`&`sidebar-fill` 透明 + 背景固定层 + `uiAlpha` | [本插件] SimplePreset 模型（accent + bgImage + bgOpacity + uiAlpha） |
| **③ 全装饰整包** | ② + Tier C 立绘/晕影/标题栏/选区/滚动条/焦点 + Tier B 细层级/字体 | ② 全部 + §2 表 + 装饰节点 | [本插件] PackPreset + 严格遵守 GUIDELINES A–F；或 [yexueqing] overrideTokens + decorCss |

**做新皮肤时的变量管理建议**：
1. 先按 §1/§2 建一份**语义 key → token 名**映射表（照 [yexueqing] 的 `TOKEN_MAP` / `EXTRA_TOKEN_MAP` 模式），亮/暗成对 `{light, dark}`，缺失即回退宿主——所以必填集要给全。
2. 遵守 §4 单调色阶与对比度。
3. 明确列出**刻意不覆盖**的保真 token（`label-secondary`、`state-idle-primary`）[yexueqing §3]。
4. 几何/结构/容器属性一律不入变量表（§5）。
5. 背景类皮肤务必 `bg-base` + `specific-sidebar-fill` 同时透明（§1.4 坑3）。

---

## 8. 一句话清单：适合作为皮肤变量的元素

**颜色/语义（Tier A/B，最佳）**：背景 5 + 文字 5 级色阶 + 品牌/状态 5 + 边框 4 + 交互/按钮 10 + 代码 4 + 滚动条 4 + 表面/浮层 8 + 遮罩 3 + 模块 3 + 焦点/开关/选区/描边延伸 + 字体 1。

**元素级（Tier C，可用但高风险）**：全局背景图、面板透明度、毛玻璃背板、立绘/边饰、晕影/护罩、滤镜、标题栏品牌、选区/滚动条/焦点态装饰。

**不可（Tier D）**：几何尺寸、结构选择器、应用容器的 transform/filter/backdrop/contain/非 auto z-index、信息保真 token（`label-secondary`/`state-idle-primary`）、`!important` 抢 token。
