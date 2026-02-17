#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

console.log('🔍 检查部署环境...\n');

// 检查 Node.js 版本
try {
    const nodeVersion = execSync('node --version').toString().trim();
    console.log(`✅ Node.js: ${nodeVersion}`);
} catch (error) {
    console.log('❌ Node.js 未安装');
    console.log('   请安装 Node.js: https://nodejs.org/\n');
}

// 检查 npm 版本
try {
    const npmVersion = execSync('npm --version').toString().trim();
    console.log(`✅ npm: ${npmVersion}`);
} catch (error) {
    console.log('❌ npm 未安装\n');
}

// 检查 PM2
try {
    const pm2Version = execSync('pm2 --version').toString().trim();
    console.log(`✅ PM2: ${pm2Version}`);
} catch (error) {
    console.log('⚠️  PM2 未安装');
    console.log('   请安装 PM2: npm install -g pm2\n');
}

// 检查必要文件
const files = [
    'server.js',
    'package.json',
    'data/data.js'
];

console.log('\n📁 检查必要文件...');
files.forEach(file => {
    if (fs.existsSync(file)) {
        console.log(`✅ ${file}`);
    } else {
        console.log(`❌ ${file} 不存在`);
    }
});

// 检查 node_modules
console.log('\n📦 检查依赖...');
if (fs.existsSync('node_modules')) {
    console.log('✅ node_modules 已存在');
} else {
    console.log('⚠️  node_modules 不存在');
    console.log('   请运行: npm install');
}

// 检查 vote-data.json 目录
console.log('\n💾 检查数据目录...');
const dataDir = 'data';
if (fs.existsSync(dataDir)) {
    console.log(`✅ ${dataDir}/ 目录存在`);
    if (fs.existsSync(`${dataDir}/vote-data.json`)) {
        console.log('✅ vote-data.json 已存在');
    } else {
        console.log('ℹ️  vote-data.json 将在首次投票时自动创建');
    }
} else {
    console.log(`❌ ${dataDir}/ 目录不存在`);
}

console.log('\n✨ 部署环境检查完成！');
console.log('如果所有检查都通过，可以运行: npm start\n');
