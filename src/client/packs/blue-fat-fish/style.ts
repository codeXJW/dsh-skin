/**
 * 蓝色大肥鱼 —— 整包样式（装饰件原创，MIT）。
 *
 * 遵循 packs/GUIDELINES.md：
 *  - A1 根作用域 body[data-dsh-blue-fat-fish]，亮/暗由 body[data-ds-dark-theme]
 *        分支表达，JS 不做任何亮暗判断；
 *  - A2 只用稳定语义钩子（[data-pane]/[data-slot]/[data-composer-card]/[role] 等），
 *        不用 nth-child / 层级深度；
 *  - B1 应用容器（侧栏/主区/输入卡）上**不**设 transform/filter/backdrop-filter/
 *        perspective/will-change/contain/opacity/isolation/z-index —— 那些属性会把
 *        fixed 浮层（设置弹窗、Cordis 审批面板）的包含块从视口改成侧栏，导致错位；
 *  - B2 装饰一律是皮肤自有节点（data-blue-fat-fish-chrome + data-skin-owner +
 *        aria-hidden + pointer-events:none）；
 *  - B4 z-index：背景层 0，装饰层 1~20，**永不 ≥40**；
 *  - C1 JS 只投影 body 上的 data-* 状态钩子，样式全在 CSS；
 *  - E1 亮/暗双套；E2 侧栏 rail/narrow/wide 三档；E3 reduced-motion 关动画；
 *    E4 1080px / 700px 两档窄视口降级；E5 装饰 pointer-events:none。
 *
 * 结构：皮肤自有变量（--bff-*）+ 宿主 --dsw-* token 覆盖（经注册表
 * core/tokens.ts 生成，语义 key 取色、类型化、亮/暗成对）+ 装饰段。
 */
import { buildTokenRules, type PaletteInput } from '../../core/tokens'

/* ── 皮肤自有变量（非宿主 token，供装饰段消费） ───────────────── */

const BFF_LIGHT_CUSTOM = `body[data-dsh-blue-fat-fish] {
  --bff-deep: #0d2b4f;
  --bff-blue: #1f7fc4;
  --bff-cyan: #4fc4e8;
  --bff-milk: #f7fbff;
  --bff-gold: #c9973f;
  --bff-ink: #123049;
  --bff-snow: #eaf7ff;
  /* 新会话按钮：亮/暗成对的皮肤自有变量（不是宿主 --dsw-* token） */
  --bff-btn-from: #2a8fd6;
  --bff-btn-to: #14588f;
  --bff-btn-ink: #f2fbff;
  --bff-btn-glow: rgba(20, 88, 143, 0.3);
}`

const BFF_DARK_CUSTOM = `body[data-ds-dark-theme][data-dsh-blue-fat-fish] {
  --bff-deep: #061a30;
  --bff-blue: #58b6ea;
  --bff-cyan: #8ce3ff;
  --bff-milk: #e8f2fb;
  --bff-gold: #e6c07a;
  --bff-ink: #dcebf7;
  --bff-snow: #cfe9ff;
  --bff-btn-from: #1f6f9e;
  --bff-btn-to: #0d3c5e;
  --bff-btn-glow: rgba(0, 0, 0, 0.45);
}`

/* ── 宿主 --dsw-* token 覆盖（缺失键回退宿主原值） ──────────────
    注：本皮肤覆盖了 label-secondary（fidelity 键）。buildTokenRules 默认跳过
    fidelity 以免把固定 UI 调淡，但既有两个整包皮肤都保留了该键，为保持仓库
    内部一致，这里显式传 allowFidelity（见 docs/skin-variable-catalog.md §5）。 */

