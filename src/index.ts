/**
 * @dsh-external/dsh-skin — 换肤插件（host 侧）。
 *
 * 皮肤逻辑全部在 client（样式注入 + 设置面板 + localStorage 持久化）：
 *  - 主题色：覆盖 body / body[data-ds-dark-theme] 上的 --dsw-* 设计 token
 *    （--dsw-static-deepseek-* 色阶 + --dsw-alias-brand-* 品牌 token），
 *    组件全部消费 token，一处覆盖全局换肤。
 *  - 背景图：body::before 固定全屏层 + 把 bg-base/layer/sidebar 等 token
 *    调成半透明让图透出来。
 * host 侧仅保持插件生命周期占位（资源注册挂 ctx.effect 的规范），无工具/无监听。
 */
import type { Context } from 'cordis'

export const name = '@dsh-external/dsh-skin'
export const inject: string[] = []

export function apply(ctx: Context): void {
  ctx.logger?.info?.('[dsh-skin] 换肤插件已激活（使用：设置 → 外观皮肤）')
}
