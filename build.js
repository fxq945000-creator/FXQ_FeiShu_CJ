const fs = require('fs');
const path = require('path');

// 定义需要复制的文件列表
const filesToCopy = [
    'index.html',
    'style.css',
    'index.js',
    'manifest.json',
    'icon.png',
    'README_Plugin.md'
];

// 创建dist目录
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
    console.log('创建dist目录成功');
}

// 复制文件到dist目录
filesToCopy.forEach(file => {
    const srcPath = path.join(__dirname, file);
    const destPath = path.join(distDir, file);
    
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`复制 ${file} 到 dist 目录成功`);
    } else {
        console.log(`警告：文件 ${file} 不存在`);
    }
});

console.log('\n构建完成！所有文件已复制到dist目录');
console.log('请将dist目录中的产物一同提交');
