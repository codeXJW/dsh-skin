/**
 * 青瓷·月门 —— 整包样式（原创，MIT）。
 * 根作用域 body[data-dsh-celadon]；状态钩子全部由 runtime.ts 投影：
 *  - [data-celadon-chat-active]      会话进行中 → 装饰退位
 *  - [data-celadon-sidebar='rail'|'narrow'|'wide']  侧栏宽度分档
 * 亮/暗双套跟随官方 body[data-ds-dark-theme]。
 */
export const CELADON_CSS = /* css */ `
body[data-dsh-celadon] {
  --celadon-jade: #3f7d6b;
  --celadon-jade-deep: #2c5a4c;
  --celadon-gold: #b89b5e;
  --celadon-ink: #23302b;
  --celadon-paper: #f4f1e6;
  --celadon-seal: #b03a2e;

  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: rgba(246, 244, 236, 0.74);
  --dsw-alias-bg-layer-2: rgba(238, 235, 224, 0.86);
  --dsw-alias-bg-layer-3: rgba(230, 227, 214, 0.9);
  --dsw-alias-bg-overlay: rgba(246, 244, 236, 0.96);
  --dsw-alias-bg-module-platform: rgba(238, 235, 224, 0.8);
  --dsw-alias-border-l1: rgba(63, 125, 107, 0.16);
  --dsw-alias-border-l2-darkmode-thin: rgba(63, 125, 107, 0.22);
  --dsw-alias-border-l2: rgba(63, 125, 107, 0.28);
  --dsw-alias-border-l3: rgba(184, 155, 94, 0.55);
  --dsw-alias-brand-primary: #3f7d6b;
  --dsw-alias-brand-text: #2c5a4c;
  --dsw-alias-button-primary-hover: #4d8f7b;
  --dsw-alias-button-primary-dimmed: rgba(63, 125, 107, 0.14);
  --dsw-alias-button-elevated-fill: rgba(250, 248, 240, 0.88);
  --dsw-alias-button-floating-fill: rgba(250, 248, 240, 0.94);
  --dsw-alias-button-floating-hover: #e9e4d2;
  --dsw-alias-interactive-bg-active: rgba(184, 155, 94, 0.2);
  --dsw-alias-interactive-bg-hover: rgba(63, 125, 107, 0.1);
  --dsw-alias-interactive-bg-hover-solid: #e2e7dc;
  --dsw-alias-label-primary: #23302b;
  --dsw-alias-label-primary-bluish: #2c5a4c;
  --dsw-alias-label-secondary: #4c5a52;
  --dsw-alias-label-tertiary: #6d7a70;
  --dsw-alias-label-caption: #8a948a;
  --dsw-alias-state-business-primary: #3f7d6b;
  --dsw-alias-state-business-tertiary: #dde5da;
  --dsw-specific-input-major: rgba(250, 248, 240, 0.86);
  --dsw-specific-selector: rgba(226, 231, 220, 0.9);
  --dsw-specific-sidebar-fill: rgba(232, 238, 230, 0.66);
  --dsw-specific-menu: rgba(246, 244, 236, 0.94);
}

body[data-ds-dark-theme][data-dsh-celadon] {
  --celadon-jade: #7fb3a1;
  --celadon-jade-deep: #a9cabe;
  --celadon-paper: #101c18;

  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: rgba(18, 30, 26, 0.88);
  --dsw-alias-bg-layer-2: rgba(24, 38, 33, 0.92);
  --dsw-alias-bg-layer-3: rgba(30, 46, 40, 0.94);
  --dsw-alias-bg-overlay: rgba(16, 28, 24, 0.97);
  --dsw-alias-bg-module-platform: rgba(24, 38, 33, 0.9);
  --dsw-alias-border-l1: rgba(143, 184, 168, 0.18);
  --dsw-alias-border-l2-darkmode-thin: rgba(143, 184, 168, 0.26);
  --dsw-alias-border-l2: rgba(143, 184, 168, 0.3);
  --dsw-alias-border-l3: rgba(200, 185, 138, 0.5);
  --dsw-alias-brand-primary: #7fb3a1;
  --dsw-alias-brand-text: #d9e6de;
  --dsw-alias-button-primary-hover: #8fb8a8;
  --dsw-alias-button-primary-dimmed: rgba(127, 179, 161, 0.2);
  --dsw-alias-button-elevated-fill: rgba(30, 46, 40, 0.94);
  --dsw-alias-button-floating-fill: rgba(34, 52, 45, 0.96);
  --dsw-alias-button-floating-hover: #2c443a;
  --dsw-alias-interactive-bg-active: rgba(200, 185, 138, 0.22);
  --dsw-alias-interactive-bg-hover: rgba(127, 179, 161, 0.12);
  --dsw-alias-interactive-bg-hover-solid: #2a4238;
  --dsw-alias-label-primary: #e4ece6;
  --dsw-alias-label-primary-bluish: #c6dcd2;
  --dsw-alias-label-secondary: #b2c4b8;
  --dsw-alias-label-tertiary: #8ea398;
  --dsw-alias-label-caption: #74887d;
  --dsw-alias-state-business-primary: #7fb3a1;
  --dsw-alias-state-business-tertiary: #2a4238;
  --dsw-specific-input-major: rgba(22, 36, 31, 0.9);
  --dsw-specific-selector: rgba(40, 58, 50, 0.92);
  --dsw-specific-sidebar-fill: rgba(14, 26, 22, 0.82);
  --dsw-specific-menu: rgba(20, 34, 29, 0.95);
}

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

body[data-dsh-celadon] :is([data-pane='sidebar'], [class*='sidebarCol']) {
  border-right: 0;
  box-shadow:
    8px 0 28px rgba(35, 48, 43, 0.08),
    inset -1px 0 rgba(63, 125, 107, 0.42),
    inset -3px 0 rgba(184, 155, 94, 0.3);
  backdrop-filter: blur(10px);
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
