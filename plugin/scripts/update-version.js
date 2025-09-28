#!/usr/bin/env node

/**
 * 版本号更新脚本
 * 符合Chrome扩展规范的版本号格式: 主版本号.次版本号.修订号
 * 例如: 1.0.2
 */

import fs from 'fs';
import path from 'path';

// 更新版本号（仅增加修订号）
const updateVersion = () => {
  // 获取当前脚本所在目录
  const scriptDir = path.dirname(new URL(import.meta.url).pathname);
  // 在Windows上，路径可能以/开头，需要处理
  const normalizedScriptDir = scriptDir.startsWith('/') && process.platform === 'win32' 
    ? scriptDir.substring(1) 
    : scriptDir;
  
  // 更新 package.json
  const packagePath = path.join(normalizedScriptDir, '..', 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  
  const currentVersion = packageJson.version;
  const versionParts = currentVersion.split('.').map(Number);
  
  // 增加修订号
  if (versionParts.length >= 3) {
    versionParts[2] += 1;
  } else {
    // 如果版本号格式不完整，补充默认值
    while (versionParts.length < 2) versionParts.push(0);
    versionParts.push(1);
  }
  
  const newVersion = versionParts.join('.');
  packageJson.version = newVersion;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  // 更新 manifest.json
  const manifestPath = path.join(normalizedScriptDir, '..', 'manifest.json');
  const manifestJson = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  manifestJson.version = newVersion;
  fs.writeFileSync(manifestPath, JSON.stringify(manifestJson, null, 2));
  
  console.log(`版本号已更新: ${currentVersion} -> ${newVersion}`);
};

// 执行更新
updateVersion();