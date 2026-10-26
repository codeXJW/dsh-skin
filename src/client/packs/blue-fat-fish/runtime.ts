/**
 * 蓝色大肥鱼 —— 整包运行时。
 *
 * 与 celadon / odeta 同一骨架（packs/GUIDELINES.md 的 D 章生命周期），做三件事：
 *  1. 背景氛围层：气泡上升 + 大肥鱼剪影缓游 + 描金浮游星光 + 海藻摇摆，
 *     全部是**皮肤自有节点**（data-blue-fat-fish-chrome + data-skin-owner +
 *     aria-hidden + pointer-events:none），observer 里忽略自身插入（C2）。
 *  2. 输入框右上角的「Q 版小人」：挂在输入卡内（皮肤自有节点），踩在卡片
 *     上沿；输入卡被 React 重建后靠 MutationObserver 重新挂载（D4 幂等）。
 *  3. 状态投影：只往 body 写 data-* 钩子（忙闲态 / 侧栏分档 / 会话进行中），
 *     具体样式全部在 CSS 里消费（C1）。
 *
 * 另留一条**可选**的本机素材槽通道：assets-local/ 里放了图时改用位图，
 * 没有则纯原创手绘 SVG 照样完整工作（素材槽不进仓库、不分发）。
 */
import type { PackContext } from '../../core/types'
import {
  BFF_BUBBLE_TILE,
  BFF_FISH_FAR,
  BFF_FISH_NEAR,
  BFF_SEAWEED,
  BFF_STAR_FIELD,
} from './art'
import { BFF_LOCAL_MASCOT, BFF_LOCAL_MASCOT_BUSY } from './local-art.generated'
import { BFF_MASCOT_SVG } from './mascot'
import { BFF_CSS } from './style'

const SKIN_OWNER = 'blue-fat-fish'
const SIDEBAR_COLUMN_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])"
const ACTIVE_CHAT_SELECTOR = "[data-phase='active'] [data-chat-flow]"
/** 输入卡本体：宿主用 data-composer-card 标记，天然带 position:relative 且不裁剪。 */
const COMPOSER_CARD_SELECTOR = '[data-composer-card]'
/** 宿主运行态指示器：会话运行期间挂载（chat.deepDiving）。 */
const RUNNING_SELECTOR = '[data-chat-running]'

const CHROME_ART_PROPERTIES = [
  '--bff-bubbles-art',
  '--bff-fish-art',
  '--bff-fish-near-art',
  '--bff-stars-art',
  '--bff-weed-art',
  '--bff-mascot-art',
  '--bff-mascot-art-busy',
] as const

function makeChrome(tag: 'div' | 'span', name: string): HTMLElement {
  const el = document.createElement(tag)
  el.dataset.blueFatFishChrome = name
  el.dataset.skinOwner = SKIN_OWNER
  el.setAttribute('aria-hidden', 'true')
  return el
}

