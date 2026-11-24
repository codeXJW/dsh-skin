/**
 * 奥黛塔 · 冰湖天鹅 —— 整包运行时。
 *
 * 与 maid-atelier / css-pack 同一骨架（packs/GUIDELINES.md 的 D 章生命周期），多两件事：
 *  1. 本机素材槽：local-art.generated.ts 里有立绘/背景时挂载立绘层并切换
 *     body 背景（快照原值、dispose 恢复）；没有则纯原创装饰版照样完整工作。
 *  2. 双雪层 + 角落冰晶/雪花点缀 + 可选立绘，全部皮肤自有节点
 *     （data-skin-owner），observer 里忽略自身插入（C2）。
 *     （原侧栏天鹅羽、顶部冰挂与按钮底部冰挂已按需求移除。）
 */
import type { PackContext } from '../../core/types'
import { ODETA_ICE_CRYSTAL, ODETA_SNOW_ACCENT, ODETA_SNOW_TILE_FAR, ODETA_SNOW_TILE_NEAR } from './art'
import { ODETA_LOCAL_BACKDROP, ODETA_LOCAL_CHIBI, ODETA_LOCAL_CHIBI_BUSY, ODETA_LOCAL_PORTRAIT } from './local-art.generated'
import { ODETA_MASCOT_SVG } from './mascot'
import { ODETA_CSS } from './style'

const SKIN_OWNER = 'odeta-frozen-swan'
const SIDEBAR_COLUMN_SELECTOR = ":is([data-pane='sidebar'], [class*='sidebarCol'])"
const ACTIVE_CHAT_SELECTOR = "[data-phase='active'] [data-chat-flow]"
/** 输入卡本体：宿主用 data-composer-card 标记，天然带 position:relative 且不裁剪。 */
const COMPOSER_CARD_SELECTOR = '[data-composer-card]'
/** 宿主运行态指示器：会话运行期间挂载（chat.deepDiving）。 */
const RUNNING_SELECTOR = '[data-chat-running]'

