/**
 * @dsh-external/dsh-skin — 换肤插件（host 侧）。
 *
 * 皮肤逻辑全部在 client（样式注入 + 设置面板 + localStorage 持久化）：
 *  - 主题色：覆盖 body / body[data-ds-dark-theme] 上的 --dsw-* 设计 token
 *    （--dsw-static-deepseek-* 色阶 + --dsw-alias-brand-* 品牌 token），
 *    组件全部消费 token，一处覆盖全局换肤。
 *  - 背景图：body::before 固定全屏层 + 把 bg-base/layer/sidebar 等 token
 *    调成半透明让图透出来。
 *  - 整包皮肤素材（maid-atelier 0.1.9 移植版）由下面的只读路由提供，
 *    路径与上游一致：/skin-assets/maid-atelier/<sha256>.<png|webp>。
 * host 侧仅做生命周期占位与该路由，无工具/无模型监听。
 */
import { readFile } from 'node:fs/promises'
import type { Context } from 'cordis'

export const name = '@dsh-external/dsh-skin'
export const inject: string[] = []

/** 上游皮肤约定的素材前缀，client 侧用 new URL('skin-assets/maid-atelier/…', document.baseURI)。 */
const SKIN_ASSET_PREFIX = '/skin-assets/maid-atelier'

/** 只发放随包分发的不可变美术资源（内容哈希命名），不做任何磁盘遍历。 */
const SKIN_ASSETS = [
  '06eaf23edd8d5efcf8dfd2ff573307d92ad4422f4a5c022064e9659d34258b8d.png',
  '1183d4d3a2b122078d09b1d9c97e085696ae214694399f14ce407fc21d8f1ec1.webp',
  '24f2fb04ce2d38574a3817f6d675b8c1ee5d9322588eec651271f67aabfcb48d.webp',
  '2789906568a926c4cf8c4a5639b1566e0eaf55ab947756839bdfd6a8d6354d92.png',
  '2818e5359596b13c5d64f5b1c5d4a9e0c05be477824779af8af37a0e10016b07.webp',
  '3d2b126caf0549c2e86684dcbc0ff4443b887e5e1684190710d2df7940466d98.webp',
  '3d7e6d87938275bb735ecf980c2bbc3392893131e3b5aa594cf96f98cb00703e.webp',
  '405917afdb68d725624bbf7e4f1619a35fc4004039b7d553c5528ca5f65308d3.webp',
  '4386aee80ebaa41f926096ae9e0378b08dbd3eaaa2ad6646ff8f50a3f480a7a9.webp',
  '47072d2d652f09e857dbc8555ff5c1917c926ef5d4581641f7018b1607c42fda.webp',
  '52e7dce6993e3f955c3fbb2875885e7ab60fb38ca89adb15d977c7a85d58c073.webp',
  '55f08096101b735ac656bcc4776dac8fb225f4b43bbc35b82aeda2cb33218355.webp',
  '70152698b4ffa11ce3d5ebb11373cb86222a68971222baf917f45f7ae2da9ef4.webp',
  '707f05bf4abed25405ca45c5c32bcf95ab7cb3a6dae3e53da29f814a8495665c.webp',
  '7c5a5493e84418bc0435013c8605222718923872c15eb46fdd36158d201c0b1e.webp',
  '944d281c6d6bb8e3b92ef682b95e107093bb8c4ba2c63e247dd615750d613ed1.webp',
  '98cf9484ee96018b1ddc6d61f30945ce973158002fe31a2be0790e44c6718515.webp',
  '98f0e13da2ecb0913739d6fbe83026b66746263a9c1dab006ef1b73279b7d8de.png',
  'ae6917bb1aafa71e6a10cfcaa1289f13e265aa7f32d3fb7c1988004bf50f8983.webp',
  'b59aa9d4ecfbbae6e62d872c964bce8ec870ed500e7cbc7a7f02bbdd0b93e87e.webp',
  'c033e0ef8cca6b516489f4e2aab05dac758c54ea3cf20f246412f08735c2d7fc.png',
  'c433e0bc2e5a36cc0022eb05150691986b5086b749ceacc556ab71359438d5c4.png',
  'cbc563ce4d9d0c299eda0acce30ba34b811cc4ac6d4abcf0e2ea066e69278ff5.webp',
  'cd728ce5c1794ec4958ef75c4cdd60a3d513b871bea99e3b526656f14089fd74.webp',
  'dcf64a43ad6b9e71c24c91fb9b1d7fe8af534497fd421213472bea96e6bc04b5.webp',
  'e2b04c3eca1871c5e73417674582a09b13de60119ca9bb9c112317232c5049fa.webp',
  'e49115f3942ea5c5034c81016c61944b5261c8ea410318cb0419b445c990b063.webp',
  'fa6d49a717c04651fd7d1afb30b853f63cbaa5bf483e58cb4bfe5ef69fc6ff50.webp',
  'fe8e1db21924622a0a3a38bd8fde3197d0f0ef2ba2b48c4665f5569013cd4f1d.png',
]

export function apply(ctx: Context): void {
  ctx.logger?.info?.('[dsh-skin] 换肤插件已激活（使用：设置 → 外观皮肤）')
  const allowed = new Set(SKIN_ASSETS)
  const directory = new URL('../assets/maid-atelier/', import.meta.url)
  ctx.inject(['webServer'], (webCtx) => {
    webCtx.effect(() => webCtx.webServer.register({
      kind: 'prefix',
      path: SKIN_ASSET_PREFIX,
      handler: async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.writeHead(405, { Allow: 'GET, HEAD' }).end()
          return
        }
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const file = pathname.slice(SKIN_ASSET_PREFIX.length + 1)
        if (!pathname.startsWith(`${SKIN_ASSET_PREFIX}/`) || !allowed.has(file)) {
          res.writeHead(404).end()
          return
        }
        let bytes
        try {
          bytes = await readFile(new URL(file, directory))
        } catch (error) {
          if (error.code !== 'ENOENT') throw error
          res.writeHead(404).end()
          return
        }
        const etag = `"${file.split('.')[0]}"`
        const headers = {
          'Content-Type': file.endsWith('.webp') ? 'image/webp' : 'image/png',
          'Cache-Control': 'public, max-age=31536000, immutable',
          'X-Content-Type-Options': 'nosniff',
          ETag: etag,
        }
        if (req.headers['if-none-match']?.split(',').some((value) => value.trim().replace(/^W\//, '') === etag || value.trim() === '*')) {
          res.writeHead(304, headers).end()
          return
        }
        res.writeHead(200, { ...headers, 'Content-Length': bytes.length })
        res.end(req.method === 'HEAD' ? undefined : bytes)
      },
    }), 'dsh-skin: maid-atelier artwork')
  })
}
