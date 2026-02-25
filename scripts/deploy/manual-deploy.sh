#!/bin/bash

echo "========================================="
echo "  中国地图 - 手动部署脚本"
echo "========================================="
echo ""

# 检查 Node.js
echo "1. 检查 Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装"
    echo ""
    echo "请先安装 Node.js:"
    echo ""
    case "$(uname -s)" in
        Linux*)
            if [ -f /etc/debian_version ]; then
                # Ubuntu/Debian
                echo "  curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -"
                echo "  sudo apt-get install -y nodejs"
            elif [ -f /etc/redhat-release ]; then
                # CentOS/RHEL
                echo "  curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -"
                echo "  sudo yum install -y nodejs"
            fi
            ;;
        Darwin*)
            echo "  brew install node"
            ;;
    esac
    exit 1
else
    NODE_VERSION=$(node --version)
    echo "✅ Node.js: $NODE_VERSION"
fi

# 检查 npm
echo ""
echo "2. 检查 npm..."
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装"
    echo "Node.js 通常会自带 npm，请检查安装"
    exit 1
else
    NPM_VERSION=$(npm --version)
    echo "✅ npm: $NPM_VERSION"
fi

# 检查 PM2
echo ""
echo "3. 检查 PM2..."
if ! command -v pm2 &> /dev/null; then
    echo "⚠️  PM2 未安装，正在安装..."
    sudo npm install -g pm2
    if [ $? -eq 0 ]; then
        echo "✅ PM2 安装成功"
    else
        echo "❌ PM2 安装失败"
        exit 1
    fi
else
    PM2_VERSION=$(pm2 --version)
    echo "✅ PM2: $PM2_VERSION"
fi

# 检查 git
echo ""
echo "4. 检查 Git..."
if ! command -v git &> /dev/null; then
    echo "⚠️  Git 未安装，正在安装..."
    case "$(uname -s)" in
        Linux*)
            if [ -f /etc/debian_version ]; then
                sudo apt-get install -y git
            elif [ -f /etc/redhat-release ]; then
                sudo yum install -y git
            fi
            ;;
        Darwin*)
            brew install git
            ;;
    esac
else
    GIT_VERSION=$(git --version)
    echo "✅ Git: $GIT_VERSION"
fi

# 设置部署路径
DEPLOY_PATH="${1:-/var/www/china-map-bilibili}"

echo ""
echo "5. 部署路径: $DEPLOY_PATH"

# 检查部署路径是否存在
if [ ! -d "$DEPLOY_PATH" ]; then
    echo "⚠️  部署路径不存在，正在创建..."
    sudo mkdir -p "$DEPLOY_PATH"
    sudo chown $USER:$USER "$DEPLOY_PATH"
    echo "✅ 部署路径已创建"
fi

# 进入部署目录
cd "$DEPLOY_PATH" || exit 1

# 检查是否是 git 仓库
if [ ! -d ".git" ]; then
    echo ""
    echo "⚠️  不是 Git 仓库，正在克隆..."
    read -p "请输入仓库地址 (例如: https://github.com/用户名/china-map-bilibili.git): " REPO_URL
    if [ -z "$REPO_URL" ]; then
        echo "❌ 仓库地址不能为空"
        exit 1
    fi
    git clone "$REPO_URL" .
else
    echo ""
    echo "6. 拉取最新代码..."
    git pull origin main
fi

# 安装依赖
echo ""
echo "7. 安装项目依赖..."
npm install
if [ $? -eq 0 ]; then
    echo "✅ 依赖安装成功"
else
    echo "❌ 依赖安装失败"
    exit 1
fi

# 检查必要文件
echo ""
echo "8. 检查必要文件..."
REQUIRED_FILES=("server.js" "package.json" "app.js" "index.html")
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file 不存在"
        exit 1
    fi
done

# 检查 PM2 状态
echo ""
echo "9. 检查 PM2 状态..."
if pm2 list | grep -q "china-map"; then
    echo "📱 服务已运行，正在重启..."
    pm2 restart china-map
    if [ $? -eq 0 ]; then
        echo "✅ 服务重启成功"
    else
        echo "❌ 服务重启失败"
        exit 1
    fi
else
    echo "🚀 正在启动服务..."
    pm2 start server.js --name china-map
    if [ $? -eq 0 ]; then
        echo "✅ 服务启动成功"
    else
        echo "❌ 服务启动失败"
        echo "   查看日志: pm2 logs china-map"
        exit 1
    fi
fi

# 设置 PM2 开机自启
echo ""
echo "10. 配置开机自启..."
pm2 startup | tail -n 1 > /tmp/pm2_startup.sh
chmod +x /tmp/pm2_startup.sh
echo "请运行以下命令设置开机自启（需要 sudo 权限）:"
echo "sudo /tmp/pm2_startup.sh"
echo ""
pm2 save

# 显示服务状态
echo ""
echo "========================================="
echo "  部署完成！"
echo "========================================="
echo ""
echo "服务状态:"
pm2 list | grep china-map
echo ""
echo "查看实时日志: pm2 logs china-map"
echo "停止服务: pm2 stop china-map"
echo "重启服务: pm2 restart china-map"
echo ""
echo "访问地址: http://$(hostname -I | awk '{print $1}'):3000"
echo ""
