/**
 * @dsh-external/dsh-skin — client 换肤实现（双层预设体系）。
 *
 * 机制：
 *  - SkinManager 同一时刻只让一个皮肤生效：简约皮肤（token + 背景图注入，
 *    见 simple/engine.ts）与整包皮肤（packs/*，自带 CSS/DOM/observer 生命
 *    周期）互斥切换，dispose 先行、不留残留。
 *  - apply() 时按 localStorage 配置立即生效（不依赖打开设置面板）。
 *  - 设置 → 「外观皮肤」section（settings.section 列表槽）：
 *    完整主题画廊（整包，昼夜自动跟随）/ 简约预设画廊 / 开关 / 主题色
 *    （取色器 + 预设色板）/ 背景图上传 / 透明度 / 恢复默认。
 *  - 预设只持久化 presetId；手动微调即退出预设、固化当时的生效值为自定义。
 */
import { useEffect, useState } from 'react'
import type { ChangeEvent, CSSProperties, ReactElement } from 'react'
import { defaultConfig, loadConfig, saveConfig } from './core/config'
import type { SkinConfig } from './core/config'
import { SkinManager } from './core/manager'
import type { SimplePreset, SkinPreset } from './core/types'
import { SKIN_PRESETS, findPreset } from './presets'

const MAX_FILE_BYTES = 3 * 1024 * 1024

const COLOR_SWATCHES = [
  '#3964fe', '#0ea5e9', '#059669', '#14b8a6',
  '#7c3aed', '#e11d48', '#f59e0b', '#334155',
]

const manager = new SkinManager(findPreset)

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
  position: 'relative',
}
const cardThumb: CSSProperties = { height: 84, backgroundSize: 'cover', backgroundPosition: 'center' }
const cardBadge: CSSProperties = {
  position: 'absolute',
  top: 6,
  left: 6,
  padding: '1px 7px',
  borderRadius: 6,
  fontSize: 10,
  lineHeight: '16px',
  color: '#fff',
  background: 'rgb(0 0 0 / 0.45)',
  backdropFilter: 'blur(4px)',
}
const cardBody: CSSProperties = { padding: '6px 8px' }
const cardName: CSSProperties = { fontSize: 12, color: 'var(--dsw-alias-label-primary)', fontWeight: 600, lineHeight: 1.4 }
const cardDesc: CSSProperties = { fontSize: 11, color: 'var(--dsw-alias-label-tertiary)', lineHeight: 1.35, marginTop: 2 }
const groupLabel: CSSProperties = { ...rowLabel, width: 'auto', fontWeight: 600 }

