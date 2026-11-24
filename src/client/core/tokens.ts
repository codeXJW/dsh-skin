/**
 * --dsw-* 皮肤变量注册表（语义 key → 宿主设计 token）。
 *
 * 目的：把「哪些元素适合作为皮肤变量」固化成一份**类型化清单**，让各皮肤
 * 用语义名引用 token，而不是散写 `--dsw-...` 字符串；并内置两条纪律：
 *  1. 必填集（required）要给全，否则换肤回退宿主默认、破坏一致性；
 *  2. 信息保真 token（fidelity，默认不覆盖）—— 覆盖即把固定 UI 调淡。
 *
 * 分层与证据来源见 docs/skin-variable-catalog.md：
 *  - required / recommended：官方 token 契约（theme-spec.md，权威清单在其
 *    packages/core/src/tokens.ts）。宿主的 --dsw-static-* 色阶不属于本契约。
 *  - extended：基础样式表实际消费、注册表之外但同样可覆盖的细层级
 *    （Bancott/dsh-yexueqing-skin §5b + 本插件 engine.ts/packs 实证）。
 *  - fidelity：DSH 用来表达「次要/未激活」的层级，覆盖 = 主动调淡固定 UI
 *    （yexueqing §3/坑7），默认跳过并告警。
 *
 * 本模块纯函数、无 DOM、无依赖，可在 host / client / 测试中复用。
 */

/** token 所在分组（与目录文档 §1/§2 对齐，便于检索）。 */
export type TokenGroup =
  | 'backgrounds' | 'labels' | 'brand' | 'states' | 'borders'
  | 'interaction' | 'buttons' | 'code' | 'markdown' | 'scrollbars'
  | 'surfaces' | 'masks' | 'modules' | 'extended' | 'font' | 'fidelity'

/** 分层：required/recommended 来自官方契约；extended 为表外细层级；fidelity 默认不覆盖。 */
export type TokenTier = 'required' | 'recommended' | 'extended' | 'fidelity'

export interface TokenSpec {
  /** 宿主 CSS 自定义属性全名。 */
  cssVar: string
  group: TokenGroup
  tier: TokenTier
}

/**
 * 语义 key → 宿主 token。key 采用与皮肤概念贴近的 camelCase，
 * 皮肤作者按语义取色，不直接背 token 名。
 */
