/**
 * 预设体系类型：双层预设。
 *  - SimplePreset：纯数据（主题色 + 背景图 + 透明度），走 simple/engine 的 token 注入。
 *  - PackPreset：完整皮肤包（自带 CSS/DOM 装饰/observer 生命周期），
 *    通过 PackContext 登记清理，SkinManager 保证同一时刻只有一个皮肤生效。
 */

/** 整包皮肤的运行上下文：语义对齐 cordis 的 ctx.effect。 */
export interface PackContext {
  /**
   * 立即执行 setup；若返回清理函数则登记，pack 停用时按逆序执行。
   * setup 抛错只记录 console.error，不影响其余清理的登记与执行。
   */
  effect(setup: () => (() => void) | void, label?: string): void
}

interface PresetBase {
  id: string
  name: string
  desc: string
  credit: string
  /** 皮肤中心卡片缩略图。 */
  preview: string
}

export interface SimplePreset extends PresetBase {
  kind: 'simple'
  accent: string
  bgImage: string
  bgOpacity: number
  /** 界面面板不透明度（越低背景越透）。 */
  uiAlpha: number
}

export interface PackPreset extends PresetBase {
  kind: 'pack'
  apply(ctx: PackContext): void
}

export type SkinPreset = SimplePreset | PackPreset
