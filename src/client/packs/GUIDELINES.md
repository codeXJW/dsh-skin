# 整包皮肤（pack）开发规范

所有 `packs/` 下的整包皮肤**必须**遵循本规范。新增皮肤以 `celadon/` 为骨架模板，
逐条对照本规范自查；`maid-atelier/` 为完整参照实现。规范中的每条都来自真实事故
或上游（dsh-deep-whale/maid-atelier）的实战注释，不要"优化掉"看起来多余的限制。

## A. 作用域与选择器

- **A1** 所有 CSS 规则以 `body[data-dsh-<skin-id>]` 为根作用域；亮/暗双套经
  `body[data-ds-dark-theme]` 分支表达，JS 不写任何亮暗判断。
- **A2** 应用 DOM 的选择器优先级：`[data-pane=...]` / `[data-slot=...]` /
  `[role=...]` / `[data-phase=...]` 等稳定语义钩子 > `[class*='xxx']` 子串兜底。
  禁止使用 nth-child、层级深度等结构性选择器。
- **A3** 皮肤是纯表现层：不得触碰 DSH 服务、事件、模型请求；不得禁用或遮挡
  原生控件；不得依赖远程运行时素材（全部 data URI 内联）。

## B. 包含块与层叠（最高优先级，违反即弹窗错位）

> 事故背景：DSH 的设置弹窗、Cordis 审批面板等浮层以 `position: fixed` 挂载在
> **侧栏 DOM 子树内**（非 document portal）。祖先链上一旦出现下列属性，fixed 的
> 包含块就从视口变成该祖先，浮层被挤压进侧栏宽度、错位到屏幕左侧。

- **B1** 永远不给**应用拥有的容器**（`[data-pane='sidebar']`、`sidebarCol`、
  `centerCol`、`detailsCol`、`#root`、会话行、消息气泡等一切 React 节点）设置
  会创建包含块/堆叠上下文的属性：
  `transform`、`filter`、`backdrop-filter`、`perspective`、`will-change`、
  `contain: paint/strict/layout`、`content-visibility`、`opacity < 1`、
  `isolation: isolate`、非 `auto` 的 `z-index`（配合 position）。
- **B2** 装饰一律是**皮肤自有兄弟节点**（`prepend`/`append` 进容器，带
  `data-skin-chrome` + `data-skin-owner` + `aria-hidden` + `pointer-events: none`）。
  需要毛玻璃/投影/位移时，把这些属性用在皮肤自有节点上（可以是 `position:
  absolute; inset: 0` 铺满的兄弟层），绝不放在应用容器上。
- **B3** `position: relative`（不设 z-index）是允许的唯一例外——它不创建
  fixed 包含块（maid 的 `#root`、`sidebarCol > div` 已验证）。
- **B4** z-index 分层约定：皮肤背景层 `-1`/`0`；皮肤装饰层 `1~20`；永不把应用
  容器抬进 overlay 层级（≥40）。浮层被压在皮肤装饰之下时，用"面板打开时给
  body 投一个状态属性、CSS 里局部提升"的模式（参照 maid 的
  `data-maid-cordis-panel-open`）。
- **B5** 按钮等**叶子级**应用元素上的 `transform`/`filter` 可用（其内部不含
  fixed 浮层），如 maid 的 newSession hover 位移；拿不准就先当容器处理。

## C. 状态投影

- **C1** JS 只往 body 上写 `data-*` 状态属性（会话进行中、侧栏宽度分档、
  工作区/浮层开关等），样式全部在 CSS 里消费这些钩子；JS 不写具体样式值。
- **C2** MutationObserver 必须忽略 `data-skin-owner` 节点（否则装饰触发重复
  装饰）；按 record 归类后再各调一次同步函数，不在循环里直接改 DOM。
- **C3** 每帧级联动（如跟随侧栏宽度）写 CSSOM `insertRule` 的规则，不写
  attribute/style——避免触发其它 observer（Chrome autofill 会逐帧放大）。

## D. 生命周期（dispose 语义）

- **D1** 先登记总清理（`ctx.effect`），再做任何可能失败的写入；每个 effect
  的 setup 失败只记录错误，不影响其余清理登记。
- **D2** 快照并恢复所有触碰过的原值：`body.style` 属性、`body` 属性、
  `document.title`、`theme-color` meta。
- **D3** 注入节点全部登记 ownedNodes 统一摘除；observer / ResizeObserver /
  timer / rAF / 事件监听全部断开；清理逆序执行，单项失败不波及其余。
- **D4** decorate 类函数幂等：重复调用不得重复插入（插入前查
  `[data-skin-chrome='...']` 是否已存在）。
- **D5** apply 部分失败也必须能干净回退（SkinManager 只保证 dispose 已登记的
  effect，所以登记要先于写入）。

## E. 主题与可达性

- **E1** 亮/暗双套 token 与装饰态（`[data-ds-dark-theme]`）。
- **E2** 侧栏 rail / narrow / wide 三档适配（ResizeObserver 投影宽度分档）。
- **E3** `prefers-reduced-motion: reduce` 下关闭所有过渡/动画。
- **E4** 窄视口降级（参照 maid 的 1080px / 700px 两档）。
- **E5** 装饰层 `pointer-events: none`，绝不拦截交互。

## F. 素材与署名

- **F1** 素材全部 data URI 内联进 bundle；原创素材随 dsh-skin 以 MIT 发布。
- **F2** 第三方素材必须许可证兼容（当前链：CC BY-NC-SA 4.0 / BSD-3-Clause），
  在 pack 目录放 `NOTICE.md` 记录完整署名链，并在 `presets/README.md` 登记。
- **F3** `*.generated.ts` 一律由 `scripts/extract-presets.mjs` 生成，不手改。

## 自查清单（提交前）

1. `grep -n 'backdrop-filter\|will-change\|contain:\|isolation\|perspective' style.css`
   → 命中的每一条确认只落在皮肤自有节点（B1/B2）。
2. 开/关设置弹窗、Cordis 审批面板 → 位置不偏移、不被装饰层压住（B4）。
3. 亮/暗切换、侧栏 rail↔wide 拖动、hero↔会话态切换 → 装饰跟随且无残留（C/E）。
4. 切到别的皮肤再切回来 → 无样式/DOM 残留，无重复装饰（D）。
