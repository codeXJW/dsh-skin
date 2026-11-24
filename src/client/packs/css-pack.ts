/**
 * 纯 CSS 皮肤包的通用工厂。
 *
 * 这类皮肤的全部规则都以 `body[data-dsh-<id>]`（暗色再加 `[data-ds-dark-theme]`）
 * 为根作用域，运行时只需要：设置 body 属性 + 注入一份 <style>，dispose 时两样都收回。
 * 因此每套皮肤 = 一个 CSS 字符串 + 一份元数据，不必各写一套 runtime。
 *
 * 规范（见 packs/GUIDELINES.md）：
 *  - A1 作用域挂在 body 属性上，亮/暗由 CSS 自己分支；
 *  - D1 先登记清理再写入；
 *  - D2 dispose 只恢复本 pack 改过的状态（属性原值 + 自己的 <style> 节点）。
 */
import type { PackContext, PackPreset } from '../core/types'

export interface CssPackOptions {
  /** 预设 id（同时作为卡片去重键）。 */
  id: string
  name: string
  desc: string
  /** 素材/代码署名链，展示在卡片 tooltip 与「当前预设」说明里。 */
  credit: string
  /** 上游 CSS 使用的 body 属性名，如 `data-dsh-nord`。 */
  bodyAttr: string
  /** 主题主色，用于生成卡片缩略图。 */
  accent: string
  /** 完整皮肤 CSS（作用域已限制在 `body[<bodyAttr>]` 下）。 */
  css: string
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '')
  const full = value.length === 3 ? value.split('').map((char) => char + char).join('') : value
  const numeric = Number.parseInt(full, 16)
  return [(numeric >> 16) & 255, (numeric >> 8) & 255, numeric & 255]
}

function shade(hex: string, factor: number): string {
  const [r, g, b] = parseHex(hex)
  const channel = (value: number): string => clampByte(value * factor).toString(16).padStart(2, '0')
  return `#${channel(r)}${channel(g)}${channel(b)}`
}

/**
 * 卡片缩略图：用主题主色画一张抽象界面（侧栏 + 两块内容），不引入额外素材文件。
 * 返回 data URI，可直接放进 background-image: url("...")。
 */
function previewDataUri(accent: string): string {
  const deep = shade(accent, 0.45)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="304" height="168" viewBox="0 0 304 168"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${accent}"/><stop offset="1" stop-color="${deep}"/></linearGradient></defs><rect width="304" height="168" fill="url(#g)"/><rect x="14" y="16" width="76" height="136" rx="12" fill="#ffffff" fill-opacity=".16"/><rect x="102" y="16" width="188" height="48" rx="12" fill="#ffffff" fill-opacity=".26"/><rect x="102" y="74" width="188" height="26" rx="8" fill="#ffffff" fill-opacity=".14"/><rect x="102" y="110" width="120" height="26" rx="8" fill="#ffffff" fill-opacity=".2"/></svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

/** 把一份 body 作用域的 CSS 包成 PackPreset。 */
export function makeCssPack(options: CssPackOptions): PackPreset {
  const preview = previewDataUri(options.accent)
  return {
    kind: 'pack',
    id: options.id,
    name: options.name,
    desc: options.desc,
    credit: options.credit,
    preview,
    apply(ctx: PackContext): void {
      const body = document.body
      const attribute = options.bodyAttr
      const previous = body.getAttribute(attribute)
      const style = document.createElement('style')
      style.dataset.skinChrome = `css-pack:${options.id}`
      style.dataset.skinOwner = options.id
      style.textContent = options.css
      // 先登记清理再写入：apply 中途失败也能干净回退。
      ctx.effect(() => () => {
        style.remove()
        if (previous === null) body.removeAttribute(attribute)
        else body.setAttribute(attribute, previous)
      }, `css-pack/${options.id}: stylesheet and body attribute`)
      body.setAttribute(attribute, '')
      document.head.append(style)
    },
  }
}
