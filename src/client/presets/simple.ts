/**
 * 简约预设（纯数据：主题色 + 背景图 + 透明度）。
 *
 * 素材来源与许可见同目录 README.md 署名链：
 *  - touhou-hakurei / dsh-deep-whale：CC BY-NC-SA 4.0（非商用、衍生同许可）
 *  - @linxin666/dsh-client-ui-skin-miku：BSD-3-Clause
 */
import type { SimplePreset } from '../core/types'
import {
  HAKUREI_PALACE_LIGHT,
  HAKUREI_PALACE_DARK,
  MAID_PALACE_DAY,
  MAID_PALACE_NIGHT,
  MIKU_BACKDROP,
} from './backgrounds.generated'

export const SIMPLE_PRESETS: SimplePreset[] = [
  {
    kind: 'simple',
    id: 'hakurei-day',
    name: '博丽神社·灵梦（昼）',
    desc: '东方 Project 博丽神社白昼实景 · 朱红主色 · 纸白半透明面板',
    credit: 'touhou-hakurei（作者 xiake595）CC BY-NC-SA 4.0',
    preview: HAKUREI_PALACE_LIGHT,
    accent: '#c8442f',
    bgImage: HAKUREI_PALACE_LIGHT,
    bgOpacity: 0.9,
    uiAlpha: 0.58,
  },
  {
    kind: 'simple',
    id: 'hakurei-night',
    name: '博丽神社·灵梦（夜）',
    desc: '博丽神社夜景 · 更适合暗色模式',
    credit: 'touhou-hakurei（作者 xiake595）CC BY-NC-SA 4.0',
    preview: HAKUREI_PALACE_DARK,
    accent: '#c8442f',
    bgImage: HAKUREI_PALACE_DARK,
    bgOpacity: 0.9,
    uiAlpha: 0.58,
  },
  {
    kind: 'simple',
    id: 'maid-day',
    name: '深海女仆工坊·轻享（昼）',
    desc: '女仆工坊白昼背景 · 仅背景与配色，不含立绘与装饰',
    credit: 'dsh-deep-whale（作者 Small-tailqwq）CC BY-NC-SA 4.0',
    preview: MAID_PALACE_DAY,
    accent: '#c5a468',
    bgImage: MAID_PALACE_DAY,
    bgOpacity: 0.92,
    uiAlpha: 0.62,
  },
  {
    kind: 'simple',
    id: 'maid-night',
    name: '深海女仆工坊·轻享（夜）',
    desc: '女仆工坊夜景背景 · 更适合暗色模式',
    credit: 'dsh-deep-whale（作者 Small-tailqwq）CC BY-NC-SA 4.0',
    preview: MAID_PALACE_NIGHT,
    accent: '#c5a468',
    bgImage: MAID_PALACE_NIGHT,
    bgOpacity: 0.92,
    uiAlpha: 0.62,
  },
  {
    kind: 'simple',
    id: 'miku',
    name: '初音未来 · 电子歌姬',
    desc: '蓝紫洋红渐变 · 音符声波 · 毛玻璃面板',
    credit: '@linxin666/dsh-client-ui-skin-miku（作者 涂山苏苏）BSD-3-Clause',
    preview: MIKU_BACKDROP,
    accent: '#2e9bff',
    bgImage: MIKU_BACKDROP,
    bgOpacity: 0.88,
    uiAlpha: 0.52,
  },
]
