/**
 * 统一预设注册表：完整主题包（pack）在前，简约预设（simple）在后。
 * 皮肤中心按 kind 分组展示；SkinManager 按 kind 调度生效方式。
 */
import type { SkinPreset } from '../core/types'
import { MAID_ATELIER_PACK } from '../packs/maid-atelier'
import { CELADON_PACK } from '../packs/celadon'
import { ODETA_PACK } from '../packs/odeta'
import { SIMPLE_PRESETS } from './simple'

export const SKIN_PRESETS: SkinPreset[] = [
  MAID_ATELIER_PACK,
  CELADON_PACK,
  ODETA_PACK,
  ...SIMPLE_PRESETS,
]

export function findPreset(id: string): SkinPreset | undefined {
  return SKIN_PRESETS.find((p) => p.id === id)
}
