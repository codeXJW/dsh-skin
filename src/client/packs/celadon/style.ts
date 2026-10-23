/**
 * 青瓷·月门 —— 整包样式（原创，MIT）。
 * 根作用域 body[data-dsh-celadon]；状态钩子全部由 runtime.ts 投影：
 *  - [data-celadon-chat-active]      会话进行中 → 装饰退位
 *  - [data-celadon-sidebar='rail'|'narrow'|'wide']  侧栏宽度分档
 * 亮/暗双套跟随官方 body[data-ds-dark-theme]。
 *
 * 结构：皮肤自有变量（--celadon-*）+ 宿主 --dsw-* token 覆盖（经注册表
 * core/tokens.ts 生成，语义 key 取色、类型化、亮/暗成对）+ 装饰段。
 */
import { buildTokenRules, type PaletteInput } from '../../core/tokens'

/* ── 皮肤自有变量（非宿主 token，供装饰段消费） ───────────────── */

const CELADON_LIGHT_CUSTOM = `body[data-dsh-celadon] {
  --celadon-jade: #3f7d6b;
  --celadon-jade-deep: #2c5a4c;
  --celadon-gold: #b89b5e;
  --celadon-ink: #23302b;
  --celadon-paper: #f4f1e6;
  --celadon-seal: #b03a2e;
}`

const CELADON_DARK_CUSTOM = `body[data-ds-dark-theme][data-dsh-celadon] {
  --celadon-jade: #7fb3a1;
  --celadon-jade-deep: #a9cabe;
  --celadon-paper: #101c18;
}`

/* ── 宿主 --dsw-* token 覆盖（缺失键回退宿主原值） ──────────────
   注：本皮肤现状**覆盖了 label-secondary**（fidelity 键）。buildTokenRules 默认
   跳过 fidelity 以免把固定 UI 调淡，但纯重构不改既有视觉，故传 allowFidelity
   予以保留。若日后要遵循信息保真建议（docs/skin-variable-catalog.md §5），
   应移除该键 —— 那是独立的行为变更，不在本次重构范围。 */

const CELADON_LIGHT_TOKENS = {
  bgBase: 'transparent',
  bgLayer1: 'rgba(246, 244, 236, 0.74)',
  bgLayer2: 'rgba(238, 235, 224, 0.86)',
  bgLayer3: 'rgba(230, 227, 214, 0.9)',
  bgOverlay: 'rgba(246, 244, 236, 0.96)',
  bgModulePlatform: 'rgba(238, 235, 224, 0.8)',
  borderL1: 'rgba(63, 125, 107, 0.16)',
  borderL2DarkmodeThin: 'rgba(63, 125, 107, 0.22)',
  borderL2: 'rgba(63, 125, 107, 0.28)',
  borderL3: 'rgba(184, 155, 94, 0.55)',
  brandPrimary: '#3f7d6b',
  brandText: '#2c5a4c',
  buttonPrimaryHover: '#4d8f7b',
  buttonPrimaryDimmed: 'rgba(63, 125, 107, 0.14)',
  buttonElevatedFill: 'rgba(250, 248, 240, 0.88)',
  buttonFloatingFill: 'rgba(250, 248, 240, 0.94)',
  buttonFloatingHover: '#e9e4d2',
  interactiveBgActive: 'rgba(184, 155, 94, 0.2)',
  interactiveBgHover: 'rgba(63, 125, 107, 0.1)',
  interactiveBgHoverSolid: '#e2e7dc',
  labelPrimary: '#23302b',
  labelPrimaryBluish: '#2c5a4c',
  labelSecondary: '#4c5a52',
  labelTertiary: '#6d7a70',
  labelCaption: '#8a948a',
  stateBusinessPrimary: '#3f7d6b',
  stateBusinessTertiary: '#dde5da',
  inputMajor: 'rgba(250, 248, 240, 0.86)',
  selector: 'rgba(226, 231, 220, 0.9)',
  sidebarFill: 'rgba(232, 238, 230, 0.8)',
  menu: 'rgba(246, 244, 236, 0.94)',
} satisfies PaletteInput

