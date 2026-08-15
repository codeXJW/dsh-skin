# dsh-skin 一键安装（Windows PowerShell）
# 官方装配：dsh plugin --profile web add <本目录> → 重启 DSH 后生效（设置 → 外观皮肤）
$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host '=== 安装 dsh-skin 换肤插件 ===' -ForegroundColor Cyan

if (-not (Test-Path (Join-Path $root 'lib\index.js')) -or -not (Test-Path (Join-Path $root 'lib\client.js'))) {
  Write-Host '缺少构建产物（lib\）——请 clone 完整仓库（含 lib/）后重试' -ForegroundColor Yellow
  exit 1
}

& dsh plugin --profile web add $root 2>&1 | Out-Host

Write-Host '' -ForegroundColor Cyan
Write-Host '✓ 已装配。重启 DSH（web 服务）后：设置 → 外观皮肤' -ForegroundColor Green
Write-Host '免重启方式（已装 dsh-routing-suite 注入器）：DSH 会话里对 AI 说 dev_inject_plugin' -ForegroundColor Yellow
Write-Host '卸载：dsh plugin --profile web remove @dsh-external/dsh-skin' -ForegroundColor DarkGray
