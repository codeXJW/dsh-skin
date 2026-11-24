# 奥黛塔 · 冰湖天鹅 —— 本机素材接入与版权说明

本整包皮肤的装饰件（雪花贴片、冰晶、霜晕、预览图）为 dsh-skin **手绘原创**，
随插件以 MIT 发布，可自由分发。

角色**立绘**与场景**背景**涉及第三方版权（© HoYoverse / 各同人画师），
**不进入本仓库**，走「本机素材槽」——素材只存在你的电脑上，构建时内联进你
本机的 bundle，不随 git 分发。

> 角色有两种出现形态：
> 1. **右侧立绘装饰层**（`portrait.*`）：贴右边缘、`pointer-events:none`、
>    z-index 留在装饰层（不压正文）；会话进行中淡出到 16% 把版面让给正文，
>    ≤980px 窄屏自动隐藏，`prefers-reduced-motion` 下不做过渡。
> 2. **输入框右上角 Q 版小人**（`chibi.*` / `chibi-busy.*`）：常驻，跟随忙闲切换。

## 接入本机素材

1. 准备图片（建议 webp，立绘需透明底 PNG/WebP 效果更佳）：
   - 立绘：官方角色立绘、标注「自用随意」的截修壁纸、或你已获得授权的同人图
   - 背景（可选）：至冬/冰湖场景图
   - 小人（可选）：输入框右上角的小人半身像，透明底
2. 放进本目录的 `assets-local/`（已被 .gitignore 排除）：

   ```
   src/client/packs/odeta/assets-local/
   ├── portrait.webp     # 立绘（候选名：portrait.webp/.png/.jpg/.jpeg）
   ├── backdrop.webp     # 背景（候选名：backdrop.webp/.png/.jpg/.jpeg，可选）
   ├── chibi.webp        # 小人·待机（候选名：chibi.webp/.png/.jpg/.jpeg）
   └── chibi-busy.webp   # 小人·运行中（候选名：chibi-busy.webp/.png/.jpg/.jpeg）
   ```

3. 重新生成 + 构建（在仓库根目录）：

   ```powershell
   node scripts/extract-presets.mjs --odeta-only   # 读取 assets-local → local-art.generated.ts
   npm run build:client                            # 内联进 lib/client.js
   ```

   > `extract-presets.mjs` 不带参数时会重跑 1~3 段（简约背景 / maid-atelier），
   > 那几段依赖 `.tmp-skins/` 里的第三方皮肤仓库；本机没有该目录时用
   > `--odeta-only`，只重生成这里的本机素材槽。

   注入器环境再让 AI 跑 `dev_reload_package @dsh-external/dsh-skin`，浏览器刷新即生效。

4. 缺省行为：
   - 没有立绘/背景时，皮肤以「纯原创装饰版」完整工作
     （CSS 冰湖渐变背景 + 落雪 + 冰晶/角落点缀）；
   - 没有小人素材时，输入框右上角回落到**原创机器人**小人
     （`mascot.ts`，MIT，可分发）；
   - 放入素材后自动升级为完整版。

## 输入框右上角的小人

小人挂载在真实输入卡 `div[data-composer-card]` 内，定位在卡片**右上角**
（整体上移，框底与卡片上沿齐平 → 角色像站在边沿上），`pointer-events:none`
不挡输入。

- 有 `chibi.*` 素材时：用 **Q 版全身像**（透明底 PNG/WebP，建议正方形构图）。
  两张状态图都注入成 CSS 变量，由 CSS 按 `body[data-odeta-mascot-state]`
  选用（规范 C1：JS 只投影状态钩子）：
  - `--odeta-mascot-art` → 待机
  - `--odeta-mascot-art-busy` → 运行中（宿主 `data-chat-running` 挂载时）
- 无 `chibi.*` 素材时：回落到 `mascot.ts` 的原创机器人 SVG（内联，便于 CSS
  分别控制眼睛/徽记/天线，做出 idle↔busy 表情与动画）。

> 素材只要"正方形 + 全身 + 透明底"即可，不必精确裁切：CSS 用
> `background-size: contain` 自适应，`mask` 负责底沿的柔和过渡。

## 版权红线

- `assets-local/` 与 `local-art.generated.ts` 的**本地变更都不要提交**。
  仓库内 `local-art.generated.ts` 保持空串占位版本。
- 仅本机个人使用；不要把含立绘的 `lib/client.js` 分发出去（官方的
  `npm run build:client` 产物不含本机素材，可正常分发）。
- 若哪天拿到画师的正式授权（如 CC 许可链），再把素材按
  `packs/maid-atelier/NOTICE.md` 的格式登记署名链后转正。