export function applyBlueFatFish(ctx: PackContext): void {
  const body = document.body
  const ownedNodes = new Set<Element>()
  const previousArt = new Map<string, string>()
  for (const property of CHROME_ART_PROPERTIES) {
    previousArt.set(property, body.style.getPropertyValue(property))
  }
  const hadChatActive = body.hasAttribute('data-blue-fat-fish-chat-active')
  const hadMascotState = body.getAttribute('data-blue-fat-fish-mascot-state')
  const hadMascotArt = body.hasAttribute('data-blue-fat-fish-has-mascot-art')
  const previousSidebarSize = body.getAttribute('data-blue-fat-fish-sidebar')

  let observer: MutationObserver | undefined
  let resizeObserver: ResizeObserver | undefined
  let observedSidebar: HTMLElement | undefined

  // D1：先登记总清理，再做任何可能失败的写入（D2：快照并恢复所有触碰过的原值）
  ctx.effect(() => () => {
    delete body.dataset.dshBlueFatFish
    if (!hadChatActive) body.removeAttribute('data-blue-fat-fish-chat-active')
    if (hadMascotState === null) body.removeAttribute('data-blue-fat-fish-mascot-state')
    else body.setAttribute('data-blue-fat-fish-mascot-state', hadMascotState)
    if (!hadMascotArt) body.removeAttribute('data-blue-fat-fish-has-mascot-art')
    if (previousSidebarSize === null) body.removeAttribute('data-blue-fat-fish-sidebar')
    else body.setAttribute('data-blue-fat-fish-sidebar', previousSidebarSize)
    observer?.disconnect()
    resizeObserver?.disconnect()
    for (const [property, value] of previousArt) {
      body.style.setProperty(property, value)
    }
    ownedNodes.forEach((el) => el.remove())
  }, 'pack/blue-fat-fish: blue fat fish')

  // 样式表
  const styleTag = document.createElement('style')
  styleTag.dataset.skinOwner = SKIN_OWNER
  styleTag.textContent = BFF_CSS
  ownedNodes.add(styleTag)
  document.head.append(styleTag)

  body.dataset.dshBlueFatFish = ''
  body.style.setProperty('--bff-bubbles-art', `url("${BFF_BUBBLE_TILE}")`)
  body.style.setProperty('--bff-fish-art', `url("${BFF_FISH_FAR}")`)
  body.style.setProperty('--bff-fish-near-art', `url("${BFF_FISH_NEAR}")`)
  body.style.setProperty('--bff-stars-art', `url("${BFF_STAR_FIELD}")`)
  body.style.setProperty('--bff-weed-art', `url("${BFF_SEAWEED}")`)

  // 背景氛围层（皮肤自有节点；z-index 由 CSS 控制：背景层 0 / 装饰层 1）
  const bubbles = makeChrome('div', 'bubbles')
  const fishFar = makeChrome('div', 'fish-far')
  const fishNear = makeChrome('div', 'fish-near')
  const stars = makeChrome('div', 'stars')
  const weed = makeChrome('div', 'weed')
  ownedNodes.add(bubbles)
  ownedNodes.add(fishFar)
  ownedNodes.add(fishNear)
  ownedNodes.add(stars)
  ownedNodes.add(weed)
  body.prepend(bubbles, fishFar, fishNear, stars, weed)

  /**
   * 输入框右上角的小人：「蓝色大肥鱼」Q 版少女（呆毛 + 猫耳 + 女仆装 +
   * 大鱼尾 + 金色星光），站在输入卡右上沿。
   *
   * 规范：
   *  - B2 小人是皮肤自有节点（data-blue-fat-fish-chrome + data-skin-owner +
   *    aria-hidden），transform/filter 只作用在小人自身，不碰应用容器；
   *  - B4 小人 z-index 留在装饰层 1~20，不把输入卡抬进 overlay 层级；
   *  - C1 忙闲只投影 body 上的 data-* 钩子，样式全在 CSS；
   *  - D4 幂等：换肤/重建后复用同一节点，重复调用不重复插入。
   */
  const mascot = makeChrome('div', 'mascot')
  ownedNodes.add(mascot)
  // 注意：不要写成 `if (BFF_LOCAL_MASCOT.length > 0)`——那是编译期内联的字符串
  // 常量，构建器会常量折叠并把 else 分支（SVG 回落）整体摇掉。先把素材放进
  // 数组再取长度，两个分支都会保留在产物里。
  const localMascot: string[] = [BFF_LOCAL_MASCOT]
  const localMascotBusy: string[] = [BFF_LOCAL_MASCOT_BUSY]
  if (localMascot[0].length > 0) {
    // 本机素材槽：用户自备的位图，按 CSS 变量注入，由 CSS 按忙闲态切换。
    body.setAttribute('data-blue-fat-fish-has-mascot-art', '')
    body.style.setProperty('--bff-mascot-art', `url("${localMascot[0]}")`)
    body.style.setProperty('--bff-mascot-art-busy', `url("${localMascotBusy[0]}")`)
  } else {
    // 默认：原创手绘内联 SVG（MIT 可分发），CSS 可分别控制眼/嘴/尾/星光。
    mascot.innerHTML = BFF_MASCOT_SVG
  }

  const isSkinChrome = (node: Node): boolean => (
    node instanceof Element && node.getAttribute('data-skin-owner') === SKIN_OWNER
  )

  /** 找到当前生效的输入卡（工作区触发卡与输入卡同名，用可编辑内容区分）。 */
  const findComposerCard = (): HTMLElement | null => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>(COMPOSER_CARD_SELECTOR),
    )
    return (
      cards.find((card) => card.querySelector('[contenteditable="true"]') !== null) ??
      cards[0] ??
      null
    )
  }

  /** 幂等挂载：卡片被 React 重建后重新挂上（同一节点复用，不新建）。 */
  const mountMascot = (): void => {
    const card = findComposerCard()
    if (!card) {
      mascot.remove()
      return
    }
    if (mascot.parentElement !== card) card.append(mascot)
  }

  /**
   * 忙闲态投影：宿主运行指示器（data-chat-running）在会话运行期间挂载。
   * 指示器位于**聊天区**子树（不在输入卡内），所以只能靠全局查询判定。
   * 用「状态是否真的变了」来收敛：避免聊天区每次流式更新都写 body 属性。
   */
  const syncMascotState = (): void => {
    const next = document.querySelector(RUNNING_SELECTOR) !== null ? 'busy' : 'idle'
    if (body.getAttribute('data-blue-fat-fish-mascot-state') === next) return
    body.setAttribute('data-blue-fat-fish-mascot-state', next)
  }

  const applySidebarWidth = (width: number): void => {
    if (width <= 0) return
    body.dataset.blueFatFishSidebar = width <= 120 ? 'rail' : width <= 220 ? 'narrow' : 'wide'
  }

  /** 侧栏观察：把 ResizeObserver 挂到当前侧栏根上（幂等）。 */
  const decorateSidebar = (): void => {
    const sidebarRoot = document
      .querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
      ?.querySelector<HTMLElement>(':scope > div')
    if (!sidebarRoot) return
    if (resizeObserver && sidebarRoot.parentElement !== observedSidebar) {
      if (observedSidebar) resizeObserver.unobserve(observedSidebar)
      observedSidebar = sidebarRoot.parentElement ?? undefined
      if (observedSidebar) resizeObserver.observe(observedSidebar)
    }
  }

  const syncChatState = (): void => {
    body.toggleAttribute('data-blue-fat-fish-chat-active',
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
  mountMascot()
  syncMascotState()
  const initialSidebar = document.querySelector<HTMLElement>(SIDEBAR_COLUMN_SELECTOR)
  if (initialSidebar) applySidebarWidth(initialSidebar.getBoundingClientRect().width)

  observer = new MutationObserver((records) => {
    let sidebarChanged = false
    let chatChanged = false
    let composerChanged = false
    let runningChanged = false
    for (const record of records) {
      if (record.type === 'attributes') {
        if (record.attributeName === 'data-phase' || record.attributeName === 'data-chat-flow') {
          chatChanged = true
        }
        continue
      }
      // C2：忽略皮肤自有节点（否则装饰会触发重复装饰）
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
      // 输入卡被 React 重建 → 重新挂小人（幂等，D4）
      if (appNodes.some((node) => node.matches(COMPOSER_CARD_SELECTOR)
        || node.querySelector(COMPOSER_CARD_SELECTOR) !== null)
        || target?.closest(COMPOSER_CARD_SELECTOR) !== null) {
        composerChanged = true
      }
      // 运行指示器在聊天区子树内，出现/消失未必命中 RUNNING_SELECTOR 匹配，
      // 因此聊天区一有变化就重查一次（syncMascotState 内部按状态收敛，不重复写）。
      if (appNodes.some((node) => node.matches(RUNNING_SELECTOR)
        || node.querySelector(RUNNING_SELECTOR) !== null)) {
        runningChanged = true
      }
      if (chatChanged) runningChanged = true
    }
    if (sidebarChanged) decorateSidebar()
    if (chatChanged) syncChatState()
    if (composerChanged) mountMascot()
    if (runningChanged) syncMascotState()
  })
  observer.observe(body, {
    attributes: true,
    attributeFilter: ['data-phase', 'data-chat-flow'],
    childList: true,
    subtree: true,
  })
}
