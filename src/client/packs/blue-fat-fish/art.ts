/**
 * 蓝色大肥鱼 —— 手绘 SVG 素材（原创，无第三方素材，随 dsh-skin 以 MIT 发布）。
 *
 * 全部内联为 data URI（规范 F1）：不引用任何远程资源，也不含第三方素材。
 * 装饰母题统一为「深海鱼群」：气泡、游鱼剪影、海藻、描金浮游星光。
 *
 * 与「深海女仆工坊」（maid-atelier）的区分：那边是宫殿/立柱 + 女仆装，
 * 这边是**湖蓝偏青的活水色** + 肥嘟嘟的大鱼剪影 + 气泡/海藻/星光，
 * 主视觉是"大肥鱼"而不是"工坊"。
 */

/** 把内联 SVG 编码为 data URI（与 celadon/art.ts 同一写法）。 */
function svgUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/** 四角金闪：圆角四角星（描金浮游星光），cx/cy 为中心，r 为外接半径。 */
function sparkStar(cx: number, cy: number, r: number, fill: string, opacity: string): string {
  const k = r * 0.3
  return `<path d='M${cx} ${cy - r}Q${cx + k} ${cy - k} ${cx + r} ${cy}`
    + `Q${cx + k} ${cy + k} ${cx} ${cy + r}Q${cx - k} ${cy + k} ${cx - r} ${cy}`
    + `Q${cx - k} ${cy - k} ${cx} ${cy - r}Z' fill='${fill}' opacity='${opacity}'/>`
}

/** 一颗气泡：空心圈 + 左上高光弧。 */
function bubble(cx: number, cy: number, r: number, stroke: string, opacity: string): string {
  return `<g fill='none' stroke='${stroke}' stroke-width='${Math.max(1, r * 0.14).toFixed(2)}' opacity='${opacity}'>`
    + `<circle cx='${cx}' cy='${cy}' r='${r}'/>`
    + `<path d='M${cx - r * 0.52} ${cy - r * 0.42}a${r * 0.62} ${r * 0.62} 0 0 1 ${r * 0.5} -${r * 0.34}'`
    + ` stroke-linecap='round'/>`
    + `</g>`
}

/* ── 气泡层贴片（240×320 无缝竖向平铺，向上滚动 = 上升气泡） ────────── */

export const BFF_BUBBLE_TILE = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 320'>`
  + bubble(34, 286, 9, '#8fd6f2', '.55')
  + bubble(96, 214, 6, '#8fd6f2', '.45')
  + bubble(168, 262, 12, '#a9e2f7', '.4')
  + bubble(206, 158, 7, '#8fd6f2', '.5')
  + bubble(62, 132, 5, '#a9e2f7', '.5')
  + bubble(132, 88, 10, '#8fd6f2', '.38')
  + bubble(28, 62, 7, '#a9e2f7', '.45')
  + bubble(196, 32, 5, '#8fd6f2', '.5')
  + bubble(104, 26, 8, '#a9e2f7', '.32')
  + bubble(172, 190, 4, '#8fd6f2', '.55')
  + bubble(40, 190, 4, '#a9e2f7', '.5')
  + `</svg>`,
)

/* ── 大肥鱼剪影（远景层）─────────────────────────────────────────
   肥厚的圆肚 + 分叉大尾鳍 + 背鳍 + 憨笑，是"大肥鱼"的主视觉。 */

