/**
 * 奥黛塔 · 冰湖天鹅（原神 7.0 至冬 · 冰系）—— 完整主题包。
 *
 * 装饰件（雪花/天鹅羽/冰晶）为本插件手绘原创（MIT）；
 * 角色立绘与场景背景属本机素材槽（assets-local/，不进仓库、不分发），
 * 接入方法与版权说明见同目录 README.md。
 */
import type { PackPreset } from '../../core/types'
import { ODETA_PREVIEW } from './art'
import { applyOdeta } from './runtime'

export const ODETA_PACK: PackPreset = {
  kind: 'pack',
  id: 'odeta-frozen-swan',
  name: '奥黛塔 · 冰湖天鹅',
  desc: '原神至冬印象：视差落雪 · 天鹅羽 · 冰蓝 token，昼夜自动跟随',
  credit: '装饰件 dsh-skin 原创（MIT）；立绘/背景为本机素材，版权归原权利人',
  preview: ODETA_PREVIEW,
  apply: applyOdeta,
}
