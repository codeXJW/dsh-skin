/**
 * 奥黛塔 · 冰湖天鹅 —— 整包样式（装饰件原创，MIT）。
 * 遵循 packs/GUIDELINES.md：根作用域 body[data-dsh-odeta]；状态钩子由
 * runtime.ts 投影：
 *  - [data-odeta-chat-active]                     会话进行中 → 立绘/雪层退位
 *  - [data-odeta-sidebar='rail'|'narrow'|'wide']  侧栏宽度分档
 *  - [data-odeta-has-backdrop]                    本机背景图存在 → 停用 CSS 渐变
 *  - [data-odeta-has-portrait]                    本机立绘存在（装饰层才挂载）
 * 亮/暗双套跟随官方 body[data-ds-dark-theme]。
 */
export const ODETA_CSS = /* css */ `
body[data-dsh-odeta] {
  --odeta-ice: #4a7fb5;
  --odeta-ice-deep: #2f5a86;
  --odeta-gold: #c9b189;
  --odeta-ink: #1f3245;
  --odeta-snow: #f4f8fb;

  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: rgba(243, 247, 251, 0.78);
  --dsw-alias-bg-layer-2: rgba(236, 243, 249, 0.88);
  --dsw-alias-bg-layer-3: rgba(228, 237, 246, 0.92);
  --dsw-alias-bg-overlay: rgba(243, 247, 251, 0.96);
  --dsw-alias-bg-module-platform: rgba(236, 243, 249, 0.84);
  --dsw-alias-border-l1: rgba(74, 127, 181, 0.16);
  --dsw-alias-border-l2-darkmode-thin: rgba(74, 127, 181, 0.24);
  --dsw-alias-border-l2: rgba(74, 127, 181, 0.3);
  --dsw-alias-border-l3: rgba(201, 177, 137, 0.55);
  --dsw-alias-brand-primary: #4a7fb5;
  --dsw-alias-brand-text: #2f5a86;
  --dsw-alias-button-primary-hover: #5a8fc0;
  --dsw-alias-button-primary-dimmed: rgba(74, 127, 181, 0.14);
  --dsw-alias-button-elevated-fill: rgba(252, 253, 255, 0.9);
  --dsw-alias-button-floating-fill: rgba(252, 253, 255, 0.94);
  --dsw-alias-button-floating-hover: #e2ecf5;
  --dsw-alias-interactive-bg-active: rgba(201, 177, 137, 0.2);
  --dsw-alias-interactive-bg-hover: rgba(74, 127, 181, 0.1);
  --dsw-alias-interactive-bg-hover-solid: #e0eaf3;
  --dsw-alias-label-primary: #1f3245;
  --dsw-alias-label-primary-bluish: #2f5a86;
  --dsw-alias-label-secondary: #47607a;
  --dsw-alias-label-tertiary: #6b8098;
  --dsw-alias-label-caption: #8a99ab;
  --dsw-alias-state-business-primary: #4a7fb5;
  --dsw-alias-state-business-tertiary: #dce8f3;
  --dsw-specific-input-major: rgba(252, 253, 255, 0.88);
  --dsw-specific-selector: rgba(224, 234, 243, 0.9);
  --dsw-specific-sidebar-fill: rgba(226, 236, 245, 0.82);
  --dsw-specific-menu: rgba(243, 247, 251, 0.94);
}

body[data-ds-dark-theme][data-dsh-odeta] {
  --odeta-ice: #8fb8dd;
  --odeta-ice-deep: #b9d2e8;

  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: rgba(16, 26, 38, 0.88);
  --dsw-alias-bg-layer-2: rgba(21, 33, 47, 0.92);
  --dsw-alias-bg-layer-3: rgba(27, 41, 57, 0.94);
  --dsw-alias-bg-overlay: rgba(14, 23, 34, 0.97);
  --dsw-alias-bg-module-platform: rgba(21, 33, 47, 0.9);
  --dsw-alias-border-l1: rgba(143, 184, 221, 0.18);
  --dsw-alias-border-l2-darkmode-thin: rgba(143, 184, 221, 0.26);
  --dsw-alias-border-l2: rgba(143, 184, 221, 0.32);
  --dsw-alias-border-l3: rgba(201, 177, 137, 0.5);
  --dsw-alias-brand-primary: #8fb8dd;
  --dsw-alias-brand-text: #dce9f5;
  --dsw-alias-button-primary-hover: #a3c4e4;
  --dsw-alias-button-primary-dimmed: rgba(143, 184, 221, 0.2);
  --dsw-alias-button-elevated-fill: rgba(27, 41, 57, 0.94);
  --dsw-alias-button-floating-fill: rgba(31, 47, 65, 0.96);
  --dsw-alias-button-floating-hover: #2a4159;
  --dsw-alias-interactive-bg-active: rgba(201, 177, 137, 0.22);
  --dsw-alias-interactive-bg-hover: rgba(143, 184, 221, 0.12);
  --dsw-alias-interactive-bg-hover-solid: #28405a;
  --dsw-alias-label-primary: #e3edf6;
  --dsw-alias-label-primary-bluish: #c6d9ec;
  --dsw-alias-label-secondary: #b3c6da;
  --dsw-alias-label-tertiary: #8fa5bb;
  --dsw-alias-label-caption: #74889d;
  --dsw-alias-state-business-primary: #8fb8dd;
  --dsw-alias-state-business-tertiary: #28405a;
  --dsw-specific-input-major: rgba(19, 31, 45, 0.9);
  --dsw-specific-selector: rgba(37, 55, 75, 0.92);
  --dsw-specific-sidebar-fill: rgba(12, 21, 32, 0.9);
  --dsw-specific-menu: rgba(17, 28, 41, 0.95);
}

/* 冰湖晨雾：纯渐变背景（本机背景图存在时由 [data-odeta-has-backdrop] 停用）。 */
body[data-dsh-odeta]:not([data-odeta-has-backdrop]) {
  background-color: var(--odeta-snow);
  background-image:
    radial-gradient(52vmin 52vmin at 82% 10%, rgba(255, 255, 255, 0.75), transparent 70%),
    radial-gradient(80vmin 60vmin at 8% 96%, rgba(74, 127, 181, 0.14), transparent 72%),
    linear-gradient(180deg, #dcebf7 0%, #eef5fb 48%, #c8dcee 100%);
  background-attachment: fixed;
}

body[data-ds-dark-theme][data-dsh-odeta]:not([data-odeta-has-backdrop]) {
  background-color: #0c1520;
  background-image:
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

/* 会话进行中：雪变小变淡，让位给内容。 */
body[data-dsh-odeta][data-odeta-chat-active] [data-odeta-chrome='snow-far'] {
  opacity: 0.55;
}

body[data-dsh-odeta][data-odeta-chat-active] [data-odeta-chrome='snow-near'] {
  opacity: 0.66;
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

/* 规范 B1：应用容器上禁用 backdrop-filter/transform 等包含块属性。 */
body[data-dsh-odeta] :is([data-pane='sidebar'], [class*='sidebarCol']) {
  border-right: 0;
  box-shadow:
    8px 0 28px rgba(31, 50, 69, 0.08),
    inset -1px 0 rgba(74, 127, 181, 0.4),
    inset -3px 0 rgba(201, 177, 137, 0.28);
}

/* 天鹅羽：钉在侧栏左下（footer 上方），仅宽侧栏显示。 */
body[data-dsh-odeta] [data-odeta-chrome='feather'] {
  position: absolute;
  left: 14px;
  bottom: 92px;
  z-index: 1;
  width: 44px;
  height: 70px;
  background: var(--odeta-feather-art) center / contain no-repeat;
  pointer-events: none;
  opacity: 0.92;
  filter: drop-shadow(0 3px 6px rgba(31, 50, 69, 0.22));
  transform: rotate(-7deg);
}

body[data-dsh-odeta][data-odeta-sidebar='rail'] [data-odeta-chrome='feather'] {
  display: none;
}

body[data-dsh-odeta] [class*='sectionHeader'] {
  color: var(--odeta-ice-deep);
  letter-spacing: 0.05em;
}

body[data-ds-dark-theme][data-dsh-odeta] [class*='sectionHeader'] {
  color: #b9d2e8;
}

body[data-dsh-odeta] button[class*='newSession'] {
  min-height: 46px;
  color: #f4f8fb;
  border: 1px solid rgba(201, 177, 137, 0.55);
  border-radius: 23px;
  background: linear-gradient(145deg, #5a8fc0, #2f5a86);
  font-size: 15px;
  letter-spacing: 0.08em;
  box-shadow:
    inset 0 1px rgba(255, 255, 255, 0.24),
    0 6px 16px rgba(47, 90, 134, 0.3);
  transition: filter 150ms ease, transform 150ms ease;
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

@media (prefers-reduced-motion: reduce) {
  body[data-dsh-odeta] [data-odeta-chrome='snow-far'],
  body[data-dsh-odeta] [data-odeta-chrome='snow-near'] {
    animation: none;
    transition: none;
  }

  body[data-dsh-odeta] [data-odeta-chrome='portrait'] {
    transition: none;
  }
}
`