const BFF_LIGHT_TOKENS = {
  bgBase: 'transparent',
  bgLayer1: 'rgba(238, 246, 253, 0.8)',
  bgLayer2: 'rgba(231, 241, 250, 0.88)',
  bgLayer3: 'rgba(222, 235, 247, 0.92)',
  bgOverlay: 'rgba(240, 247, 253, 0.96)',
  bgModulePlatform: 'rgba(231, 241, 250, 0.84)',
  borderL1: 'rgba(31, 127, 196, 0.16)',
  borderL2DarkmodeThin: 'rgba(31, 127, 196, 0.24)',
  borderL2: 'rgba(31, 127, 196, 0.3)',
  borderL3: 'rgba(201, 151, 63, 0.5)',
  brandPrimary: '#1f7fc4',
  brandText: '#14588f',
  buttonPrimaryHover: '#2a8fd6',
  buttonPrimaryDimmed: 'rgba(31, 127, 196, 0.14)',
  buttonElevatedFill: 'rgba(250, 253, 255, 0.9)',
  buttonFloatingFill: 'rgba(250, 253, 255, 0.94)',
  buttonFloatingHover: '#e2eef8',
  interactiveBgActive: 'rgba(201, 151, 63, 0.2)',
  interactiveBgHover: 'rgba(31, 127, 196, 0.1)',
  interactiveBgHoverSolid: '#dfeaf5',
  focusRingColor: '#1f7fc4',
  labelPrimary: '#123049',
  labelPrimaryBluish: '#14588f',
  labelSecondary: '#40607c',
  labelTertiary: '#5f7d96',
  labelCaption: '#8298ad',
  stateBusinessPrimary: '#1f7fc4',
  stateBusinessTertiary: '#dcebf7',
  inputMajor: 'rgba(250, 253, 255, 0.88)',
  selector: 'rgba(223, 234, 245, 0.9)',
  /* 侧栏底色透明 → 由装饰段补回半透明蓝底，海藻/游鱼能透出来 */
  sidebarFill: 'transparent',
  menu: 'rgba(238, 246, 253, 0.94)',
} satisfies PaletteInput

const BFF_DARK_TOKENS = {
  bgBase: 'transparent',
  bgLayer1: 'rgba(11, 30, 52, 0.88)',
  bgLayer2: 'rgba(14, 38, 64, 0.92)',
  bgLayer3: 'rgba(18, 46, 76, 0.94)',
  bgOverlay: 'rgba(8, 24, 43, 0.97)',
  bgModulePlatform: 'rgba(14, 38, 64, 0.9)',
  borderL1: 'rgba(88, 182, 234, 0.18)',
  borderL2DarkmodeThin: 'rgba(88, 182, 234, 0.26)',
  borderL2: 'rgba(88, 182, 234, 0.32)',
  borderL3: 'rgba(230, 192, 122, 0.5)',
  brandPrimary: '#58b6ea',
  brandText: '#d6ecfa',
  buttonPrimaryHover: '#6cc4f2',
  buttonPrimaryDimmed: 'rgba(88, 182, 234, 0.2)',
  buttonElevatedFill: 'rgba(18, 46, 76, 0.94)',
  buttonFloatingFill: 'rgba(20, 52, 84, 0.96)',
  buttonFloatingHover: '#1c4468',
  interactiveBgActive: 'rgba(230, 192, 122, 0.22)',
  interactiveBgHover: 'rgba(88, 182, 234, 0.12)',
  interactiveBgHoverSolid: '#15395c',
  focusRingColor: '#58b6ea',
  labelPrimary: '#dcebf7',
  labelPrimaryBluish: '#bcdcf0',
  labelSecondary: '#a9c6dc',
  labelTertiary: '#87a2ba',
  labelCaption: '#6f8ba3',
  stateBusinessPrimary: '#58b6ea',
  stateBusinessTertiary: '#15395c',
  inputMajor: 'rgba(12, 33, 56, 0.9)',
  selector: 'rgba(20, 52, 84, 0.92)',
  sidebarFill: 'transparent',
  menu: 'rgba(11, 30, 52, 0.95)',
} satisfies PaletteInput

const BFF_TOKEN_CSS = buildTokenRules({
  lightSelector: 'body[data-dsh-blue-fat-fish]',
  darkSelector: 'body[data-ds-dark-theme][data-dsh-blue-fat-fish]',
  light: BFF_LIGHT_TOKENS,
  dark: BFF_DARK_TOKENS,
  allowFidelity: true,
})

/* ── 装饰段：背景、装饰层、侧栏、输入区、滚动条、小人、媒体查询 ── */

