/**
 * 蓝色大肥鱼 —— 完整主题包。
 *
 * 深海湖蓝主题：气泡上升 + 大肥鱼剪影缓游 + 描金浮游星光 + 海藻，
 * 输入框右上角站着一个 Q 版「猫耳女仆 + 大鱼尾」的小人（呆毛 / 猫耳 /
 * 女仆装 / 大鱼尾 / 金色星光），待机时闭眼微笑、运行时睁眼吐泡。
 *
 * 全部装饰件（含小人）为本插件手绘原创（MIT），随插件以 MIT 分发；
 * 另有一条可选的本机素材槽（assets-local/，不进仓库、不分发），
 * 接入方法见同目录 README.md。
 */
import type { PackPreset } from '../../core/types'
import { BFF_PREVIEW } from './art'
import { applyBlueFatFish } from './runtime'

export const BLUE_FAT_FISH_PACK: PackPreset = {
  kind: 'pack',
  id: 'blue-fat-fish',
  name: '蓝色大肥鱼',
  desc: '深海湖蓝：气泡与肥鱼剪影缓游 · 描金浮游星光 · 输入框右上角趴一只呆毛猫耳大鱼尾 Q 版小人，昼夜自动跟随',
  credit: '装饰件（含 Q 版小人）均为 dsh-skin 手绘原创（MIT）；本机素材槽素材版权归原权利人',
  preview: BFF_PREVIEW,
  apply: applyBlueFatFish,
}
