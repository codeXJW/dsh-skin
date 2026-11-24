import { DWN_ASSETS } from './art'

/* 沿用上游昼夜色板，并为新版的场景、面板和装饰指定各自的素材。 */
export const DWN_CSS = `
body[data-dsh-dwn] {
  color: #172347;
  --maid-shadow: 0 18px 54px #0f1e4833, 0 2px 8px #0f1e481f;
  --maid-component-surface-muted: #e1f1fcd6;
  --maid-component-ink: #18345d;
  --maid-component-edge: #be974dad;
  --maid-component-edge-soft: #6897c975;
  --maid-component-focus-outer: #356ca8;
  --maid-component-shadow: 0 12px 30px #3d6d9e26, inset 0 1px #ffffffe0;
  --maid-selected-session-fill: linear-gradient(90deg, #e2f3ffa8, #f6fbff85);
  --maid-assistant-fill: linear-gradient(145deg, #fdfefff7, #e8f4fdf0);
  --maid-user-fill: linear-gradient(145deg, #dbeefdf7, #eff7fff2);
  --maid-overlay-fill: linear-gradient(145deg, #fdfefffc, #e8f4fdfa);
  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: #f8faffb8;
  --dsw-alias-bg-layer-2: #ebf0fad6;
  --dsw-alias-bg-layer-3: #e0e7f6e0;
  --dsw-alias-bg-overlay: #f8fafff5;
  --dsw-alias-border-l1: #475b912e;
  --dsw-alias-border-l2-darkmode-thin: #475b9140;
  --dsw-alias-border-l2: #475b914d;
  --dsw-alias-border-l3: #c5a468a3;
  --dsw-alias-brand-primary: #526aa8;
  --dsw-alias-brand-text: #172347;
  --dsw-alias-button-elevated-fill: #fffdf8e0;
  --dsw-alias-button-floating-fill: #fffdf8f0;
  --dsw-alias-button-floating-hover: #ece6d8;
  --dsw-alias-button-info-fill: #536eae;
  --dsw-alias-button-info-hover: #405a99;
  --dsw-alias-interactive-bg-active: #c5a4683d;
  --dsw-alias-interactive-bg-hover: #677eb71f;
  --dsw-alias-interactive-bg-hover-solid: #e2e8f5;
  --dsw-alias-label-primary: #172347;
  --dsw-alias-label-primary-bluish: #243866;
  --dsw-alias-label-secondary: #4d5d7f;
  --dsw-alias-label-tertiary: #6f7c99;
  --dsw-alias-label-caption: #8a94aa;
  --dsw-alias-state-business-primary: #536eae;
  --dsw-alias-state-business-tertiary: #e1e7f5;
  --dsw-shadow-lv2: var(--maid-shadow);
  --dsw-specific-input-major: #fffdf8d1;
  --dsw-specific-selector: #e2e8f6e6;
  --dsw-specific-sidebar-fill: #f1f8fff2;
  --dwn-scene: url("${DWN_ASSETS.DEEP_WHALE_DAY_SCENE}");
  --dwn-companion: url("${DWN_ASSETS.DEEP_WHALE_DAY_COMPANION}");
  --dwn-ribbon: url("${DWN_ASSETS.DEEP_WHALE_DAY_SOFT_NEW_SESSION}");
  --dwn-swag: url("${DWN_ASSETS.DEEP_WHALE_DAY_SOFT_BOTTOM_TRIM}");
  --dwn-corner: url("${DWN_ASSETS.DEEP_WHALE_DAY_SOFT_SIDEBAR_CORNER}");
  --dwn-composer-frame: url("${DWN_ASSETS.DEEP_WHALE_DAY_CONTENT_FRAME}");
  --dwn-message-frame: url("${DWN_ASSETS.DEEP_WHALE_DAY_SOFT_CONTENT_FRAME}");
  --dwn-crown: url("${DWN_ASSETS.DEEP_WHALE_DAY_COMPOSER_RAIL}");
  --dwn-composer-fill: linear-gradient(180deg, #f9fcffeb, #eaf5fde0);
  --dwn-header-fill: linear-gradient(90deg, #edf6fbbd, #e4f1fc91);
  --dwn-ribbon-ink: #18345d;
  --dwn-crown-ratio: 1440 / 340;
  --dwn-scene-base: #dce6f5;
}


body[data-dsh-dwn][data-ds-dark-theme] {
  color: #e5eaf6;
  --maid-shadow: 0 18px 58px #00000061, 0 2px 10px #0000004d;
  --maid-component-surface-muted: #182d5bdb;
  --maid-component-ink: #f3eddf;
  --maid-component-edge: #d3b477b8;
  --maid-component-edge-soft: #6489cf94;
  --maid-component-focus-outer: #e4c884;
  --maid-component-shadow: 0 14px 34px #00000057, inset 0 1px #ffffff14;
  --maid-selected-session-fill: linear-gradient(90deg, #3e5ba694, #18316f7a);
  --maid-assistant-fill: linear-gradient(145deg, #132650f5, #091739f2);
  --maid-user-fill: linear-gradient(145deg, #274384f7, #142a5cf5);
  --maid-overlay-fill: linear-gradient(145deg, #122652fc, #061231fc);
  --dsw-alias-bg-base: transparent;
  --dsw-alias-bg-layer-1: #121f43e6;
  --dsw-alias-bg-layer-2: #182850eb;
  --dsw-alias-bg-layer-3: #20315bf0;
  --dsw-alias-bg-overlay: #0d193bf7;
  --dsw-alias-border-l1: #97a9d833;
  --dsw-alias-border-l2-darkmode-thin: #97a9d84d;
  --dsw-alias-border-l2: #97a9d857;
  --dsw-alias-border-l3: #d3b477a8;
  --dsw-alias-brand-primary: #9bb0e1;
  --dsw-alias-brand-text: #e7ecf7;
  --dsw-alias-button-elevated-fill: #1c2c54f0;
  --dsw-alias-button-floating-fill: #1f315cf5;
  --dsw-alias-button-floating-hover: #354d88;
  --dsw-alias-button-info-fill: #8ca4dc;
  --dsw-alias-button-info-hover: #a3b7e5;
  --dsw-alias-interactive-bg-active: #d3b4773d;
  --dsw-alias-interactive-bg-hover: #a4b7e524;
  --dsw-alias-interactive-bg-hover-solid: #293f78;
  --dsw-alias-label-primary: #e7ecf7;
  --dsw-alias-label-primary-bluish: #d5dff3;
  --dsw-alias-label-secondary: #bdc9e3;
  --dsw-alias-label-tertiary: #96a6c9;
  --dsw-alias-label-caption: #7f90b4;
  --dsw-alias-state-business-primary: #9bb0e1;
  --dsw-alias-state-business-tertiary: #293d73;
  --dsw-specific-input-major: #111e42e0;
  --dsw-specific-selector: #2d406fe6;
  --dsw-specific-sidebar-fill: #050d28e6;
  --dwn-scene: url("${DWN_ASSETS.DEEP_WHALE_NIGHT_SCENE}");
  --dwn-companion: url("${DWN_ASSETS.DEEP_WHALE_NIGHT_COMPANION}");
  --dwn-ribbon: url("${DWN_ASSETS.DEEP_WHALE_NIGHT_SOFT_NEW_SESSION}");
  --dwn-swag: url("${DWN_ASSETS.DEEP_WHALE_NIGHT_SOFT_BOTTOM_TRIM}");
  --dwn-corner: url("${DWN_ASSETS.DEEP_WHALE_NIGHT_SOFT_SIDEBAR_CORNER}");
  --dwn-composer-frame: url("${DWN_ASSETS.DEEP_WHALE_NIGHT_CONTENT_FRAME}");
  --dwn-message-frame: url("${DWN_ASSETS.DEEP_WHALE_NIGHT_SOFT_CONTENT_FRAME}");
  --dwn-crown: url("${DWN_ASSETS.DEEP_WHALE_NIGHT_COMPOSER_RAIL}");
  --dwn-composer-fill: linear-gradient(180deg, #17274bef, #0c193cf5);
  --dwn-header-fill: linear-gradient(90deg, #0b1536de, #0b1737ae);
  --dwn-ribbon-ink: #f3eddf;
  --dwn-crown-ratio: 1440 / 410;
  --dwn-scene-base: #080f27;
}

/* Windows 的窗口底色同时用于整个 frame。把场景绘制在内容列，保留标题栏与侧栏底色。 */
body[data-dsh-dwn] :is([data-pane='conversation'], [class$='_centerCol']) {
  background: var(--dwn-scene) left center / cover no-repeat var(--dwn-scene-base);
}

body[data-dsh-dwn] :is([data-pane='sidebar'], [class$='_sidebarCol']) {
  box-shadow: inset -1px 0 var(--maid-component-edge-soft);
}

body[data-dsh-dwn] :is([data-pane='sidebar'], [class$='_sidebarCol']) :where([class$='_logoRow'], [class$='_footArea']) {
  position: relative;
}

/* 品牌和新会话沿用原生图标，角饰只在背景绘制。 */
body[data-dsh-dwn] :is([data-pane='sidebar'], [class$='_sidebarCol']):not([inert]) :where([class$='_logoRow']):has([class$='_brandIdentity']) {
  background: var(--dwn-corner) right center / auto 100% no-repeat, var(--maid-assistant-fill);
  border-radius: 12px;
  box-shadow: inset 0 0 0 1px var(--maid-component-edge-soft);
}

body[data-dsh-dwn] :is([data-pane='sidebar'], [class$='_sidebarCol']) button[class$='_newSession']:has([class*='_newSessionLabel']),
body[data-dsh-dwn] [class$='_settingsArea'] button[class$='_trigger']:is([data-collapsed='false'], :has([data-slot='settings.trigger'])) {
  background: var(--dwn-ribbon) center / 100% 100% no-repeat;
  color: var(--dwn-ribbon-ink);
  box-shadow: none;
}

body[data-dsh-dwn] :is([data-pane='sidebar'], [class$='_sidebarCol']) button[class$='_newSession']:has([class*='_newSessionLabel']) {
  justify-content: center;
  min-height: 50px;
  border: 0;
  border-radius: 12px;
}

body[data-dsh-dwn] [class$='_settingsArea'] button[class$='_trigger']:is([data-collapsed='false'], :has([data-slot='settings.trigger'])) {
  min-height: 44px;
  padding-inline: 20px;
}

body[data-dsh-dwn] :is([data-pane='sidebar'], [class$='_sidebarCol']) button[class$='_newSession']:has([class*='_newSessionLabel']):hover,
body[data-dsh-dwn] [class$='_settingsArea'] button[class$='_trigger']:is([data-collapsed='false'], :has([data-slot='settings.trigger'])):hover {
  filter: brightness(1.08);
}

/* 工作区飘带只拉伸中段，两端饰纹限制在行边缘，避开标题和右侧操作。 */
body[data-dsh-dwn] :is([data-pane='sidebar'], [class$='_sidebarCol']) [role='treeitem'][aria-expanded='true'] {
  min-height: 32px;
  padding-inline-start: max(16px, var(--dsh-sidebar-row-padding, 12px));
  color: var(--dwn-ribbon-ink);
  border-image: var(--dwn-ribbon) 0 280 fill / 0 7px 0 16px stretch;
}

body[data-dsh-dwn] [role='treeitem'][aria-expanded='true'] [class$='_rowActions'] {
  --dsw-alias-label-tertiary: var(--dwn-ribbon-ink);
}

body[data-dsh-dwn] :is([data-pane='sidebar'], [class$='_sidebarCol']) [role='treeitem'][aria-selected='true'] {
  background: var(--maid-selected-session-fill);
  box-shadow: inset 0 0 0 1px var(--maid-component-edge-soft);
}

/* 独立的底部区域给伙伴留出空间，工作区列表仍在原滚动区内。 */
body[data-dsh-dwn] [data-skin-chrome='dwn:sidebar-companion'] {
  --dwn-swag-height: 24px;
  flex: none;
  block-size: min(27vh, 244px);
  margin: 4px 0 6px;
  pointer-events: none;
  background:
    var(--dwn-companion) center bottom / contain no-repeat content-box,
    var(--dwn-swag) center bottom / 100% var(--dwn-swag-height) no-repeat border-box;
  box-sizing: border-box;
  padding-block-end: var(--dwn-swag-height);
}

body[data-dsh-dwn] [class$='_sidebarCol'] [class*='_collapsed'] [data-skin-chrome='dwn:sidebar-companion'] {
  display: none;
}

/* 新版会话头用薄玻璃底，保留原生标题、页签和操作布局。 */
body[data-dsh-dwn] [data-phase='active'] [class$='_header']:has([class$='_titleRow']) {
  background: var(--dwn-header-fill);
  border-bottom-color: var(--maid-component-edge-soft);
}

/* 设置浮层使用独立的高不透明度底，降低场景对表单阅读的干扰。 */
body[data-dsh-dwn] [role='dialog'][data-shortcut-modal='settings'] {
  background: var(--maid-overlay-fill);
}

body[data-dsh-dwn] :where([data-phase='hero'], [data-content-phase='hero']) [class$='_headline']:has(> [class$='_fishHitbox']) {
  flex-direction: column;
  gap: 10px;
  inline-size: min(100%, 520px);
  margin-inline: auto;
  color: var(--maid-component-ink);
  background: linear-gradient(90deg, transparent, var(--maid-component-edge) 23% 77%, transparent) center 26px / 100% 1px no-repeat;
  font-family: Georgia, 'Songti SC', SimSun, serif;
  text-align: center;
  text-shadow: 0 1px 6px var(--dwn-scene-base);
}

body[data-dsh-dwn] [class$='_headline'] > [class$='_fishHitbox'] {
  display: grid;
  place-items: center;
  inline-size: 54px;
  block-size: 54px;
  border: 1px solid var(--maid-component-edge);
  border-radius: 50%;
  background: var(--maid-assistant-fill);
  box-shadow: var(--maid-component-shadow);
}

body[data-dsh-dwn] [class$='_heroWorkspaceRow'] button {
  color: var(--maid-component-ink);
  background-color: var(--maid-component-surface-muted);
  border-radius: 999px;
}

body[data-dsh-dwn] [data-composer-card] {
  --dwn-card-frame: var(--dwn-composer-frame);
  --dwn-frame-outset: -14px -7px -16px;
  --dwn-composer-clearance: 26px;
  /* 仅为顶饰留出安全区，两种场景继续使用各自的原生高度和自动增高。 */
  padding-block-start: var(--dwn-composer-clearance);
  background: var(--dwn-composer-fill);
  border-radius: 18px;
  box-shadow: var(--maid-component-shadow);
}

body[data-dsh-dwn] [data-composer-card]:focus-within {
  box-shadow: var(--maid-component-shadow), 0 0 0 1px var(--maid-component-focus-outer);
}

/* 九宫格保留角饰大小，长消息与编辑器增高时只延伸边线。 */
body[data-dsh-dwn] :is([data-composer-card],
  [data-chat-flow-kind='assistant-step']:not([data-chat-group-part='reasoning']) [class$='_root'] > [class$='_body']:not(:empty))::before {
  content: '';
  position: absolute;
  inset: var(--dwn-frame-outset);
  border: solid transparent;
  border-width: 20px 24px;
  border-image: var(--dwn-card-frame) 150 190 stretch;
  pointer-events: none;
}

body[data-dsh-dwn] [data-skin-chrome='dwn:composer-crown'] {
  --dwn-crown-rise: 50%;
  position: absolute;
  inset: 0 auto auto 50%;
  width: min(62%, 420px);
  aspect-ratio: var(--dwn-crown-ratio);
  translate: -50% calc(0% - var(--dwn-crown-rise));
  background: var(--dwn-crown) center / contain no-repeat;
  /* 淡出越过安全区的尾部，窄窗口和换行时也不会盖住正文。 */
  mask-image: linear-gradient(to bottom,
    #000 calc(var(--dwn-crown-rise) + var(--dwn-composer-clearance) - 7px),
    transparent calc(var(--dwn-crown-rise) + var(--dwn-composer-clearance)));
  pointer-events: none;
}

body[data-dsh-dwn] :is([data-phase='active'], [data-content-phase='active']) [data-skin-chrome='dwn:composer-crown'] {
  --dwn-crown-rise: 56%;
  width: min(52%, 360px);
}

body[data-dsh-dwn] [data-chat-flow-kind='assistant-step']:not([data-chat-group-part='reasoning']) [class$='_root'] > [class$='_body']:not(:empty) {
  --dwn-card-frame: var(--dwn-message-frame);
  --dwn-frame-outset: -9px -7px -11px;
  position: relative;
  padding: 14px 18px;
  border-radius: 16px;
  background: var(--maid-assistant-fill);
  box-shadow: var(--maid-component-shadow);
}

body[data-dsh-dwn] [data-message-bubble] {
  background: var(--maid-user-fill);
  color: var(--maid-component-ink);
  border-radius: 16px 16px 6px 16px;
  box-shadow: inset 0 0 0 1px var(--maid-component-edge-soft), var(--maid-component-shadow);
}

body[data-dsh-dwn] [data-variant='think'] button[class$='_row'] {
  background-color: var(--maid-component-surface-muted);
  border-radius: 8px;
}

@media (max-height: 650px) {
  body[data-dsh-dwn] [data-skin-chrome='dwn:sidebar-companion'] { block-size: min(20vh, 144px); }
}

@media (max-height: 440px), (max-width: 700px) {
  body[data-dsh-dwn] [data-skin-chrome='dwn:sidebar-companion'] { display: none; }
  body[data-dsh-dwn] [data-composer-card] [data-skin-chrome='dwn:composer-crown'] { width: min(46%, 250px); }
  body[data-dsh-dwn] :is([data-pane='conversation'], [class$='_centerCol']) { background-position: 24% center; }
  body[data-dsh-dwn] [data-composer-card] { --dwn-composer-clearance: 20px; }
}
`
