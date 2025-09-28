const fs = require('fs');
const path = require('path');

// 创建dist目录
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir);
}

// 复制manifest.json
fs.copyFileSync(
  path.join(__dirname, 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// 复制icons目录
const iconsSrc = path.join(__dirname, 'icons');
const iconsDist = path.join(distDir, 'icons');
if (fs.existsSync(iconsSrc)) {
  if (!fs.existsSync(iconsDist)) {
    fs.mkdirSync(iconsDist);
  }
  const files = fs.readdirSync(iconsSrc);
  files.forEach(file => {
    fs.copyFileSync(
      path.join(iconsSrc, file),
      path.join(iconsDist, file)
    );
  });
}

// 复制src目录
const srcDir = path.join(__dirname, 'src');
const srcDist = path.join(distDir, 'src');
if (fs.existsSync(srcDir)) {
  // 递归复制src目录
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    const items = fs.readdirSync(src);
    items.forEach(item => {
      const srcPath = path.join(src, item);
      const destPath = path.join(dest, item);
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }
  copyDir(srcDir, srcDist);
}

console.log('Chrome extension build completed!');