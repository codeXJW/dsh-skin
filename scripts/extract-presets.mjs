/**
 * 从 .tmp-skins 下的第三方皮肤仓库提取预设背景素材，生成
 * src/client/presets/backgrounds.generated.ts（base64 内嵌 webp）。
 *
 * 用法：node scripts/extract-presets.mjs
 * 素材来源与许可见 src/client/presets/README.md（CC BY-NC-SA 4.0 署名链）。
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const tmp = join(root, '.tmp-skins')

const TOUHOU_TS = join(tmp, 'touhou-hakurei', 'src', 'client', 'background-art.generated.ts')
const DEEP_WHALE = join(tmp, 'dsh-deep-whale', 'maid-atelier', 'assets')
const MIKU_JS = join(tmp, 'package', 'lib', 'client.js')

/** 从 TS/JS 源码里提取 data URI（兼容 export const / const + 单双引号）。 */
function extractDataUri(file, name) {
  const s = readFileSync(file, 'utf8')
  const m = s.match(new RegExp(`${name}\\s*=\\s*['"]([^'"]+)['"]`))
  if (!m) throw new Error(`missing ${name} in ${file}`)
  return m[1]
}

function webpToDataUri(rel) {
  const buf = readFileSync(join(DEEP_WHALE, rel))
  return `data:image/webp;base64,${buf.toString('base64')}`
}

const out = {
  HAKUREI_PALACE_LIGHT: extractDataUri(TOUHOU_TS, 'HAKUREI_PALACE_LIGHT'),
  HAKUREI_PALACE_DARK: extractDataUri(TOUHOU_TS, 'HAKUREI_PALACE_DARK'),
  MAID_PALACE_DAY: webpToDataUri('maid-atelier-palace-day-v4.webp'),
  MAID_PALACE_NIGHT: webpToDataUri('maid-atelier-palace-night-v4.webp'),
  MIKU_BACKDROP: extractDataUri(MIKU_JS, 'MIKU_ART'),
}

for (const [k, v] of Object.entries(out)) {
  console.log(k, Math.round(v.length / 1024) + 'KB')
}

const header = `/**
 * 生成的预设背景素材（base64 内嵌 webp）——请勿手改，重新生成：
 *   node scripts/extract-presets.mjs
 * 来源与许可（CC BY-NC-SA 4.0 署名链）见本目录 README.md。
 */
`

const body = Object.entries(out)
  .map(([k, v]) => `export const ${k} = '${v}'`)
  .join('\n\n')

const target = join(root, 'src', 'client', 'presets', 'backgrounds.generated.ts')
mkdirSync(dirname(target), { recursive: true })
writeFileSync(target, header + body + '\n')
console.log('written:', target)
