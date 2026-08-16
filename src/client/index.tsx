/**
 * @dsh-external/dsh-skin — client 换肤实现。
 *
 * 机制：
 *  - apply() 时立即按 localStorage 配置注入 <style id="dsh-skin-style">，
 *    覆盖 design-platform.css 里的 --dsw-* 设计 token（body 亮色 /
 *    body[data-ds-dark-theme] 暗色两个作用域），并挂 body[data-dsh-skin] 属性。
 *  - 设置 → 「外观皮肤」section（settings.section 列表槽）：
 *    二次元预设皮肤画廊（内置博丽神社/深海女仆/初音未来，素材与署名见 presets/）/
 *    开关 / 主题色（取色器 + 预设色板）/ 背景图上传（FileReader → data URI，
 *    localStorage 持久化）/ 背景透明度 / 恢复默认。
 */
import { useEffect, useState } from 'react'
import type { ChangeEvent, CSSProperties, ReactElement } from 'react'
import { SKIN_PRESETS } from './presets'
import type { SkinPreset } from './presets'

const STORAGE_KEY = 'dsh-skin:config'
const STYLE_ID = 'dsh-skin-style'
const MAX_FILE_BYTES = 3 * 1024 * 1024

const PRESETS = [
  '#3964fe', '#0ea5e9', '#059669', '#14b8a6',
  '#7c3aed', '#e11d48', '#f59e0b', '#334155',
]

interface SkinConfig {
  enabled: boolean
  accent: string
  bgImage: string | null
  bgOpacity: number
  /** 界面面板不透明度（0.2~1，越低背景越透）。 */
  uiAlpha: number
  /** 当前生效的预设皮肤 id；null = 自定义组合。 */
  presetId: string | null
}

function defaultConfig(): SkinConfig {
  return { enabled: true, accent: '#3964fe', bgImage: null, bgOpacity: 0.9, uiAlpha: 0.62, presetId: null }
}

function loadConfig(): SkinConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultConfig()
    const p = JSON.parse(raw) as Partial<SkinConfig>
    return {
      enabled: typeof p.enabled === 'boolean' ? p.enabled : true,
      accent: typeof p.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(p.accent) ? p.accent : '#3964fe',
      bgImage: typeof p.bgImage === 'string' ? p.bgImage : null,
      bgOpacity: typeof p.bgOpacity === 'number' ? Math.min(1, Math.max(0.1, p.bgOpacity)) : 0.9,
      uiAlpha: typeof p.uiAlpha === 'number' ? Math.min(1, Math.max(0.2, p.uiAlpha)) : 0.62,
      presetId: typeof p.presetId === 'string' && SKIN_PRESETS.some((s) => s.id === p.presetId) ? p.presetId : null,
    }
  } catch {
    return defaultConfig()
  }
}

function saveConfig(cfg: SkinConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
  } catch {
    window.alert('皮肤配置保存失败（localStorage 空间不足？背景图请 ≤2.5MB）')
  }
}

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

