#!/bin/bash

# 部署脚本 - 用于手动部署到服务器
# 使用方法: ./scripts/deploy.sh [服务器用户] [服务器地址] [服务器路径]

SERVER_USER=${1:-root}
SERVER_HOST=${2:-localhost}
SERVER_PATH=${3:-/var/www/china-map-bilibili}

echo "======================================"
echo "部署到: ${SERVER_USER}@${SERVER_HOST}:${SERVER_PATH}"
echo "======================================"

# SSH 到服务器并执行部署命令
ssh "${SERVER_USER}@${SERVER_HOST}" << EOF
    cd ${SERVER_PATH}

    echo "拉取最新代码..."
    git pull origin main

    echo "部署完成!"
    echo "部署时间: \$(date)"
EOF

echo "======================================"
echo "部署完成"
echo "======================================"
