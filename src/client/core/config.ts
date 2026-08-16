/**
 * 皮肤配置的 localStorage 读写与校验。
 *
 * 预设只存 presetId（简约预设的色值/背景、整包的全部样式都在注册表里），
 * 避免把预设背景图的 data URI 复制进 localStorage 顶爆 ~5MB 配额；
 * 用户在预设基础上手动微调时才会把当时的生效值固化为自定义配置。
 */
export const STORAGE_KEY = 'dsh-skin:config'

export interface SkinConfig {
  enabled: boolean
  /** 当前生效的预设 id；null = 自定义组合（使用下方字段）。 */
  presetId: string | null
  accent: string
  bgImage: string | null
  bgOpacity: number
  /** 界面面板不透明度（0.2~1，越低背景越透）。 */
  uiAlpha: number
}

export function defaultConfig(): SkinConfig {
  return { enabled: true, presetId: null, accent: '#3964fe', bgImage: null, bgOpacity: 0.9, uiAlpha: 0.62 }
}

export function loadConfig(isValidPreset: (id: string) => boolean): SkinConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultConfig()
    const p = JSON.parse(raw) as Partial<SkinConfig>
    return {
      enabled: typeof p.enabled === 'boolean' ? p.enabled : true,
      presetId: typeof p.presetId === 'string' && isValidPreset(p.presetId) ? p.presetId : null,
      accent: typeof p.accent === 'string' && /^#[0-9a-fA-F]{6}$/.test(p.accent) ? p.accent : '#3964fe',
      bgImage: typeof p.bgImage === 'string' ? p.bgImage : null,
      bgOpacity: typeof p.bgOpacity === 'number' ? Math.min(1, Math.max(0.1, p.bgOpacity)) : 0.9,
      uiAlpha: typeof p.uiAlpha === 'number' ? Math.min(1, Math.max(0.2, p.uiAlpha)) : 0.62,
    }
  } catch {
    return defaultConfig()
  }
}

export function saveConfig(cfg: SkinConfig): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg))
  } catch {
    window.alert('皮肤配置保存失败（localStorage 空间不足？背景图请 ≤2.5MB）')
  }
}
