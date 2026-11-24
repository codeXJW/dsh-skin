/**
 * 鲸鱼娘昼夜工坊 · 场景版（Small-tailqwq / Deep Whale Day & Night 0.1.12 素材）。
 *
 * 上游原包面向 DSH 0.1.0-rc.7，在 0.2.x 上只有一半装饰能挂上；这里改用 0.2.x
 * 布局与会话钩子还原昼夜场景、侧栏、输入卡与消息装饰。
 * 素材仍由 Host 的 /skin-assets/deep-whale-day-night/* 本地只读路由提供。
 *
 * 与「深海女仆工坊 · 完整主题」的关系：同一作者、同一角色的另一条线（昼夜双场景），
 * 两个 pack 可并存，SkinManager 保证同一时刻只生效一个。
 *
 * 素材许可：CC BY-NC-SA 4.0（非商业、署名链 上善 → zipzip → Small-tailqwq），
 * 见同目录 NOTICE.md。
 */
import type { PackPreset } from '../../core/types'
import { DWN_ASSETS } from './art'
import { applyDeepWhaleDayNight } from './runtime'

export const DEEP_WHALE_DAY_NIGHT_PACK: PackPreset = {
  kind: 'pack',
  id: 'deep-whale-day-night',
  name: '鲸鱼娘昼夜工坊 · 场景版',
  desc: '白昼水晶工坊 / 夜晚月潮观测室：双场景、侧栏伙伴、输入框与会话饰边，随原生亮暗切换',
  credit: '素材 Deep Whale Day & Night v0.1.12（作者 Small-tailqwq）CC BY-NC-SA 4.0 非商用；场景版运行时由 dsh-skin 重写',
  preview: DWN_ASSETS.DEEP_WHALE_DAY_SCENE,
  apply: applyDeepWhaleDayNight,
}
