/**
 * 青瓷·月门 —— 示例整包皮肤（原创纯 CSS/SVG，无第三方素材，MIT）。
 * 作为 PackPreset 的参考实现：素材内联、状态投影、dispose 语义
 * 都是新皮肤可以直接照抄的最小完整骨架。
 */
import type { PackPreset } from '../../core/types'
import { CELADON_PREVIEW } from './art'
import { applyCeladon } from './runtime'

export const CELADON_PACK: PackPreset = {
  kind: 'pack',
  id: 'celadon-moon-gate',
  name: '青瓷·月门（示例整包）',
  desc: '原创纯 CSS/SVG：月门环 · 梅枝 · 印章 · 玉色 token，昼夜自动跟随',
  credit: 'dsh-skin 原创示例（MIT）',
  preview: CELADON_PREVIEW,
  apply: applyCeladon,
}
