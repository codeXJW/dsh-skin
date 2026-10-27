/**
 * 深海女仆工坊（maid-atelier）—— 附加样式（输入框右上角的「DeepSeek 小机器人」）。
 *
 * 为什么单独一个文件：整包主样式 `css.generated.ts` 是
 * `scripts/extract-presets.mjs` 从上游 `.tmp-skins/dsh-deep-whale/` 提取的
 * **生成物**（规范 F3：生成物只由该脚本产出，不手改）。本机新增的装饰规则
 * 一律放这里，由 runtime 注入一个独立 `<style>` 标签，随 dispose 摘除。
 *
 * 规范（packs/GUIDELINES.md）：
 *  - A1 根作用域 body[data-dsh-maid-atelier]；亮/暗双套走
 *    body[data-ds-dark-theme]，JS 不做亮暗判断；
 *  - B1 应用容器（输入卡）只允许 position: relative（B3），绝不加
 *    transform / filter / backdrop-filter / contain / isolation / z-index；
 *  - B2 小人是皮肤自有节点（data-skin-chrome + data-skin-owner + aria-hidden），
 *    transform / filter 只作用在小人自己身上；
 *  - B4 小人 z-index 留在装饰层（1~20），永不 ≥40；
 *  - C1 忙闲态由 CSS 按 body[data-maid-mascot-state] 换图，JS 只投影状态钩子；
 *  - E1 亮/暗双套；E3 prefers-reduced-motion；E4 窄视口降级；
 *  - E5 pointer-events: none，绝不拦截输入框点击。
 */