export const DSW_TOKENS = {
  /* ── required：背景 ── */
  bgBase: { cssVar: '--dsw-alias-bg-base', group: 'backgrounds', tier: 'required' },
  bgLayer1: { cssVar: '--dsw-alias-bg-layer-1', group: 'backgrounds', tier: 'required' },
  bgLayer2: { cssVar: '--dsw-alias-bg-layer-2', group: 'backgrounds', tier: 'required' },
  bgLayer3: { cssVar: '--dsw-alias-bg-layer-3', group: 'backgrounds', tier: 'required' },
  bgOverlay: { cssVar: '--dsw-alias-bg-overlay', group: 'backgrounds', tier: 'required' },

  /* ── required：文字 ── */
  labelPrimary: { cssVar: '--dsw-alias-label-primary', group: 'labels', tier: 'required' },
  labelTertiary: { cssVar: '--dsw-alias-label-tertiary', group: 'labels', tier: 'required' },

  /* ── required：品牌与状态 ── */
  brandPrimary: { cssVar: '--dsw-alias-brand-primary', group: 'brand', tier: 'required' },
  stateBusinessPrimary: { cssVar: '--dsw-alias-state-business-primary', group: 'states', tier: 'required' },
  stateSuccessPrimary: { cssVar: '--dsw-alias-state-success-primary', group: 'states', tier: 'required' },
  stateWarnPrimary: { cssVar: '--dsw-alias-state-warn-primary', group: 'states', tier: 'required' },
  stateErrorPrimary: { cssVar: '--dsw-alias-state-error-primary', group: 'states', tier: 'required' },

  /* ── required：边框 ── */
  borderL1: { cssVar: '--dsw-alias-border-l1', group: 'borders', tier: 'required' },
  borderL2: { cssVar: '--dsw-alias-border-l2', group: 'borders', tier: 'required' },

  /* ── required：交互 ── */
  interactiveBgHover: { cssVar: '--dsw-alias-interactive-bg-hover', group: 'interaction', tier: 'required' },
  interactiveBgActive: { cssVar: '--dsw-alias-interactive-bg-active', group: 'interaction', tier: 'required' },
  buttonPrimaryFill: { cssVar: '--dsw-alias-button-primary-fill', group: 'interaction', tier: 'required' },
  buttonPrimaryHover: { cssVar: '--dsw-alias-button-primary-hover', group: 'interaction', tier: 'required' },

  /* ── required：代码 ── */
  markdownCodeBlock: { cssVar: '--dsw-alias-markdown-code-block', group: 'code', tier: 'required' },
  markdownCodeBlockBanner: { cssVar: '--dsw-alias-markdown-code-block-banner', group: 'code', tier: 'required' },
  markdownInlineCode: { cssVar: '--dsw-alias-markdown-inline-code', group: 'code', tier: 'required' },
  markdownTag: { cssVar: '--dsw-alias-markdown-tag', group: 'code', tier: 'required' },

  /* ── required：滚动条 ── */
  scrollbarBgL1: { cssVar: '--dsw-alias-scrollbar-bg-l1', group: 'scrollbars', tier: 'required' },
  scrollbarHoverL1: { cssVar: '--dsw-alias-scrollbar-hover-l1', group: 'scrollbars', tier: 'required' },

  /* ── required：表面 ── */
  tooltipBg: { cssVar: '--dsw-alias-tooltip-bg', group: 'surfaces', tier: 'required' },
  bubble: { cssVar: '--dsw-specific-bubble', group: 'surfaces', tier: 'required' },
  bubbleHighlight: { cssVar: '--dsw-specific-bubble-highlight', group: 'surfaces', tier: 'required' },
  sidebarFill: { cssVar: '--dsw-specific-sidebar-fill', group: 'surfaces', tier: 'required' },
  sidebarNavItemActive: { cssVar: '--dsw-specific-sidebar-nav-item-active', group: 'surfaces', tier: 'required' },

  /* ── recommended：遮罩 ── */
  bgMask1: { cssVar: '--dsw-alias-bg-mask-1', group: 'masks', tier: 'recommended' },
  bgMask2: { cssVar: '--dsw-alias-bg-mask-2', group: 'masks', tier: 'recommended' },
  bgMask3: { cssVar: '--dsw-alias-bg-mask-3', group: 'masks', tier: 'recommended' },

  /* ── recommended：模块 ── */
  bgModulePlatform: { cssVar: '--dsw-alias-bg-module-platform', group: 'modules', tier: 'recommended' },
  bgMultiSelect: { cssVar: '--dsw-alias-bg-multi-select', group: 'modules', tier: 'recommended' },
  bgSkeleton: { cssVar: '--dsw-alias-bg-skeleton', group: 'modules', tier: 'recommended' },

  /* ── recommended：边框 ── */
  borderL3: { cssVar: '--dsw-alias-border-l3', group: 'borders', tier: 'recommended' },
  borderL4: { cssVar: '--dsw-alias-border-l4', group: 'borders', tier: 'recommended' },
  borderInverted: { cssVar: '--dsw-alias-border-inverted', group: 'borders', tier: 'recommended' },

  /* ── recommended：按钮 ── */
  buttonInfoFill: { cssVar: '--dsw-alias-button-info-fill', group: 'buttons', tier: 'recommended' },
  buttonInfoHover: { cssVar: '--dsw-alias-button-info-hover', group: 'buttons', tier: 'recommended' },
  buttonElevatedFill: { cssVar: '--dsw-alias-button-elevated-fill', group: 'buttons', tier: 'recommended' },
  buttonFloatingFill: { cssVar: '--dsw-alias-button-floating-fill', group: 'buttons', tier: 'recommended' },
  buttonFloatingHover: { cssVar: '--dsw-alias-button-floating-hover', group: 'buttons', tier: 'recommended' },

  /* ── recommended：交互 ── */
  interactiveBgHoverSolid: { cssVar: '--dsw-alias-interactive-bg-hover-solid', group: 'interaction', tier: 'recommended' },
  interactiveBgHoverDanger: { cssVar: '--dsw-alias-interactive-bg-hover-danger', group: 'interaction', tier: 'recommended' },
  interactiveBgHoverAccent: { cssVar: '--dsw-alias-interactive-bg-hover-accent', group: 'interaction', tier: 'recommended' },

  /* ── recommended：文字 ── */
  labelCaption: { cssVar: '--dsw-alias-label-caption', group: 'labels', tier: 'recommended' },
  labelPrimaryInverted: { cssVar: '--dsw-alias-label-primary-inverted', group: 'labels', tier: 'recommended' },
  labelPrimaryDimmed: { cssVar: '--dsw-alias-label-primary-dimmed', group: 'labels', tier: 'recommended' },
  labelDimmed: { cssVar: '--dsw-alias-label-dimmed', group: 'labels', tier: 'recommended' },

  /* ── recommended：markdown ── */
  markdownCitation: { cssVar: '--dsw-alias-markdown-citation', group: 'markdown', tier: 'recommended' },
  markdownCodeSegmentSelected: { cssVar: '--dsw-alias-markdown-code-segment-selected', group: 'markdown', tier: 'recommended' },
  markdownCodeSegmentUnselected: { cssVar: '--dsw-alias-markdown-code-segment-unselected', group: 'markdown', tier: 'recommended' },
  markdownPlaceholder: { cssVar: '--dsw-alias-markdown-placeholder', group: 'markdown', tier: 'recommended' },

  /* ── recommended：滚动条 ── */
  scrollbarBgL2: { cssVar: '--dsw-alias-scrollbar-bg-l2', group: 'scrollbars', tier: 'recommended' },
  scrollbarHoverL2: { cssVar: '--dsw-alias-scrollbar-hover-l2', group: 'scrollbars', tier: 'recommended' },

  /* ── recommended：状态 ── */
  stateSuccessSecondary: { cssVar: '--dsw-alias-state-success-secondary', group: 'states', tier: 'recommended' },
  stateWarnSecondary: { cssVar: '--dsw-alias-state-warn-secondary', group: 'states', tier: 'recommended' },
  stateErrorSecondary: { cssVar: '--dsw-alias-state-error-secondary', group: 'states', tier: 'recommended' },
  stateSuccessTertiary: { cssVar: '--dsw-alias-state-success-tertiary', group: 'states', tier: 'recommended' },
  stateWarnTertiary: { cssVar: '--dsw-alias-state-warn-tertiary', group: 'states', tier: 'recommended' },
  stateBusinessTertiary: { cssVar: '--dsw-alias-state-business-tertiary', group: 'states', tier: 'recommended' },

  /* ── recommended：表面 ── */
  toastBg: { cssVar: '--dsw-alias-toast-bg', group: 'surfaces', tier: 'recommended' },
  inputMajor: { cssVar: '--dsw-specific-input-major', group: 'surfaces', tier: 'recommended' },
  loginInput: { cssVar: '--dsw-specific-login-input', group: 'surfaces', tier: 'recommended' },
  menu: { cssVar: '--dsw-specific-menu', group: 'surfaces', tier: 'recommended' },
  selector: { cssVar: '--dsw-specific-selector', group: 'surfaces', tier: 'recommended' },
  sidebarNavItemHover: { cssVar: '--dsw-specific-sidebar-nav-item-hover', group: 'surfaces', tier: 'recommended' },
  tip: { cssVar: '--dsw-specific-tip', group: 'surfaces', tier: 'recommended' },

  /* ── extended：表外细层级 / 品牌补充（本插件 engine.ts、packs、yexueqing §5b 实证）── */
  brandText: { cssVar: '--dsw-alias-brand-text', group: 'extended', tier: 'extended' },
  buttonPrimaryDimmed: { cssVar: '--dsw-alias-button-primary-dimmed', group: 'extended', tier: 'extended' },
  borderL2DarkmodeThin: { cssVar: '--dsw-alias-border-l2-darkmode-thin', group: 'extended', tier: 'extended' },
  labelPrimaryBluish: { cssVar: '--dsw-alias-label-primary-bluish', group: 'extended', tier: 'extended' },
  settingsCardFill: { cssVar: '--dsw-alias-settings-card-fill', group: 'extended', tier: 'extended' },
  settingsCardStroke: { cssVar: '--dsw-alias-settings-card-stroke', group: 'extended', tier: 'extended' },
  focusRingColor: { cssVar: '--dsw-alias-focus-ring-color', group: 'extended', tier: 'extended' },
  bgDocumentSelection: { cssVar: '--dsw-alias-bg-document-selection', group: 'extended', tier: 'extended' },
  switchThumb: { cssVar: '--dsw-alias-switch-thumb', group: 'extended', tier: 'extended' },
  elevationStrokeColor: { cssVar: '--dsw-elevation-stroke-color', group: 'extended', tier: 'extended' },

  /* ── extended：字体（换 UI 字体的唯一入口，brand 派生自它）── */
  fontFamily: { cssVar: '--dsw-font-family', group: 'font', tier: 'extended' },
  fontFamilyBrand: { cssVar: '--dsw-font-family-brand', group: 'font', tier: 'extended' },

  /* ── extended：滚动条 thumb（注意是 --dsh- 前缀，非 --dsw-；高层级表面会重绑为 l2）── */
  scrollbarThumb: { cssVar: '--dsh-scrollbar-thumb', group: 'extended', tier: 'extended' },
  scrollbarThumbHover: { cssVar: '--dsh-scrollbar-thumb-hover', group: 'extended', tier: 'extended' },

  /* ── fidelity：默认不覆盖 —— 覆盖即把固定 UI（权限/模型/账号/标签/轮数/输入框）调淡 ── */
  labelSecondary: { cssVar: '--dsw-alias-label-secondary', group: 'fidelity', tier: 'fidelity' },
  stateIdlePrimary: { cssVar: '--dsw-alias-state-idle-primary', group: 'fidelity', tier: 'fidelity' },
} as const satisfies Record<string, TokenSpec>

