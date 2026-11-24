# 预设皮肤素材来源与许可

本插件内置的二次元预设皮肤背景素材提取自以下第三方开源项目。
本插件为个人/非商业用途；素材以各自许可条款使用，请勿将本插件或其素材用于商业用途。

> 「深海女仆工坊 · 完整主题」整包（立绘/chrome 装饰/样式）的素材与署名链
> 另见 `../packs/maid-atelier/NOTICE.md`。

## 素材清单

| 预设 | 素材 | 来源 | 许可 |
|---|---|---|---|
| 博丽神社·灵梦（昼/夜） | 博丽神社昼夜实景背景 | [xiake595/touhou-hakurei](https://github.com/xiake595/touhou-hakurei) | CC BY-NC-SA 4.0 |
| 初音未来·电子歌姬 | MIKU_ART 背景画作 | [@linxin666/dsh-client-ui-skin-miku](https://www.npmjs.com/package/@linxin666/dsh-client-ui-skin-miku)（作者 涂山苏苏） | BSD-3-Clause |
| 深海女仆工坊·输入框小人 | DeepSeek 小机器人 Q 版全身像（待机/运行中） | [YunYueSama/codex-deepseek-pet](https://github.com/YunYueSama/codex-deepseek-pet) | 大肥鱼项目署名许可 1.0（**必须署名**；本机素材槽，不随仓库分发） |

## 署名链（CC BY-NC-SA 4.0 要求）

### dsh-deep-whale / maid-atelier（深海女仆工坊）
1. 一创：上善 —— 鲸鱼娘角色形象原作（https://www.pixiv.net/users/62155430）
2. 二创：zipzip —— 加入 DeepSeek 元素的女仆鲸鱼娘二次设计（https://www.pixiv.net/users/18604994）
3. 三创：Small-tailqwq —— 本皮肤所用素材的再设计

### touhou-hakurei（博丽神社·灵梦）
- 皮肤工程结构衍生自 dsh-deep-whale / maid-atelier（Small-tailqwq，CC BY-NC-SA 4.0）
- 背景/角色素材为作者本地素材（博丽神社昼夜实景等），经工具转 webp 内嵌
- 作者：xiake595

### codex-deepseek-pet（DeepSeek 小机器人）
- 深海女仆工坊整包输入框右上角的小人素材（`fish_idle.png` / `fish_happy.png`）
- 许可：「大肥鱼项目署名许可 1.0」——允许使用/修改/分享/商用，**必须署名**：
  `作者：YunYueSama` / `仓库：https://github.com/YunYueSama/codex-deepseek-pet`
- 已做的修改：等比缩放至 200×217 并转 WebP，未裁切、未变形
- 鲸鱼三视图参考（`1190fasheqi/dafeiyu-pet`，MIT）仅作兜底 SVG 的造型参考，不随本插件分发

## 重新生成

```sh
node scripts/extract-presets.mjs
```

需要先在 `.tmp-skins/` 下准备对应仓库源码：
- `touhou-hakurei/` ← git clone https://github.com/xiake595/touhou-hakurei
- `dsh-deep-whale/` ← git clone https://github.com/Small-tailqwq/dsh-deep-whale
- `package/` ← npm pack @linxin666/dsh-client-ui-skin-miku 并解压

输出：`src/client/presets/backgrounds.generated.ts`