const CHROME_ART_PROPERTIES = [
  '--odeta-snow-far-art',
  '--odeta-snow-near-art',
  '--odeta-crystal-art',
  '--odeta-snow-accent-art',
  '--odeta-mascot-art',
  '--odeta-mascot-art-busy',
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
  const hadMascotState = body.getAttribute('data-odeta-mascot-state')
  const previousSidebarSize = body.getAttribute('data-odeta-sidebar')

  let observer: MutationObserver | undefined
  let resizeObserver: ResizeObserver | undefined
  let observedSidebar: HTMLElement | undefined

  ctx.effect(() => () => {
    delete body.dataset.dshOdeta
    if (!hadChatActive) body.removeAttribute('data-odeta-chat-active')
    if (!hadBackdrop) body.removeAttribute('data-odeta-has-backdrop')
    if (!hadPortrait) body.removeAttribute('data-odeta-has-portrait')
    if (hadMascotState === null) body.removeAttribute('data-odeta-mascot-state')
    else body.setAttribute('data-odeta-mascot-state', hadMascotState)
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
  body.style.setProperty('--odeta-crystal-art', `url("${ODETA_ICE_CRYSTAL}")`)
  body.style.setProperty('--odeta-snow-accent-art', `url("${ODETA_SNOW_ACCENT}")`)

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

  // 角落冰晶/雪花点缀 + 边缘霜晕/左侧大冰晶：一次性挂载，均皮肤自有节点
  // （data-skin-owner + aria-hidden + CSS 里 pointer-events:none，不拦截交互）
  const crystalTop = makeChrome('span', 'crystal-top')
  const snowBottom = makeChrome('span', 'snow-bottom')
  const frostDeco = makeChrome('div', 'frost-deco')
  ownedNodes.add(crystalTop)
  ownedNodes.add(snowBottom)
  ownedNodes.add(frostDeco)
  body.prepend(crystalTop, snowBottom, frostDeco)

  // 本机立绘：作为**右侧装饰层**挂载（不占正文、不拦截交互）。
  // 层级：插到 #root 之前、雪层之后 —— 雪层(z-index:0) 在它下面，正文(#root) 在它上面，
  // 所以立绘「飘雪前面、正文后面」都不会盖住文字（同层级靠 DOM 顺序，见 style.ts 立绘层）。
  // 会话进行中由 CSS 稍微淡出给正文让位，窄屏直接隐藏。
  // 素材仍在 assets-local/portrait.*（本机素材槽，不进仓库）。
  if (ODETA_LOCAL_PORTRAIT.length > 0) {
    body.setAttribute('data-odeta-has-portrait', '')
    const portrait = makeChrome('div', 'portrait')
    // 2.4MB 的 data URI 直接挂在装饰节点自己的行内样式上，不往 body 写巨型变量。
    portrait.style.backgroundImage = `url("${ODETA_LOCAL_PORTRAIT}")`
    portrait.style.backgroundPosition = 'right bottom'
    portrait.style.backgroundSize = 'contain'
    portrait.style.backgroundRepeat = 'no-repeat'
    ownedNodes.add(portrait)
    const root = document.getElementById('root')
    if (root && root.parentElement === body) root.before(portrait)
    else body.append(portrait)
  }

  const isSkinChrome = (node: Node): boolean => (
    node instanceof Element && node.getAttribute('data-skin-owner') === SKIN_OWNER
  )

  /**
   * 输入框右上方的小人：奥黛塔本人半身像（本机素材裁切件）。
   *
   * 位置：挂到输入卡**右上角**（absolute，right 偏移），半身浮在输入框右上方，
   * 不压 accessory 行（该行控件靠左）也不挡输入区正文。
   *
   * 素材来源：assets-local/chibi.*（由本机立绘 portrait.* 裁出，属本机素材槽，
   * 不进仓库）。没有本机素材时回落到原创机器人 SVG（mascot.ts，MIT，可分发），
   * 保证其它机器 clone 后皮肤仍有小人。
   *
   * 规范约束：
   *  - B2 小人是皮肤自有节点（data-odeta-chrome + data-skin-owner + aria-hidden），
   *    绝不把 transform/filter 挂到应用容器上；
   *  - B4 小人 z-index 留在装饰层 1~20，不把输入卡抬进 overlay 层级；
   *  - C1 忙闲只投影 body 上的 data-* 钩子，样式全在 CSS；
   *  - D4 幂等：换肤/重建后复用同一节点，重复调用不重复插入。
   */
  const mascot = makeChrome('div', 'mascot')
  // 注意：不要写成 `if (ODETA_LOCAL_CHIBI.length > 0)`——那是编译期内联的字符串
  // 常量，构建器会常量折叠并把 else 分支（SVG 回落）整体摇掉。本机构建时
  // 素材非空，摇掉后一旦素材失效就没有兜底。这里用运行时不可折叠的判断：
  // 先把素材放进数组再取长度，两个分支都会保留在产物里。
  const chibiArt: string[] = [ODETA_LOCAL_CHIBI]
  const chibiBusyArt: string[] = [ODETA_LOCAL_CHIBI_BUSY]
  if (chibiArt[0].length > 0) {
    // 角色本人（Q 版全身像）。两张状态图都注入成 CSS 变量，
    // 由 CSS 按 body[data-odeta-mascot-state] 选用（规范 C1：JS 只投影状态钩子）。
    mascot.dataset.mascotArt = 'chibi'
    body.style.setProperty('--odeta-mascot-art', `url("${chibiArt[0]}")`)
    body.style.setProperty('--odeta-mascot-art-busy', `url("${chibiBusyArt[0]}")`)
  } else {
    // 无本机素材：原创机器人（内联 SVG，便于 CSS 分别控制眼/徽等部件）
    mascot.dataset.mascotArt = 'svg'
    mascot.innerHTML = ODETA_MASCOT_SVG
  }
  ownedNodes.add(mascot)

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
   *
   * 指示器位于**聊天区**子树（不在输入卡内），所以只能靠全局查询判定。
   * 用「状态是否真的变了」来收敛：避免聊天区每次流式更新都写 body 属性。
   */
  const syncMascotState = (): void => {
    const next = document.querySelector(RUNNING_SELECTOR) !== null ? 'busy' : 'idle'
    if (body.getAttribute('data-odeta-mascot-state') === next) return
    body.setAttribute('data-odeta-mascot-state', next)
  }

  const applySidebarWidth = (width: number): void => {
    if (width <= 0) return
    body.dataset.odetaSidebar = width <= 120 ? 'rail' : width <= 220 ? 'narrow' : 'wide'
  }

  /** 侧栏观察：确保 ResizeObserver 挂在当前侧栏根上（幂等；原天鹅羽装饰已移除）。 */
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
      // 输入卡被 React 重建 → 重新挂小人（幂等，D4）。
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
