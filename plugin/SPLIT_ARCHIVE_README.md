# 分卷打包文件说明

由于原始 zip 文件大小超过了 GitHub 25MB 的上传限制，我们已将其分卷打包成多个小于 25MB 的文件。

## 分卷文件列表

1. `chrome-erp-woocommerce-v1.0.5.part001.zip` (20.00 MB)
2. `chrome-erp-woocommerce-v1.0.5.part002.zip` (7.05 MB)

## 如何使用分卷文件

### 在 Windows 上合并文件

#### 方法 1: 使用 PowerShell 脚本
运行提供的 `merge-archive.ps1` 脚本:
```powershell
powershell -ExecutionPolicy Bypass -File "merge-archive.ps1"
```

#### 方法 2: 使用命令行
```cmd
copy /b chrome-erp-woocommerce-v1.0.5.part*.zip chrome-erp-woocommerce-v1.0.5-merged.zip
```

### 在 Linux/macOS 上合并文件
```bash
cat chrome-erp-woocommerce-v1.0.5.part*.zip > chrome-erp-woocommerce-v1.0.5-merged.zip
```

## 验证合并后的文件

合并后的文件应该与原始的 `chrome-erp-woocommerce-v1.0.5.zip` 文件完全相同，大小应为 28,359,586 字节。

您可以使用校验和来验证文件完整性:
- MD5: (需要计算)
- SHA256: (需要计算)

## 安装说明

合并并解压文件后，请按照 `dist/README.md` 中的说明安装 Chrome 扩展。