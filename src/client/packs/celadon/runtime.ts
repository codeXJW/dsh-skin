/**
 * 青瓷·月门 —— 整包运行时（示例皮肤，演示 pack 的标准写法）。
 *
 * 与 maid-atelier 同一套模式，刻意保持精简，便于作为新皮肤的模板：
 *  1. 先登记总清理（恢复快照、断 observer、摘注入节点），再做会失败的写入；
 *  2. 装饰节点一律带 data-skin-owner + data-celadon-chrome，observer 里
 *     用 isSkinChrome 忽略自身插入，避免装饰触发重复装饰；
 *  3. 状态只投影为 body 上的 data-* 属性，样式全部交给 CSS（含亮/暗、
 *     rail/宽侧栏、会话进行中退位），JS 不写任何具体样式值。
 */
import type { PackContext } from '../../core/types'
import { CELADON_MOON_GATE, CELADON_PLUM_BRANCH, CELADON_SEAL } from './art'
import { CELADON_CSS } from './style'

const SKIN_OWNER = 'celadon-moon-gate'
const SIDEBAR_COLUMN_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])"
const ACTIVE_CHAT_SELECTOR = "[data-phase='active'] [data-chat-flow]"

const CHROME_ART_PROPERTIES = [
  '--celadon-moon-gate-art',
  '--celadon-plum-branch-art',
  '--celadon-seal-art',
] as const

function makeChrome(tag: 'div' | 'span', name: string): HTMLElement {
  const el = document.createElement(tag)
  el.dataset.celadonChrome = name
  el.dataset.skinOwner = SKIN_OWNER
  el.setAttribute('aria-hidden', 'true')
  return el
}

export function applyCeladon(ctx: PackContext): void {
  const body = document.body
  const ownedNodes = new Set<Element>()
  const previousArt = new Map<string, string>()
  for (const property of CHROME_ART_PROPERTIES) {
    previousArt.set(property, body.style.getPropertyValue(property))
  }
  const hadChatActive = body.hasAttribute('data-celadon-chat-active')
  const previousSidebarSize = body.getAttribute('data-celadon-sidebar')

  let observer: MutationObserver | undefined
  let resizeObserver: ResizeObserver | undefined
  let observedSidebar: HTMLElement | undefined

  ctx.effect(() => () => {
    delete body.dataset.dshCeladon
    if (!hadChatActive) body.removeAttribute('data-celadon-chat-active')
    if (previousSidebarSize === null) body.removeAttribute('data-celadon-sidebar')
    else body.setAttribute('data-celadon-sidebar', previousSidebarSize)
    observer?.disconnect()
    resizeObserver?.disconnect()
    for (const [property, value] of previousArt) {
      body.style.setProperty(property, value)
    }
    ownedNodes.forEach((el) => el.remove())
  }, 'pack/celadon: celadon moon gate')

  // 样式与素材变量
  const styleTag = document.createElement('style')
  styleTag.dataset.skinOwner = SKIN_OWNER
  styleTag.textContent = CELADON_CSS
  ownedNodes.add(styleTag)
  document.head.append(styleTag)

  body.dataset.dshCeladon = ''
  body.style.setProperty('--celadon-moon-gate-art', `url("${CELADON_MOON_GATE}")`)
  body.style.setProperty('--celadon-plum-branch-art', `url("${CELADON_PLUM_BRANCH}")`)
  body.style.setProperty('--celadon-seal-art', `url("${CELADON_SEAL}")`)

  // 主区装饰层（月门 + 梅枝）
  const moon = makeChrome('div', 'moon-gate')
  const plum = makeChrome('div', 'plum-branch')
  ownedNodes.add(moon)
  ownedNodes.add(plum)
  body.prepend(moon, plum)

  const isSkinChrome = (node: Node): boolean => (
    node instanceof Element && node.getAttribute('data-skin-owner') === SKIN_OWNER
  )

  const applySidebarWidth = (width: number): void => {
    if (width <= 0) return
    body.dataset.celadonSidebar = width <= 120 ? 'rail' : width <= 220 ? 'narrow' : 'wide'
  }

  /** 侧栏装饰：印章钉进侧栏根（重复调用幂等）。 */
  const decorateSidebar = (): void => {
    const sidebarRoot = document
      .querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
      ?.querySelector<HTMLElement>(':scope > div')
    if (!sidebarRoot) return
    if (!sidebarRoot.querySelector("[data-celadon-chrome='seal']")) {
      const seal = makeChrome('span', 'seal')
      ownedNodes.add(seal)
      sidebarRoot.prepend(seal)
    }
    if (resizeObserver && sidebarRoot.parentElement !== observedSidebar) {
      if (observedSidebar) resizeObserver.unobserve(observedSidebar)
      observedSidebar = sidebarRoot.parentElement ?? undefined
      if (observedSidebar) resizeObserver.observe(observedSidebar)
    }
  }

  const syncChatState = (): void => {
    body.toggleAttribute('data-celadon-chat-active',
      document.querySelector(ACTIVE_CHAT_SELECTOR) !== null)
  }

  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      const entry = entries.at(-1)
      if (entry) applySidebarWidth(entry.contentRect.width)
    })
  }

  decorateSidebar()
  syncChatState()
  const initialSidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
  if (initialSidebar) applySidebarWidth(initialSidebar.getBoundingClientRect().width)

  observer = new MutationObserver((records) => {
    let sidebarChanged = false
    let chatChanged = false
    for (const record of records) {
      if (record.type === 'attributes') {
        if (record.attributeName === 'data-phase' || record.attributeName === 'data-chat-flow') {
          chatChanged = true
        }
        continue
      }
      const appNodes = [...record.addedNodes, ...record.removedNodes]
        .filter((node): node is Element => node instanceof Element && !isSkinChrome(node))
      if (appNodes.length === 0) continue
      const target = record.target instanceof Element ? record.target : null
      if (appNodes.some((node) => node.matches(SIDEBAR_COLUMN_SELECTOR)
        || node.querySelector(SIDEBAR_COLUMN_SELECTOR) !== null)
        || target?.closest(SIDEBAR_COLUMN_SELECTOR) !== null) {
        sidebarChanged = true
      }
      if (appNodes.some((node) => node.matches('[data-phase], [data-chat-flow]')
        || node.querySelector('[data-phase], [data-chat-flow]') !== null)) {
        chatChanged = true
      }
    }
    if (sidebarChanged) decorateSidebar()
    if (chatChanged) syncChatState()
  })
  observer.observe(body, {
    attributes: true,
    attributeFilter: ['data-phase', 'data-chat-flow'],
    childList: true,
    subtree: true,
  })
}
