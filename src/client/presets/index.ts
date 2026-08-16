/**
 * 预设皮肤定义（二次元主题）。
 *
 * 素材来源与许可见同目录 README.md 署名链：
 *  - touhou-hakurei / dsh-deep-whale：CC BY-NC-SA 4.0（非商用、衍生同许可）
 *  - @linxin666/dsh-client-ui-skin-miku：BSD-3-Clause
 */
import {
  HAKUREI_PALACE_LIGHT,
  HAKUREI_PALACE_DARK,
  MAID_PALACE_DAY,
  MAID_PALACE_NIGHT,
  MIKU_BACKDROP,
} from './backgrounds.generated'

export interface SkinPreset {
  id: string
  name: string
  desc: string
  credit: string
  accent: string
  bgImage: string
  bgOpacity: number
}

export const SKIN_PRESETS: SkinPreset[] = [
  {
    id: 'hakurei-day',
    name: '博丽神社·灵梦（昼）',
    desc: '东方 Project 博丽神社白昼实景 · 朱红主色 · 纸白半透明面板',
    credit: 'touhou-hakurei（作者 xiake595）CC BY-NC-SA 4.0',
    accent: '#c8442f',
    bgImage: HAKUREI_PALACE_LIGHT,
    bgOpacity: 0.85,
  },
  {
    id: 'hakurei-night',
    name: '博丽神社·灵梦（夜）',
    desc: '博丽神社夜景 · 更适合暗色模式',
    credit: 'touhou-hakurei（作者 xiake595）CC BY-NC-SA 4.0',
    accent: '#c8442f',
    bgImage: HAKUREI_PALACE_DARK,
    bgOpacity: 0.85,
  },
  {
    id: 'maid-day',
    name: '深海女仆工坊（昼）',
    desc: '双女仆工坊白昼场景 · 深海蓝蕾丝 · 柔金点缀',
    credit: 'dsh-deep-whale（作者 Small-tailqwq）CC BY-NC-SA 4.0',
    accent: '#c5a468',
    bgImage: MAID_PALACE_DAY,
    bgOpacity: 0.9,
  },
  {
    id: 'maid-night',
    name: '深海女仆工坊（夜）',
    desc: '女仆工坊夜景 · 更适合暗色模式',
    credit: 'dsh-deep-whale（作者 Small-tailqwq）CC BY-NC-SA 4.0',
    accent: '#c5a468',
    bgImage: MAID_PALACE_NIGHT,
    bgOpacity: 0.9,
  },
  {
    id: 'miku',
    name: '初音未来 · 电子歌姬',
    desc: '蓝紫洋红渐变 · 音符声波 · 毛玻璃面板',
    credit: '@linxin666/dsh-client-ui-skin-miku（作者 涂山苏苏）BSD-3-Clause',
    accent: '#2e9bff',
    bgImage: MIKU_BACKDROP,
    bgOpacity: 0.85,
  },
]
