# Chrome ERP WooCommerce 插件构建脚本
# 用于在 Windows PowerShell 环境中正确构建项目

Write-Host "正在切换到项目目录..." -ForegroundColor Green
Set-Location $PSScriptRoot

Write-Host "正在执行 TypeScript 类型检查..." -ForegroundColor Green
npx tsc --noEmit

Write-Host "正在构建 Vite 项目..." -ForegroundColor Green
npx vite build

Write-Host "构建完成！" -ForegroundColor Green