const CELADON_DARK_TOKENS = {
  bgBase: 'transparent',
  bgLayer1: 'rgba(18, 30, 26, 0.88)',
  bgLayer2: 'rgba(24, 38, 33, 0.92)',
  bgLayer3: 'rgba(30, 46, 40, 0.94)',
  bgOverlay: 'rgba(16, 28, 24, 0.97)',
  bgModulePlatform: 'rgba(24, 38, 33, 0.9)',
  borderL1: 'rgba(143, 184, 168, 0.18)',
  borderL2DarkmodeThin: 'rgba(143, 184, 168, 0.26)',
  borderL2: 'rgba(143, 184, 168, 0.3)',
  borderL3: 'rgba(200, 185, 138, 0.5)',
  brandPrimary: '#7fb3a1',
  brandText: '#d9e6de',
  buttonPrimaryHover: '#8fb8a8',
  buttonPrimaryDimmed: 'rgba(127, 179, 161, 0.2)',
  buttonElevatedFill: 'rgba(30, 46, 40, 0.94)',
  buttonFloatingFill: 'rgba(34, 52, 45, 0.96)',
  buttonFloatingHover: '#2c443a',
  interactiveBgActive: 'rgba(200, 185, 138, 0.22)',
  interactiveBgHover: 'rgba(127, 179, 161, 0.12)',
  interactiveBgHoverSolid: '#2a4238',
  labelPrimary: '#e4ece6',
  labelPrimaryBluish: '#c6dcd2',
  labelSecondary: '#b2c4b8',
  labelTertiary: '#8ea398',
  labelCaption: '#74887d',
  stateBusinessPrimary: '#7fb3a1',
  stateBusinessTertiary: '#2a4238',
  inputMajor: 'rgba(22, 36, 31, 0.9)',
  selector: 'rgba(40, 58, 50, 0.92)',
  sidebarFill: 'rgba(14, 26, 22, 0.9)',
  menu: 'rgba(20, 34, 29, 0.95)',
} satisfies PaletteInput

const CELADON_TOKEN_CSS = buildTokenRules({
  lightSelector: 'body[data-dsh-celadon]',
  darkSelector: 'body[data-ds-dark-theme][data-dsh-celadon]',
  light: CELADON_LIGHT_TOKENS,
  dark: CELADON_DARK_TOKENS,
  allowFidelity: true,
})

/* ── 装饰段：背景、装饰层、侧栏、输入区、滚动条、媒体查询 ────── */