function PresetGallery(props: {
  title: string
  presets: SkinPreset[]
  activeId: string | null
  onApply: (preset: SkinPreset) => void
}): ReactElement {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 0' }}>
      <span style={groupLabel}>{props.title}</span>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {props.presets.map((preset) => {
          const active = props.activeId === preset.id
          return (
            <button
              key={preset.id}
              title={`${preset.name} · ${preset.credit}`}
              style={{
                ...card,
                outline: active ? '2px solid var(--dsw-alias-brand-primary)' : 'none',
                outlineOffset: 1,
              }}
              onClick={() => props.onApply(preset)}
            >
              <div style={{ ...cardThumb, backgroundImage: `url("${preset.preview}")` }} />
              <span style={cardBadge}>{preset.kind === 'pack' ? '完整主题' : '简约'}</span>
              <div style={cardBody}>
                <div style={cardName}>{preset.name}</div>
                <div style={cardDesc}>{preset.desc}</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function SkinSection(): ReactElement {
  const [cfg, setCfg] = useState<SkinConfig>(() => loadConfig((id) => findPreset(id) !== undefined))

  useEffect(() => {
    manager.activate(cfg)
    saveConfig(cfg)
  }, [cfg])

  const activePreset = cfg.presetId !== null ? findPreset(cfg.presetId) : undefined
  const packActive = cfg.enabled && activePreset?.kind === 'pack'

  /**
   * 手动微调（改色/换图/调透明度）会退出预设模式：
   * 从简约预设退出时把预设背景固化为自定义起点（预设期间 bgImage 字段
   * 为 null，背景取自注册表，不写 localStorage）；keepPreset 用于开关等
   * 非样式改动。
   */
  const update = (patch: Partial<SkinConfig>, opts?: { keepPreset?: boolean }): void =>
    setCfg((prev) => {
      if (opts?.keepPreset) return { ...prev, ...patch }
      const seeded: Partial<SkinConfig> = {}
      const prevPreset = prev.presetId !== null ? findPreset(prev.presetId) : undefined
      if (prevPreset?.kind === 'simple' && patch.bgImage === undefined && prev.bgImage === null) {
        seeded.bgImage = prevPreset.bgImage
      }
      return { ...prev, ...seeded, ...patch, presetId: null }
    })

  const applyPreset = (preset: SkinPreset): void =>
    setCfg((prev) => preset.kind === 'pack'
      // 整包自带全部样式：只切 presetId，自定义字段原样保留（退出后接着用）
      ? { ...prev, enabled: true, presetId: preset.id }
      // 简约：参数复制进配置（bgImage 置 null = 生效期取预设图，不落盘）
      : {
        enabled: true,
        presetId: preset.id,
        accent: preset.accent,
        bgImage: null,
        bgOpacity: preset.bgOpacity,
        uiAlpha: preset.uiAlpha,
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

  const packs = SKIN_PRESETS.filter((p) => p.kind === 'pack')
  const simples = SKIN_PRESETS.filter((p): p is SimplePreset => p.kind === 'simple')
  // 面板里展示的背景图：预设生效期取预设图，自定义期取 cfg.bgImage
  const effectiveBgImage = activePreset?.kind === 'simple' ? activePreset.bgImage : cfg.bgImage

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: '100%' }}>
      <PresetGallery title="完整主题（自带全部装饰，昼夜自动跟随）" presets={packs} activeId={cfg.presetId} onApply={applyPreset} />
      <PresetGallery title="简约皮肤（背景图 + 主题色）" presets={simples} activeId={cfg.presetId} onApply={applyPreset} />

      {activePreset !== undefined && (
        <span style={hint}>
          当前预设：{activePreset.name}（素材署名：{activePreset.credit}，改动下方选项即切换为自定义）
        </span>
      )}

      <div style={row}>
        <span style={rowLabel}>启用皮肤</span>
        <input type="checkbox" checked={cfg.enabled} onChange={(e) => update({ enabled: e.target.checked }, { keepPreset: true })} />
      </div>

      <div style={packActive ? { opacity: 0.45, pointerEvents: 'none' } : undefined}>
        <div style={row}>
          <span style={rowLabel}>主题色</span>
          <input type="color" value={cfg.accent} onChange={(e) => update({ accent: e.target.value })} />
          {COLOR_SWATCHES.map((p) => (
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
          {effectiveBgImage !== null && (
            <img src={effectiveBgImage} alt="预览" style={{ height: 40, borderRadius: 6, border: '1px solid var(--dsw-alias-border-l2)' }} />
          )}
          {effectiveBgImage !== null && <button onClick={() => update({ bgImage: null })}>移除</button>}
        </div>

        {effectiveBgImage !== null && (
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

        {effectiveBgImage !== null && (
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
      </div>
      {packActive && <span style={hint}>完整主题自带全部样式，以上自定义选项在主题生效期间停用。</span>}

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
  // 立即按已存配置生效（不依赖用户打开面板）；插件卸载时整体还原。
  manager.activate(loadConfig((id) => findPreset(id) !== undefined))
  ctx.effect(() => () => manager.deactivate(), 'dsh-skin: skin lifecycle')

  // 设置 → 外观皮肤（settings.section 为 ui-settings-general 声明的 root 列表槽）
  ctx.effect(() => ctx.slots.inject('settings.section', () =>
    ctx.slots.register({
      name: 'settings.section',
      id: 'skin',
      order: 10,
      label: () => '外观皮肤',
    }, SkinSection),
  ) as unknown as () => void, 'dsh-skin: settings section')
}
