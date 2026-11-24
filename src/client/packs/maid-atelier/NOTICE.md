> **本目录现状（0.1.9 移植版）**：运行时由 `upstream.ts` 从已安装的
> `@smalltailqwq/dsh-client-ui-skin-maid-atelier@0.1.9` 的 `lib/client.js` 机械移植，
> 素材来自该包的 `assets/runtime/`，由本插件 Host 半的 `/skin-assets/maid-atelier/*`
> 路由提供。相对上游去掉了「改窗口标题 / 换 favicon 与 manifest / 同步 theme-color」
> 这三类浏览器头部行为，其余视觉装饰保持原样。生成脚本：`scripts/transplant-maid.mjs`。

# 深海女仆工坊（maid-atelier）整包素材与署名

本目录的整包皮肤素材提取自
[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)（maid-atelier），
许可以 **CC BY-NC-SA 4.0** 使用：仅限个人/非商业用途，衍生作品须以相同许可发布并保留本署名链。

输入框右上角的「DeepSeek 小机器人」另有一组署名链，见下文「DeepSeek 小机器人」一节。

## 署名链

1. 一创：上善 —— 鲸鱼娘角色形象原作（https://www.pixiv.net/users/62155430）
2. 二创：zipzip —— 加入 DeepSeek 元素的女仆鲸鱼娘二次设计（https://www.pixiv.net/users/18604994）
3. 三创：Small-tailqwq —— 本皮肤所用素材的再设计

## DeepSeek 小机器人（输入框右上角）

输入卡右上角站着的小机器人，素材取自
[YunYueSama/codex-deepseek-pet](https://github.com/YunYueSama/codex-deepseek-pet)
（`assets/fish_idle.png` / `assets/fish_happy.png`）。

许可：该仓库的素材适用**「大肥鱼项目署名许可 1.0」**——允许使用、修改、分享及商用，
**必须署名**；分发材料或其实质性部分时须保留完整许可，修改后须同时说明经过修改。
（该仓库自带的 `NOTICE` 另将这两个文件列为 MIT 随仓库分发；这里按更严格的署名许可执行。）

按许可要求，署名如下：

```text
作者：YunYueSama
仓库：https://github.com/YunYueSama/codex-deepseek-pet
```

**已做的修改**：原图 768×832 PNG → 等比缩放至 200×217 → 转 WebP（质量 90），
未裁切、未变形、保留透明底；分别作为「待机」与「运行中（开心）」两态使用。
本插件内为**本机素材槽**（`assets-local/`，已被 `.gitignore` 忽略，**不随仓库分发**），
仓库内版本保持空串占位，其它机器 clone 后回落到本包原创手绘鲸鱼剪影 SVG（`mascot.ts`，MIT）。

鲸鱼三视图参考（`assets/whale_front.png` / `whale_side.png` / `whale_icon.png`，
来自 [1190fasheqi/dafeiyu-pet](https://github.com/1190fasheqi/dafeiyu-pet)，MIT）
仅用于人工绘制兜底 SVG 时的造型参考，**未随本插件分发**。

## 文件说明

| 文件 | 内容 | 来源 |
|---|---|---|
| `art.generated.ts` | 双女仆立绘、chrome 装饰（角框/饰带/按钮框）、吉祥物、蝴蝶结、图标（base64 webp） | `maid-atelier/src/client/{art,background-art.generated,chrome-art.generated,workspace-art.generated}.ts` |
| `css.generated.ts` | 整包样式（~2600 行，根作用域 `body[data-dsh-maid-atelier]`） | `maid-atelier/src/client/maid-atelier.module.css` |
| `titlebar-brand.generated.ts` | 标题栏 DeepSeek Harness 矢量字标（去鲸鱼版） | `maid-atelier/src/client/titlebar-brand.ts` |
| `style.ts` | 本插件追加的样式（输入框右上角小人的规则）。**主样式 `css.generated.ts` 是生成物，不手改** | 本插件原创 |
| `mascot.ts` | 无本机素材时的兜底：原创手绘鲸鱼剪影 + 呆毛 SVG（MIT） | 本插件原创 |
| `local-art.generated.ts` | 本机素材槽（小人待机/运行中两张图）；仓库内为**空串占位** | `scripts/extract-presets.mjs --maid-only` |
| `runtime.ts` | 装饰与状态投影运行时（DOM 钩子、observer、dispose 恢复），按 dsh-skin PackContext 适配 | `maid-atelier/src/client/index.ts` |

宫殿昼夜背景复用 `../../presets/backgrounds.generated.ts` 的
`MAID_PALACE_DAY / MAID_PALACE_NIGHT`（同源素材，避免重复内联）。

## 重新生成

```sh
node scripts/extract-presets.mjs          # 全量（需要 .tmp-skins/dsh-deep-whale/ 源仓库）
node scripts/extract-presets.mjs --maid-only   # 只重生成 maid-atelier 本机素材槽
```

需要 `.tmp-skins/dsh-deep-whale/` 下准备好源仓库（git clone）。
本机素材放在 `assets-local/`（`mascot.webp` / `mascot-busy.webp`），
`--maid-only` 会把它们转成 data URI 写进 `local-art.generated.ts`。
