/**
 * @dsh-external/dsh-skin — 换肤插件（host 侧）。
 *
 * 皮肤逻辑全部在 client（样式注入 + 设置面板 + localStorage 持久化）。
 * host 侧只做两件事：
 *  1. 生命周期占位（资源注册挂 ctx.effect 的规范）；
 *  2. 为整包皮肤发放只读、内容哈希命名的素材：
 *     /skin-assets/maid-atelier/*          · 深海女仆工坊（0.1.9 移植）
 *     /skin-assets/deep-whale-day-night/*  · 鲸鱼娘昼夜工坊（0.1.12 移植）
 * 每个集合都有显式白名单，不做磁盘遍历；只允许 GET/HEAD。
 */
import { readFile } from 'node:fs/promises'

export const name = '@dsh-external/dsh-skin'
export const inject = []

const ASSET_SETS = [
  {
    prefix: "/skin-assets/maid-atelier",
    directory: "../assets/maid-atelier/",
    files: [
      "06eaf23edd8d5efcf8dfd2ff573307d92ad4422f4a5c022064e9659d34258b8d.png",
      "1183d4d3a2b122078d09b1d9c97e085696ae214694399f14ce407fc21d8f1ec1.webp",
      "24f2fb04ce2d38574a3817f6d675b8c1ee5d9322588eec651271f67aabfcb48d.webp",
      "2789906568a926c4cf8c4a5639b1566e0eaf55ab947756839bdfd6a8d6354d92.png",
      "2818e5359596b13c5d64f5b1c5d4a9e0c05be477824779af8af37a0e10016b07.webp",
      "3d2b126caf0549c2e86684dcbc0ff4443b887e5e1684190710d2df7940466d98.webp",
      "3d7e6d87938275bb735ecf980c2bbc3392893131e3b5aa594cf96f98cb00703e.webp",
      "405917afdb68d725624bbf7e4f1619a35fc4004039b7d553c5528ca5f65308d3.webp",
      "4386aee80ebaa41f926096ae9e0378b08dbd3eaaa2ad6646ff8f50a3f480a7a9.webp",
      "47072d2d652f09e857dbc8555ff5c1917c926ef5d4581641f7018b1607c42fda.webp",
      "52e7dce6993e3f955c3fbb2875885e7ab60fb38ca89adb15d977c7a85d58c073.webp",
      "55f08096101b735ac656bcc4776dac8fb225f4b43bbc35b82aeda2cb33218355.webp",
      "70152698b4ffa11ce3d5ebb11373cb86222a68971222baf917f45f7ae2da9ef4.webp",
      "707f05bf4abed25405ca45c5c32bcf95ab7cb3a6dae3e53da29f814a8495665c.webp",
      "7c5a5493e84418bc0435013c8605222718923872c15eb46fdd36158d201c0b1e.webp",
      "944d281c6d6bb8e3b92ef682b95e107093bb8c4ba2c63e247dd615750d613ed1.webp",
      "98cf9484ee96018b1ddc6d61f30945ce973158002fe31a2be0790e44c6718515.webp",
      "98f0e13da2ecb0913739d6fbe83026b66746263a9c1dab006ef1b73279b7d8de.png",
      "ae6917bb1aafa71e6a10cfcaa1289f13e265aa7f32d3fb7c1988004bf50f8983.webp",
      "b59aa9d4ecfbbae6e62d872c964bce8ec870ed500e7cbc7a7f02bbdd0b93e87e.webp",
      "c033e0ef8cca6b516489f4e2aab05dac758c54ea3cf20f246412f08735c2d7fc.png",
      "c433e0bc2e5a36cc0022eb05150691986b5086b749ceacc556ab71359438d5c4.png",
      "cbc563ce4d9d0c299eda0acce30ba34b811cc4ac6d4abcf0e2ea066e69278ff5.webp",
      "cd728ce5c1794ec4958ef75c4cdd60a3d513b871bea99e3b526656f14089fd74.webp",
      "dcf64a43ad6b9e71c24c91fb9b1d7fe8af534497fd421213472bea96e6bc04b5.webp",
      "e2b04c3eca1871c5e73417674582a09b13de60119ca9bb9c112317232c5049fa.webp",
      "e49115f3942ea5c5034c81016c61944b5261c8ea410318cb0419b445c990b063.webp",
      "fa6d49a717c04651fd7d1afb30b853f63cbaa5bf483e58cb4bfe5ef69fc6ff50.webp",
      "fe8e1db21924622a0a3a38bd8fde3197d0f0ef2ba2b48c4665f5569013cd4f1d.png",
    ],
  },
  {
    prefix: "/skin-assets/deep-whale-day-night",
    directory: "../assets/deep-whale-day-night/",
    files: [
      "01e6ea6f95422427cc1f30e610b4f70a53392e2a5e53b69c055e4fc8624dffe5.png",
      "12a1d644639c58d2ecae05e5b6b7bd42f7c30f76bd9829c3eec7d05c676c2568.webp",
      "1b1566eab6a711d231bb1339a88aff02265b4e175daa41b0b70c5e3d1a5b30b7.png",
      "250ef507e7638c1cd6c5292a5742afb6a8bba1b377687817c2210bfc6f4e64b8.webp",
      "2559bfb7258e3a22d5ebf457f0d2f63bb8144060a4ae8d9e2726feab5387a480.png",
      "27b40f1341b1ca70184b78216a49df7b673bce9aa5ce17bade2fb52971f80268.webp",
      "34b0d883188c44a523954e1a1c5002f2dec8644c44c54d94a0b9d18b639416c8.png",
      "3e82fa14ddd753f39f9bd6f39c2fb653fe8fc1699175b41ff6bcf67b728a84cd.png",
      "41bad09ccb54eff51795098ec11ce24c0d0c260e04f5ddf2bb0272951eac5aa8.png",
      "4af1c982620cc37ead7a1b60fda17accd409c0658edaf0e16c553a08f1374334.webp",
      "4b5d21588ab29c32216ce68a9a4cb0b3f6208dafba8289adc0d1fe88623b92b6.png",
      "60a8a2fa2a038b40b01bdc30b99dc355d6aa1a8d5893b1e84d0a9a3c738d458d.png",
      "889a802c168dce2509edcabfab86658eafbe0e6d47abd1832389cad88ccc9613.png",
      "90c6b2e9f02032f7fc3304ac583d2375be3394ef7a89088e0ce2f2b935c9fd0c.webp",
      "918f77fc8fb33bac339f2b002c3f76722cf7c18676561d39c55683b977706292.png",
      "b8f088c46c1295ed9f8af6d50618bed3dd0c4633e5edcd076e542b6c5a218dd9.webp",
      "be7ea360355b13213250b5920c69d2036f10db003c4bcc8756366f409656b6b0.webp",
      "c1ba59aca0207897a3cc8dc77baafcd2e1b1c4f5e0fefe1b91d8ae386e57907d.png",
      "ce5b6b5e5a576a9d60792612f7878db7962824f9b6475a8b0b3a9dc26fa4079d.png",
      "d395858d192c0fb2b0b79c01bbb636e9aa0f88007d3e174b1087302ca63f0a10.png",
      "dfcfd0207bc759454332ef1b75ecd58ff872a741597c715a065ab949210e7817.png",
      "e993058b674e6438ebb9c7669ce8ec43193cf50d44de01963dd7e69f5ab9fdcc.png",
      "eac0c77c28ef30b11a57238ca1118d1f55d6aeadee45282160c83f311030bbfe.webp",
      "f2f9976a3688d3c95a21e711c0d073aaac0916aeb424c0e820328958af5e6566.webp",
      "feaeec9da966dc2ba09605403dcde3a43b21305d65000c3dcb3396d0b0fb5021.png",
      "preview-dark.webp",
      "preview-light.webp",
    ],
  },
]

function contentTypeOf(file) {
  return file.endsWith('.webp') ? 'image/webp' : 'image/png'
}

function installAssetSet(ctx, set) {
  const allowed = new Set(set.files)
  const directory = new URL(set.directory, import.meta.url)
  ctx.inject(['webServer'], (webCtx) => {
    webCtx.effect(() => webCtx.webServer.register({
      kind: 'prefix',
      path: set.prefix,
      handler: async (req, res) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.writeHead(405, { Allow: 'GET, HEAD' }).end()
          return
        }
        const pathname = new URL(req.url ?? '/', 'http://localhost').pathname
        const file = pathname.slice(set.prefix.length + 1)
        if (!pathname.startsWith(`${set.prefix}/`) || !allowed.has(file)) {
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
          'Content-Type': contentTypeOf(file),
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
    }), `dsh-skin: ${set.prefix} artwork`)
  })
}

export function apply(ctx) {
  ctx.logger?.info?.('[dsh-skin] 换肤插件已激活（使用：设置 → 外观皮肤）')
  for (const set of ASSET_SETS) installAssetSet(ctx, set)
}
