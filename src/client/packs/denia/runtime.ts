import type { PackContext } from '../../core/types'

const OWNER = 'denia'
const CENTER = ":is([data-pane='conversation'], [class$='_centerCol'])"
const SIDEBAR = ":is([data-pane='sidebar'], [class$='_sidebarCol'])"
const FOOTER = "[class$='_footArea'], [data-slot='sidebar.settings']"
const HERO = "[class$='_headline']:has(> [class$='_fishHitbox'])"
const LAYOUT = `${CENTER}, ${SIDEBAR}, ${FOOTER}, ${HERO}`
const OWNED = `[data-skin-owner='${OWNER}']`

function ornament(name: string): HTMLDivElement {
  const node = document.createElement('div')
  node.dataset.skinOwner = OWNER
  node.dataset.skinChrome = `denia:${name}`
  node.setAttribute('aria-hidden', 'true')
  return node
}

export function mountDeniaDecorations(ctx: PackContext): void {
  const stage = ornament('stage')
  stage.append(ornament('portrait-left'), ornament('portrait-right'), ornament('mascot'))
  const bubbleField = ornament('bubbles')
  // 固定轨迹便于切换和复现，不让素材层随每次渲染重建。
  for (const [left, diameter, period, delay] of [
    [7, 54, 24, 17], [16, 22, 18, 3], [27, 36, 29, 19], [39, 72, 31, 12],
    [55, 26, 19, 8], [69, 44, 26, 14], [80, 66, 30, 23], [92, 35, 21, 12],
  ]) {
    const bubble = ornament('bubble')
    bubble.style.setProperty('--denia-bubble-x', `${left}%`)
    bubble.style.setProperty('--denia-bubble-size', `${diameter}px`)
    bubble.style.setProperty('--denia-bubble-period', `${period}s`)
    bubble.style.setProperty('--denia-bubble-delay', `-${delay}s`)
    bubbleField.append(bubble)
  }
  stage.append(bubbleField)

  const chain = ornament('chain')
  const swag = ornament('swag')
  const welcome = ornament('welcome')
  const title = document.createElement('strong')
  title.textContent = '达妮娅'
  const subtitle = document.createElement('span')
  subtitle.textContent = '虚质科学课 · 星炬学院'
  const line = document.createElement('em')
  line.textContent = '「……你来了啊。要聊什么？」'
  welcome.append(title, subtitle, line)

  let observer: MutationObserver | undefined
  // 先登记收尾，皮肤切换后只移除本包插入的装饰。
  ctx.effect(() => () => {
    observer?.disconnect()
    for (const node of [welcome, swag, chain, stage]) node.remove()
  }, 'denia: decoration lifecycle')

  const sync = (): void => {
    const center = document.querySelector(CENTER)
    const sidebar = document.querySelector(SIDEBAR)
    const footer = sidebar?.querySelector(FOOTER)
    const headline = center?.querySelector(HERO)

    // 以宿主列作为定位基准，折叠、调整宽度及换页都由原生布局驱动。
    if (center && stage.parentElement !== center) center.prepend(stage)
    if (sidebar && chain.parentElement !== sidebar) sidebar.prepend(chain)
    if (footer && swag.parentElement !== footer) footer.prepend(swag)
    if (headline && headline.previousElementSibling !== welcome) headline.before(welcome)
  }
  sync()
  observer = new MutationObserver(records => {
    const layoutChanged = records.some(record => [...record.addedNodes, ...record.removedNodes]
      .some(node => node instanceof Element && !node.matches(OWNED)
        && (node.matches(LAYOUT) || node.querySelector(LAYOUT) !== null)))
    if (layoutChanged) sync()
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
