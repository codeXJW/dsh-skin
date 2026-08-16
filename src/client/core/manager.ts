/**
 * SkinManager：皮肤生命周期调度器。
 *
 * 不变量：同一时刻至多一个皮肤生效；切换 = 先 dispose 旧皮肤再 apply 新皮肤。
 *  - 简约皮肤（含自定义组合）：重建 <style> 成本极低，任何配置变化直接重放。
 *  - 整包皮肤（pack）：持有 observer/定时器/注入节点，同一个 pack 重复
 *    activate 是幂等空操作；仅当目标变化时才 dispose/apply。
 *
 * dispose 语义遵循整包仓库的生命周期规范：只恢复本次 activation 改过的状态，
 * 清理先登记后执行（逆序），单个清理抛错不波及其余清理。
 */
import type { SkinConfig } from './config'
import type { PackContext, PackPreset, SkinPreset } from './types'
import { applySimple } from '../simple/engine'

interface ActiveSkin {
  /** 'simple' 或 pack 的 preset id。 */
  id: string
  dispose: () => void
}

class PackContextImpl implements PackContext {
  private cleanups: Array<{ label?: string; fn: () => void }> = []

  effect(setup: () => (() => void) | void, label?: string): void {
    let cleanup: (() => void) | void
    try {
      cleanup = setup()
    } catch (err) {
      console.error(`[dsh-skin] pack effect setup failed (${label ?? 'anonymous'}):`, err)
      return
    }
    if (typeof cleanup === 'function') this.cleanups.push({ label, fn: cleanup })
  }

  dispose(): void {
    for (const { label, fn } of this.cleanups.splice(0).reverse()) {
      try {
        fn()
      } catch (err) {
        console.error(`[dsh-skin] pack cleanup failed (${label ?? 'anonymous'}):`, err)
      }
    }
  }
}

export class SkinManager {
  private active: ActiveSkin | null = null

  constructor(private readonly resolve: (id: string) => SkinPreset | undefined) {}

  /** 当前生效的 pack id；简约/关闭时为 null。 */
  get activePackId(): string | null {
    return this.active !== null && this.active.id !== 'simple' ? this.active.id : null
  }

  activate(cfg: SkinConfig): void {
    const preset = cfg.presetId !== null ? this.resolve(cfg.presetId) : undefined
    if (cfg.enabled && preset?.kind === 'pack') {
      this.activatePack(preset)
      return
    }
    this.activateSimple(cfg, preset?.kind === 'simple' ? preset : undefined)
  }

  /** 卸掉当前皮肤（插件卸载 / 配置关闭时调用）。 */
  deactivate(): void {
    this.active?.dispose()
    this.active = null
  }

  private activatePack(preset: PackPreset): void {
    if (this.active?.id === preset.id) return // 幂等：同 pack 重放配置不重建
    this.deactivate()
    const ctx = new PackContextImpl()
    try {
      preset.apply(ctx)
    } catch (err) {
      console.error(`[dsh-skin] pack apply failed (${preset.id}):`, err)
    }
    // apply 部分失败也要能干净回退：dispose 只清理已登记的 effect。
    this.active = { id: preset.id, dispose: () => ctx.dispose() }
  }

  private activateSimple(cfg: SkinConfig, preset?: SkinPreset & { kind: 'simple' }): void {
    this.deactivate()
    if (!cfg.enabled) return
    const dispose = applySimple(preset
      ? { accent: preset.accent, bgImage: preset.bgImage, bgOpacity: preset.bgOpacity, uiAlpha: preset.uiAlpha }
      : { accent: cfg.accent, bgImage: cfg.bgImage, bgOpacity: cfg.bgOpacity, uiAlpha: cfg.uiAlpha })
    this.active = { id: 'simple', dispose }
  }
}
