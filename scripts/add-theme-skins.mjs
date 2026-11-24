/**
 * 从 `.tmp-skin-css/` 的抓取结果生成「纯 CSS 皮肤包」。
 *
 * 输入（由 agent 从上游 whyihaveyou/dsh-themes 抓取，Apache-2.0）：
 *   .tmp-skin-css/<id>.json   ← skins/<id>/skin.json
 *   .tmp-skin-css/<id>.css    ← skins/<id>/src/client/<id>.module.css
 *
 * 输出：
 *   src/client/packs/<id>/style.ts   ← CSS 字符串（JSON 转义，原样搬运）
 *   src/client/packs/<id>/index.ts   ← makeCssPack({id,name,desc,credit,bodyAttr,accent,css})
 *
 * 用法：node scripts/add-theme-skins.mjs
 * 生成的目录与文件不要手改；色值/元数据更新时重跑即可。
 */
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const source = join(root, '.tmp-skin-css')
const output = join(root, 'src', 'client', 'packs')

const constantName = (id) => `${id.replace(/[^a-z0-9]+/gi, '_').toUpperCase()}_PACK`

const files = readdirSync(source).filter((file) => file.endsWith('.json'))
if (files.length === 0) {
  console.error(`没有找到抓取结果：${source}`)
  process.exit(1)
}

for (const file of files.sort()) {
  const id = file.replace(/\.json$/, '')
  const meta = JSON.parse(readFileSync(join(source, file), 'utf8'))
  const css = readFileSync(join(source, `${id}.css`), 'utf8')
  if (typeof meta.bodyAttr !== 'string' || !meta.bodyAttr.startsWith('data-dsh-')) {
    throw new Error(`${id}: skin.json 缺少合法的 bodyAttr`)
  }
  if (!css.includes(`body[${meta.bodyAttr}]`)) {
    throw new Error(`${id}: CSS 作用域与 bodyAttr（${meta.bodyAttr}）不一致`)
  }

  const dir = join(output, id)
  mkdirSync(dir, { recursive: true })
  writeFileSync(
    join(dir, 'style.ts'),
    `/** 上游 whyihaveyou/dsh-themes skins/${id}（Apache-2.0），原样搬运，不要手改。 */\nexport const CSS = ${JSON.stringify(css)}\n`,
    'utf8',
  )
  writeFileSync(
    join(dir, 'index.ts'),
    [
      "import { makeCssPack } from '../css-pack'",
      "import { CSS } from './style'",
      '',
      `export const ${constantName(id)} = makeCssPack({`,
      `  id: ${JSON.stringify(id)},`,
      `  name: ${JSON.stringify(meta.name ?? id)},`,
      `  desc: ${JSON.stringify(meta.description ?? meta.tagline ?? '')},`,
      "  credit: 'whyihaveyou/dsh-themes（Apache-2.0），移植自 aionui-themes',",
      `  bodyAttr: ${JSON.stringify(meta.bodyAttr)},`,
      `  accent: ${JSON.stringify(typeof meta.accent === 'string' ? meta.accent : '#4c6ef5')},`,
      '  css: CSS,',
      '})',
      '',
    ].join('\n'),
    'utf8',
  )
  console.log(`${id}: ${css.length} bytes CSS → ${dir}`)
}
