/**
 * 青瓷·月门 —— 手绘 SVG 素材（原创，无第三方素材，随 dsh-skin 以 MIT 发布）。
 * 全部内联为 data URI，由 runtime 挂到装饰层 / CSS 引用。
 */

function svgUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/** 月门环：双环 + 描金弧 + 虚线内环，固定于主区右侧。 */
export const CELADON_MOON_GATE = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 600 600'>`
  + `<defs><linearGradient id='cg' x1='0' y1='0' x2='1' y2='1'>`
  + `<stop offset='0' stop-color='#8fb8a8'/><stop offset='1' stop-color='#3f7d6b'/>`
  + `</linearGradient></defs>`
  + `<circle cx='300' cy='300' r='272' fill='none' stroke='url(#cg)' stroke-width='9'/>`
  + `<circle cx='300' cy='300' r='254' fill='none' stroke='url(#cg)' stroke-width='2' opacity='.55'/>`
  + `<circle cx='300' cy='300' r='236' fill='none' stroke='#c8b98a' stroke-width='1' stroke-dasharray='2 10' opacity='.6'/>`
  + `<path d='M118 96a272 272 0 0 1 90-56' fill='none' stroke='#c8b98a' stroke-width='4' stroke-linecap='round' opacity='.8'/>`
  + `<path d='M482 518a272 272 0 0 1-92 52' fill='none' stroke='#c8b98a' stroke-width='4' stroke-linecap='round' opacity='.8'/>`
  + `</svg>`,
)

/** 梅枝：自右缘探入的曲枝 + 五瓣梅 + 花蕾，固定于右下角。 */
export const CELADON_PLUM_BRANCH = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'>`
  + `<g fill='none' stroke='#6b4a3a' stroke-linecap='round'>`
  + `<path d='M400 250C330 235 280 200 235 150 220 132 200 120 176 118' stroke-width='9'/>`
  + `<path d='M290 205c-25-8-45-25-55-48' stroke-width='6'/>`
  + `<path d='M235 150c18 4 38 2 55-8' stroke-width='5'/>`
  + `<path d='M340 242c-8-18-24-30-44-34' stroke-width='5'/>`
  + `</g>`
  + `<g fill='#c96a7e' opacity='.88'>`
  // 花 F1（主枝梢 176,118）
  + `<circle cx='176' cy='109' r='7'/><circle cx='184.6' cy='115.2' r='7'/><circle cx='181.3' cy='125.3' r='7'/>`
  + `<circle cx='170.7' cy='125.3' r='7'/><circle cx='167.4' cy='115.2' r='7'/>`
  // 花 F2（枝节 235,150）
  + `<circle cx='235' cy='141' r='6'/><circle cx='242.6' cy='147.2' r='6'/><circle cx='239.3' cy='157.3' r='6'/>`
  + `<circle cx='230.7' cy='157.3' r='6'/><circle cx='227.4' cy='147.2' r='6'/>`
  // 花 F3（侧枝梢 290,142）
  + `<circle cx='290' cy='133' r='6'/><circle cx='297.6' cy='139.2' r='6'/><circle cx='294.3' cy='149.3' r='6'/>`
  + `<circle cx='285.7' cy='149.3' r='6'/><circle cx='282.4' cy='139.2' r='6'/>`
  // 花 F4（下枝 300,206）
  + `<circle cx='300' cy='197' r='5'/><circle cx='307.6' cy='203.2' r='5'/><circle cx='304.3' cy='213.3' r='5'/>`
  + `<circle cx='295.7' cy='213.3' r='5'/><circle cx='292.4' cy='203.2' r='5'/>`
  + `</g>`
  + `<g fill='#f2d8a0'><circle cx='176' cy='118' r='2.6'/><circle cx='235' cy='150' r='2.2'/>`
  + `<circle cx='290' cy='142' r='2.2'/><circle cx='300' cy='206' r='2'/></g>`
  + `<g fill='#b4526a'><circle cx='340' cy='238' r='4'/><circle cx='252' cy='196' r='3.4'/><circle cx='210' cy='128' r='3'/></g>`
  + `</svg>`,
)

/** 印章：胭脂方章 + 楷体「瓷」，钉在侧栏底部。 */
export const CELADON_SEAL = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>`
  + `<rect x='3' y='3' width='58' height='58' rx='9' fill='#b03a2e'/>`
  + `<rect x='8' y='8' width='48' height='48' rx='6' fill='none' stroke='#f6efe4' stroke-width='1.6' opacity='.85'/>`
  + `<text x='32' y='44' font-family='KaiTi,STKaiti,serif' font-size='30' fill='#f6efe4' text-anchor='middle'>瓷</text>`
  + `</svg>`,
)

/** 皮肤中心卡片缩略图（月门 + 米纸底）。 */
export const CELADON_PREVIEW = CELADON_MOON_GATE
