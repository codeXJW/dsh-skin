/**
 * 简约皮肤引擎：主题色 11 级色阶 + 背景图固定层 + 面板半透明，
 * 全部通过覆盖 --dsw-* 设计 token 生效（组件消费 token → 一处覆盖全局换肤）。
 *
 * applySimple 返回 dispose：移除 <style> 与 body[data-dsh-skin] 属性。
 * 由 SkinManager 统一调度，不直接读写 localStorage。
 */

export interface SimpleSkinValues {
  accent: string
  bgImage: string | null
  bgOpacity: number
  uiAlpha: number
}

const STYLE_ID = 'dsh-skin-style'

/* ── 颜色工具 ─────────────────────────────────────────────────── */

function hexToRgb(hex: string): [number, number, number] {
  const v = hex.replace('#', '')
  const n = parseInt(v.length === 3 ? v.split('').map((c) => c + c).join('') : v, 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** mix(accent, target, t)：t=0 保持 accent，t=1 变为 target。 */
function mix(hex: string, target: [number, number, number], t: number): string {
  const a = hexToRgb(hex)
  const r = Math.round(a[0] + (target[0] - a[0]) * t)
  const g = Math.round(a[1] + (target[1] - a[1]) * t)
  const b = Math.round(a[2] + (target[2] - a[2]) * t)
  return `rgb(${r}, ${g}, ${b})`
}

const WHITE: [number, number, number] = [255, 255, 255]
const BLACK: [number, number, number] = [0, 0, 0]

/** 由主题色生成 DeepSeek 风格 11 级色阶（对应 --dsw-static-deepseek-*）。 */
function accentRamp(accent: string): Record<string, string> {
  return {
    'dsw-static-deepseek-50': mix(accent, WHITE, 0.93),
    'dsw-static-deepseek-100': mix(accent, WHITE, 0.85),
    'dsw-static-deepseek-200': mix(accent, WHITE, 0.72),
    'dsw-static-deepseek-300': mix(accent, WHITE, 0.5),
    'dsw-static-deepseek-400': mix(accent, WHITE, 0.25),
    'dsw-static-deepseek-450': mix(accent, WHITE, 0.12),
    'dsw-static-deepseek-500': accent,
    'dsw-static-deepseek-600': mix(accent, BLACK, 0.12),
    'dsw-static-deepseek-700-delete': mix(accent, BLACK, 0.25),
    'dsw-static-deepseek-800': mix(accent, BLACK, 0.45),
    'dsw-static-deepseek-900': mix(accent, BLACK, 0.62),
  }
}

/* ── CSS 生成 ─────────────────────────────────────────────────── */

function cssVar(k: string, v: string): string {
  return `  --${k}: ${v};`
}

function buildCss(values: SimpleSkinValues): string {
  const ramp = accentRamp(values.accent)
  const img = values.bgImage ? `url("${values.bgImage}")` : 'none'
  const L: string[] = []

  // 亮色：主色阶 + 品牌 token（body[data-dsh-skin] 特异性 0,1,1，
  // 与 body[data-ds-dark-theme] 同级但排在 design-platform.css 之后 → 覆盖生效）
  L.push('body[data-dsh-skin] {')
  for (const [k, v] of Object.entries(ramp)) L.push(cssVar(k, v))
  L.push(cssVar('dsw-alias-brand-primary', ramp['dsw-static-deepseek-600']))
  L.push(cssVar('dsw-alias-brand-text', ramp['dsw-static-deepseek-700']))
  L.push(cssVar('dsw-alias-button-primary-hover', ramp['dsw-static-deepseek-500']))
  L.push(cssVar('dsw-alias-button-primary-dimmed', ramp['dsw-static-deepseek-100']))
  L.push(cssVar('dsw-alias-label-primary-bluish', ramp['dsw-static-deepseek-900']))
  L.push(cssVar('dsh-skin-image', img))
  L.push(cssVar('dsh-skin-image-opacity', String(values.bgOpacity)))
  L.push(cssVar('dsh-skin-ui-alpha', String(values.uiAlpha)))
  L.push('}')

  // 暗色：品牌 token 单独覆盖（更高特异性压过 body[data-ds-dark-theme] 块）
  L.push('body[data-ds-dark-theme][data-dsh-skin] {')
  L.push(cssVar('dsw-alias-brand-primary', ramp['dsw-static-deepseek-300']))
  L.push(cssVar('dsw-alias-brand-text', ramp['dsw-static-deepseek-300']))
  L.push(cssVar('dsw-alias-button-primary-hover', ramp['dsw-static-deepseek-400']))
  L.push(cssVar('dsw-alias-button-primary-dimmed', ramp['dsw-static-deepseek-800']))
  L.push(cssVar('dsw-alias-label-primary-bluish', ramp['dsw-static-deepseek-200']))
  L.push('}')

  // 背景图固定层（z-index:-1，位于内容之下、画布之上）
  L.push('body[data-dsh-skin]::before {')
  L.push("  content: '';")
  L.push('  position: fixed;')
  L.push('  inset: 0;')
  L.push('  z-index: -1;')
  L.push('  background-image: var(--dsh-skin-image);')
  L.push('  background-size: cover;')
  L.push('  background-position: center;')
  L.push('  background-repeat: no-repeat;')
  L.push('  opacity: var(--dsh-skin-image-opacity);')
  L.push('  pointer-events: none;')
  L.push('}')

  // 亮色：主背景 token 调半透明，让背景图透出来
  L.push('body[data-dsh-skin] {')
  L.push(cssVar('dsw-alias-bg-base', 'rgb(249 250 251 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-alias-bg-layer-1', 'rgb(249 250 251 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-alias-bg-layer-2', 'rgb(249 250 251 / calc(var(--dsh-skin-ui-alpha) + 0.08))'))
  L.push(cssVar('dsw-alias-bg-layer-3', 'rgb(249 250 251 / calc(var(--dsh-skin-ui-alpha) + 0.12))'))
  L.push(cssVar('dsw-specific-sidebar-fill', 'rgb(249 250 251 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-alias-bg-module-platform', 'rgb(245 246 247 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-specific-menu', 'rgb(249 250 251 / 0.92)'))
  L.push(cssVar('dsw-alias-bg-overlay', 'rgb(233 236 242 / 0.92)'))
  L.push('}')

  // 暗色：主背景 token 半透明
  L.push('body[data-ds-dark-theme][data-dsh-skin] {')
  L.push(cssVar('dsw-alias-bg-base', 'rgb(21 21 23 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-alias-bg-layer-1', 'rgb(35 35 36 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-alias-bg-layer-2', 'rgb(44 44 46 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-alias-bg-layer-3', 'rgb(53 54 56 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-specific-sidebar-fill', 'rgb(27 27 28 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-alias-bg-module-platform', 'rgb(44 44 46 / var(--dsh-skin-ui-alpha))'))
  L.push(cssVar('dsw-specific-menu', 'rgb(35 35 36 / 0.92)'))
  L.push(cssVar('dsw-alias-bg-overlay', 'rgb(67 69 74 / 0.92)'))
  L.push('}')

  return L.join('\n')
}

/** 应用简约皮肤，返回 dispose（移除样式与 body 钩子）。 */
export function applySimple(values: SimpleSkinValues): () => void {
  const body = document.body
  if (!body) return () => {}
  body.setAttribute('data-dsh-skin', 'on')
  let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!tag) {
    tag = document.createElement('style')
    tag.id = STYLE_ID
    document.head.appendChild(tag)
  }
  tag.textContent = buildCss(values)
  return () => {
    document.body?.removeAttribute('data-dsh-skin')
    document.getElementById(STYLE_ID)?.remove()
  }
}
