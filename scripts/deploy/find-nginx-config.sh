#!/bin/bash

echo "========================================="
echo "  Nginx 配置文件查找工具"
echo "========================================="
echo ""

# 常见的 Nginx 配置文件位置
CONFIG_LOCATIONS=(
    "/etc/nginx/nginx.conf"           # 主配置文件
    "/etc/nginx/sites-available/*"  # Ubuntu/Debian 站点配置
    "/etc/nginx/conf.d/*"             # CentOS/RHEL 包含额外配置
    "/etc/nginx/sites-enabled/*"      # 已启用的站点
    "/usr/local/nginx/conf/nginx.conf"  # 自定义安装
    "/etc/nginx/conf.d/*"             # CentOS/RHEL 额外配置
)

echo "正在搜索 Nginx 配置文件..."
echo ""

FOUND_FILES=()
for pattern in "${CONFIG_LOCATIONS[@]}"; do
    if [ -n "$(echo $pattern)" ]; then
        files=($(ls -1 $pattern 2>/dev/null))
        if [ ${#files[@]} -gt 0 ]; then
            echo "📁 在以下位置找到配置文件: $pattern"
            for file in "${files[@]}"; do
                echo "   - $file"
                FOUND_FILES+=("$file")
            done
            echo ""
        fi
    fi
done

if [ ${#FOUND_FILES[@]} -eq 0 ]; then
    echo "❌ 未找到任何 Nginx 配置文件"
    echo ""
    echo "请手动查找："
    echo "  find /etc/nginx -name '*.conf'"
    echo ""
    echo "或检查 Nginx 是否安装："
    echo "  which nginx"
    exit 1
fi

echo "找到的配置文件："
for file in "${FOUND_FILES[@]}"; do
    echo "========================================="
    echo "📄 $file"
    echo "========================================="
    echo ""

    # 显示配置内容（只显示关键部分）
    echo "服务器配置 (listen):"
    grep -i "listen" "$file" | head -5

    echo ""
    echo "服务器名称 (server_name):"
    grep -i "server_name" "$file" | head -5

    echo ""
    echo "位置配置 (location /):"
    grep -A 10 "location /" "$file" | head -15

    echo ""
    echo "是否已有 /api 代理："
    if grep -q "location /api/" "$file"; then
        echo "✅ 是"
        echo ""
        echo "当前的 /api 配置："
        grep -A 10 "location /api/" "$file" | head -15
    else
        echo "❌ 否 - 需要添加"
    fi

    echo ""
done

echo ""
echo "========================================="
echo "  如何添加 /api 反向代理"
echo "========================================="
echo ""

echo "找到包含 'location /' 块的配置文件后，"
echo "添加以下配置到该文件中："
echo ""

cat << 'EOF'

# 在现有的 server { ... } 块中添加：

location /api/ {
    proxy_pass http://localhost:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade \$http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host \$host;
    proxy_cache_bypass \$http_upgrade;
}

EOF

echo ""
echo "添加后，运行以下命令重载 Nginx："
echo ""
echo "  sudo nginx -t"
echo ""
echo "  或者:"
echo "  sudo nginx -s reload"
echo ""
echo "配置位置参考："
echo "  1. /etc/nginx/sites-available/default     (Ubuntu/Debian)"
echo "  2. /etc/nginx/sites-available/你的域名.conf"
echo "  3. /etc/nginx/conf.d/你的域名.conf           (CentOS/RHEL)"
echo "  4. /etc/nginx/nginx.conf                      (主配置文件)"
echo ""
