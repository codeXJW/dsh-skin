# 奥黛塔 · 冰湖天鹅 —— 本机素材接入与版权说明

本整包皮肤的装饰件（雪花贴片、天鹅羽、冰晶、预览图）为 dsh-skin **手绘原创**，
随插件以 MIT 发布，可自由分发。

角色**立绘**与场景**背景**涉及第三方版权（© HoYoverse / 各同人画师），
**不进入本仓库**，走「本机素材槽」——素材只存在你的电脑上，构建时内联进你
本机的 bundle，不随 git 分发。

## 接入本机素材

1. 准备图片（建议 webp，立绘需透明底 PNG/WebP 效果更佳）：
   - 立绘：官方角色立绘、标注「自用随意」的截修壁纸、或你已获得授权的同人图
   - 背景（可选）：至冬/冰湖场景图
2. 放进本目录的 `assets-local/`（已被 .gitignore 排除）：

   ```
   src/client/packs/odeta/assets-local/
   ├── portrait.webp   # 立绘（候选名：portrait.webp/.png/.jpg/.jpeg）
   └── backdrop.webp   # 背景（候选名：backdrop.webp/.png/.jpg/.jpeg，可选）
   ```

3. 重新生成 + 构建（在仓库根目录）：

   ```powershell
   node scripts/extract-presets.mjs   # 读取 assets-local → local-art.generated.ts
   npm run build:client               # 内联进 lib/client.js
   ```

   注入器环境再让 AI 跑 `dev_reload_package @dsh-external/dsh-skin`，浏览器刷新即生效。

4. 缺省行为：没有立绘/背景时，皮肤以「纯原创装饰版」完整工作
   （CSS 冰湖渐变背景 + 落雪 + 羽毛），放了素材自动升级为完整版。

## 版权红线

- `assets-local/` 与 `local-art.generated.ts` 的**本地变更都不要提交**。
  仓库内 `local-art.generated.ts` 保持空串占位版本。
- 仅本机个人使用；不要把含立绘的 `lib/client.js` 分发出去（官方的
  `npm run build:client` 产物不含本机素材，可正常分发）。
- 若哪天拿到画师的正式授权（如 CC 许可链），再把素材按
  `packs/maid-atelier/NOTICE.md` 的格式登记署名链后转正。
