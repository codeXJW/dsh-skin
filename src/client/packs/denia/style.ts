import { DENIA_ART } from './art'

/* 沿用上游亮暗色板，通过 CSS 响应宿主主题。 */
export const DENIA_CSS = `
body[data-dsh-denia] {
  color: #5D3A8E;
  --denia-rose: #D4859E;
  --denia-shadow: 0 18px 54px rgba(45,27,78,0.12),0 2px 8px rgba(45,27,78,0.08);
  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: rgba(253,245,248,0.88);
  --dsw-alias-bg-layer-2: rgba(245,234,246,0.92);
  --dsw-alias-bg-layer-3: rgba(237,224,242,0.95);
  --dsw-alias-bg-overlay: rgba(253,245,248,0.98);
  --dsw-alias-border-l1: rgba(155,107,216,0.18);
  --dsw-alias-border-l2-darkmode-thin: rgba(155,107,216,0.25);
  --dsw-alias-border-l2: rgba(155,107,216,0.3);
  --dsw-alias-border-l3: rgba(197,164,104,0.64);
  --dsw-alias-brand-primary: #D4859E;
  --dsw-alias-brand-text: #2D1B4E;
  --dsw-alias-button-elevated-fill: rgba(255,252,250,0.88);
  --dsw-alias-button-floating-fill: rgba(255,252,250,0.94);
  --dsw-alias-button-floating-hover: #F5EAE8;
  --dsw-alias-button-info-fill: #9B6BD8;
  --dsw-alias-button-info-hover: #7B4DBE;
  --dsw-alias-interactive-bg-active: rgba(197,164,108,0.24);
  --dsw-alias-interactive-bg-hover: rgba(212,133,158,0.12);
  --dsw-alias-interactive-bg-hover-solid: #F0E0F5;
  --dsw-alias-label-primary: #5D3A8E;
  --dsw-alias-label-primary-bluish: #4A5E9E;
  --dsw-alias-label-secondary: #7B68A8;
  --dsw-alias-label-tertiary: #7F6C99;
  --dsw-alias-label-caption: #8A84AA;
  --dsw-alias-state-business-primary: #9B6BD8;
  --dsw-alias-state-business-tertiary: #E8DEF5;
  --dsw-shadow-lv2: var(--denia-shadow);
  --dsw-specific-input-major: rgba(255,252,250,0.82);
  --dsw-specific-selector: rgba(240,224,245,0.9);
  --dsw-specific-sidebar-fill: rgba(248,240,245,0.88);
  --denia-backdrop: #f5eaf6;
  --denia-wash: linear-gradient(#fdf5f8b4, #f5eaf67a);
  --denia-heading-end: #7949b4;
  --denia-bubble-edge: #fff7;
  --denia-bubble-shine: #fffb;
  --denia-swag: url("${DENIA_ART.swag}");
  --denia-scene: url("${DENIA_ART.light.scene}");
  --denia-portrait-left: url("${DENIA_ART.light.left}");
  --denia-portrait-right: url("${DENIA_ART.light.right}");
  --denia-mascot: url("${DENIA_ART.light.mascot}");
  --denia-mascot-still: url("${DENIA_ART.light.still}");
  --denia-chain: url("${DENIA_ART.light.chain}");
}

body[data-dsh-denia][data-ds-dark-theme] {
  color: #F5D5E8;
  --denia-shadow: 0 18px 58px rgba(0,0,0,0.38),0 2px 10px rgba(0,0,0,0.3);
  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: rgba(26,15,46,0.88);
  --dsw-alias-bg-layer-2: rgba(31,18,48,0.92);
  --dsw-alias-bg-layer-3: rgba(40,22,64,0.95);
  --dsw-alias-bg-overlay: rgba(13,8,32,0.98);
  --dsw-alias-border-l1: rgba(180,154,232,0.2);
  --dsw-alias-border-l2-darkmode-thin: rgba(180,154,232,0.3);
  --dsw-alias-border-l2: rgba(180,154,232,0.34);
  --dsw-alias-border-l3: rgba(211,180,119,0.66);
  --dsw-alias-brand-primary: #B49AE8;
  --dsw-alias-brand-text: #F5D5E8;
  --dsw-alias-button-elevated-fill: rgba(26,15,46,0.88);
  --dsw-alias-button-floating-fill: rgba(31,18,48,0.94);
  --dsw-alias-button-floating-hover: #281640;
  --dsw-alias-button-info-fill: #7B4DBE;
  --dsw-alias-button-info-hover: #6B3DAE;
  --dsw-alias-interactive-bg-active: rgba(197,164,108,0.24);
  --dsw-alias-interactive-bg-hover: rgba(180,154,232,0.12);
  --dsw-alias-interactive-bg-hover-solid: #281640;
  --dsw-alias-label-primary: #F5D5E8;
  --dsw-alias-label-primary-bluish: #D5D0F5;
  --dsw-alias-label-secondary: #C8A8D8;
  --dsw-alias-label-tertiary: #B89AC8;
  --dsw-alias-label-caption: #A88AB8;
  --dsw-alias-state-business-primary: #B49AE8;
  --dsw-alias-state-business-tertiary: #281640;
  --dsw-specific-input-major: rgba(26,15,46,0.82);
  --dsw-specific-selector: rgba(40,22,64,0.9);
  --dsw-specific-sidebar-fill: rgba(13,8,32,0.88);
  --denia-backdrop: #0d0820;
  --denia-wash: linear-gradient(#0d08208c, #1f12305a);
  --denia-heading-end: #d0adff;
  --denia-bubble-edge: #b49ae839;
  --denia-bubble-shine: #d5d0f569;
  --denia-scene: url("${DENIA_ART.dark.scene}");
  --denia-portrait-left: url("${DENIA_ART.dark.left}");
  --denia-portrait-right: url("${DENIA_ART.dark.right}");
  --denia-mascot: url("${DENIA_ART.dark.mascot}");
  --denia-mascot-still: url("${DENIA_ART.dark.still}");
  --denia-chain: url("${DENIA_ART.dark.chain}");
}

/* 应用容器只提供定位基准。背景、粒子和立绘都有独立的装饰节点。 */
body[data-dsh-denia] :is([data-pane='conversation'], [class$='_centerCol'], [data-pane='sidebar'], [class$='_sidebarCol']) {
  position: relative;
}

body[data-dsh-denia] [data-skin-owner='denia'][data-skin-chrome] {
  pointer-events: none;
}

body[data-dsh-denia] [data-skin-chrome='denia:stage'] {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: var(--denia-wash), var(--denia-scene) center / cover no-repeat var(--denia-backdrop);
  animation: denia-scene-light 480ms ease-out;
}

body[data-dsh-denia][data-ds-dark-theme] [data-skin-chrome='denia:stage'] {
  animation-name: denia-scene-dark;
}

@keyframes denia-scene-light {
  from { opacity: .65; }
}

@keyframes denia-scene-dark {
  from { opacity: .55; }
}

body[data-dsh-denia] :is([data-skin-chrome='denia:portrait-left'], [data-skin-chrome='denia:portrait-right']) {
  position: absolute;
  inset-block-end: 0;
  inline-size: min(24vw, 34%);
  background-repeat: no-repeat;
  background-size: contain;
}

body[data-dsh-denia] [data-skin-chrome='denia:portrait-left'] {
  inset-inline-start: 8px;
  block-size: min(47vh, 62%);
  background-image: var(--denia-portrait-left);
  background-position: left bottom;
}

body[data-dsh-denia] [data-skin-chrome='denia:portrait-right'] {
  inset-inline-end: 0;
  block-size: min(58vh, 72%);
  background-image: var(--denia-portrait-right);
  background-position: right bottom;
}

body[data-dsh-denia] [data-skin-chrome='denia:mascot'] {
  position: absolute;
  inset-inline-start: clamp(22px, 6vw, 104px);
  inset-block-end: min(50vh, 64%);
  inline-size: clamp(66px, 9vw, 132px);
  aspect-ratio: 1;
  background: var(--denia-mascot) center / contain no-repeat;
}

/* 原生侧栏宽度变化时，链条跟随边缘，展开抽屉仍可使用。 */
body[data-dsh-denia] [data-skin-chrome='denia:chain'] {
  position: absolute;
  inset: 0 0 0 auto;
  inline-size: 6px;
  background: var(--denia-chain) center top / 6px auto repeat-y;
  z-index: 1;
}

body[data-dsh-denia] [data-sidebar-collapsed] [data-skin-chrome='denia:chain'] {
  display: none;
}

body[data-dsh-denia] [data-skin-chrome='denia:swag'] {
  block-size: min(48px, 7vh);
  margin-inline: 8px;
  background: var(--denia-swag) center / contain no-repeat;
}

body[data-dsh-denia] [data-sidebar-collapsed] [data-skin-chrome='denia:swag'] {
  display: none;
}

body[data-dsh-denia] [data-skin-chrome='denia:welcome'] {
  display: grid;
  justify-items: center;
  gap: 3px;
  margin-block-end: clamp(14px, 4vh, 40px);
  text-align: center;
  color: var(--dsw-alias-label-secondary);
  font-size: 13px;
}

body[data-dsh-denia] [data-skin-chrome='denia:welcome'] strong {
  font-size: clamp(21px, 3vw, 34px);
  background: linear-gradient(135deg, var(--denia-rose), var(--denia-heading-end));
  background-clip: text;
  color: transparent;
}

body[data-dsh-denia] :is([data-phase='active'], [data-content-phase='active']) [data-skin-chrome='denia:welcome'] {
  display: none;
}

body[data-dsh-denia] [data-skin-chrome='denia:welcome'] em {
  margin-block-start: 5px;
}

body[data-dsh-denia] [data-skin-chrome='denia:bubbles'] {
  position: absolute;
  inset: 0;
}

body[data-dsh-denia] [data-skin-chrome='denia:bubble'] {
  position: absolute;
  inset-inline-start: var(--denia-bubble-x);
  inset-block-end: calc(0px - var(--denia-bubble-size));
  inline-size: var(--denia-bubble-size);
  aspect-ratio: 1;
  border: 1px solid var(--denia-bubble-edge);
  border-radius: 50%;
  corner-shape: round;
  background: radial-gradient(circle at 28% 23%, var(--denia-bubble-shine), transparent 26%),
    conic-gradient(from 200deg, #a0c4e84c, #e8a5bf44, #9b6bd84f, #a0c4e84c);
  animation: denia-bubble-rise var(--denia-bubble-period) var(--denia-bubble-delay) linear infinite;
}

@keyframes denia-bubble-rise {
  0% { translate: 0 0; scale: .45; opacity: 0; }
  20% { opacity: .65; }
  65% { translate: 12px -67vh; scale: .9; opacity: .4; }
  100% { translate: -6px -112vh; scale: 1.1; opacity: 0; }
}

/* 复用宿主令牌给侧栏选中态、输入框与设置面板着色，保留尺寸与交互。 */
body[data-dsh-denia] [role='treeitem'][aria-selected='true'] {
  background: linear-gradient(90deg, var(--dsw-alias-interactive-bg-active), var(--dsw-alias-interactive-bg-hover));
}

body[data-dsh-denia] [data-composer-card] {
  box-shadow: var(--denia-shadow), inset 0 0 0 1px var(--dsw-alias-border-l1);
}

body[data-dsh-denia] [data-composer-card]:focus-within {
  box-shadow: var(--denia-shadow), inset 0 0 0 1px var(--dsw-alias-state-business-primary);
}

body[data-dsh-denia] [role='dialog'][data-shortcut-modal='settings'] {
  background-color: var(--dsw-alias-bg-overlay);
}

@media (max-width: 1000px) {
  body[data-dsh-denia] :is([data-skin-chrome='denia:portrait-left'], [data-skin-chrome='denia:portrait-right']) { opacity: .44; }
  body[data-dsh-denia] [data-skin-chrome='denia:mascot'] { opacity: .65; }
}

@media (max-width: 700px), (max-height: 440px) {
  body[data-dsh-denia] :is([data-skin-chrome='denia:portrait-left'], [data-skin-chrome='denia:portrait-right'], [data-skin-chrome='denia:mascot']) { display: none; }
  body[data-dsh-denia] [data-skin-chrome='denia:welcome'] { margin-block-end: 10px; }
}

@media (prefers-reduced-motion: reduce) {
  body[data-dsh-denia] [data-skin-chrome='denia:stage'] { animation: none; }
  body[data-dsh-denia] [data-skin-chrome='denia:bubbles'] { display: none; }
  body[data-dsh-denia] [data-skin-chrome='denia:mascot'] { background-image: var(--denia-mascot-still); }
}
`
