/**
 * 从 .tmp-skins 下的第三方皮肤仓库提取预设素材：
 *  1. 简约预设背景 → src/client/presets/backgrounds.generated.ts（base64 内嵌 webp）
 *  2. maid-atelier 整包素材 → src/client/packs/maid-atelier/art.generated.ts
 *     （角色立绘 / chrome 装饰 / art.ts 内嵌件 / 标题栏 SVG 字标）
 *  3. maid-atelier 整包样式 → src/client/packs/maid-atelier/css.generated.ts
 *     （module.css 原样转为字符串导出，由 pack runtime 注入并随 dispose 移除）
 *
 * 用法：node scripts/extract-presets.mjs
 * 素材来源与许可见 src/client/presets/README.md 与
 * src/client/packs/maid-atelier/NOTICE.md（CC BY-NC-SA 4.0 署名链）。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = join(root, '.tmp-skins')

const TOUHOU_TS = join(tmp, 'touhou-hakurei', 'src', 'client', 'background-art.generated.ts')
const MIKU_JS = join(tmp, 'package', 'lib', 'client.js')
const MAID_CLIENT = join(tmp, 'dsh-deep-whale', 'maid-atelier', 'src', 'client')
const MAID_ASSETS = join(tmp, 'dsh-deep-whale', 'maid-atelier', 'assets')

/** 从 TS/JS 源码里提取单/双引号字符串（data URI 等单行字面量）。 */
function extractString(file, name) {
  const s = readFileSync(file, 'utf8')
  const m = s.match(new RegExp(`${name}\\s*=\\s*['"]([^'"]+)['"]`))
  if (!m) throw new Error(`missing ${name} in ${file}`)
  return m[1]
}

/** 提取反引号模板字面量（SVG 字标；源内不含 ${} 插值）。 */
function extractTemplate(file, name) {
  const s = readFileSync(file, 'utf8')
  const m = s.match(new RegExp(`${name}\\s*=\\s*\`([^\`]+)\``))
  if (!m) throw new Error(`missing template ${name} in ${file}`)
  return m[1]
}

function webpToDataUri(rel) {
  const buf = readFileSync(join(MAID_ASSETS, rel))
  return `data:image/webp;base64,${buf.toString('base64')}`
}

/* ── 1. 简约预设背景 ─────────────────────────────────────────── */

const backgrounds = {
  HAKUREI_PALACE_LIGHT: extractString(TOUHOU_TS, 'HAKUREI_PALACE_LIGHT'),
  HAKUREI_PALACE_DARK: extractString(TOUHOU_TS, 'HAKUREI_PALACE_DARK'),
  MAID_PALACE_DAY: webpToDataUri('maid-atelier-palace-day-v4.webp'),
  MAID_PALACE_NIGHT: webpToDataUri('maid-atelier-palace-night-v4.webp'),
  MIKU_BACKDROP: extractString(MIKU_JS, 'MIKU_ART'),
}

const GEN_HEADER = `/**
 * 生成的预设素材（base64 内嵌 webp）——请勿手改，重新生成：
 *   node scripts/extract-presets.mjs
 * 来源与许可（CC BY-NC-SA 4.0 署名链）见 presets/README.md 与 packs/maid-atelier/NOTICE.md。
 */
`

function writeGenerated(rel, entries, extraHeader = '') {
  const body = Object.entries(entries)
    .map(([k, v]) => `export const ${k} = '${v}'`)
    .join('\n\n')
  const target = join(root, 'src', 'client', ...rel)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, GEN_HEADER + extraHeader + body + '\n')
  for (const [k, v] of Object.entries(entries)) {
    console.log(' ', k, Math.round(v.length / 1024) + 'KB')
  }
  console.log('written:', target)
}

console.log('== backgrounds.generated.ts ==')
writeGenerated(['presets', 'backgrounds.generated.ts'], backgrounds)

/* ── 2. maid-atelier 整包素材 ────────────────────────────────── */

const maidBg = join(MAID_CLIENT, 'background-art.generated.ts')
const maidChrome = join(MAID_CLIENT, 'chrome-art.generated.ts')
const maidWorkspace = join(MAID_CLIENT, 'workspace-art.generated.ts')
const maidArt = join(MAID_CLIENT, 'art.ts')