export const BFF_FISH_FAR = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 340 180'>`
  + `<defs><linearGradient id='bffFishFar' x1='0' y1='0' x2='0' y2='1'>`
  + `<stop offset='0' stop-color='#2a6cb0'/><stop offset='1' stop-color='#123a72'/>`
  + `</linearGradient></defs>`
  // 尾鳍（先画，身体压住尾根）
  + `<path d='M236 90C264 62 292 44 318 38c-12 22-18 38-18 52s6 30 18 52`
  + `c-26-8-54-24-76-50Z' fill='url(#bffFishFar)'/>`
  // 背鳍
  + `<path d='M118 50c22-30 58-42 88-36-20 16-32 28-38 42Z' fill='url(#bffFishFar)'/>`
  // 身体（胖圆肚）
  + `<path d='M48 92c0-44 46-68 104-66 66 2 108 28 108 66 0 38-42 64-108 66`
  + `-58 2-104-22-104-66Z' fill='url(#bffFishFar)'/>`
  // 肚皮高光
  + `<path d='M70 112c26 18 92 22 140 4 22-8 38-18 44-28 4 34-44 60-104 62`
  + `-46 2-80-14-80-38Z' fill='#5ea8dc' opacity='.35'/>`
  // 胸鳍
  + `<path d='M138 108c18-4 34 2 40 16-16 8-32 6-42-4Z' fill='#1b4e8c' opacity='.8'/>`
  // 腮线
  + `<path d='M116 56c-10 22-10 46 0 68' fill='none' stroke='#0f3368' stroke-width='4'`
  + ` stroke-linecap='round' opacity='.55'/>`
  // 眼 + 憨笑
  + `<circle cx='86' cy='84' r='9' fill='#f4fbff'/>`
  + `<circle cx='88' cy='85' r='4.6' fill='#123a72'/>`
  + `<path d='M62 104c8 8 20 10 30 4' fill='none' stroke='#0f3368' stroke-width='4'`
  + ` stroke-linecap='round' opacity='.6'/>`
  // 鳞纹
  + `<g fill='none' stroke='#0f3368' stroke-width='2.4' opacity='.35'>`
  + `<path d='M150 60c14-6 30-6 44 0M158 92c16-6 34-6 50 0M146 122c14 6 30 6 44 0'/>`
  + `</g>`
  + `</svg>`,
)

/* ── 小鱼剪影（近景层，方向相反，制造纵深） ────────────────────────── */

export const BFF_FISH_NEAR = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 220 120'>`
  + `<defs><linearGradient id='bffFishNear' x1='0' y1='0' x2='0' y2='1'>`
  + `<stop offset='0' stop-color='#123f7d'/><stop offset='1' stop-color='#0a2447'/>`
  + `</linearGradient></defs>`
  + `<path d='M158 60c22-22 44-36 62-40-9 16-13 28-13 40s4 24 13 40`
  + `-18-4-40-18-62-40Z' fill='url(#bffFishNear)'/>`
  + `<path d='M74 62c0-30 32-46 72-45 44 1 72 18 72 45 0 27-28 45-72 46`
  + `-40 1-72-16-72-46Z' fill='url(#bffFishNear)'/>`
  + `<path d='M60 46c12-18 34-28 54-26-14 10-22 18-26 28Z' fill='url(#bffFishNear)'/>`
  + `<circle cx='104' cy='58' r='6.6' fill='#cfeaff'/>`
  + `<circle cx='105' cy='59' r='3.2' fill='#0a2447'/>`
  + `<path d='M88 74c6 5 14 6 21 2' fill='none' stroke='#061a35' stroke-width='3'`
  + ` stroke-linecap='round' opacity='.6'/>`
  + `</svg>`,
)

/* ── 描金浮游星光（整屏层，cover 铺开）
   viewBox 与常见视口同尺寸（1280×960）→ cover 时基本 1:1，星光保持小巧精致，
   不会被放大成背景里的大色块。 ───────────────────────────────────────────── */

