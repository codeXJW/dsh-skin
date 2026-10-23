/**
 * 奥黛塔 · 冰湖天鹅 —— 整包样式（装饰件原创，MIT）。
 * 遵循 packs/GUIDELINES.md：根作用域 body[data-dsh-odeta]；状态钩子由
 * runtime.ts 投影：
 *  - [data-odeta-chat-active]                     会话进行中 → 立绘退位、雪层保留
 *  - [data-odeta-sidebar='rail'|'narrow'|'wide']  侧栏宽度分档
 *  - [data-odeta-has-backdrop]                    本机背景图存在 → 停用 CSS 渐变
 *  - [data-odeta-has-portrait]                    本机立绘存在（装饰层才挂载）
 * 亮/暗双套跟随官方 body[data-ds-dark-theme]。
 *
 * 结构：皮肤自有变量（--odeta-*）+ 宿主 --dsw-* token 覆盖（经注册表
 * core/tokens.ts 生成，语义 key 取色、类型化、亮/暗成对）+ 装饰段。
 */
import { buildTokenRules, type PaletteInput } from '../../core/tokens'

/* ── 皮肤自有变量（非宿主 token，供装饰段消费） ───────────────── */

const ODETA_LIGHT_CUSTOM = `body[data-dsh-odeta] {
  --odeta-ice: #4a7fb5;
  --odeta-ice-deep: #2f5a86;
  --odeta-gold: #c9b189;
  --odeta-ink: #1f3245;
  --odeta-snow: #f4f8fb;
  /* 新会话按钮：亮/暗成对的皮肤自有变量（不是宿主 --dsw-* token） */
  --odeta-btn-from: #5a8fc0;
  --odeta-btn-to: #2f5a86;
  --odeta-btn-ink: #f4f8fb;
  --odeta-btn-glow: rgba(47, 90, 134, 0.3);
  /* 主区左侧空档的 x 位置：跟随侧栏宽度分档 */
  --odeta-gutter-left: 300px;
}`

const ODETA_DARK_CUSTOM = `body[data-ds-dark-theme][data-dsh-odeta] {
  --odeta-ice: #8fb8dd;
  --odeta-ice-deep: #b9d2e8;
  --odeta-btn-from: #4d7fae;
  --odeta-btn-to: #22415d;
  --odeta-btn-ink: #f4f8fb;
  --odeta-btn-glow: rgba(0, 0, 0, 0.4);
}`

/* ── 宿主 --dsw-* token 覆盖（缺失键回退宿主原值） ──────────────
   注：本皮肤现状**覆盖了 label-secondary**（fidelity 键）。buildTokenRules 默认
   跳过 fidelity 以免把固定 UI 调淡，但纯重构不改既有视觉，故传 allowFidelity
   予以保留。若日后要遵循信息保真建议（docs/skin-variable-catalog.md §5），
   应移除该键 —— 那是独立的行为变更，不在本次重构范围。 */

const ODETA_LIGHT_TOKENS = {
  bgBase: 'transparent',
  bgLayer1: 'rgba(243, 247, 251, 0.78)',
  bgLayer2: 'rgba(236, 243, 249, 0.88)',
  bgLayer3: 'rgba(228, 237, 246, 0.92)',
  bgOverlay: 'rgba(243, 247, 251, 0.96)',
  bgModulePlatform: 'rgba(236, 243, 249, 0.84)',
  borderL1: 'rgba(74, 127, 181, 0.16)',
  borderL2DarkmodeThin: 'rgba(74, 127, 181, 0.24)',
  borderL2: 'rgba(74, 127, 181, 0.3)',
  borderL3: 'rgba(201, 177, 137, 0.55)',
  brandPrimary: '#4a7fb5',
  brandText: '#2f5a86',
  buttonPrimaryHover: '#5a8fc0',
  buttonPrimaryDimmed: 'rgba(74, 127, 181, 0.14)',
  buttonElevatedFill: 'rgba(252, 253, 255, 0.9)',
  buttonFloatingFill: 'rgba(252, 253, 255, 0.94)',
  buttonFloatingHover: '#e2ecf5',
  interactiveBgActive: 'rgba(201, 177, 137, 0.2)',
  interactiveBgHover: 'rgba(74, 127, 181, 0.1)',
  interactiveBgHoverSolid: '#e0eaf3',
  focusRingColor: '#4a7fb5',
  labelPrimary: '#1f3245',
  labelPrimaryBluish: '#2f5a86',
  labelSecondary: '#47607a',
  labelTertiary: '#6b8098',
  labelCaption: '#8a99ab',
  stateBusinessPrimary: '#4a7fb5',
  stateBusinessTertiary: '#dce8f3',
  inputMajor: 'rgba(252, 253, 255, 0.88)',
  selector: 'rgba(224, 234, 243, 0.9)',
  /* Windows 标题栏模式下全屏 .frame 也吃这个 token；保持不透明会把
     body 背景和雪层一起盖掉（见 docs/skin-variable-catalog.md §1.4 坑3）。 */
  sidebarFill: 'transparent',
  menu: 'rgba(243, 247, 251, 0.94)',
} satisfies PaletteInput

