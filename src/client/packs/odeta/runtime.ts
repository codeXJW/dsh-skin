/**
 * 奥黛塔 · 冰湖天鹅 —— 整包运行时。
 *
 * 与 celadon 同一骨架（packs/GUIDELINES.md 的 D 章生命周期），多两件事：
 *  1. 本机素材槽：local-art.generated.ts 里有立绘/背景时挂载立绘层并切换
 *     body 背景（快照原值、dispose 恢复）；没有则纯原创装饰版照样完整工作。
 *  2. 双雪层 + 羽毛 + 可选立绘，全部皮肤自有节点（data-skin-owner），
 *     observer 里忽略自身插入（C2）。
 */
import type { PackContext } from '../../core/types'
import { ODETA_ICE_CRYSTAL, ODETA_SNOW_TILE_FAR, ODETA_SNOW_TILE_NEAR, ODETA_SWAN_FEATHER } from './art'
import { ODETA_LOCAL_BACKDROP, ODETA_LOCAL_PORTRAIT } from './local-art.generated'
import { ODETA_CSS } from './style'

const SKIN_OWNER = 'odeta-frozen-swan'
const SIDEBAR_COLUMN_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])"
const ACTIVE_CHAT_SELECTOR = "[data-phase='active'] [data-chat-flow]"

const CHROME_ART_PROPERTIES = [
  '--odeta-snow-far-art',
  '--odeta-snow-near-art',
  '--odeta-feather-art',
  '--odeta-crystal-art',
] as const

const BACKDROP_PROPERTIES = [
  'background-image',
  'background-position',
  'background-size',
  'background-attachment',
  'background-repeat',
] as const

function makeChrome(tag: 'div' | 'span' | 'img', name: string): HTMLElement {
  const el = document.createElement(tag)
  el.dataset.odetaChrome = name
  el.dataset.skinOwner = SKIN_OWNER
  el.setAttribute('aria-hidden', 'true')
  return el
}

export function applyOdeta(ctx: PackContext): void {
  const body = document.body
  const ownedNodes = new Set<Element>()
  const previousArt = new Map<string, string>()
  for (const property of [...CHROME_ART_PROPERTIES, ...BACKDROP_PROPERTIES]) {
    previousArt.set(property, body.style.getPropertyValue(property))
  }
  const hadChatActive = body.hasAttribute('data-odeta-chat-active')
  const hadBackdrop = body.hasAttribute('data-odeta-has-backdrop')
  const hadPortrait = body.hasAttribute('data-odeta-has-portrait')
  const previousSidebarSize = body.getAttribute('data-odeta-sidebar')

  let observer: MutationObserver | undefined
  let resizeObserver: ResizeObserver | undefined
  let observedSidebar: HTMLElement | undefined

  ctx.effect(() => () => {
    delete body.dataset.dshOdeta
    if (!hadChatActive) body.removeAttribute('data-odeta-chat-active')
    if (!hadBackdrop) body.removeAttribute('data-odeta-has-backdrop')
    if (!hadPortrait) body.removeAttribute('data-odeta-has-portrait')
    if (previousSidebarSize === null) body.removeAttribute('data-odeta-sidebar')
    else body.setAttribute('data-odeta-sidebar', previousSidebarSize)
    observer?.disconnect()
    resizeObserver?.disconnect()
    for (const [property, value] of previousArt) {
      body.style.setProperty(property, value)
    }
    ownedNodes.forEach((el) => el.remove())
  }, 'pack/odeta: frozen lake swan')

  // 样式与素材变量
  const styleTag = document.createElement('style')
  styleTag.dataset.skinOwner = SKIN_OWNER
  styleTag.textContent = ODETA_CSS
  ownedNodes.add(styleTag)
  document.head.append(styleTag)

  body.dataset.dshOdeta = ''
  body.style.setProperty('--odeta-snow-far-art', `url("${ODETA_SNOW_TILE_FAR}")`)
  body.style.setProperty('--odeta-snow-near-art', `url("${ODETA_SNOW_TILE_NEAR}")`)
  body.style.setProperty('--odeta-feather-art', `url("${ODETA_SWAN_FEATHER}")`)
  body.style.setProperty('--odeta-crystal-art', `url("${ODETA_ICE_CRYSTAL}")`)

  // 本机背景图：存在时切 body 背景并停用 CSS 渐变（样式表按属性钩子切换）
  if (ODETA_LOCAL_BACKDROP.length > 0) {
    body.setAttribute('data-odeta-has-backdrop', '')
    body.style.setProperty('background-image', `url("${ODETA_LOCAL_BACKDROP}")`)
    body.style.setProperty('background-position', 'center top')
    body.style.setProperty('background-size', 'cover')
    body.style.setProperty('background-attachment', 'scroll')
    body.style.setProperty('background-repeat', 'no-repeat')
  }

  // 雪层（远/近视差）
  const snowFar = makeChrome('div', 'snow-far')
  const snowNear = makeChrome('div', 'snow-near')
  ownedNodes.add(snowFar)
  ownedNodes.add(snowNear)
  body.prepend(snowFar, snowNear)

  // 本机立绘：存在才挂载
  if (ODETA_LOCAL_PORTRAIT.length > 0) {
    body.setAttribute('data-odeta-has-portrait', '')
    const portrait = makeChrome('img', 'portrait') as HTMLImageElement
    portrait.alt = ''
    portrait.src = ODETA_LOCAL_PORTRAIT
    ownedNodes.add(portrait)
    body.prepend(portrait)
  }

  const isSkinChrome = (node: Node): boolean => (
    node instanceof Element && node.getAttribute('data-skin-owner') === SKIN_OWNER
  )

  const applySidebarWidth = (width: number): void => {
    if (width <= 0) return
    body.dataset.odetaSidebar = width <= 120 ? 'rail' : width <= 220 ? 'narrow' : 'wide'
  }

  /** 侧栏装饰：天鹅羽钉进侧栏根（重复调用幂等）。 */
  const decorateSidebar = (): void => {
    const sidebarRoot = document
      .querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
      ?.querySelector<HTMLElement>(':scope > div')
    if (!sidebarRoot) return
    if (!sidebarRoot.querySelector("[data-odeta-chrome='feather']")) {
      const feather = makeChrome('span', 'feather')
      ownedNodes.add(feather)
      sidebarRoot.prepend(feather)
    }
    if (resizeObserver && sidebarRoot.parentElement !== observedSidebar) {
      if (observedSidebar) resizeObserver.unobserve(observedSidebar)
      observedSidebar = sidebarRoot.parentElement ?? undefined
      if (observedSidebar) resizeObserver.observe(observedSidebar)
    }
  }

  const syncChatState = (): void => {
    body.toggleAttribute('data-odeta-chat-active',
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