function buildCss(cfg: SkinConfig): string {
  const ramp = accentRamp(cfg.accent)
  const img = cfg.bgImage ? `url("${cfg.bgImage}")` : 'none'
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
  L.push(cssVar('dsh-skin-image-opacity', String(cfg.bgOpacity)))
  L.push(cssVar('dsh-skin-ui-alpha', String(cfg.uiAlpha)))
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

/** 按配置注入/移除 <style> 与 body[data-dsh-skin] 属性。 */
function applySkin(cfg: SkinConfig): void {
  const body = document.body
  if (!body) return
  if (!cfg.enabled) {
    body.removeAttribute('data-dsh-skin')
    document.getElementById(STYLE_ID)?.remove()
    return
  }
  body.setAttribute('data-dsh-skin', 'on')
  let tag = document.getElementById(STYLE_ID) as HTMLStyleElement | null
  if (!tag) {
    tag = document.createElement('style')
    tag.id = STYLE_ID
    document.head.appendChild(tag)
  }
  tag.textContent = buildCss(cfg)
}

/* ── 设置面板（设置 → 外观皮肤） ───────────────────────────────── */

const row: CSSProperties = { display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', flexWrap: 'wrap' }
const rowLabel: CSSProperties = { width: 90, flex: 'none', color: 'var(--dsw-alias-label-secondary)', fontSize: 13 }
const field: CSSProperties = { color: 'var(--dsw-alias-label-primary)', background: 'var(--dsw-specific-input-major)', border: '1px solid var(--dsw-alias-border-l2)', borderRadius: 8, padding: '4px 8px', fontSize: 13 }
const hint: CSSProperties = { color: 'var(--dsw-alias-label-tertiary)', fontSize: 12 }
const swatch: CSSProperties = { width: 24, height: 24, borderRadius: 8, border: '1px solid var(--dsw-alias-border-l2)', cursor: 'pointer', padding: 0 }
const card: CSSProperties = {
  width: 152,
  borderRadius: 10,
  border: '1px solid var(--dsw-alias-border-l2)',
  overflow: 'hidden',
  cursor: 'pointer',
  background: 'var(--dsw-alias-bg-layer-2)',
  padding: 0,
  textAlign: 'left',
}
const cardThumb: CSSProperties = { height: 84, backgroundSize: 'cover', backgroundPosition: 'center' }
const cardBody: CSSProperties = { padding: '6px 8px' }
const cardName: CSSProperties = { fontSize: 12, color: 'var(--dsw-alias-label-primary)', fontWeight: 600, lineHeight: 1.4 }
const cardDesc: CSSProperties = { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', lineHeight: 1.35, marginTop: 2 }

function SkinSection(): ReactElement {
  const [cfg, setCfg] = useState<SkinConfig>(() => loadConfig())

  useEffect(() => {
    applySkin(cfg)
    saveConfig(cfg)
  }, [cfg])

  /** 手动微调（改色/换图/调透明度）会退出预设模式；keepPreset 用于开关等非样式改动。 */
  const update = (patch: Partial<SkinConfig>, opts?: { keepPreset?: boolean }): void =>
    setCfg((prev) => ({ ...prev, ...patch, presetId: opts?.keepPreset ? prev.presetId : null }))

  const applyPreset = (preset: SkinPreset): void =>
    setCfg({
      enabled: true,
      accent: preset.accent,
      bgImage: preset.bgImage,
      bgOpacity: preset.bgOpacity,
      uiAlpha: preset.uiAlpha,
      presetId: preset.id,
    })

  const onFile = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_FILE_BYTES) {
      window.alert(`图片过大（>${Math.round(MAX_FILE_BYTES / 1024 / 1024)}MB）。请压缩后再上传（建议 ≤2.5MB）。`)
      return
    }
    const reader = new FileReader()
    reader.onload = () => update({ bgImage: String(reader.result ?? '') })
    reader.readAsDataURL(file)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0' }}>
        <span style={{ ...rowLabel, width: 'auto', fontWeight: 600 }}>二次元预设皮肤</span>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {SKIN_PRESETS.map((preset) => {
            const active = cfg.presetId === preset.id
            return (
              <button
                key={preset.id}
                title={`${preset.name} · ${preset.credit}`}
                style={{
                  ...card,
                  outline: active ? '2px solid var(--dsw-alias-brand-primary)' : 'none',
                  outlineOffset: 1,
                }}
                onClick={() => applyPreset(preset)}
              >
                <div style={{ ...cardThumb, backgroundImage: `url("${preset.bgImage}")` }} />
                <div style={cardBody}>
                  <div style={cardName}>{preset.name}</div>
                  <div style={cardDesc}>{preset.desc}</div>
                </div>
              </button>
            )
          })}
        </div>
        {cfg.presetId !== null && (
          <span style={hint}>
            当前预设：{SKIN_PRESETS.find((s) => s.id === cfg.presetId)?.name ?? ''}（素材署名：{SKIN_PRESETS.find((s) => s.id === cfg.presetId)?.credit ?? ''}，改动下方选项即切换为自定义）
          </span>
        )}
      </div>

      <div style={row}>
        <span style={rowLabel}>启用皮肤</span>
        <input type="checkbox" checked={cfg.enabled} onChange={(e) => update({ enabled: e.target.checked }, { keepPreset: true })} />
      </div>

      <div style={row}>
        <span style={rowLabel}>主题色</span>
        <input type="color" value={cfg.accent} onChange={(e) => update({ accent: e.target.value })} />
        {PRESETS.map((p) => (
          <button
            key={p}
            title={p}
            style={{ ...swatch, background: p, outline: cfg.accent === p ? '2px solid var(--dsw-alias-brand-primary)' : 'none' }}
            onClick={() => update({ accent: p })}
          />
        ))}
      </div>

      <div style={row}>
        <span style={rowLabel}>背景图</span>
        <input type="file" accept="image/*" onChange={onFile} style={field} />
        {cfg.bgImage !== null && (
          <img src={cfg.bgImage} alt="预览" style={{ height: 40, borderRadius: 6, border: '1px solid var(--dsw-alias-border-l2)' }} />
        )}
        {cfg.bgImage !== null && <button onClick={() => update({ bgImage: null })}>移除</button>}
      </div>

      {cfg.bgImage !== null && (
        <div style={row}>
          <span style={rowLabel}>背景透明度</span>
          <input
            type="range"
            min={0.1}
            max={1}
            step={0.01}
            value={cfg.bgOpacity}
            onChange={(e) => update({ bgOpacity: Number(e.target.value) })}
          />
          <span style={hint}>{Math.round(cfg.bgOpacity * 100)}%</span>
        </div>
      )}

      {cfg.bgImage !== null && (
        <div style={row}>
          <span style={rowLabel}>界面透明度</span>
          <input
            type="range"
            min={0.2}
            max={1}
            step={0.01}
            value={cfg.uiAlpha}
            onChange={(e) => update({ uiAlpha: Number(e.target.value) })}
          />
          <span style={hint}>{Math.round((1 - cfg.uiAlpha) * 100)}% 透</span>
        </div>
      )}

      <div style={row}>
        <button onClick={() => setCfg(defaultConfig())}>恢复默认</button>
        <span style={hint}>背景图保存在浏览器本地（localStorage），建议 ≤2.5MB</span>
      </div>
    </div>
  )
}

/* ── 插件装配 ─────────────────────────────────────────────────── */

type SlotRegisterOptions = {
  name: string
  id: string
  order?: number
  label?: string | (() => string)
}

type SlotsLike = {
  inject(slot: string, factory: () => unknown): unknown
  register(options: SlotRegisterOptions, component: unknown): unknown
}

type SkinClientContext = {
  slots: SlotsLike
  effect(fn: () => (() => void) | void, label?: string): void
}

export const inject = ['slots']

export function apply(ctx: SkinClientContext): void {
  // 立即按已存配置生效（不依赖用户打开面板）
  applySkin(loadConfig())

  // 设置 → 外观皮肤（settings.section 为 ui-settings-general 声明的 root 列表槽）
  ctx.effect(() => ctx.slots.inject('settings.section', () =>
    ctx.slots.register({
      name: 'settings.section',
      id: 'skin',
      order: 10,
      label: () => '外观皮肤',
    }, SkinSection),
  ), 'dsh-skin: settings section')
}
