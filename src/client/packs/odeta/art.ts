/**
 * 奥黛塔 · 冰湖天鹅 —— 手绘 SVG 素材（原创，无第三方素材，随 dsh-skin 以 MIT 发布）。
 *
 * 角色立绘 / 场景背景不在此处：那是「本机素材槽」的内容
 * （assets-local/ → local-art.generated.ts，见同目录 README.md），
 * 本文件只含永不涉及版权的原创装饰件。
 */

function svgUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

/** 一片雪花的笔画（以 0,0 为中心，半径 14）。 */
function snowflake(stroke: string, width: number): string {
  return `<g fill='none' stroke='${stroke}' stroke-width='${width}' stroke-linecap='round'>`
    + `<path d='M0-14V14M-12.1-7 12.1 7M-12.1 7 12.1-7'/>`
    + `<path d='M0-14 -3.5-9.5M0-14 3.5-9.5M0 14 -3.5 9.5M0 14 3.5 9.5'/>`
    + `<path d='M-12.1-7 -7.5-4.3M-12.1-7 -9.4-11.7M12.1 7 7.5 4.3M12.1 7 9.4 11.7'/>`
    + `<path d='M-12.1 7 -7.5 4.3M-12.1 7 -9.4 11.7M12.1-7 7.5-4.3M12.1-7 9.4-11.7'/>`
    + `</g>`
}

/** 远景雪层贴片（小而密，无缝平铺，慢速）。 */
export const ODETA_SNOW_TILE_FAR = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 320'>`
  + `<g fill='#ffffff' opacity='.55'>`
  + `<circle cx='40' cy='52' r='1.8'/><circle cx='150' cy='30' r='1.4'/><circle cx='262' cy='68' r='2'/>`
  + `<circle cx='90' cy='140' r='1.5'/><circle cx='210' cy='120' r='1.9'/><circle cx='300' cy='170' r='1.4'/>`
  + `<circle cx='55' cy='230' r='2'/><circle cx='170' cy='205' r='1.5'/><circle cx='255' cy='258' r='1.8'/>`
  + `<circle cx='120' cy='295' r='1.6'/><circle cx='305' cy='300' r='1.9'/><circle cx='20' cy='310' r='1.4'/>`
  + `</g>`
  + `<g transform='translate(105 80) scale(.5)' opacity='.5'>${snowflake('#ffffff', 2.4)}</g>`
  + `<g transform='translate(238 232) scale(.42)' opacity='.45'>${snowflake('#ffffff', 2.4)}</g>`
  + `</svg>`,
)

/** 近景雪层贴片（大而疏，无缝平铺，快速 → 视差）。 */
export const ODETA_SNOW_TILE_NEAR = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 480 480'>`
  + `<g fill='#ffffff' opacity='.7'>`
  + `<circle cx='70' cy='120' r='2.6'/><circle cx='330' cy='60' r='2.2'/><circle cx='430' cy='220' r='2.8'/>`
  + `<circle cx='180' cy='330' r='2.4'/><circle cx='390' cy='420' r='2.2'/><circle cx='50' cy='440' r='2.6'/>`
  + `</g>`
  + `<g transform='translate(250 170) scale(.9)' opacity='.75'>${snowflake('#ffffff', 2.2)}</g>`
  + `<g transform='translate(90 390) scale(.65)' opacity='.6'>${snowflake('#eaf3fb', 2.2)}</g>`
  + `<g transform='translate(420 350) scale(.5)' opacity='.55'>${snowflake('#ffffff', 2.2)}</g>`
  + `</svg>`,
)

/** 天鹅羽：白→冰蓝渐变羽片 + 羽轴 + 羽枝，侧栏底部装饰。 */
export const ODETA_SWAN_FEATHER = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 320'>`
  + `<defs><linearGradient id='fv' x1='0' y1='0' x2='0' y2='1'>`
  + `<stop offset='0' stop-color='#ffffff'/><stop offset='.55' stop-color='#dbeaf6'/><stop offset='1' stop-color='#a9c8e4'/>`
  + `</linearGradient></defs>`
  + `<path d='M100 12C150 60 168 130 158 200 152 246 130 282 104 306 102 308 98 308 96 306 70 282 48 246 42 200 32 130 50 60 100 12Z' fill='url(#fv)' opacity='.95'/>`
  + `<path d='M100 12C100 90 100 200 100 310' fill='none' stroke='#8fb3d4' stroke-width='3' stroke-linecap='round'/>`
  + `<g fill='none' stroke='#b9d2e8' stroke-width='1.6' opacity='.8'>`
  + `<path d='M100 60 138 84M100 60 62 84'/><path d='M100 110 146 138M100 110 54 138'/>`
  + `<path d='M100 160 148 192M100 160 52 192'/><path d='M100 210 140 242M100 210 60 242'/>`
  + `<path d='M100 255 126 280M100 255 74 280'/>`
  + `</g></svg>`,
)

/** 冰晶：六棱晶形，侧栏区块标记/角饰。 */
export const ODETA_ICE_CRYSTAL = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>`
  + `<g fill='none' stroke='#7fb3d9' stroke-linecap='round'>`
  + `<path d='M60 8 104 34 104 86 60 112 16 86 16 34Z' stroke-width='3'/>`
  + `<path d='M60 34 84 48 84 74 60 88 36 74 36 48Z' stroke-width='2' opacity='.85'/>`
  + `<path d='M60 8 60 34M60 88 60 112M16 34 36 48M84 74 104 86M104 34 84 48M36 74 16 86' stroke-width='1.6' opacity='.7'/>`
  + `</g></svg>`,
)

/** 皮肤中心卡片缩略图（冰湖渐变 + 羽毛）。 */
export const ODETA_PREVIEW = svgUri(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 320 180'>`
  + `<defs><linearGradient id='pb' x1='0' y1='0' x2='0' y2='1'>`
  + `<stop offset='0' stop-color='#dcebf7'/><stop offset='.55' stop-color='#eef5fb'/><stop offset='1' stop-color='#c2d9ec'/>`
  + `</linearGradient></defs>`
  + `<rect width='320' height='180' fill='url(#pb)'/>`
  + `<circle cx='248' cy='42' r='30' fill='#ffffff' opacity='.8'/>`
  + `<g transform='translate(70 28) scale(.42) rotate(-8)'>`
  + `<path d='M100 12C150 60 168 130 158 200 152 246 130 282 104 306 102 308 98 308 96 306 70 282 48 246 42 200 32 130 50 60 100 12Z' fill='#ffffff' opacity='.95'/>`
  + `<path d='M100 12C100 90 100 200 100 310' fill='none' stroke='#8fb3d4' stroke-width='4' stroke-linecap='round'/>`
  + `</g>`
  + `<g transform='translate(200 120) scale(.8)' opacity='.7'>${snowflake('#7fb3d9', 2.4)}</g>`
  + `<g transform='translate(160 60) scale(.5)' opacity='.55'>${snowflake('#7fb3d9', 2.4)}</g>`
  + `</svg>`,
)