const CELADON_DECOR = /* css */ `
/* 米纸底 + 月色 + 竹影：纯渐变背景，无任何位图。 */
body[data-dsh-celadon] {
  background-color: var(--celadon-paper);
  background-image:
    radial-gradient(58vmin 58vmin at 80% 12%, rgba(216, 197, 146, 0.34), transparent 70%),
    radial-gradient(90vmin 70vmin at 12% 92%, rgba(63, 125, 107, 0.12), transparent 72%),
    repeating-linear-gradient(90deg, rgba(63, 125, 107, 0.035) 0 2px, transparent 2px 96px),
    repeating-linear-gradient(0deg, rgba(35, 48, 43, 0.014) 0 1px, transparent 1px 5px);
  background-attachment: fixed;
}

body[data-ds-dark-theme][data-dsh-celadon] {
  background-image:
    radial-gradient(58vmin 58vmin at 80% 12%, rgba(216, 197, 146, 0.2), transparent 70%),
    radial-gradient(90vmin 70vmin at 12% 92%, rgba(127, 179, 161, 0.1), transparent 72%),
    repeating-linear-gradient(90deg, rgba(127, 179, 161, 0.04) 0 2px, transparent 2px 96px),
    repeating-linear-gradient(0deg, rgba(228, 236, 230, 0.014) 0 1px, transparent 1px 5px);
}

body[data-dsh-celadon] [id='root'] {
  position: relative;
  background: transparent;
}

/* ── 装饰层 ─────────────────────────────────────────────────── */

body[data-dsh-celadon] [data-celadon-chrome='moon-gate'] {
  position: fixed;
  top: 50%;
  right: -14vmin;
  z-index: 0;
  width: 76vmin;
  height: 76vmin;
  transform: translateY(-50%);
  background: var(--celadon-moon-gate-art) center / contain no-repeat;
  opacity: 0.42;
  pointer-events: none;
  transition: opacity 520ms ease, transform 620ms cubic-bezier(0.22, 0.78, 0.2, 1);
}

body[data-dsh-celadon] [data-celadon-chrome='plum-branch'] {
  position: fixed;
  right: 0;
  bottom: 0;
  z-index: 0;
  width: min(40vw, 46vh);
  aspect-ratio: 4 / 3;
  background: var(--celadon-plum-branch-art) right bottom / contain no-repeat;
  opacity: 0.9;
  pointer-events: none;
  filter: drop-shadow(0 6px 14px rgba(35, 48, 43, 0.16));
  transition: opacity 520ms ease;
}

/* 会话进行中：月门退到更右、压暗，梅枝稍淡，让位给对话内容。 */
body[data-dsh-celadon][data-celadon-chat-active] [data-celadon-chrome='moon-gate'] {
  opacity: 0.16;
  transform: translateY(-50%) translateX(8vmin) scale(0.96);
}

body[data-dsh-celadon][data-celadon-chat-active] [data-celadon-chrome='plum-branch'] {
  opacity: 0.55;
}

@media (max-width: 860px) {
  body[data-dsh-celadon] [data-celadon-chrome='moon-gate'] {
    opacity: 0.2;
  }
}

/* 侧栏印章：钉在侧栏底部（footer 上方），仅宽侧栏显示。 */
body[data-dsh-celadon] [data-celadon-chrome='seal'] {
  position: absolute;
  left: 18px;
  bottom: 96px;
  z-index: 1;
  width: 46px;
  height: 46px;
  background: var(--celadon-seal-art) center / contain no-repeat;
  pointer-events: none;
  opacity: 0.94;
  filter: drop-shadow(0 3px 6px rgba(35, 48, 43, 0.28));
  transform: rotate(-4deg);
}

body[data-dsh-celadon][data-celadon-sidebar='rail'] [data-celadon-chrome='seal'] {
  display: none;
}

/* ── 侧栏 ───────────────────────────────────────────────────── */

/* 规范 B1：应用容器上禁用 backdrop-filter/transform/filter 等包含块属性——
   设置弹窗等浮层以 position:fixed 挂载在侧栏子树内，这类属性会把 fixed 的
   参照从视口改成侧栏，弹窗被挤压错位。磨砂质感用略高的不透明度补偿。 */
body[data-dsh-celadon] :is([data-pane='sidebar'], [class*='sidebarCol']) {
  border-right: 0;
  box-shadow:
    8px 0 28px rgba(35, 48, 43, 0.08),
    inset -1px 0 rgba(63, 125, 107, 0.42),
    inset -3px 0 rgba(184, 155, 94, 0.3);
}

body[data-dsh-celadon] [class*='sectionHeader'] {
  color: var(--celadon-jade-deep);
  font-family: KaiTi, STKaiti, Georgia, serif;
  letter-spacing: 0.06em;
}

body[data-ds-dark-theme][data-dsh-celadon] [class*='sectionHeader'] {
  color: #c8b98a;
}

body[data-dsh-celadon] button[class*='newSession'] {
  min-height: 46px;
  color: #f4efdf;
  border: 1px solid rgba(184, 155, 94, 0.6);
  border-radius: 23px;
  background: linear-gradient(145deg, #4d8f7b, #2c5a4c);
  font-family: KaiTi, STKaiti, Georgia, serif;
  font-size: 15px;
  letter-spacing: 0.12em;
  box-shadow:
    inset 0 1px rgba(255, 255, 255, 0.22),
    0 6px 16px rgba(44, 90, 76, 0.28);
  transition: filter 150ms ease, transform 150ms ease;
}

body[data-dsh-celadon] button[class*='newSession']:hover {
  filter: brightness(1.08);
  transform: translateY(-1px);
}

body[data-dsh-celadon][data-celadon-sidebar='rail'] button[class*='newSession'] {
  min-height: 38px;
  width: 38px;
  min-width: 38px;
  align-self: center;
  padding: 0;
  border-radius: 50%;
  font-size: 0;
}

/* ── 输入区 ─────────────────────────────────────────────────── */

body[data-dsh-celadon] [data-composer-card],
body[data-dsh-celadon] [class*='composer'] {
  --dsw-alias-border-l2: rgba(184, 155, 94, 0.45);
}

body[data-dsh-celadon] :is([data-pane='conversation'], [class*='centerCol']) {
  background: transparent;
}

/* 会话行选中态：玉色淡底 + 左侧描金竖条。 */
body[data-dsh-celadon] :is([data-pane='sidebar'], [class*='sidebarCol']) [role='treeitem'][aria-selected='true'] {
  background: linear-gradient(90deg, rgba(63, 125, 107, 0.2), rgba(63, 125, 107, 0.06));
  box-shadow: inset 3px 0 var(--celadon-gold);
}

/* 滚动条：玉色细条。 */
body[data-dsh-celadon] ::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

body[data-dsh-celadon] ::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background: rgba(63, 125, 107, 0.35);
}

body[data-dsh-celadon] ::-webkit-scrollbar-thumb:hover {
  background: rgba(63, 125, 107, 0.55);
}

@media (prefers-reduced-motion: reduce) {
  body[data-dsh-celadon] [data-celadon-chrome='moon-gate'],
  body[data-dsh-celadon] [data-celadon-chrome='plum-branch'] {
    transition: none;
  }
}
`

export const CELADON_CSS = [CELADON_LIGHT_CUSTOM, CELADON_DARK_CUSTOM, CELADON_TOKEN_CSS, CELADON_DECOR]
  .join('\n\n')
