# 蓝色大肥鱼（blue-fat-fish）

深海湖蓝主题整包皮肤。输入框右上角站着一只 **Q 版「猫耳女仆 + 大鱼尾」小人**
（呆毛 + 深蓝猫耳 + 黑白女仆装 + 大肥鱼尾 + 金色四角星光），待机时闭眼微笑，
宿主会话运行时切换成睁眼张嘴的"响应中"表情。

## 文件

| 文件 | 内容 |
|---|---|
| `index.ts` | `BLUE_FAT_FISH_PACK`（PackPreset 注册项） |
| `art.ts` | 手绘原创 SVG 素材（气泡贴片、大肥鱼剪影、小鱼剪影、描金星光、海藻、预览图），全部 data URI 内联 |
| `mascot.ts` | 输入框右上角小人的**内联 SVG**（原创手绘，MIT 可分发） |
| `style.ts` | 皮肤 CSS（亮/暗双套 token + 装饰段 + 小人定位/动画） |
| `runtime.ts` | 运行时（生命周期、装饰挂载、小人重挂、状态投影） |
| `local-art.generated.ts` | 本机素材槽（脚本生成，仓库内为空串占位） |

## 主题与规范要点

- 根作用域 `body[data-dsh-blue-fat-fish]`，亮/暗由 `body[data-ds-dark-theme]` 分支表达。
- 状态钩子（全部由 runtime 投影，CSS 消费）：
  - `[data-blue-fat-fish-chat-active]` —— 会话进行中
  - `[data-blue-fat-fish-sidebar='rail'|'narrow'|'wide']` —— 侧栏宽度分档
  - `[data-blue-fat-fish-mascot-state='idle'|'busy']` —— 小人忙闲态
  - `[data-blue-fat-fish-has-mascot-art]` —— 存在本机素材槽图片
- 装饰层（气泡 / 游鱼 / 星光 / 海藻 / 小人）**全部是皮肤自有节点**：
  `data-blue-fat-fish-chrome` + `data-skin-owner` + `aria-hidden` + `pointer-events:none`。
- z-index：背景层 `0`，星光 `1`，小人 `2`（在输入卡内），**永不 ≥40**。
- 应用容器（侧栏 / 主区 / 输入卡）上不设 `transform` / `filter` /
  `backdrop-filter` / `perspective` / `will-change` / `contain` / `opacity<1` /
  `isolation` / 非 auto `z-index`——否则 DSH 设置弹窗与 Cordis 审批面板（以
  `position:fixed` 挂在侧栏子树内）会被挤到屏幕左侧。

## 可选：本机素材槽（覆盖小人形象）

默认用仓库内的**原创手绘 SVG**（MIT，可随插件分发）。若想换成自己的位图：

1. 在本目录建 `assets-local/`（已被 `.gitignore` 忽略，**不会**进仓库）：
   - `mascot.png`（或 `.webp` / `.jpg`）—— 待机图
   - `mascot-busy.png` —— 运行中图（可省略，省略时运行时沿用待机图）
2. 重新生成槽位：

   ```sh
   node scripts/extract-presets.mjs --blue-fat-fish-only
   ```

3. 重启插件。`local-art.generated.ts` 会被写入 base64 data URI，
   runtime 通过 `--bff-mascot-art` / `--bff-mascot-art-busy` CSS 变量接入，
   CSS 按 `data-blue-fat-fish-mascot-state` 切换。

> `local-art.generated.ts` 的本地变更**不要提交**（其它机器 clone 后应以
> 纯原创 SVG 版本工作）。

## 素材与许可

本包全部装饰件（含 Q 版小人）为本插件手绘原创，随 dsh-skin 以 **MIT** 发布，
不含任何第三方素材。
