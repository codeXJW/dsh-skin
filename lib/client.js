window.__ModuleLoader__.load({
	id: "@dsh-external/dsh-skin",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react = require("react");
		let react_jsx_runtime = require("react/jsx-runtime");
		//#region src/client/index.tsx
		/**
		* @dsh-external/dsh-skin — client 换肤实现。
		*
		* 机制：
		*  - apply() 时立即按 localStorage 配置注入 <style id="dsh-skin-style">，
		*    覆盖 design-platform.css 里的 --dsw-* 设计 token（body 亮色 /
		*    body[data-ds-dark-theme] 暗色两个作用域），并挂 body[data-dsh-skin] 属性。
		*  - 设置 → 「外观皮肤」section（settings.section 列表槽）：
		*    开关 / 主题色（取色器 + 预设色板）/ 背景图上传（FileReader → data URI，
		*    localStorage 持久化）/ 背景透明度 / 恢复默认。
		*/
		const STORAGE_KEY = "dsh-skin:config";
		const STYLE_ID = "dsh-skin-style";
		const MAX_FILE_BYTES = 3145728;
		const PRESETS = [
			"#3964fe",
			"#0ea5e9",
			"#059669",
			"#14b8a6",
			"#7c3aed",
			"#e11d48",
			"#f59e0b",
			"#334155"
		];
		function defaultConfig() {
			return {
				enabled: true,
				accent: "#3964fe",
				bgImage: null,
				bgOpacity: .9
			};
		}
		function loadConfig() {
			try {
				const raw = localStorage.getItem(STORAGE_KEY);
				if (!raw) return defaultConfig();
				const p = JSON.parse(raw);
				return {
					enabled: typeof p.enabled === "boolean" ? p.enabled : true,
					accent: typeof p.accent === "string" && /^#[0-9a-fA-F]{6}$/.test(p.accent) ? p.accent : "#3964fe",
					bgImage: typeof p.bgImage === "string" ? p.bgImage : null,
					bgOpacity: typeof p.bgOpacity === "number" ? Math.min(1, Math.max(.1, p.bgOpacity)) : .9
				};
			} catch {
				return defaultConfig();
			}
		}
		function saveConfig(cfg) {
			try {
				localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
			} catch {
				window.alert("皮肤配置保存失败（localStorage 空间不足？背景图请 ≤2.5MB）");
			}
		}
		function hexToRgb(hex) {
			const v = hex.replace("#", "");
			const n = parseInt(v.length === 3 ? v.split("").map((c) => c + c).join("") : v, 16);
			return [
				n >> 16 & 255,
				n >> 8 & 255,
				n & 255
			];
		}
		/** mix(accent, target, t)：t=0 保持 accent，t=1 变为 target。 */
		function mix(hex, target, t) {
			const a = hexToRgb(hex);
			return `rgb(${Math.round(a[0] + (target[0] - a[0]) * t)}, ${Math.round(a[1] + (target[1] - a[1]) * t)}, ${Math.round(a[2] + (target[2] - a[2]) * t)})`;
		}
		const WHITE = [
			255,
			255,
			255
		];
		const BLACK = [
			0,
			0,
			0
		];
		/** 由主题色生成 DeepSeek 风格 11 级色阶（对应 --dsw-static-deepseek-*）。 */
		function accentRamp(accent) {
			return {
				"dsw-static-deepseek-50": mix(accent, WHITE, .93),
				"dsw-static-deepseek-100": mix(accent, WHITE, .85),
				"dsw-static-deepseek-200": mix(accent, WHITE, .72),
				"dsw-static-deepseek-300": mix(accent, WHITE, .5),
				"dsw-static-deepseek-400": mix(accent, WHITE, .25),
				"dsw-static-deepseek-450": mix(accent, WHITE, .12),
				"dsw-static-deepseek-500": accent,
				"dsw-static-deepseek-600": mix(accent, BLACK, .12),
				"dsw-static-deepseek-700-delete": mix(accent, BLACK, .25),
				"dsw-static-deepseek-800": mix(accent, BLACK, .45),
				"dsw-static-deepseek-900": mix(accent, BLACK, .62)
			};
		}
		function cssVar(k, v) {
			return `  --${k}: ${v};`;
		}
		function buildCss(cfg) {
			const ramp = accentRamp(cfg.accent);
			const img = cfg.bgImage ? `url("${cfg.bgImage}")` : "none";
			const L = [];
			L.push("body[data-dsh-skin] {");
			for (const [k, v] of Object.entries(ramp)) L.push(cssVar(k, v));
			L.push(cssVar("dsw-alias-brand-primary", ramp["dsw-static-deepseek-600"]));
			L.push(cssVar("dsw-alias-brand-text", ramp["dsw-static-deepseek-700"]));
			L.push(cssVar("dsw-alias-button-primary-hover", ramp["dsw-static-deepseek-500"]));
			L.push(cssVar("dsw-alias-button-primary-dimmed", ramp["dsw-static-deepseek-100"]));
			L.push(cssVar("dsw-alias-label-primary-bluish", ramp["dsw-static-deepseek-900"]));
			L.push(cssVar("dsh-skin-image", img));
			L.push(cssVar("dsh-skin-image-opacity", String(cfg.bgOpacity)));
			L.push(cssVar("dsh-skin-ui-alpha", "0.74"));
			L.push("}");
			L.push("body[data-ds-dark-theme][data-dsh-skin] {");
			L.push(cssVar("dsw-alias-brand-primary", ramp["dsw-static-deepseek-300"]));
			L.push(cssVar("dsw-alias-brand-text", ramp["dsw-static-deepseek-300"]));
			L.push(cssVar("dsw-alias-button-primary-hover", ramp["dsw-static-deepseek-400"]));
			L.push(cssVar("dsw-alias-button-primary-dimmed", ramp["dsw-static-deepseek-800"]));
			L.push(cssVar("dsw-alias-label-primary-bluish", ramp["dsw-static-deepseek-200"]));
			L.push("}");
			L.push("body[data-dsh-skin]::before {");
			L.push("  content: '';");
			L.push("  position: fixed;");
			L.push("  inset: 0;");
			L.push("  z-index: -1;");
			L.push("  background-image: var(--dsh-skin-image);");
			L.push("  background-size: cover;");
			L.push("  background-position: center;");
			L.push("  background-repeat: no-repeat;");
			L.push("  opacity: var(--dsh-skin-image-opacity);");
			L.push("  pointer-events: none;");
			L.push("}");
			L.push("body[data-dsh-skin] {");
			L.push(cssVar("dsw-alias-bg-base", "rgb(249 250 251 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-alias-bg-layer-1", "rgb(249 250 251 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-alias-bg-layer-2", "rgb(249 250 251 / calc(var(--dsh-skin-ui-alpha) + 0.08))"));
			L.push(cssVar("dsw-alias-bg-layer-3", "rgb(249 250 251 / calc(var(--dsh-skin-ui-alpha) + 0.12))"));
			L.push(cssVar("dsw-specific-sidebar-fill", "rgb(249 250 251 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-alias-bg-module-platform", "rgb(245 246 247 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-specific-menu", "rgb(249 250 251 / 0.92)"));
			L.push(cssVar("dsw-alias-bg-overlay", "rgb(233 236 242 / 0.92)"));
			L.push("}");
			L.push("body[data-ds-dark-theme][data-dsh-skin] {");
			L.push(cssVar("dsw-alias-bg-base", "rgb(21 21 23 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-alias-bg-layer-1", "rgb(35 35 36 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-alias-bg-layer-2", "rgb(44 44 46 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-alias-bg-layer-3", "rgb(53 54 56 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-specific-sidebar-fill", "rgb(27 27 28 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-alias-bg-module-platform", "rgb(44 44 46 / var(--dsh-skin-ui-alpha))"));
			L.push(cssVar("dsw-specific-menu", "rgb(35 35 36 / 0.92)"));
			L.push(cssVar("dsw-alias-bg-overlay", "rgb(67 69 74 / 0.92)"));
			L.push("}");
			return L.join("\n");
		}
		/** 按配置注入/移除 <style> 与 body[data-dsh-skin] 属性。 */
		function applySkin(cfg) {
			const body = document.body;
			if (!body) return;
			if (!cfg.enabled) {
				body.removeAttribute("data-dsh-skin");
				document.getElementById(STYLE_ID)?.remove();
				return;
			}
			body.setAttribute("data-dsh-skin", "on");
			let tag = document.getElementById(STYLE_ID);
			if (!tag) {
				tag = document.createElement("style");
				tag.id = STYLE_ID;
				document.head.appendChild(tag);
			}
			tag.textContent = buildCss(cfg);
		}
		const row = {
			display: "flex",
			alignItems: "center",
			gap: 10,
			padding: "8px 0",
			flexWrap: "wrap"
		};
		const rowLabel = {
			width: 90,
			flex: "none",
			color: "var(--dsw-alias-label-secondary)",
			fontSize: 13
		};
		const field = {
			color: "var(--dsw-alias-label-primary)",
			background: "var(--dsw-specific-input-major)",
			border: "1px solid var(--dsw-alias-border-l2)",
			borderRadius: 8,
			padding: "4px 8px",
			fontSize: 13
		};
		const hint = {
			color: "var(--dsw-alias-label-tertiary)",
			fontSize: 12
		};
		const swatch = {
			width: 24,
			height: 24,
			borderRadius: 8,
			border: "1px solid var(--dsw-alias-border-l2)",
			cursor: "pointer",
			padding: 0
		};
		function SkinSection() {
			const [cfg, setCfg] = (0, react.useState)(() => loadConfig());
			(0, react.useEffect)(() => {
				applySkin(cfg);
				saveConfig(cfg);
			}, [cfg]);
			const update = (patch) => setCfg((prev) => ({
				...prev,
				...patch
			}));
			const onFile = (e) => {
				const file = e.target.files?.[0];
				e.target.value = "";
				if (!file) return;
				if (file.size > MAX_FILE_BYTES) {
					window.alert(`图片过大（>${Math.round(MAX_FILE_BYTES / 1024 / 1024)}MB）。请压缩后再上传（建议 ≤2.5MB）。`);
					return;
				}
				const reader = new FileReader();
				reader.onload = () => update({ bgImage: String(reader.result ?? "") });
				reader.readAsDataURL(file);
			};
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				style: {
					display: "flex",
					flexDirection: "column",
					gap: 6,
					width: "100%"
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: rowLabel,
							children: "启用皮肤"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: cfg.enabled,
							onChange: (e) => update({ enabled: e.target.checked })
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: row,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: rowLabel,
								children: "主题色"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "color",
								value: cfg.accent,
								onChange: (e) => update({ accent: e.target.value })
							}),
							PRESETS.map((p) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								title: p,
								style: {
									...swatch,
									background: p,
									outline: cfg.accent === p ? "2px solid var(--dsw-alias-brand-primary)" : "none"
								},
								onClick: () => update({ accent: p })
							}, p))
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: row,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: rowLabel,
								children: "背景图"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "file",
								accept: "image/*",
								onChange: onFile,
								style: field
							}),
							cfg.bgImage !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("img", {
								src: cfg.bgImage,
								alt: "预览",
								style: {
									height: 40,
									borderRadius: 6,
									border: "1px solid var(--dsw-alias-border-l2)"
								}
							}),
							cfg.bgImage !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								onClick: () => update({ bgImage: null }),
								children: "移除"
							})
						]
					}),
					cfg.bgImage !== null && /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: row,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
								style: rowLabel,
								children: "背景透明度"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								type: "range",
								min: .1,
								max: 1,
								step: .01,
								value: cfg.bgOpacity,
								onChange: (e) => update({ bgOpacity: Number(e.target.value) })
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								style: hint,
								children: [Math.round(cfg.bgOpacity * 100), "%"]
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						style: row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
							onClick: () => setCfg(defaultConfig()),
							children: "恢复默认"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							style: hint,
							children: "背景图保存在浏览器本地（localStorage），建议 ≤2.5MB"
						})]
					})
				]
			});
		}
		const inject = ["slots"];
		function apply(ctx) {
			applySkin(loadConfig());
			ctx.effect(() => ctx.slots.inject("settings.section", () => ctx.slots.register({
				name: "settings.section",
				id: "skin",
				order: 10,
				label: () => "外观皮肤"
			}, SkinSection)), "dsh-skin: settings section");
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map