export const BFF_STAR_FIELD = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 960'>`
  + sparkStar(96, 132, 13, '#f6d488', '.85')
  + sparkStar(152, 186, 7, '#fbe8b6', '.7')
  + sparkStar(316, 78, 9, '#f6d488', '.6')
  + sparkStar(548, 164, 12, '#f6d488', '.75')
  + sparkStar(632, 86, 6, '#fbe8b6', '.65')
  + sparkStar(742, 296, 9, '#f6d488', '.55')
  + sparkStar(96, 402, 8, '#fbe8b6', '.5')
  + sparkStar(238, 496, 11, '#f6d488', '.55')
  + sparkStar(438, 388, 6, '#fbe8b6', '.6')
  + sparkStar(654, 528, 13, '#f6d488', '.5')
  + sparkStar(372, 596, 8, '#fbe8b6', '.45')
  + sparkStar(806, 604, 6, '#f6d488', '.5')
  + sparkStar(908, 208, 10, '#f6d488', '.6')
  + sparkStar(1096, 356, 7, '#fbe8b6', '.5')
  + sparkStar(1178, 612, 12, '#f6d488', '.45')
  + sparkStar(486, 812, 9, '#fbe8b6', '.5')
  + sparkStar(880, 848, 7, '#f6d488', '.45')
  + sparkStar(120, 852, 11, '#f6d488', '.4')
  + `</svg>`,
)

/* ── 海藻（右下角一丛，随波摇摆） ─────────────────────────────────── */

export const BFF_SEAWEED = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 260 300'>`
  + `<g fill='none' stroke-linecap='round'>`
  + `<path d='M60 300C44 236 62 190 44 132 32 92 44 54 66 24' stroke='#146a63' stroke-width='13'/>`
  + `<path d='M108 300c-4-58 18-96 12-146-4-38 8-70 28-96' stroke='#0f7a72' stroke-width='10'/>`
  + `<path d='M156 300c10-48 2-84 22-124 14-28 12-54 4-74' stroke='#17857c' stroke-width='8'/>`
  + `</g>`
  + `<g fill='#0f5f59' opacity='.7'>`
  + `<ellipse cx='44' cy='132' rx='16' ry='7' transform='rotate(-24 44 132)'/>`
  + `<ellipse cx='120' cy='154' rx='14' ry='6' transform='rotate(16 120 154)'/>`
  + `<ellipse cx='178' cy='176' rx='12' ry='5' transform='rotate(-18 178 176)'/>`
  + `</g>`
  + `</svg>`,
)

/* ── 皮肤中心缩略图（深海蓝 + 大肥鱼 + 金闪） ──────────────────────── */

export const BFF_PREVIEW = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'>`
  + `<defs><linearGradient id='bffPb' x1='0' y1='0' x2='0' y2='1'>`
  + `<stop offset='0' stop-color='#0d2b4f'/><stop offset='.55' stop-color='#14497e'/>`
  + `<stop offset='1' stop-color='#0a1f3c'/>`
  + `</linearGradient></defs>`
  + `<rect width='320' height='180' fill='url(#bffPb)'/>`
  // 焦散光束
  + `<g opacity='.22' fill='#8fe6ff'>`
  + `<path d='M30 0h26l-46 180H0Z'/><path d='M132 0h18l-58 180H76Z'/><path d='M236 0h22l-40 180h-44Z'/>`
  + `</g>`
  // 大肥鱼
  + `<g transform='translate(96 52) scale(.5)'>`
  + `<path d='M48 92c0-44 46-68 104-66 66 2 108 28 108 66 0 38-42 64-108 66`
  + `-58 2-104-22-104-66Z' fill='#2f7fc4'/>`
  + `<path d='M236 90c28-28 56-46 82-52-12 22-18 38-18 52s6 30 18 52`
  + `-26-8-54-24-76-50Z' fill='#2f7fc4'/>`
  + `<circle cx='86' cy='84' r='9' fill='#eaf7ff'/><circle cx='88' cy='85' r='4.6' fill='#0d2b4f'/>`
  + `</g>`
  + sparkStar(252, 44, 18, '#f6d488', '.9')
  + sparkStar(226, 84, 8, '#fbe8b6', '.75')
  + sparkStar(44, 148, 11, '#f6d488', '.6')
  + `<g fill='none' stroke='#8fd6f2' stroke-width='1.6' opacity='.5'>`
  + `<circle cx='292' cy='130' r='7'/><circle cx='274' cy='152' r='4'/>`
  + `</g>`
  + `</svg>`,
)
