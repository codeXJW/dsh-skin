import type { PackPreset } from '../../core/types'
import { makeCssPack } from '../css-pack'
import { DENIA_ART } from './art'
import { mountDeniaDecorations } from './runtime'
import { DENIA_CSS } from './style'

const base = makeCssPack({
  id: 'denia',
  name: '达妮娅 · 虚无之泡',
  desc: '布景之形 / 幻灭之形：双背景、左右立绘、Q 版伙伴、虹彩泡泡与锁链边饰，跟随原生亮暗切换',
  credit: 'Ewnscat / dsh-client-ui-skin-denia v1.0.0（CC BY-NC-SA 4.0）；角色原作：库洛游戏',
  bodyAttr: 'data-dsh-denia',
  accent: '#9B6BD8',
  css: DENIA_CSS,
})

export const DENIA_PACK: PackPreset = {
  ...base,
  preview: DENIA_ART.preview,
  apply(ctx) {
    base.apply(ctx)
    mountDeniaDecorations(ctx)
  },
}