const ODETA_DARK_TOKENS = {
  bgBase: 'transparent',
  bgLayer1: 'rgba(16, 26, 38, 0.88)',
  bgLayer2: 'rgba(21, 33, 47, 0.92)',
  bgLayer3: 'rgba(27, 41, 57, 0.94)',
  bgOverlay: 'rgba(14, 23, 34, 0.97)',
  bgModulePlatform: 'rgba(21, 33, 47, 0.9)',
  borderL1: 'rgba(143, 184, 221, 0.18)',
  borderL2DarkmodeThin: 'rgba(143, 184, 221, 0.26)',
  borderL2: 'rgba(143, 184, 221, 0.32)',
  borderL3: 'rgba(201, 177, 137, 0.5)',
  brandPrimary: '#8fb8dd',
  brandText: '#dce9f5',
  buttonPrimaryHover: '#a3c4e4',
  buttonPrimaryDimmed: 'rgba(143, 184, 221, 0.2)',
  buttonElevatedFill: 'rgba(27, 41, 57, 0.94)',
  buttonFloatingFill: 'rgba(31, 47, 65, 0.96)',
  buttonFloatingHover: '#2a4159',
  interactiveBgActive: 'rgba(201, 177, 137, 0.22)',
  interactiveBgHover: 'rgba(143, 184, 221, 0.12)',
  interactiveBgHoverSolid: '#28405a',
  focusRingColor: '#8fb8dd',
  labelPrimary: '#e3edf6',
  labelPrimaryBluish: '#c6d9ec',
  labelSecondary: '#b3c6da',
  labelTertiary: '#8fa5bb',
  labelCaption: '#74889d',
  stateBusinessPrimary: '#8fb8dd',
  stateBusinessTertiary: '#28405a',
  inputMajor: 'rgba(19, 31, 45, 0.9)',
  selector: 'rgba(37, 55, 75, 0.92)',
  sidebarFill: 'transparent',
  menu: 'rgba(17, 28, 41, 0.95)',
} satisfies PaletteInput

const ODETA_TOKEN_CSS = buildTokenRules({
  lightSelector: 'body[data-dsh-odeta]',
  darkSelector: 'body[data-ds-dark-theme][data-dsh-odeta]',
  light: ODETA_LIGHT_TOKENS,
  dark: ODETA_DARK_TOKENS,
  allowFidelity: true,
})

/* ── 装饰段：背景、雪层、立绘、侧栏、输入区、滚动条、媒体查询 ── */