const BFF_DECOR = /* css */ `
/* ── 海底基调：亮色 = 浅蓝灰海面 + 奶白；暗色 = 深海军蓝深海 ── */
body[data-dsh-blue-fat-fish] {
  background-color: var(--bff-snow);
  background-image:
    radial-gradient(92vmin 62vmin at 16% -12%, rgba(255, 255, 255, 0.9), transparent 62%),
    radial-gradient(74vmin 52vmin at 94% 4%, rgba(79, 196, 232, 0.22), transparent 66%),
    radial-gradient(66vmin 48vmin at 46% 108%, rgba(31, 127, 196, 0.14), transparent 70%),
    linear-gradient(180deg, #e6f2fb 0%, #f1f8fd 46%, #dcecf8 100%);
  background-attachment: fixed;
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] {
  background-color: #05141f;
  background-image:
    radial-gradient(92vmin 62vmin at 16% -12%, rgba(31, 127, 196, 0.24), transparent 62%),
    radial-gradient(74vmin 52vmin at 94% 4%, rgba(79, 196, 232, 0.14), transparent 66%),
    radial-gradient(66vmin 48vmin at 46% 108%, rgba(13, 43, 79, 0.6), transparent 70%),
    linear-gradient(180deg, #04101d 0%, #0a2542 52%, #05141f 100%);
}

body[data-dsh-blue-fat-fish] [id='root'] {
  position: relative;
  background: transparent;
}

/* ── 气泡层（背景层，z-index 0）───────────────────────────────
   贴片 240×320，位移正好一格高度 → 无缝循环，气泡不断上升。 */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='bubbles'] {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background-image: var(--bff-bubbles-art);
  background-repeat: repeat;
  background-size: 240px 320px;
  opacity: 0.55;
  animation: bff-bubbles 26s linear infinite;
}

@keyframes bff-bubbles {
  from { background-position: 0 0; }
  to { background-position: 0 -320px; }
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='bubbles'] {
  opacity: 0.4;
}

/* ── 大肥鱼剪影（背景层，z-index 0，缓慢横向游动） ────────────── */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='fish-far'] {
  position: fixed;
  left: 0;
  top: 12vh;
  z-index: 0;
  width: min(40vw, 460px);
  aspect-ratio: 340 / 180;
  pointer-events: none;
  background: var(--bff-fish-art) center / contain no-repeat;
  opacity: 0.17;
  animation: bff-swim-far 72s linear infinite;
}

body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='fish-near'] {
  position: fixed;
  right: 0;
  top: 64vh;
  z-index: 0;
  width: min(24vw, 280px);
  aspect-ratio: 220 / 120;
  pointer-events: none;
  background: var(--bff-fish-near-art) center / contain no-repeat;
  opacity: 0.2;
  animation: bff-swim-near 88s linear infinite;
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='fish-far'] {
  opacity: 0.3;
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='fish-near'] {
  opacity: 0.34;
}

@keyframes bff-swim-far {
  from { transform: translateX(-32vw); }
  to { transform: translateX(114vw); }
}

@keyframes bff-swim-near {
  from { transform: translateX(32vw); }
  to { transform: translateX(-114vw); }
}

/* ── 描金浮游星光（装饰层，z-index 1） ─────────────────────────── */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='stars'] {
  position: fixed;
  inset: 0;
  z-index: 1;
  pointer-events: none;
  background-image: var(--bff-stars-art);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  animation: bff-twinkle 6.5s ease-in-out infinite;
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='stars'] {
  animation-name: bff-twinkle-dark;
}

@keyframes bff-twinkle {
  0%, 100% { opacity: 0.26; }
  50% { opacity: 0.6; }
}

/* 暗色：星光更亮更金（另起一条关键帧，避免被上面的动画值覆盖）。 */
@keyframes bff-twinkle-dark {
  0%, 100% { opacity: 0.42; }
  50% { opacity: 0.88; }
}

/* ── 海藻（右下角一丛，随波摇摆） ──────────────────────────────── */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='weed'] {
  position: fixed;
  right: 1.5vw;
  bottom: 0;
  z-index: 0;
  width: min(20vw, 240px);
  aspect-ratio: 260 / 300;
  pointer-events: none;
  background: var(--bff-weed-art) bottom center / contain no-repeat;
  opacity: 0.36;
  transform-origin: 50% 100%;
  animation: bff-sway 7.5s ease-in-out infinite;
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='weed'] {
  opacity: 0.5;
}

@keyframes bff-sway {
  0%, 100% { transform: rotate(-2deg); }
  50% { transform: rotate(2deg); }
}

/* ── 侧栏 ─────────────────────────────────────────────────────
   规范 B1：应用容器上禁用 backdrop-filter/transform 等包含块属性——
   设置弹窗等浮层以 position:fixed 挂载在侧栏子树内，这类属性会把 fixed 的
   参照从视口改成侧栏，弹窗被挤压错位。磨砂质感用略高的不透明度补偿。 */
body[data-dsh-blue-fat-fish] :is([data-pane='sidebar'], [class*='sidebarCol']) {
  border-right: 0;
  background-color: rgba(226, 240, 252, 0.72);
  box-shadow:
    8px 0 28px rgba(13, 43, 79, 0.08),
    inset -1px 0 rgba(31, 127, 196, 0.34),
    inset -3px 0 rgba(201, 151, 63, 0.22);
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] :is([data-pane='sidebar'], [class*='sidebarCol']) {
  background-color: rgba(6, 22, 41, 0.9);
}

body[data-dsh-blue-fat-fish] [data-rightbar-col] {
  background-color: rgba(226, 240, 252, 0.72);
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] [data-rightbar-col] {
  background-color: rgba(6, 22, 41, 0.9);
}

body[data-dsh-blue-fat-fish] [class*='sectionHeader'] {
  color: var(--bff-blue);
  letter-spacing: 0.05em;
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] [class*='sectionHeader'] {
  color: #8ce3ff;
}

/* 会话行选中态：湖蓝淡底 + 左侧描金竖条。 */
body[data-dsh-blue-fat-fish] :is([data-pane='sidebar'], [class*='sidebarCol']) [role='treeitem'][aria-selected='true'] {
  background: linear-gradient(90deg, rgba(31, 127, 196, 0.22), rgba(31, 127, 196, 0.05));
  box-shadow: inset 3px 0 var(--bff-gold);
}

body[data-dsh-blue-fat-fish] :is([data-pane='conversation'], [class*='centerCol']) {
  background: transparent;
}

/* 新会话按钮：湖蓝 → 深蓝渐变 + 描金描边。 */
body[data-dsh-blue-fat-fish] button[class*='newSession'] {
  position: relative;
  min-height: 46px;
  color: var(--bff-btn-ink);
  border: 1px solid rgba(201, 151, 63, 0.5);
  border-radius: 23px;
  background: linear-gradient(145deg, var(--bff-btn-from), var(--bff-btn-to));
  font-size: 15px;
  letter-spacing: 0.08em;
  box-shadow:
    inset 0 1px rgba(255, 255, 255, 0.26),
    inset 0 -10px 18px rgba(79, 196, 232, 0.16),
    0 6px 16px var(--bff-btn-glow);
  transition: filter 150ms ease, transform 150ms ease;
}

body[data-dsh-blue-fat-fish] button[class*='newSession']:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

body[data-dsh-blue-fat-fish][data-blue-fat-fish-sidebar='rail'] button[class*='newSession'] {
  min-height: 38px;
  width: 38px;
  min-width: 38px;
  align-self: center;
  padding: 0;
  border-radius: 50%;
  font-size: 0;
}

/* 标签页选中态：湖蓝 → 描金渐变线。 */
body[data-dsh-blue-fat-fish] [role='tab'][aria-selected='true']::after {
  background: linear-gradient(90deg, var(--bff-blue), var(--bff-gold));
  box-shadow: 0 0 8px rgba(79, 196, 232, 0.55);
}

/* ── 输入区：描金鱼鳞边 ─────────────────────────────────────────
   只命中输入卡本体（data-composer-card），不要加 [class*='composer'] 兜底：
   宿主布局容器 composerSeat/composerStack 的类名同样含 composer，会一起套上
   描边 + 外投影，在输入区周围形成多余的多层线框。
   注意：输入卡**不加** overflow:hidden —— 小人要在卡片上沿"探"出来。 */
body[data-dsh-blue-fat-fish] [data-composer-card] {
  position: relative;
  box-shadow:
    inset 0 0 0 1px rgba(31, 127, 196, 0.3),
    inset 0 1px 16px rgba(79, 196, 232, 0.1),
    0 10px 30px rgba(13, 43, 79, 0.14);
}

body[data-dsh-blue-fat-fish] [data-composer-card]:focus-within {
  box-shadow:
    inset 0 0 0 1px rgba(31, 127, 196, 0.58),
    0 0 0 3px rgba(79, 196, 232, 0.18),
    0 12px 34px rgba(13, 43, 79, 0.18);
}

/* ── 滚动条：湖蓝细条 ─────────────────────────────────────────── */
body[data-dsh-blue-fat-fish] ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

body[data-dsh-blue-fat-fish] ::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: rgba(31, 127, 196, 0.35);
}

body[data-dsh-blue-fat-fish] ::-webkit-scrollbar-thumb:hover {
  background: rgba(31, 127, 196, 0.55);
}

body[data-dsh-blue-fat-fish] ::selection {
  background: rgba(79, 196, 232, 0.35);
  color: inherit;
}

/* 侧栏宽度分档（E2）：rail 档把新会话按钮收成圆形图标（见下方 rail 规则）。 */

/* ── 输入框右上角「趴边小人」────────────────────────────────────
   「蓝色大肥鱼」Q 版少女：呆毛 + 猫耳 + 女仆装 + 大鱼尾 + 金星。
   站在输入卡右上沿：body 探出卡片上沿，脚正好落在边沿上。

   规范：
   - B2 小人是皮肤自有节点（data-blue-fat-fish-chrome + data-skin-owner +
     aria-hidden），这里的 transform/filter 只作用在小人自身，不碰应用容器；
   - B4 z-index 留在装饰层（1~20），不把输入卡抬进 overlay 层级；
   - E5 pointer-events:none，绝不拦截输入框点击；
   - E1 亮/暗各一套投影与描边；
   - E3 prefers-reduced-motion 下停掉呼吸/摆尾动画。 */

body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] {
  position: absolute;
  top: 0;
  right: 14px;
  z-index: 2;
  /* 小人框 116×132（与 mascot.ts 的 viewBox 一致） */
  width: 116px;
  height: 132px;
  /* 整体上移 132px → 小人框底与卡片上沿齐平，脚正好落在边沿 */
  margin-top: -132px;
  pointer-events: none;
  transform-origin: 50% 88%;
  animation: bff-mascot-breathe 4.4s ease-in-out infinite;
}

body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-svg {
  display: block;
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 4px 8px rgba(13, 43, 79, 0.26));
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-svg {
  filter: brightness(0.93) saturate(0.97) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
}

/* SVG 内部部件做旋转时用 view-box 坐标系定位旋转中心。 */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-ahoge,
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-tail,
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-ears,
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-stars {
  transform-box: view-box;
}

/* 呆毛：轻轻晃动。 */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-ahoge {
  transform-origin: 46px 18px;
  animation: bff-mascot-ahoge 2.8s ease-in-out infinite;
}

/* 猫耳：偶尔抖一下。 */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-ears {
  transform-origin: 50px 32px;
  animation: bff-mascot-ears 5.2s ease-in-out infinite;
}

/* 大鱼尾：慢慢摆动（"大肥鱼"的核心动效）。 */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-tail {
  transform-origin: 57px 96px;
  animation: bff-mascot-tail 3.6s ease-in-out infinite;
}

/* 金色星光：呼吸式明灭。 */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-stars {
  transform-origin: 58px 40px;
  animation: bff-mascot-stars 2.4s ease-in-out infinite;
}

/* 待机：闭眼弯月眼 + 小嘴；运行中：换睁眼 + 大张嘴（规范 C1：状态由 CSS 消费
   body 上的钩子决定，JS 只投影 data-* 属性，不写样式值）。 */
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-eyes-busy,
body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-mouth-busy {
  display: none;
}

body[data-dsh-blue-fat-fish][data-blue-fat-fish-mascot-state='busy']
  [data-blue-fat-fish-chrome='mascot'] .bff-mascot-eyes-idle,
body[data-dsh-blue-fat-fish][data-blue-fat-fish-mascot-state='busy']
  [data-blue-fat-fish-chrome='mascot'] .bff-mascot-mouth-idle {
  display: none;
}

body[data-dsh-blue-fat-fish][data-blue-fat-fish-mascot-state='busy']
  [data-blue-fat-fish-chrome='mascot'] .bff-mascot-eyes-busy,
body[data-dsh-blue-fat-fish][data-blue-fat-fish-mascot-state='busy']
  [data-blue-fat-fish-chrome='mascot'] .bff-mascot-mouth-busy {
  display: inline;
}

/* 运行中：鱼尾摆得更快、星光更亮、小人整体带一圈冷光。 */
body[data-dsh-blue-fat-fish][data-blue-fat-fish-mascot-state='busy']
  [data-blue-fat-fish-chrome='mascot'] .bff-mascot-tail {
  animation-duration: 1.7s;
}

body[data-dsh-blue-fat-fish][data-blue-fat-fish-mascot-state='busy']
  [data-blue-fat-fish-chrome='mascot'] .bff-mascot-stars {
  animation-duration: 1.2s;
}

body[data-dsh-blue-fat-fish][data-blue-fat-fish-mascot-state='busy']
  [data-blue-fat-fish-chrome='mascot'] .bff-mascot-svg {
  filter: drop-shadow(0 4px 8px rgba(13, 43, 79, 0.26)) drop-shadow(0 0 10px rgba(140, 227, 255, 0.7));
}

body[data-ds-dark-theme][data-dsh-blue-fat-fish][data-blue-fat-fish-mascot-state='busy']
  [data-blue-fat-fish-chrome='mascot'] .bff-mascot-svg {
  filter: brightness(0.93) saturate(0.97) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
    drop-shadow(0 0 10px rgba(140, 227, 255, 0.75));
}

/* 本机素材槽（可选）：用户自备位图时按 --blue-fat-fish-mascot-art 变量接入，
   底沿用 mask 渐隐做柔和过渡；没有素材时保持上面的原创内联 SVG。 */
body[data-dsh-blue-fat-fish][data-blue-fat-fish-has-mascot-art]
  [data-blue-fat-fish-chrome='mascot'] {
  background-image: var(--bff-mascot-art);
  background-repeat: no-repeat;
  background-position: 50% 100%;
  background-size: contain;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 94%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 94%, transparent 100%);
}

body[data-dsh-blue-fat-fish][data-blue-fat-fish-has-mascot-art]
  [data-blue-fat-fish-chrome='mascot'] .bff-mascot-svg {
  display: none;
}

body[data-dsh-blue-fat-fish][data-blue-fat-fish-has-mascot-art][data-blue-fat-fish-mascot-state='busy']
  [data-blue-fat-fish-chrome='mascot'] {
  background-image: var(--bff-mascot-art-busy);
}

@keyframes bff-mascot-breathe {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(-1.1deg); }
}

@keyframes bff-mascot-ahoge {
  0%, 100% { transform: rotate(-4deg); }
  50% { transform: rotate(6deg); }
}

@keyframes bff-mascot-ears {
  0%, 100% { transform: rotate(0deg); }
  46%, 54% { transform: rotate(-2.4deg); }
}

@keyframes bff-mascot-tail {
  0%, 100% { transform: rotate(-2.6deg); }
  50% { transform: rotate(3deg); }
}

@keyframes bff-mascot-stars {
  0%, 100% { opacity: 0.55; transform: scale(0.94); }
  50% { opacity: 1; transform: scale(1.06); }
}

/* ── 窄视口降级（E4）────────────────────────────────────────── */
@media (max-width: 1080px) {
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='weed'] {
    display: none;
  }

  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] {
    width: 96px;
    height: 110px;
    right: 10px;
    margin-top: -110px;
  }
}

@media (max-width: 700px) {
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'],
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='fish-far'],
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='fish-near'] {
    display: none;
  }
}

/* ── 降低动效偏好（E3）：关掉所有动画 ───────────────────────── */
@media (prefers-reduced-motion: reduce) {
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='bubbles'],
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='fish-far'],
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='fish-near'],
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='stars'],
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='weed'],
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'],
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-ahoge,
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-ears,
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-tail,
  body[data-dsh-blue-fat-fish] [data-blue-fat-fish-chrome='mascot'] .bff-mascot-stars {
    animation: none;
  }
}
`

export const BFF_CSS = [BFF_LIGHT_CUSTOM, BFF_DARK_CUSTOM, BFF_TOKEN_CSS, BFF_DECOR]
  .join('\n\n')
