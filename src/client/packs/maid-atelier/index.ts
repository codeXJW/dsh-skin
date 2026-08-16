/**
 * 深海女仆工坊 · 完整主题包。
 * 素材与署名见同目录 NOTICE.md（CC BY-NC-SA 4.0，非商用）。
 * 昼夜合一：pack CSS 自带亮/暗双套，跟随官方 data-ds-dark-theme 切换。
 */
import type { PackPreset } from '../../core/types'
import { MAID_PALACE_DAY } from '../../presets/backgrounds.generated'
import { applyMaidAtelier } from './runtime'

export const MAID_ATELIER_PACK: PackPreset = {
  kind: 'pack',
  id: 'maid-atelier',
  name: '深海女仆工坊 · 完整主题',
  desc: '双女仆立绘 · 金框侧栏 · 蕾丝帘饰带 · 缎带选中态，昼夜自动跟随',
  credit: 'dsh-deep-whale/maid-atelier（作者 Small-tailqwq）CC BY-NC-SA 4.0',
  preview: MAID_PALACE_DAY,
  apply: applyMaidAtelier,
}
