/**
 * 深海女仆工坊 —— 输入框右上角「DeepSeek 小机器人」的兜底素材（原创手绘 SVG，MIT）。
 *
 * **主形态是 DeepSeek 小机器人本人**（本机素材 assets-local/mascot*.webp，
 * 见 local-art.generated.ts 与 runtime.ts）；本文件是**没有本机素材时的回落**：
 * 一只原创的「蓝鲸 + 呆毛」小人，随插件以 MIT 分发，保证其它机器 clone
 * 后输入框右上角仍然站着一个小人（规范 F1：素材全部内联，不远程加载）。
 *
 * 造型刻意只画**鲸鱼 + 呆毛**，不画人脸：手绘人脸在这么小的尺寸下
 * 远不如原素材耐看，画不好反而拉低整包皮肤的观感。呆毛是「DeepSeek 小机器人」
 * 的标志性特征，保留它就能让人一眼认出这是同一只小机器人；鲸鱼则是
 * 深海女仆工坊的核心母题（女仆围裙上的蓝鲸徽记、侧栏与饰带都有它）。
 *
 * 用**内联 SVG**（而非 data URI 背景图）挂载：这样 CSS 才能分别控制
 * 呆毛/尾鳍等内部部件，做出 idle↔busy 的轻微动画。
 * SVG 字符串是编译期常量，不含任何用户输入，不产生远程请求（规范 A3/F1）。
 *
 * ── 几何约定（改图前务必先读） ────────────────────────────────
 * 视图 92×100，与位图形态的小人框同尺寸同比例（素材 200×217，比例 0.9217）：
 *   - 鲸身画在 y≈46~106，**下缘被小人框底沿裁掉**（半身探出输入卡上沿的观感）；
 *   - 尾鳍伸到 x≈90（右侧留 2px 余量，不裁切）；
 *   - 呆毛从 y≈25 翘起，是这只小机器人的标志；
 *   - 框底沿由 CSS 的 mask 渐隐收尾。
 * 改动 viewBox 高度或元素尺寸时，必须同步 style.ts 里的小人框宽高。
 *
 * 状态由外层 DOM 钩子驱动（body[data-maid-mascot-state]），本文件只出静态画：
 *  - idle  ：待机（默认）
 *  - busy  ：运行中（尾鳍轻摆 + 呆毛抖动 + 描金更亮）
 */

/** 机身配色：深海女仆工坊同款深蓝 + 描金 + 瓷白。 */
export const MAID_MASCOT_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 92 100' class='maid-mascot-svg'>
  <defs>
    <linearGradient id='maidMascotBody' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#3a5ea8'/>
      <stop offset='1' stop-color='#16295c'/>
    </linearGradient>
    <linearGradient id='maidMascotFin' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#2a4586'/>
      <stop offset='1' stop-color='#0f1d47'/>
    </linearGradient>
    <clipPath id='maidMascotBellyClip'>
      <ellipse cx='40' cy='76' rx='34' ry='30'/>
    </clipPath>
  </defs>

  <!-- 呆毛：DeepSeek 小机器人的标志性特征 -->
  <g class='maid-mascot-ahoge'>
    <path d='M50 48c-2-11 2-19 10-23-2 7 0 13 5 16'
      fill='none' stroke='#c5a468' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/>
  </g>

  <!-- 尾鳍（运行中轻摆） -->
  <g class='maid-mascot-tail'>
    <path d='M70 60c8-7 14-15 18-24 2 12-2 22-10 29 9 3 15 10 17 19-11 0-21-6-26-15z'
      fill='url(#maidMascotFin)' stroke='#c5a468' stroke-width='2' stroke-linejoin='round'/>
  </g>

  <!-- 背鳍 -->
  <path d='M17 57c2-11 9-19 18-20-4 6-7 13-7 21z'
    fill='url(#maidMascotFin)' stroke='#c5a468' stroke-width='2' stroke-linejoin='round'/>

  <!-- 鲸身（下缘被小人框底沿裁掉，做出"探出输入卡上沿"的观感） -->
  <ellipse cx='40' cy='76' rx='34' ry='30' fill='url(#maidMascotBody)' stroke='#c5a468' stroke-width='2.4'/>

  <!-- 瓷白腹（裁进鲸身内） -->
  <g clip-path='url(#maidMascotBellyClip)'>
    <ellipse cx='30' cy='92' rx='30' ry='19' fill='#f4f6fb' opacity='0.94'/>
  </g>

  <!-- 描金胸针（运行中更亮） -->
  <g class='maid-mascot-brooch'>
    <path d='M40 49l3.8 4.8-3.8 4.8-3.8-4.8z' fill='#e2cfaa' stroke='#a68d5f' stroke-width='1.3' stroke-linejoin='round'/>
  </g>
</svg>`
