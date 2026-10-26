/**
 * 奥黛塔 · 冰湖天鹅 —— 输入框右上角「小人」兜底素材（原创手绘 SVG，MIT）。
 *
 * **主形态是奥黛塔本人**（本机素材 assets-local/chibi.*，见 runtime.ts）；
 * 本文件是**没有本机素材时的回落**：一个原创小机器人，随插件以 MIT 分发。
 * 造型刻意不描摹角色，避免把角色美术混进可分发的代码里。
 *
 * 用**内联 SVG**（而非 data URI 背景图）挂载：这样 CSS 才能分别控制
 * 眼睛/徽记/天线等内部部件，做出 idle↔busy 的表情与动画。
 * SVG 字符串是编译期常量，不含任何用户输入，不产生远程请求（规范 A3/F1）。
 *
 * ── 几何约定（改图前务必先读） ────────────────────────────────
 * 视图 96×96，小人框为正方形（style.ts 里 84×84），SVG 等比铺满，
 * 所以 viewBox 的 y=96 就是小人框的底沿：
 *   - 头/脸/天线画在 y<62（在框内完整可见）；
 *   - 肩/身延伸到 y=96，被小人框的底沿干净切断（半身像效果）；
 *   - 小手画在 y≈88 → 搭在框底沿上，一半在身前一半被裁掉。
 * 改动 viewBox 高度或元素尺寸时，必须同步重算这些位置。
 *
 * 状态由外层 DOM 钩子驱动（data-odeta-mascot-state），本文件只出静态画：
 *  - idle  ：待机（默认，柔和椭圆眼）
 *  - busy  ：运行中（眼睛变成发光方块，徽记旋转、天线轻摆）
 */

/** 机身配色：冰蓝外壳 + 深蓝面罩 + 鎏金徽记。 */
export const ODETA_MASCOT_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96' class='odeta-mascot-svg'>
  <defs>
    <linearGradient id='odetaMascotShell' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#eaf4fc'/>
      <stop offset='.55' stop-color='#cfe4f5'/>
      <stop offset='1' stop-color='#a8c9e6'/>
    </linearGradient>
    <linearGradient id='odetaMascotVisor' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#2f5a86'/>
      <stop offset='1' stop-color='#1f3245'/>
    </linearGradient>
  </defs>

  <!-- 肩/身：延伸到 y=96，被小人框底沿切断（半身像） -->
  <path d='M4 96C4 78 24 62 48 62S92 78 92 96Z' fill='url(#odetaMascotShell)' stroke='#4a7fb5' stroke-width='2.4' stroke-linejoin='round'/>

  <!-- 天线：冰晶顶饰 + 根部与头顶 y=13 相连（不能留缝） -->
  <g class='odeta-mascot-antenna'>
    <path d='M48 8V13' stroke='#4a7fb5' stroke-width='2.4' stroke-linecap='round'/>
    <path d='M48 0 52.6 4 48 8 43.4 4Z' fill='#bcd6ee' stroke='#4a7fb5' stroke-width='1.4' stroke-linejoin='round'/>
  </g>

  <!-- 头 -->
  <rect x='18' y='13' width='60' height='44' rx='15' fill='url(#odetaMascotShell)' stroke='#4a7fb5' stroke-width='2.4'/>
  <rect x='26' y='19' width='44' height='27' rx='13.5' fill='url(#odetaMascotVisor)'/>

  <!-- 眼睛：idle 为柔和椭圆，busy 为发光方块 -->
  <g class='odeta-mascot-eyes-idle'>
    <ellipse cx='38' cy='32' rx='5.2' ry='6' fill='#f2f9ff'/>
    <ellipse cx='58' cy='32' rx='5.2' ry='6' fill='#f2f9ff'/>
  </g>
  <g class='odeta-mascot-eyes-busy'>
    <rect x='32.8' y='26.8' width='10.4' height='10.4' rx='3.2' fill='#9ff0ff'/>
    <rect x='52.8' y='26.8' width='10.4' height='10.4' rx='3.2' fill='#9ff0ff'/>
  </g>

  <!-- 额前鎏金徽记（运行中旋转）——位于面罩上方的额头，不与眼睛挤在一起 -->
  <g class='odeta-mascot-badge'>
    <path d='M48 14 51.6 18 48 22 44.4 18Z' fill='#c9b189' stroke='#a68d5f' stroke-width='1.3' stroke-linejoin='round'/>
    <path d='M48 15.7 50 18 48 20.3 46 18Z' fill='#f3f8fc'/>
  </g>

  <!-- 扒在框底沿的两只小手（中心 y=90，底部被框沿裁掉一半 → 搭在边沿上） -->
  <g class='odeta-mascot-hands'>
    <ellipse cx='17' cy='90' rx='9' ry='6' fill='#cfe4f5' stroke='#4a7fb5' stroke-width='2.2'/>
    <ellipse cx='79' cy='90' rx='9' ry='6' fill='#cfe4f5' stroke='#4a7fb5' stroke-width='2.2'/>
  </g>
</svg>`
