/**
 * 把已安装的 @smalltailqwq/dsh-client-ui-skin-maid-atelier 整包皮肤移植进本插件。
 *
 * 做三件事（机械搬运，不改写语义）：
 *  1. 从该包 lib/client.js 抽出 factory 主体（去掉 __ModuleLoader__ 装配壳），
 *     重命名为 applyMaidAtelierPack，写入 src/client/packs/maid-atelier/upstream.ts。
 *  2. 去掉三类「浏览器头部行为」：改 document.title、换 favicon/manifest、
 *     同步 meta[theme-color]。其余视觉装饰原样保留。
 *  3. 把该包 assets/runtime/ 的不可变素材拷到本仓库 assets/maid-atelier/，
 *     供 Host 半的 /skin-assets/maid-atelier/* 路由发放。
 *
 * 用法：
 *   node scripts/transplant-maid.mjs [安装包目录]
 * 缺省从 profile 的 node_modules 找；找不到就报错，不做猜测。
 */
import { copyFileSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { basename, join } from 'node:path'

const PACKAGE = '@smalltailqwq/dsh-client-ui-skin-maid-atelier'
const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')
const packDir = join(root, 'src', 'client', 'packs', 'maid-atelier')
const assetTarget = join(root, 'assets', 'maid-atelier')

function locatePackage() {
  if (process.argv[2]) return process.argv[2]
  const profile = process.env.DSH_PROFILE_DIR ?? join(homedir(), '.dsh', 'profiles', process.env.DSH_PROFILE ?? 'desktop')
  return join(profile, 'node_modules', ...PACKAGE.split('/'))
}

/** 抽出 `const X = "..."` 形式的长字符串（CSS 常量）。 */
function extractStringLiteral(source, marker) {
  const at = source.indexOf(marker)
  if (at < 0) return null
  const quote = source.indexOf('"', at + marker.length)
  let index = quote + 1
  let out = ''
  while (index < source.length) {
    const ch = source[index]
    if (ch === '\\') {
      out += ch + source[index + 1]
      index += 2
      continue
    }
    if (ch === '"') break
    out += ch
    index += 1
  }
  return JSON.parse(`"${out}"`)
}

const pkgDir = locatePackage()
const clientFile = join(pkgDir, 'lib', 'client.js')
const source = readFileSync(clientFile, 'utf8')

const headMarker = 'Object.defineProperty(exports, Symbol.toStringTag'
const headAt = source.indexOf(headMarker)
const bodyStart = source.indexOf('\n', headAt) + 1
const bodyEnd = source.lastIndexOf('exports.apply = apply;')
if (headAt < 0 || bodyEnd < 0) throw new Error(`不是预期的 client 装配壳：${clientFile}`)

let body = source.slice(bodyStart, bodyEnd)
body = body.replace('function apply(ctx) {', 'export function applyMaidAtelierPack(ctx) {')
body = body.replace(/\n\s*const inject = \["layout"\];\n/, '\n')

// ── 去掉浏览器头部行为 ───────────────────────────────────────────────
const dropLines = new Set([
  'const originalTitle = document.title;',
  'if (document.title === SKIN_TITLE) document.title = originalTitle;',
  'document.title = SKIN_TITLE;',
  'installMaidPageIcons(ctx);',
  'let themeColorMeta = null;',
  'let previousThemeColor;',
  'let themeColorObserver;',
  'themeColorObserver?.disconnect();',
  'if (themeColorMeta?.isConnected && themeColorMeta.content === SKIN_SYSTEM_CHROME_COLOR) themeColorMeta.content = previousThemeColor ?? "";',
])
const lines = body.split('\n')
let themeBlockStart = -1
let themeBlockEnd = -1
lines.forEach((line, index) => {
  if (line.includes('const syncSystemChrome = () => {')) themeBlockStart = index
  if (themeBlockStart >= 0 && themeBlockEnd < 0 && line.trim() === 'syncSystemChrome();') themeBlockEnd = index
})
const kept = lines.filter((line, index) => {
  if (dropLines.has(line.trim())) return false
  if (themeBlockStart >= 0 && themeBlockEnd >= 0 && index >= themeBlockStart && index <= themeBlockEnd) return false
  return true
})
body = kept.join('\n')

const banner = `/**
 * 深海女仆工坊（maid-atelier）0.1.9 运行时 —— 从已安装包 lib/client.js 机械移植。
 *
 * 生成方式：node scripts/transplant-maid.mjs（不要手改本文件）。
 * 与上游的差异仅三处：
 *  - 去掉 Cordis 客户端装配壳（__ModuleLoader__ / exports / inject），改为 pack 的 apply；
 *  - ctx 由本插件的 PackContext 提供（effect + layout），不依赖客户端服务容器；
 *  - 素材 URL 走本插件 Host 半的 /skin-assets/maid-atelier/* 路由（与上游同路径）。
 * 另外去掉改标题 / favicon+manifest / theme-color 三类浏览器头部行为。
 *
 * 授权：素材与代码署名见同目录 NOTICE.md（CC BY-NC-SA 4.0，非商用）。
 */
// @ts-nocheck
`

mkdirSync(packDir, { recursive: true })
writeFileSync(join(packDir, 'upstream.ts'), banner + body.trimEnd() + '\n', 'utf8')

// ── 素材：不可变哈希文件 ──────────────────────────────────────────────
const assetSource = join(pkgDir, 'assets', 'runtime')
mkdirSync(assetTarget, { recursive: true })
const assets = readdirSync(assetSource).filter((file) => /^[a-f0-9]{64}\.(png|webp)$/.test(file))
for (const file of assets) copyFileSync(join(assetSource, file), join(assetTarget, file))

console.log('client source:', clientFile)
console.log('upstream.ts bytes:', (banner + body).length)
console.log('dropped lines:', dropLines.size, '| theme-color block:', themeBlockStart >= 0 && themeBlockEnd > themeBlockStart)
console.log('assets:', assets.length, 'from', basename(assetSource))
