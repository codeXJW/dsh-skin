/**
 * 蓝色大肥鱼 —— 输入框右上角「Q 版小人」手绘 SVG（原创，随 dsh-skin 以 MIT 发布）。
 *
 * 形象取自用户参考图：Q 版少女 + **肥嘟嘟的大鱼尾**（「大肥鱼」的核心意象）。
 * 特征清单：
 *   - 深蓝色长发、齐刘海（中间有一道分发缝）
 *   - 头顶一根**呆毛**（翘起的呆毛）
 *   - 头顶左右一对**深蓝猫耳**
 *   - 白色蕾丝女仆头饰 + 深蓝围裙 + 白色蕾丝边 + 白色泡泡袖
 *   - **闭着眼睛**（^ ^ 满足/得意的笑）、微张嘴、腮红
 *   - 身后一条**又大又肥的鱼尾鳍**（向右后方伸出）
 *   - 周围若干**金黄色四角星闪光**，脚下淡蓝色椭圆投影
 *
 * 用**内联 SVG**（而非 data URI 背景图）挂载：这样 CSS 才能分别控制
 * 呆毛/鱼尾/眼睛/星光等内部部件，做出 idle↔busy 的表情与动画。
 * SVG 字符串是编译期常量，不含任何用户输入，也不产生远程请求（规范 A3/F1）。
 *
 * ── 几何约定（改图前务必先读） ────────────────────────────────
 * 视图 116×132，小人框为 116×132（style.ts 里同尺寸），SVG 等比铺满，
 * 所以 viewBox 的 y=132 就是小人框的底沿：
 *   - 呆毛/猫耳/头饰画在 y<34（在框内完整可见）；
 *   - 脚与投影落在 y≈104~128 → 正好踩在输入卡上沿（框底=卡片上沿）；
 *   - 大鱼尾占 x 52~114、y 73~107（在框内，不越界）。
 * 改动 viewBox 高度或元素尺寸时，必须同步重算这些位置。
 *
 * 状态由外层 DOM 钩子驱动（data-blue-fat-fish-mascot-state），本文件只出静态画：
 *   - idle  ：待机（默认，^ ^ 弯月闭眼 + 小嘴）
 *   - busy  ：运行中（睁开的亮眼 + 大张嘴 + 鱼尾摆得快 + 星光更亮）
 */
