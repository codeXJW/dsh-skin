# 深海女仆工坊（maid-atelier）整包素材与署名

本目录的整包皮肤素材提取自
[Small-tailqwq/dsh-deep-whale](https://github.com/Small-tailqwq/dsh-deep-whale)（maid-atelier），
许可以 **CC BY-NC-SA 4.0** 使用：仅限个人/非商业用途，衍生作品须以相同许可发布并保留本署名链。

## 署名链

1. 一创：上善 —— 鲸鱼娘角色形象原作（https://www.pixiv.net/users/62155430）
2. 二创：zipzip —— 加入 DeepSeek 元素的女仆鲸鱼娘二次设计（https://www.pixiv.net/users/18604994）
3. 三创：Small-tailqwq —— 本皮肤所用素材的再设计

## 文件说明

| 文件 | 内容 | 来源 |
|---|---|---|
| `art.generated.ts` | 双女仆立绘、chrome 装饰（角框/饰带/按钮框）、吉祥物、蝴蝶结、图标（base64 webp） | `maid-atelier/src/client/{art,background-art.generated,chrome-art.generated,workspace-art.generated}.ts` |
| `css.generated.ts` | 整包样式（~2600 行，根作用域 `body[data-dsh-maid-atelier]`） | `maid-atelier/src/client/maid-atelier.module.css` |
| `titlebar-brand.generated.ts` | 标题栏 DeepSeek Harness 矢量字标（去鲸鱼版） | `maid-atelier/src/client/titlebar-brand.ts` |
| `runtime.ts` | 装饰与状态投影运行时（DOM 钩子、observer、dispose 恢复），按 dsh-skin PackContext 适配 | `maid-atelier/src/client/index.ts` |

宫殿昼夜背景复用 `../../presets/backgrounds.generated.ts` 的
`MAID_PALACE_DAY / MAID_PALACE_NIGHT`（同源素材，避免重复内联）。

## 重新生成

```sh
node scripts/extract-presets.mjs
```

需要 `.tmp-skins/dsh-deep-whale/` 下准备好源仓库（git clone）。