export const MAID_ATELIER_EXTRA_CSS = /* css */ `
/* ── 输入框右上角「DeepSeek 小机器人」────────────────────────────────
   小人站在输入卡上沿：整个小人框向上平移一个框高，框底与卡片上沿齐平，
   于是"脚"正好落在卡片边沿上（参照 odeta 的趴边小人）。

   规范 B3：宿主 .GRgSLq_card 本身已是 position:relative，这里再钉一次，
   保证小人的 absolute 锚点始终是输入卡本身（不落到更外层的定位祖先上）。
   position:relative 不创建 fixed 包含块，不会把设置弹窗/审批面板挤歪。 */
body[data-dsh-maid-atelier] [data-composer-card] {
  position: relative;
}

body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'] {
  position: absolute;
  top: 0;
  right: 14px;
  z-index: 2;
  /* 素材 200x217（比例 0.9217）→ 框宽高等比，contain 完整放入不裁不切 */
  width: 92.17px;
  height: 100px;
  /* 框底与输入卡上沿齐平：整体上移一个框高 */
  margin-top: -100px;
  pointer-events: none;
  transform-origin: 50% 92%;
  animation: maid-mascot-breathe 3.8s ease-in-out infinite;
}

/* ── 形态一：DeepSeek 小机器人 Q 版全身像（本机素材 assets-local/mascot*.webp）──
   两张状态图都是整幅透明底全身像，contain 完整放进小人框、图底对齐框底，
   于是待机与运行中两种姿态都站在同一条输入卡上沿上。
   底沿用 mask 收掉最下一小截，让"脚"与卡片边沿柔和相接。 */
body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'][data-maid-mascot-art='image'] {
  overflow: hidden;
  background-image: var(--maid-mascot-art);
  background-repeat: no-repeat;
  background-position: 50% 100%;
  background-size: contain;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 97%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 97%, transparent 100%);
  filter: drop-shadow(0 4px 8px rgba(11, 25, 63, 0.26));
}

/* 运行中：换成"开心/响应中"姿态（规范 C1：切换由 CSS 按状态钩子决定） */
body[data-dsh-maid-atelier][data-maid-mascot-state='busy']
  [data-composer-card] > [data-skin-chrome='mascot'][data-maid-mascot-art='image'] {
  background-image: var(--maid-mascot-art-busy);
}

/* ── 形态二：原创鲸鱼剪影（无本机素材时的回落，MIT 可分发） ── */
body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'][data-maid-mascot-art='svg'] {
  overflow: hidden;
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 90%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 90%, transparent 100%);
}

body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-svg {
  display: block;
  width: 100%;
  height: 100%;
  overflow: hidden;
  filter: drop-shadow(0 3px 6px rgba(11, 25, 63, 0.24));
}

/* 待机时呆毛与尾鳍静置；运行中尾鳍轻摆、呆毛抖动。 */
body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-tail {
  transform-box: view-box;
  transform-origin: 62px 62px;
}

body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-ahoge {
  transform-box: view-box;
  transform-origin: 45px 46px;
}

body[data-dsh-maid-atelier][data-maid-mascot-state='busy']
  [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-tail {
  animation: maid-mascot-tail 1.5s ease-in-out infinite;
}

body[data-dsh-maid-atelier][data-maid-mascot-state='busy']
  [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-ahoge {
  animation: maid-mascot-ahoge 1.1s ease-in-out infinite;
}

/* 运行中：胸针描金更亮，并给一圈极淡的暖光提示"正在响应"。 */
body[data-dsh-maid-atelier][data-maid-mascot-state='busy']
  [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-brooch {
  fill: #f6e3b8;
}

body[data-dsh-maid-atelier][data-maid-mascot-state='busy']
  [data-composer-card] > [data-skin-chrome='mascot'][data-maid-mascot-art='svg'] {
  filter: drop-shadow(0 3px 6px rgba(11, 25, 63, 0.24)) drop-shadow(0 0 8px rgba(226, 207, 170, 0.55));
}

/* ── 暗色：投影更重、亮度压一点，避免白围裙在深底上刺眼（E1） ── */
body[data-ds-dark-theme][data-dsh-maid-atelier]
  [data-composer-card] > [data-skin-chrome='mascot'][data-maid-mascot-art='image'] {
  filter: brightness(0.94) saturate(0.97) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5));
}

body[data-ds-dark-theme][data-dsh-maid-atelier][data-maid-mascot-state='busy']
  [data-composer-card] > [data-skin-chrome='mascot'][data-maid-mascot-art='image'] {
  filter: brightness(0.94) saturate(0.97) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))
    drop-shadow(0 0 10px rgba(159, 200, 255, 0.55));
}

body[data-ds-dark-theme][data-dsh-maid-atelier]
  [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-svg {
  filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.45));
}

body[data-ds-dark-theme][data-dsh-maid-atelier][data-maid-mascot-state='busy']
  [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-svg {
  filter: drop-shadow(0 3px 7px rgba(0, 0, 0, 0.45)) drop-shadow(0 0 8px rgba(226, 207, 170, 0.5));
}

@keyframes maid-mascot-breathe {
  0%,
  100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-2px) rotate(-1deg);
  }
}

@keyframes maid-mascot-tail {
  0%,
  100% {
    transform: rotate(-3deg);
  }
  50% {
    transform: rotate(5deg);
  }
}

@keyframes maid-mascot-ahoge {
  0%,
  100% {
    transform: rotate(-4deg);
  }
  50% {
    transform: rotate(4deg);
  }
}

/* ── 窄视口降级（E4）：两档 ──
   ≤1080px：小人缩小并贴近右边，别压住输入区上方的正文；
   ≤700px：完全隐藏，窄屏优先保证输入区可用。 */
@media (max-width: 1080px) {
  body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'] {
    width: 73.74px;
    height: 80px;
    right: 8px;
    margin-top: -80px;
  }
}

@media (max-width: 700px) {
  body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'] {
    display: none;
  }
}

/* 降低动效偏好：停掉呼吸与部件动画（E3）。 */
@media (prefers-reduced-motion: reduce) {
  body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'],
  body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-tail,
  body[data-dsh-maid-atelier] [data-composer-card] > [data-skin-chrome='mascot'] .maid-mascot-ahoge {
    animation: none;
  }
}

/* ── 去掉 tab 栏下方那条贯穿整宽的金色横线 ─────────────────────────────
   生成样式（css.generated.ts）里：
     body[data-dsh-maid-atelier] header[class*='header'] {
       border-bottom-color: rgba(197, 164, 104, 0.28);
     }
   把整条 header（对话/轨迹 那排）底边染成金色，横贯整个窗口宽度，
   在深色背景上非常扎眼。这里改回与宿主一致的淡描边。

   选择器不加父级限定：这个 header 挂在会话区/主列内，但宿主结构会变，
   限定父级反而可能匹配不上（实测踩过）。body[data-dsh-maid-atelier]
   + header[class*='header'] 已足够定位，且特异性高于原规则。
   只动这一条边框；消息气泡的金边、标题栏的金色压边都保留原样。 */
body[data-dsh-maid-atelier] header[class*='header'] {
  border-bottom-color: rgba(71, 91, 145, 0.18);
}

body[data-dsh-maid-atelier][data-ds-dark-theme] header[class*='header'] {
  border-bottom-color: rgba(122, 146, 200, 0.2);
}

/* ══ 对比度修复：深色宫殿立绘 + 亮色 token 失配 ═══════════════════════
   根因：整包浅色系 token 按"瓷白面板"设计，但 hero 欢迎区 / 标题栏 /
   输入卡上方工具行直接坐在恒为深色的立绘上；data-ds-dark-theme 未开启
   时，深墨字 (--maid-ink #172347) 与透明底按钮压在深底上几乎不可见。
   以下规则不依赖昼夜开关，按区域恒配亮色，只补对比度、不改布局。 */

/* ── 框1：右上角窗口控制按钮（最小化/最大化/关闭）─────────────────────
   DSH 类名是 camelCase（如 xxxButton），生成 CSS 里那条
     [class*='titlebar'] [class*='button'] { color:#d9bd83 }
   因属性选择器默认大小写敏感而匹配不到它们，于是保留官方深色图标压在
   深蓝标题栏上。这里用大小写不敏感修饰符 [i] 补命中，并给金色。
   只作用于标题栏后代，不影响别处按钮。 */
body[data-dsh-maid-atelier] [class*='titlebar'] [class*='button' i] {
  color: #d9bd83;
}

body[data-dsh-maid-atelier] [class*='titlebar'] [class*='button' i]:hover {
  color: #f3e3c0;
  background: rgba(87, 117, 190, 0.28);
}

/* 图标若是 currentColor 填充会随上面 color 变金；显式填充的兜底一道。 */
body[data-dsh-maid-atelier] [class*='titlebar'] [class*='button' i] svg {
  color: inherit;
  fill: currentColor;
}

/* 新版 Windows 桌面端使用原生窗口按钮，不经过上面的网页 titlebar。
   preload 用 body 直属的隐藏 span 采样这两个 token，再同步给原生标题栏。
   采样节点没有语义属性，只能按其内联 token 定位；仅在该节点重定义变量，
   既能覆盖内联样式取值，也保留正文的深色字与其它皮肤的原生配色。 */
body[data-dsh-maid-atelier] > span[style*='--dsw-specific-sidebar-fill'][style*='--dsw-alias-label-primary'] {
  --dsw-specific-sidebar-fill: var(--maid-navy-950);
  --dsw-alias-label-primary: var(--maid-gold-soft);
}

/* 右侧面板的普通停靠层为 10；顶部饰带原来的 20 会盖住标签栏及其按钮。
   降低皮肤自有装饰层，保留宿主浮窗、菜单和全屏面板的既有层叠关系。 */
body[data-dsh-maid-atelier] [data-skin-chrome='top-trim'] {
  z-index: 9;
}

/* 侧栏按钮位于深蓝饰带上，单独配色，避免改动面板正文的浅色表面。 */
body[data-dsh-maid-atelier] :is([data-sidebar-right-mode], [data-sidebar-right-toggle]) {
  color: var(--maid-gold-soft);
  background: var(--maid-navy-950);
}

body[data-dsh-maid-atelier] :is([data-sidebar-right-mode], [data-sidebar-right-toggle]):hover {
  color: var(--maid-porcelain);
  background: var(--maid-navy-800);
}

body[data-dsh-maid-atelier] :is([data-sidebar-right-mode], [data-sidebar-right-toggle]):focus-visible {
  outline: 2px solid var(--maid-gold-soft);
  outline-offset: 2px;
}

/* ── 框2：hero 欢迎语「探索未至之境」+「预览版」徽章 ───────────────────
   恒用亮色方案（原亮色分支给的是深墨字，暗色分支只在 data-ds-dark-theme
   下才生效，于是亮色模式下深字压在深底上看不清）。 */
body[data-dsh-maid-atelier] [class*='headline'] {
  color: #f6eedf;
  text-shadow:
    0 1px 0 rgba(4, 11, 34, 0.9),
    0 3px 7px rgba(0, 0, 0, 0.8),
    0 0 18px rgba(255, 235, 190, 0.22);
}

body[data-dsh-maid-atelier] [data-phase='hero'] [class*='headlineText'] {
  color: #fffaf0;
}

body[data-dsh-maid-atelier] [data-phase='hero'] [class*='previewBadge'] {
  color: #f0dfba;
  border-color: rgba(226, 207, 170, 0.58);
  background: rgba(7, 18, 52, 0.58);
  box-shadow: 0 2px 7px rgba(0, 0, 0, 0.28);
}

/* ── 框3：输入卡上方工具行的「标准模式」下拉 ───────────────────────────
   生成样式只覆盖了输入卡内部的 modes 触发器（hero 态甚至把 label 藏成
   42px 圆钮），这个在卡外的实例被漏掉，保留官方透明底 + 深色字。给它
   与相邻工作区 chip 同款的瓷白胶囊 + 深蓝字；:not() 排除卡内实例，
   避免破坏卡内圆钮设计。 */
body[data-dsh-maid-atelier]
  :is([class*='modes'] button[class*='trigger'], [class*='modes'] [role='button'])
  :not([data-composer-card] *) {
  color: #314979;
  border: 1px solid rgba(197, 164, 104, 0.45);
  background: rgba(255, 253, 248, 0.62);
  box-shadow: 0 2px 8px rgba(30, 48, 92, 0.18);
}

body[data-dsh-maid-atelier]
  [class*='modes'] :is([class*='triggerLabel'], [class*='chevron'], [class*='triggerIcon'], svg)
  :not([data-composer-card] *) {
  color: #314979;
}
`