export const BFF_MASCOT_SVG = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 116 132' class='bff-mascot-svg'>
  <defs>
    <linearGradient id='bffHair' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#2c4a99'/>
      <stop offset='.55' stop-color='#1e3577'/>
      <stop offset='1' stop-color='#16255c'/>
    </linearGradient>
    <linearGradient id='bffTail' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='#3f74c9'/>
      <stop offset='.6' stop-color='#2a56a8'/>
      <stop offset='1' stop-color='#1b3a76'/>
    </linearGradient>
    <linearGradient id='bffApron' x1='0' y1='0' x2='0' y2='1'>
      <stop offset='0' stop-color='#243a7d'/>
      <stop offset='1' stop-color='#141f4f'/>
    </linearGradient>
    <radialGradient id='bffBlush' cx='.5' cy='.5' r='.5'>
      <stop offset='0' stop-color='#ff8fa6' stop-opacity='.62'/>
      <stop offset='1' stop-color='#ff8fa6' stop-opacity='0'/>
    </radialGradient>
  </defs>

  <!-- 脚下淡蓝色椭圆投影 -->
  <ellipse cx='46' cy='124' rx='25' ry='5.6' fill='#bcd9ef' opacity='.55'/>
  <ellipse cx='46' cy='124' rx='15' ry='3.2' fill='#9dc8ea' opacity='.45'/>

  <!-- ── 后发（大块深蓝长发 + 两侧长鬓） ── -->
  <path d='M50 20c-22 0-34 16-34 38 0 16-2 28-8 40 10-2 16-8 18-16 4 10 12 14 24 14s20-4 24-14c2 8 8 14 18 16-6-12-8-24-8-40 0-22-12-38-34-38Z' fill='url(#bffHair)'/>

  <!-- ── 大肥鱼尾（"大肥鱼"核心意象：又大又肥的尾鳍，从身后右侧伸出）
       画在后发之后 → 尾鳍不会被头发盖住；裙摆在其后 → 尾根被裙子挡住。 ── -->
  <g class='bff-mascot-tail'>
    <path d='M57 92c16 0 30-8 38-18 4-5 10-6 13-1 3 5-2 10-8 13 8-1 14 3 13 9-2 8-16 12-34 12-16 0-26-4-26-9 0-3 1-5 4-6Z' fill='url(#bffTail)' stroke='#13224f' stroke-width='1.6' stroke-linejoin='round'/>
    <path d='M63 97c13 1 25-3 32-11 3-4 7-4 8 0 1 3-2 6-6 8 6-1 10 1 9 5-2 4-11 6-22 6-11 0-19-3-19-6 0-1 0-2 1-2Z' fill='#7bb4ea' opacity='.45'/>
    <g fill='none' stroke='#13224f' stroke-width='1.3' opacity='.42' stroke-linecap='round'>
      <path d='M64 99c14-2 27-9 34-18'/>
      <path d='M64 99c17 0 31-3 39-8'/>
      <path d='M64 99c9 3 19 4 27 2'/>
    </g>
    <g fill='none' stroke='#13224f' stroke-width='1.2' opacity='.35' stroke-linecap='round'>
      <path d='M76 88c4 2 9 3 13 2'/>
      <path d='M88 80c4 2 9 3 13 2'/>
    </g>
  </g>

  <!-- ── 脸 ── -->
  <ellipse cx='50' cy='52' rx='23' ry='21' fill='#ffe1cd'/>

  <!-- ── 齐刘海（顶部中间一道小小的分发缝，边缘是尖尖的刘海梢） ── -->
  <path d='M26 52C23 33 35 21 48 20c1 .4 2 1.6 2 2.6 0-1 1-2.2 2-2.6 13 1 22 13 22 32-3-6-6-10-10-12-2 6-6 8-10 6-2-4-3-6-4-7-1 1-2 3-4 7-4 2-8 0-10-6-4 2-7 6-10 12Z' fill='url(#bffHair)'/>
  <!-- 两侧鬓发 -->
  <path d='M27 44c-4 12-6 27-6 42 4-4 7-7 10-9 0-13 1-24 3-31Z' fill='#1e3577'/>
  <path d='M73 44c4 12 6 27 6 42-4-4-7-7-10-9 0-13-1-24-3-31Z' fill='#1e3577'/>
  <!-- 发丝高光 -->
  <path d='M34 34c6-5 14-7 21-5' fill='none' stroke='#5d86cf' stroke-width='2.2' stroke-linecap='round' opacity='.6'/>

  <!-- ── 白色蕾丝女仆头饰（压在头发上） ── -->
  <g class='bff-mascot-frill'>
    <path d='M27 25C29 12 39 7 50 7s21 5 23 18Z' fill='#fcfbff'/>
    <g fill='#fcfbff'>
      <circle cx='29' cy='24' r='5'/>
      <circle cx='38' cy='21.5' r='5.4'/>
      <circle cx='50' cy='20.5' r='5.8'/>
      <circle cx='62' cy='21.5' r='5.4'/>
      <circle cx='71' cy='24' r='5'/>
    </g>
    <path d='M28 25c10 7 42 7 52 0' fill='none' stroke='#e0b062' stroke-width='1.6' opacity='.85'/>
  </g>

  <!-- ── 猫耳（深蓝兽耳，向外张开） ── -->
  <g class='bff-mascot-ears'>
    <path d='M27 34C19 26 14 18 16 11c8 3 16 11 22 20Z' fill='url(#bffHair)' stroke='#13224f' stroke-width='1.4' stroke-linejoin='round'/>
    <path d='M73 34c8-8 13-16 11-23-8 3-16 11-22 20Z' fill='url(#bffHair)' stroke='#13224f' stroke-width='1.4' stroke-linejoin='round'/>
    <path d='M29 30c-4-4-7-9-7-13 4 2 9 6 13 11Z' fill='#5d86cf' opacity='.85'/>
    <path d='M71 30c4-4 7-9 7-13-4 2-9 6-13 11Z' fill='#5d86cf' opacity='.85'/>
  </g>

  <!-- ── 呆毛（头顶翘起的一撮） ── -->
  <g class='bff-mascot-ahoge'>
    <path d='M46 18C45 9 51 3 59 5' fill='none' stroke='#1e3577' stroke-width='4.4' stroke-linecap='round'/>
  </g>

  <!-- ── 表情：idle 弯月闭眼 / busy 亮眼 ── -->
  <g class='bff-mascot-eyes-idle' fill='none' stroke='#233063' stroke-width='3.2' stroke-linecap='round'>
    <path d='M37 57c3-5 9-5 12 0'/>
    <path d='M55 57c3-5 9-5 12 0'/>
  </g>
  <g class='bff-mascot-eyes-busy'>
    <ellipse cx='43' cy='56' rx='6.2' ry='7.2' fill='#2b3f7e'/>
    <ellipse cx='61' cy='56' rx='6.2' ry='7.2' fill='#2b3f7e'/>
    <circle cx='45.2' cy='52.8' r='2.4' fill='#ffffff'/>
    <circle cx='63.2' cy='52.8' r='2.4' fill='#ffffff'/>
    <circle cx='41' cy='58.6' r='1.5' fill='#8fe6ff'/>
    <circle cx='59' cy='58.6' r='1.5' fill='#8fe6ff'/>
  </g>
  <!-- 腮红 -->
  <ellipse cx='33' cy='62' rx='7' ry='4.4' fill='url(#bffBlush)'/>
  <ellipse cx='67' cy='62' rx='7' ry='4.4' fill='url(#bffBlush)'/>
  <!-- 嘴：idle 小嘴 / busy 大张嘴 -->
  <g class='bff-mascot-mouth-idle'>
    <path d='M46.5 63.5c1.6-1.8 5.4-1.8 7 0-.8 3.6-6.2 3.6-7 0Z' fill='#b3566e'/>
  </g>
  <g class='bff-mascot-mouth-busy'>
    <path d='M44.5 62.5c3 6.6 9 6.6 12 0-1 6-11 6-12 0Z' fill='#b3566e'/>
  </g>

  <!-- ── 泡泡袖 + 小手 ── -->
  <ellipse cx='31' cy='80' rx='10.2' ry='9' fill='#fcfbff' stroke='#dcd4ee' stroke-width='1'/>
  <ellipse cx='69' cy='80' rx='10.2' ry='9' fill='#fcfbff' stroke='#dcd4ee' stroke-width='1'/>
  <ellipse cx='21.5' cy='86' rx='6.2' ry='5' fill='#ffdcc6'/>
  <ellipse cx='78.5' cy='86' rx='6.2' ry='5' fill='#ffdcc6'/>

  <!-- ── 女仆装：白衬衫 + 深蓝围裙 + 白色蕾丝边 ── -->
  <path d='M50 70c-8 0-12 4-13 11h26c-1-7-5-11-13-11Z' fill='#fcfbff'/>
  <path d='M37 81h26c3 7 6 13 9 19-6 5-13 7-22 7s-16-2-22-7c3-6 6-12 9-19Z' fill='url(#bffApron)'/>
  <path d='M44 83h12c1 6 3 12 5 18-3 2-7 3-11 3s-8-1-11-3c2-6 4-12 5-18Z' fill='#f9f6ff'/>
  <g fill='#fcfbff'>
    <circle cx='37' cy='100' r='4.2'/>
    <circle cx='43' cy='103' r='4.4'/>
    <circle cx='50' cy='104' r='4.6'/>
    <circle cx='57' cy='103' r='4.4'/>
    <circle cx='63' cy='100' r='4.2'/>
  </g>
  <!-- 围裙上的小鱼徽记 -->
  <g transform='translate(50 93) scale(.62)' opacity='.9'>
    <path d='M-7 0c0-3.6 4.4-5.4 9-4.6C5.6-4 8-1.6 8 0s-2.4 4-6 4.6C-2.6 5.4-7 3.6-7 0Z' fill='#2f7fc4'/>
    <path d='M8 0c3-2.6 5.6-4 8-4.4-1.2 2-1.8 3.4-1.8 4.4s.6 2.4 1.8 4.4c-2.4-.4-5-1.8-8-4.4Z' fill='#2f7fc4'/>
    <circle cx='-3' cy='-.6' r='1.1' fill='#0d2b4f'/>
  </g>

  <!-- ── 腿 + 鞋 ── -->
  <path d='M43 104c0 6-1 10-2 14h7c-1-4-1-9-1-14Z' fill='#ffdcc6'/>
  <path d='M53 104c0 5 0 9 1 14h7c-1-4-2-8-2-14Z' fill='#ffdcc6'/>
  <ellipse cx='43.5' cy='119' rx='6.4' ry='3.6' fill='#1b2a5c'/>
  <ellipse cx='56.5' cy='119' rx='6.4' ry='3.6' fill='#1b2a5c'/>

  <!-- ── 金黄色四角星闪光（四角尖锐、边缘内凹的星芒） ── -->
  <g class='bff-mascot-stars' fill='#f2c25f'>
    <path class='bff-star bff-star-1' d='M15 17C16.53 22.76 18.24 24.47 24 26 18.24 27.53 16.53 29.24 15 35 13.47 29.24 11.76 27.53 6 26 11.76 24.47 13.47 22.76 15 17Z'/>
    <path class='bff-star bff-star-2' opacity='.85' d='M10 68C11.02 71.84 12.16 72.98 16 74 12.16 75.02 11.02 76.16 10 80 8.98 76.16 7.84 75.02 4 74 7.84 72.98 8.98 71.84 10 68Z'/>
    <path class='bff-star bff-star-3' d='M96 6C97.36 11.12 98.88 12.64 104 14 98.88 15.36 97.36 16.88 96 22 94.64 16.88 93.12 15.36 88 14 93.12 12.64 94.64 11.12 96 6Z'/>
    <path class='bff-star bff-star-4' opacity='.8' d='M106 20.5C106.94 24.02 107.98 25.07 111.5 26 107.98 26.94 106.94 27.98 106 31.5 105.07 27.98 104.02 26.94 100.5 26 104.02 25.07 105.07 24.02 106 20.5Z'/>
  </g>
</svg>`
