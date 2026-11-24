import type { PackContext } from '../../core/types'
import { DWN_CSS } from './style'

const OWNER = 'deep-whale-day-night'
const BODY_ATTR = 'data-dsh-dwn'

// 只在新版侧栏底部和 composer 定位点挂装饰，跟随宿主布局一起移动。
const DECORATIONS = {
  'dwn:sidebar-companion': ":is([data-pane='sidebar'], [class$='_sidebarCol']) [class$='_footArea']",
  'dwn:composer-crown': "[data-composer-card] [class$='_overlayAnchor']",
} as const
const HOST_SELECTOR = "[class$='_footArea'], [class$='_overlayAnchor']"
const OWNED_SELECTOR = `[data-skin-owner='${OWNER}']`

export function applyDeepWhaleDayNight(ctx: PackContext): void {
  const body = document.body
  const previousAttribute = body.getAttribute(BODY_ATTR)
  const style = document.createElement('style')
  style.dataset.skinOwner = OWNER
  style.dataset.skinChrome = 'dwn:styles'
  style.textContent = DWN_CSS
  const ownedNodes = new Set<HTMLElement>([style])
  let observer: MutationObserver | undefined

  const syncDecorations = (): void => {
    for (const node of ownedNodes) {
      if (!node.isConnected) ownedNodes.delete(node)
    }
    for (const [name, selector] of Object.entries(DECORATIONS)) {
      for (const host of body.querySelectorAll(selector)) {
        if (host.querySelector(`[data-skin-chrome='${name}']`)) continue
        const node = document.createElement('div')
        node.dataset.skinOwner = OWNER
        node.dataset.skinChrome = name
        node.setAttribute('aria-hidden', 'true')
        ownedNodes.add(node)
        host.prepend(node)
      }
    }
  }

  // 先登记清理，切换皮肤时同时收回样式、装饰和监听。
  ctx.effect(() => () => {
    observer?.disconnect()
    for (const node of ownedNodes) node.remove()
    if (previousAttribute === null) body.removeAttribute(BODY_ATTR)
    else body.setAttribute(BODY_ATTR, previousAttribute)
  }, `pack/${OWNER}: theme and chrome`)

  body.setAttribute(BODY_ATTR, '')
  document.head.append(style)
  syncDecorations()

  observer = new MutationObserver(records => {
    // 聊天流式更新与皮肤自身的插入均无需扫描整个页面。
    const layoutChanged = records.some(record => [...record.addedNodes, ...record.removedNodes]
      .some(node => node instanceof Element && !node.matches(OWNED_SELECTOR)
        && (node.matches(HOST_SELECTOR) || node.querySelector(HOST_SELECTOR) !== null)))
    if (layoutChanged) syncDecorations()
  })
  observer.observe(body, { childList: true, subtree: true })
}