console.log('== packs/maid-atelier/art.generated.ts ==')
writeGenerated(['packs', 'maid-atelier', 'art.generated.ts'], {
  // 角色立绘（独立于宫殿背景，避免视口变化重采样）
  MAID_ATELIER_MAID_LEFT: extractString(maidBg, 'MAID_ATELIER_MAID_LEFT'),
  MAID_ATELIER_MAID_RIGHT: extractString(maidBg, 'MAID_ATELIER_MAID_RIGHT'),
  // chrome 装饰（border-image / 角框 / 饰带）
  MAID_ATELIER_BOTTOM_TRIM_TILE: extractString(maidChrome, 'MAID_ATELIER_BOTTOM_TRIM_TILE'),
  MAID_ATELIER_BOTTOM_CREST: extractString(maidChrome, 'MAID_ATELIER_BOTTOM_CREST'),
  MAID_ATELIER_SIDEBAR_CORNER: extractString(maidChrome, 'MAID_ATELIER_SIDEBAR_CORNER'),
  MAID_ATELIER_COMPOSER_FRAME: extractString(maidChrome, 'MAID_ATELIER_COMPOSER_FRAME'),
  MAID_ATELIER_SETTINGS_FRAME: extractString(maidChrome, 'MAID_ATELIER_SETTINGS_FRAME'),
  MAID_ATELIER_WORKSPACE_SHIELD: extractString(maidWorkspace, 'MAID_ATELIER_WORKSPACE_SHIELD'),
  MAID_ATELIER_WORKSPACE_RIBBON: extractString(maidWorkspace, 'MAID_ATELIER_WORKSPACE_RIBBON'),
  // art.ts 内嵌件（吉祥物 / 蝴蝶结 / 按钮框 / 帘幔 / 图标）
  MAID_ATELIER_CHIBI: extractString(maidArt, 'MAID_ATELIER_CHIBI'),
  MAID_ATELIER_BOW_CLEAN: extractString(maidArt, 'MAID_ATELIER_BOW_CLEAN'),
  MAID_ATELIER_NEW_SESSION: extractString(maidArt, 'MAID_ATELIER_NEW_SESSION'),
  MAID_ATELIER_SIDEBAR_SWAG: extractString(maidArt, 'MAID_ATELIER_SIDEBAR_SWAG'),
  MAID_ATELIER_TOP_TRIM_TILE: extractString(maidArt, 'MAID_ATELIER_TOP_TRIM_TILE'),
  MAID_ATELIER_ICON: extractString(maidArt, 'MAID_ATELIER_ICON'),
}, `// 宫殿昼夜背景复用 presets/backgrounds.generated.ts（MAID_PALACE_DAY / MAID_PALACE_NIGHT），
// 标题栏 SVG 字标见 ./titlebar-brand.generated.ts。
`)

// 标题栏字标是含双引号的 SVG 模板串，单独用 JSON.stringify 输出。
const titlebarSvg = extractTemplate(join(MAID_CLIENT, 'titlebar-brand.ts'), 'MAID_ATELIER_TITLEBAR_BRAND')
const titlebarTarget = join(root, 'src', 'client', 'packs', 'maid-atelier', 'titlebar-brand.generated.ts')
writeFileSync(titlebarTarget, GEN_HEADER + `export const MAID_ATELIER_TITLEBAR_BRAND = ${JSON.stringify(titlebarSvg)}\n`)
console.log(' ', 'MAID_ATELIER_TITLEBAR_BRAND', Math.round(titlebarSvg.length / 1024) + 'KB')
console.log('written:', titlebarTarget)

/* ── 3. maid-atelier 整包样式 ────────────────────────────────── */

const maidCss = readFileSync(join(MAID_CLIENT, 'maid-atelier.module.css'), 'utf8')
if (maidCss.includes('${')) throw new Error('maid-atelier.module.css contains template interpolation marker')
const cssTarget = join(root, 'src', 'client', 'packs', 'maid-atelier', 'css.generated.ts')
writeFileSync(cssTarget, GEN_HEADER + `export const MAID_ATELIER_CSS = ${JSON.stringify(maidCss)}\n`)
console.log(' ', 'MAID_ATELIER_CSS', Math.round(maidCss.length / 1024) + 'KB')
console.log('written:', cssTarget)

/* ── 4. odeta 本机素材槽（assets-local/ 被 gitignore，素材不分发） ── */

const odetaLocal = join(root, 'src', 'client', 'packs', 'odeta', 'assets-local')

/** 按候选文件名读取本机图片为 data URI；全部缺失时返回空串（皮肤退化为纯原创装饰版）。 */
function localImage(names) {
  for (const n of names) {
    try {
      const buf = readFileSync(join(odetaLocal, n))
      const ext = n.split('.').pop().toLowerCase()
      const mime = ext === 'png' ? 'image/png' : ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/webp'
      return `data:${mime};base64,${buf.toString('base64')}`
    } catch { /* 尝试下一个候选名 */ }
  }
  return ''
}

console.log('== packs/odeta/local-art.generated.ts ==')
writeGenerated(['packs', 'odeta', 'local-art.generated.ts'], {
  ODETA_LOCAL_PORTRAIT: localImage(['portrait.webp', 'portrait.png', 'portrait.jpg', 'portrait.jpeg']),
  ODETA_LOCAL_BACKDROP: localImage(['backdrop.webp', 'backdrop.png', 'backdrop.jpg', 'backdrop.jpeg']),
}, `// 本机素材（assets-local/，不进仓库）。此文件的本地变更请勿提交；
// 仓库内版本保持空串占位，其它机器 clone 后皮肤以纯原创装饰版工作。
`)