export type SemanticKey = keyof typeof DSW_TOKENS

/** 必填集（官方契约必填，扣除 fidelity 的 labelSecondary）。给全才能保证换肤一致性。 */
export type RequiredKey = {
  [K in SemanticKey]: (typeof DSW_TOKENS)[K]['tier'] extends 'required' ? K : never
}[SemanticKey]

/** 可选集：recommended + extended（补齐细层级）。 */
export type OptionalKey = {
  [K in SemanticKey]: (typeof DSW_TOKENS)[K]['tier'] extends 'recommended' | 'extended' ? K : never
}[SemanticKey]

/** fidelity 键：可写进调色板，但默认不下发（buildTokenRules 会跳过并告警）。 */
export type FidelityKey = {
  [K in SemanticKey]: (typeof DSW_TOKENS)[K]['tier'] extends 'fidelity' ? K : never
}[SemanticKey]

/** 确定性输出顺序，保证生成 CSS 可比对。 */
export const SEMANTIC_KEY_ORDER = Object.keys(DSW_TOKENS) as SemanticKey[]

export const REQUIRED_KEYS = SEMANTIC_KEY_ORDER.filter(
  (k) => DSW_TOKENS[k].tier === 'required',
) as RequiredKey[]

export const OPTIONAL_KEYS = SEMANTIC_KEY_ORDER.filter(
  (k) => DSW_TOKENS[k].tier === 'recommended' || DSW_TOKENS[k].tier === 'extended',
) as OptionalKey[]