const ODETA_DECOR = /* css */ `
/* 冰湖晨雾 + 冰裂纹/霜光/极光（更冷冽；本机背景图存在时由 [data-odeta-has-backdrop] 停用）。
   background-image 首项在最上：冰裂纹/霜光/极光叠在原冰湖渐变之上。 */
body[data-dsh-odeta]:not([data-odeta-has-backdrop]) {
  background-color: var(--odeta-snow);
  background-image:
    repeating-linear-gradient(115deg, rgba(74, 127, 181, 0.055) 0 1px, transparent 1px 46px),
    repeating-linear-gradient(65deg, rgba(74, 127, 181, 0.045) 0 1px, transparent 1px 62px),
    radial-gradient(120vmin 64vmin at 24% -12%, rgba(255, 255, 255, 0.7), transparent 62%),
    radial-gradient(90vmin 52vmin at 98% -6%, rgba(143, 184, 221, 0.28), transparent 66%),
    linear-gradient(104deg, transparent 30%, rgba(143, 184, 221, 0.16) 47%, rgba(185, 210, 232, 0.1) 55%, transparent 72%),
    radial-gradient(52vmin 52vmin at 82% 10%, rgba(255, 255, 255, 0.75), transparent 70%),
    radial-gradient(80vmin 60vmin at 8% 96%, rgba(74, 127, 181, 0.14), transparent 72%),
    linear-gradient(180deg, #dcebf7 0%, #eef5fb 48%, #c8dcee 100%);
  background-attachment: fixed;
}

body[data-ds-dark-theme][data-dsh-odeta]:not([data-odeta-has-backdrop]) {
  background-color: #0c1520;
  background-image:
    repeating-linear-gradient(115deg, rgba(143, 184, 221, 0.06) 0 1px, transparent 1px 46px),
    repeating-linear-gradient(65deg, rgba(143, 184, 221, 0.05) 0 1px, transparent 1px 62px),
    radial-gradient(120vmin 64vmin at 24% -12%, rgba(143, 184, 221, 0.16), transparent 62%),
    radial-gradient(90vmin 52vmin at 98% -6%, rgba(74, 127, 181, 0.24), transparent 66%),
    linear-gradient(104deg, transparent 30%, rgba(74, 127, 181, 0.2) 47%, rgba(143, 184, 221, 0.12) 55%, transparent 72%),
    radial-gradient(52vmin 52vmin at 82% 10%, rgba(185, 210, 232, 0.22), transparent 70%),
    radial-gradient(80vmin 60vmin at 8% 96%, rgba(74, 127, 181, 0.12), transparent 72%),
    linear-gradient(180deg, #0a1420 0%, #122334 55%, #0d1a29 100%);
}

body[data-dsh-odeta] [id='root'] {
  position: relative;
  background: transparent;
}

/* ── 雪层（规范 B2：皮肤自有 fixed 层，pointer-events 不拦截） ── */

body[data-dsh-odeta] [data-odeta-chrome='snow-far'],
body[data-dsh-odeta] [data-odeta-chrome='snow-near'] {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-repeat: repeat;
  /* 雪花改用冰蓝色（art.ts）：白雪花在浅冰蓝底上对比度太低，真实 Electron
     窗口里几乎看不见；冰蓝在亮/暗两套背景下都能读出来。 */
  transition: opacity 520ms ease;
}

body[data-dsh-odeta] [data-odeta-chrome='snow-far'] {
  background-image: var(--odeta-snow-far-art);
  background-size: 320px 320px;
  opacity: 0.78;
  animation: odetaSnowFar 46s linear infinite;
}

body[data-dsh-odeta] [data-odeta-chrome='snow-near'] {
  background-image: var(--odeta-snow-near-art);
  background-size: 480px 480px;
  opacity: 0.93;
  animation: odetaSnowNear 26s linear infinite;
}

/* 贴片高度整倍位移 → 无缝循环；轻微横向漂移模拟风。 */
@keyframes odetaSnowFar {
  from { background-position: 0 0; }
  to { background-position: -64px 640px; }
}

@keyframes odetaSnowNear {
  from { background-position: 0 0; }
  to { background-position: 96px 960px; }
}

body[data-ds-dark-theme][data-dsh-odeta] [data-odeta-chrome='snow-far'] {
  opacity: 0.65;
}

body[data-ds-dark-theme][data-dsh-odeta] [data-odeta-chrome='snow-near'] {
  opacity: 0.75;
}

/* 会话进行中：雪只轻微降一点，保持对话区背景仍有明显落雪（不再压到几乎看不见）。 */
body[data-dsh-odeta][data-odeta-chat-active] [data-odeta-chrome='snow-far'] {
  opacity: 0.72;
}

body[data-dsh-odeta][data-odeta-chat-active] [data-odeta-chrome='snow-near'] {
  opacity: 0.86;
}

body[data-ds-dark-theme][data-dsh-odeta][data-odeta-chat-active] [data-odeta-chrome='snow-far'] {
  opacity: 0.68;
}

body[data-ds-dark-theme][data-dsh-odeta][data-odeta-chat-active] [data-odeta-chrome='snow-near'] {
  opacity: 0.8;
}

/* ── 立绘层（仅本机立绘存在时挂载，左右各一张） ── */

body[data-dsh-odeta] [data-odeta-chrome='portrait'] {
  position: fixed;
  bottom: 0;
  /* z-index 抬到侧栏半透明背景之上，否则左侧立绘会被侧栏盖住透不出来 */
  z-index: 1;
  /* 缩小默认尺寸：奥黛塔立绘较高(1024x1536)，原 clamp 撑满右下会挡内容 */
  height: clamp(340px, 62vh, 760px);
  width: auto;
  max-width: none;
  object-fit: contain;
  object-position: center bottom;
  pointer-events: none;
  filter: drop-shadow(0 18px 26px rgba(31, 50, 69, 0.18));
  transition: opacity 520ms ease, transform 620ms cubic-bezier(0.22, 0.78, 0.2, 1), height 620ms cubic-bezier(0.22, 0.78, 0.2, 1);
}

body[data-dsh-odeta] [data-odeta-chrome='portrait'][data-side='left'] {
  left: clamp(0px, 0.5vw, 12px);
}

body[data-dsh-odeta] [data-odeta-chrome='portrait'][data-side='right'] {
  right: clamp(0px, 0.5vw, 12px);
}

/* 会话进行中：两侧向外推开（远离内容，不再挡回复） */
body[data-dsh-odeta][data-odeta-chat-active] [data-odeta-chrome='portrait'][data-side='left'] {
  height: clamp(360px, 58vh, 700px);
  opacity: 0.85;
  /* 左侧向左推（负值，脱离内容） */
  transform: translateX(calc(-1 * clamp(4px, 0.75vw, 14px)));
}

body[data-dsh-odeta][data-odeta-chat-active] [data-odeta-chrome='portrait'][data-side='right'] {
  height: clamp(360px, 58vh, 700px);
  opacity: 0.85;
  /* 右侧向右推（正值，脱离内容） */
  transform: translateX(clamp(4px, 0.75vw, 14px));
}

body[data-ds-dark-theme][data-dsh-odeta] [data-odeta-chrome='portrait'] {
  filter: brightness(0.88) saturate(0.94) drop-shadow(0 20px 28px rgba(0, 0, 0, 0.32));
}

@media (max-width: 860px) {
  body[data-dsh-odeta] [data-odeta-chrome='portrait'] {
    opacity: 0.6;
  }
}

/* ── 侧栏 ───────────────────────────────────────────────────── */

/* 规范 B1：应用容器上禁用 backdrop-filter/transform 等包含块属性。
   sidebarFill token 已设为 transparent（否则 Windows 标题栏 .frame 会盖掉雪），
   侧栏自身的底色改由这条规则补回。 */
body[data-dsh-odeta] :is([data-pane='sidebar'], [class*='sidebarCol']) {
  border-right: 0;
  background-color: rgba(226, 236, 245, 0.82);
  box-shadow:
    8px 0 28px rgba(31, 50, 69, 0.08),
    inset -1px 0 rgba(74, 127, 181, 0.4),
    inset -3px 0 rgba(201, 177, 137, 0.28),
    inset -6px 0 20px rgba(143, 184, 221, 0.14);
}

body[data-ds-dark-theme][data-dsh-odeta] :is([data-pane='sidebar'], [class*='sidebarCol']) {
  background-color: rgba(12, 21, 32, 0.9);
}

/* 右侧栏同样吃 sidebar-fill；token 透明后单独补回面板底色。 */
body[data-dsh-odeta] [data-rightbar-col] {
  background-color: rgba(226, 236, 245, 0.82);
}

body[data-ds-dark-theme][data-dsh-odeta] [data-rightbar-col] {
  background-color: rgba(12, 21, 32, 0.9);
}

/* ── 结霜描边 / 角落点缀（冰元素） ─────────────────────────────── */

/* 结霜描边：输入卡一圈冰晶描边 + 冷光（只用 border/box-shadow，遵守规范 B1）。
   只命中输入卡本体（data-composer-card）；不要再加 [class*='composer'] 兜底：
   宿主布局容器 composerSeat/composerStack 的类名同样含 composer，会一起套上
   1px 内描边 + 外投影，在输入区周围形成多余的多层线框。 */
body[data-dsh-odeta] [data-composer-card] {
  position: relative;
  box-shadow:
    inset 0 0 0 1px rgba(143, 184, 221, 0.45),
    inset 0 1px 14px rgba(143, 184, 221, 0.12),
    inset 0 -12px 22px rgba(143, 184, 221, 0.08),
    0 8px 26px rgba(74, 127, 181, 0.14);
}

/* 输入卡左上角冰晶：只给真正含编辑器的卡片（用 :has 排除工作区选择卡），
   纯装饰、pointer-events:none，不改卡片几何。略微探出卡片边缘，避开占位文字。 */
body[data-dsh-odeta] [data-composer-card]:has([contenteditable='true'])::before {
  content: '';
  position: absolute;
  top: -9px;
  left: 16px;
  width: 18px;
  height: 18px;
  background: var(--odeta-crystal-art) center / contain no-repeat;
  filter: drop-shadow(0 2px 3px rgba(74, 127, 181, 0.22));
  opacity: 0.45;
  pointer-events: none;
}

/* 结霜描边：输入卡聚焦 → 霜光更亮。 */
body[data-dsh-odeta] [data-composer-card]:focus-within {
  box-shadow:
    inset 0 0 0 1px rgba(143, 184, 221, 0.7),
    inset 0 1px 16px rgba(143, 184, 221, 0.18),
    0 0 0 3px rgba(143, 184, 221, 0.22),
    0 8px 30px rgba(74, 127, 181, 0.2);
}

/* 角落冰晶/雪花点缀：右上角冰晶 + 右下角雪花，小尺寸低透明、pointer-events 不拦截，
   尽量避开正文区。 */
body[data-dsh-odeta] [data-odeta-chrome='crystal-top'],
body[data-dsh-odeta] [data-odeta-chrome='snow-bottom'] {
  position: fixed;
  z-index: 3;
  pointer-events: none;
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  opacity: 0.55;
  transition: opacity 520ms ease;
}

body[data-dsh-odeta] [data-odeta-chrome='crystal-top'] {
  top: clamp(8px, 2vh, 18px);
  right: clamp(8px, 1.5vw, 20px);
  width: clamp(30px, 3.4vmin, 44px);
  height: clamp(30px, 3.4vmin, 44px);
  background-image: var(--odeta-crystal-art);
}

body[data-dsh-odeta] [data-odeta-chrome='snow-bottom'] {
  bottom: clamp(10px, 2vh, 20px);
  right: clamp(10px, 1.5vw, 22px);
  width: clamp(34px, 3.8vmin, 50px);
  height: clamp(34px, 3.8vmin, 50px);
  background-image: var(--odeta-snow-accent-art);
}

body[data-ds-dark-theme][data-dsh-odeta] [data-odeta-chrome='crystal-top'],
body[data-ds-dark-theme][data-dsh-odeta] [data-odeta-chrome='snow-bottom'] {
  opacity: 0.42;
}

/* 边缘霜晕 + 主区左侧大冰晶/雪花：整页氛围层。
   z-index 0 落在正文与侧栏之下；霜晕用 inset box-shadow，不用 1px 线框，
   避免再出现“输入区外围多余线框”那类问题。 */
body[data-dsh-odeta] [data-odeta-chrome='frost-deco'] {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image:
    var(--odeta-crystal-art),
    var(--odeta-snow-accent-art);
  background-repeat: no-repeat;
  background-position:
    left var(--odeta-gutter-left) top 112px,
    left calc(var(--odeta-gutter-left) + 10px) bottom 116px;
  background-size:
    clamp(64px, 7vmin, 96px) auto,
    clamp(78px, 8.5vmin, 118px) auto;
  opacity: 0.42;
  box-shadow:
    inset 0 22px 46px -24px rgba(255, 255, 255, 0.9),
    inset 0 -34px 64px -34px rgba(74, 127, 181, 0.26),
    inset 24px 0 54px -40px rgba(143, 184, 221, 0.38),
    inset -24px 0 54px -40px rgba(143, 184, 221, 0.32);
  transition: opacity 520ms ease;
}

body[data-ds-dark-theme][data-dsh-odeta] [data-odeta-chrome='frost-deco'] {
  opacity: 0.28;
  box-shadow:
    inset 0 22px 46px -24px rgba(185, 210, 232, 0.3),
    inset 0 -34px 64px -34px rgba(0, 0, 0, 0.45),
    inset 24px 0 54px -40px rgba(143, 184, 221, 0.24),
    inset -24px 0 54px -40px rgba(143, 184, 221, 0.2);
}

body[data-dsh-odeta][data-odeta-sidebar='narrow'] {
  --odeta-gutter-left: 196px;
}

body[data-dsh-odeta][data-odeta-sidebar='rail'] {
  --odeta-gutter-left: 92px;
}

body[data-dsh-odeta] ::selection {
  background: rgba(143, 184, 221, 0.35);
  color: inherit;
}

body[data-dsh-odeta] [class*='sectionHeader'] {
  color: var(--odeta-ice-deep);
  letter-spacing: 0.05em;
}

body[data-ds-dark-theme][data-dsh-odeta] [class*='sectionHeader'] {
  color: #b9d2e8;
}

/* 新会话按钮：配色收敛到 --odeta-btn-* 亮/暗成对变量（不再写死亮色，
   暗色下也不会借 brand-text 变成浅底白字）。 */
body[data-dsh-odeta] button[class*='newSession'] {
  position: relative;
  min-height: 46px;
  color: var(--odeta-btn-ink);
  border: 1px solid var(--dsw-alias-border-l3);
  border-radius: 23px;
  background: linear-gradient(145deg, var(--odeta-btn-from), var(--odeta-btn-to));
  font-size: 15px;
  letter-spacing: 0.08em;
  box-shadow:
    inset 0 1px rgba(255, 255, 255, 0.28),
    inset 0 -10px 18px rgba(143, 184, 221, 0.16),
    0 6px 16px var(--odeta-btn-glow);
  transition: filter 150ms ease, transform 150ms ease;
}

/* 两侧雪晶：叶子按钮上的纯装饰伪元素，不占布局、不拦交互。 */
body[data-dsh-odeta] button[class*='newSession']::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  pointer-events: none;
  background-image: var(--odeta-snow-accent-art), var(--odeta-crystal-art);
  background-repeat: no-repeat;
  background-position: left 14px center, right 14px center;
  background-size: 18px 18px, 18px 18px;
  opacity: 0.7;
}

body[data-dsh-odeta] button[class*='newSession']:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

body[data-dsh-odeta][data-odeta-sidebar='rail'] button[class*='newSession'] {
  min-height: 38px;
  width: 38px;
  min-width: 38px;
  align-self: center;
  padding: 0;
  border-radius: 50%;
  font-size: 0;
}

/* 侧栏收起成圆钮时没有横向空间，隐藏两侧雪晶避免重叠。 */
body[data-dsh-odeta][data-odeta-sidebar='rail'] button[class*='newSession']::before {
  display: none;
}

/* 标签页选中态：冰蓝→淡金霜线 + 冷光，左侧一枚小雪晶。 */
body[data-dsh-odeta] [role='tab'][aria-selected='true']::after {
  background: linear-gradient(90deg, var(--odeta-ice), var(--odeta-gold));
  box-shadow: 0 0 8px rgba(143, 184, 221, 0.6);
}

body[data-dsh-odeta] [role='tab'][aria-selected='true']::before {
  content: '';
  position: absolute;
  left: -11px;
  top: 4px;
  width: 8px;
  height: 8px;
  background: var(--odeta-snow-accent-art) center / contain no-repeat;
  opacity: 0.55;
  pointer-events: none;
}

/* 会话行选中态：冰蓝淡底 + 左侧淡金竖条。 */
body[data-dsh-odeta] :is([data-pane='sidebar'], [class*='sidebarCol']) [role='treeitem'][aria-selected='true'] {
  background: linear-gradient(90deg, rgba(74, 127, 181, 0.2), rgba(74, 127, 181, 0.06));
  box-shadow: inset 3px 0 var(--odeta-gold);
}

body[data-dsh-odeta] :is([data-pane='conversation'], [class*='centerCol']) {
  background: transparent;
}

/* 滚动条：冰蓝细条。 */
body[data-dsh-odeta] ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

body[data-dsh-odeta] ::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: rgba(74, 127, 181, 0.35);
}

body[data-dsh-odeta] ::-webkit-scrollbar-thumb:hover {
  background: rgba(74, 127, 181, 0.55);
}

/* 窄视口：只保留边缘霜晕，隐藏左侧大冰晶避免压到内容。 */
@media (max-width: 980px) {
  body[data-dsh-odeta] [data-odeta-chrome='frost-deco'] {
    background-image: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  body[data-dsh-odeta] [data-odeta-chrome='snow-far'],
  body[data-dsh-odeta] [data-odeta-chrome='snow-near'],
  body[data-dsh-odeta] [data-odeta-chrome='crystal-top'],
  body[data-dsh-odeta] [data-odeta-chrome='snow-bottom'],
  body[data-dsh-odeta] [data-odeta-chrome='frost-deco'] {
    animation: none;
    transition: none;
  }

  body[data-dsh-odeta] [data-odeta-chrome='portrait'] {
    transition: none;
  }
}
`

export const ODETA_CSS = [ODETA_LIGHT_CUSTOM, ODETA_DARK_CUSTOM, ODETA_TOKEN_CSS, ODETA_DECOR]
  .join('\n\n')
