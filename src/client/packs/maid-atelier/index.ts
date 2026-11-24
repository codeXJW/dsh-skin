/**
 * 深海女仆工坊 · 完整主题（0.1.9 移植版）。
 *
 * 运行时来自 `upstream.ts`（由 `scripts/transplant-maid.mjs` 从已安装的
 * `@smalltailqwq/dsh-client-ui-skin-maid-atelier@0.1.9` 机械移植并去掉浏览器
 * 头部行为），素材由本插件 Host 半的 `/skin-assets/maid-atelier/*` 路由提供。
 *
 * 素材与署名见同目录 NOTICE.md（CC BY-NC-SA 4.0，非商用；输入框右上角小机器人
 * 为「大肥鱼项目署名许可 1.0」，需署名 YunYueSama）。
 * 昼夜合一：pack CSS 自带亮/暗双套，跟随官方 data-ds-dark-theme 切换。
 */
import type { PackPreset } from '../../core/types'
import { MAID_PALACE_DAY } from '../../presets/backgrounds.generated'
import { applyMaidAtelierPack } from './upstream'

export const MAID_ATELIER_PACK: PackPreset = {
  kind: 'pack',
  id: 'maid-atelier',
  name: '深海女仆工坊 · 完整主题',
  desc: '双女仆立绘 · 深蓝蕾丝侧栏与帘饰 · 输入框帘饰与缎带 · 设置/表格卡框 · 昼夜自动跟随',
  credit:
    'dsh-deep-whale/maid-atelier v0.1.9（作者 Small-tailqwq）CC BY-NC-SA 4.0；输入框小机器人 YunYueSama/codex-deepseek-pet（大肥鱼项目署名许可 1.0）',
  preview: MAID_PALACE_DAY,
  apply: applyMaidAtelierPack,
}