export const FIDELITY_KEYS = SEMANTIC_KEY_ORDER.filter(
  (k) => DSW_TOKENS[k].tier === 'fidelity',
) as FidelityKey[]

/**
 * 一套调色板：必填键必须给全，可选键按需覆盖。
 * 亮/暗各一份（皮肤作者成对提供，自动跟随宿主明暗）。
 */
export type TokenPalette =
  & Record<RequiredKey, string>
  & Partial<Record<OptionalKey, string>>
  // fidelity 允许写（便于「明知故犯」的皮肤），但默认不下发。
  & Partial<Record<FidelityKey, string>>

/** 取某语义 key 的宿主 CSS 变量全名。 */
export function cssVar(key: SemanticKey): string {
  return DSW_TOKENS[key].cssVar
}

/** 生成一行声明：`  --dsw-...: <value>;` */
export function decl(key: SemanticKey, value: string): string {
  return `  ${DSW_TOKENS[key].cssVar}: ${value};`
}

/** 皮肤自定义变量的声明行（非宿主 token，供 --xxx-art / --yxq-* 等自有变量复用格式）。 */
export function customDecl(cssVarName: string, value: string): string {
  return `  ${cssVarName}: ${value};`
}

/**
 * 可下发的部分调色板：任意语义 key → 颜色。缺失的键不下发（回退宿主原值）。
 * 现有整包皮肤只覆盖 token 的子集（补齐必填集会改变视觉），故下发接口接受本类型；
 * 需要「强制给全必填集」的场景用 TokenPalette + paletteGaps 校验。
 */
export type PaletteInput = Partial<Record<SemanticKey, string>>

/** buildTokenRules 的可选项。 */
export interface BuildTokenRulesOptions {
  /** 亮色根选择器，如 `body[data-dsh-<skin>]`。 */
  lightSelector: string
  /** 暗色根选择器，如 `body[data-ds-dark-theme][data-dsh-<skin>]`。 */
  darkSelector: string
  light: PaletteInput
  dark: PaletteInput
  /** 显式允许下发 fidelity token（默认 false：跳过并 console.warn）。 */
  allowFidelity?: boolean
}

/**
 * 生成亮/暗两段 token 覆盖规则（只含 --dsw-*，不含装饰）。
 * 调色板缺失的可选键不下发（回退宿主原值）；fidelity 键默认跳过并告警。
 */
export function buildTokenRules(opts: BuildTokenRulesOptions): string {
  const { lightSelector, darkSelector, light, dark, allowFidelity = false } = opts
  const warnOnce = new Set<SemanticKey>()

  const block = (selector: string, palette: PaletteInput): string => {
    const lines: string[] = []
    for (const key of SEMANTIC_KEY_ORDER) {
      const spec = DSW_TOKENS[key]
      const value = palette[key]
      if (value === undefined) continue
      if (spec.tier === 'fidelity' && !allowFidelity) {
        if (!warnOnce.has(key)) {
          warnOnce.add(key)
          console.warn(
            `[dsh-skin] 跳过信息保真 token ${spec.cssVar}：覆盖它等于把固定 UI 调淡。`
            + ` 若确要覆盖，传 allowFidelity:true（见 docs/skin-variable-catalog.md §5）。`,
          )
        }
        continue
      }
      lines.push(decl(key, value))
    }
    if (lines.length === 0) return ''
    return `${selector} {\n${lines.join('\n')}\n}`
  }

  return [block(lightSelector, light), block(darkSelector, dark)]
    .filter(Boolean)
    .join('\n\n')
}

/** 校验结果：缺失的必填 key（亮/暗分别报）。 */
export interface PaletteGaps {
  lightMissing: RequiredKey[]
  darkMissing: RequiredKey[]
}

/** 列出亮/暗调色板各自缺失的必填 key（供皮肤作者补齐 / 测试断言）。 */
export function paletteGaps(light: PaletteInput, dark: PaletteInput): PaletteGaps {
  const miss = (p: PaletteInput): RequiredKey[] =>
    REQUIRED_KEYS.filter((k) => p[k] === undefined)
  return { lightMissing: miss(light), darkMissing: miss(dark) }
}

/* ── 可选的色阶单调性检查（不自动执行；供测试/皮肤作者自查） ────────────── */

/** 解析 #rgb/#rrggbb/rgb()/rgba() 为 0..255 三元组；var()/hsl()/无法解析返回 null。 */
function parseRgb(color: string): [number, number, number] | null {
  const s = color.trim()
  let m = /^#([0-9a-f]{3})$/i.exec(s)
  if (m) {
    const [r, g, b] = m[1].split('')
    return [parseInt(r + r, 16), parseInt(g + g, 16), parseInt(b + b, 16)]
  }
  m = /^#([0-9a-f]{6})$/i.exec(s)
  if (m) {
    const n = parseInt(m[1], 16)
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
  }
  m = /^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)/i.exec(s)
  if (m) return [Number(m[1]), Number(m[2]), Number(m[3])]
  return null
}

/** WCAG 相对亮度。无法解析的颜色返回 null。 */
export function relativeLuminance(color: string): number | null {
  const rgb = parseRgb(color)
  if (!rgb) return null
  const lin = rgb.map((c) => {
    const v = c / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2]
}

/**
 * 文字色阶单调性自查：labelPrimary → labelPrimaryDimmed → labelTertiary → labelCaption。
 *
 * 方向随明暗翻转：亮底下「越次要越亮」（亮度递增），暗底下「越次要越暗」（亮度递减）。
 * 故需传 scheme：
 *  - 'light'：下级亮度不得**低于**上级（caption 应最亮）；
 *  - 'dark' ：下级亮度不得**高于**上级（caption 应最暗）。
 * 只对可解析颜色（hex/rgb）生效，var()/hsl() 跳过。返回问题描述数组（空 = 通过）。
 */
export function checkLabelRamp(palette: PaletteInput, scheme: 'light' | 'dark'): string[] {
  const chain: SemanticKey[] = ['labelPrimary', 'labelPrimaryDimmed', 'labelTertiary', 'labelCaption']
  const present = chain.filter((k) => palette[k] !== undefined)
  const problems: string[] = []
  for (let i = 0; i < present.length - 1; i++) {
    const a = present[i]
    const b = present[i + 1]
    const va = palette[a]
    const vb = palette[b]
    if (va === undefined || vb === undefined) continue
    const la = relativeLuminance(va)
    const lb = relativeLuminance(vb)
    if (la === null || lb === null) continue
    const inverted = scheme === 'light' ? lb < la - 1e-6 : lb > la + 1e-6
    if (inverted) {
      const dir = scheme === 'light' ? '暗于' : '亮于'
      problems.push(`${DSW_TOKENS[b].cssVar} 亮度${dir}更高级的 ${DSW_TOKENS[a].cssVar}，色阶倒挂（${scheme}）`)
    }
  }
  return problems
}
