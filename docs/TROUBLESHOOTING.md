# 服务器部署故障排除

## 常见问题

### 1. 404 Not Found - GET /api/votes（外部访问返回 404）

**原因：** Nginx 没有配置 `/api` 路径的反向代理

**解决方法：**

#### 方式一：使用配置查找脚本

```bash
npm run find-nginx
```

根据输出的位置，编辑对应的配置文件，添加：

```nginx
location /api/ {
    proxy_pass http://localhost:3000/api/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

**注意：** 添加到包含 `location /` 的 server 块中。

#### 方式二：手动查找配置

```bash
# 查找所有配置文件
find /etc/nginx -name '*.conf'

# 查看内容（例如）
cat /etc/nginx/sites-available/default
cat /etc/nginx/nginx.conf
cat /etc/nginx/conf.d/*.conf
```

### 2. 404 Not Found - GET /api/votes

**原因：** Express 服务器没有运行

**解决方法：**

```bash
# 1. SSH 登录到服务器
ssh user@your-server-ip.com

# 2. 进入项目目录
cd /var/www/china-map-bilibili  # 或您的部署路径

# 3. 检查服务器是否运行
pm2 list

# 4. 如果没有运行，启动它
pm2 start server.js --name china-map

# 5. 如果启动失败，查看错误日志
pm2 logs china-map --err

# 6. 检查端口 3000 是否被占用
netstat -tuln | grep 3000
# 或
lsof -i :3000
```

### 2. npm 命令找不到

**原因：** Node.js 没有安装或没有正确配置 PATH

**解决方法：**

```bash
# 重新登录或运行
source ~/.bashrc

# 验证
which npm
npm --version
```

### 3. PM2 命令找不到

**解决方法：**

```bash
# 全局安装 PM2
sudo npm install -g pm2

# 重新登录
exit
ssh user@server
```

### 4. 端口 3000 无法访问

**原因：** 防火墙阻止或端口未开放

**解决方法：**

```bash
# Ubuntu/Debian - 开放防火墙端口
sudo ufw allow 3000/tcp
sudo ufw reload

# CentOS/RHEL - 使用 firewalld
sudo firewall-cmd --permanent --add-port=3000/tcp
sudo firewall-cmd --reload

# 云服务器（阿里云/腾讯云等）
# 需要在控制台安全组中开放端口 3000
```

### 5. 权限错误

**原因：** 文件权限不正确

**解决方法：**

```bash
# 进入部署目录
cd /var/www/china-map-bilibili

# 修改权限
sudo chown -R $USER:$USER .
chmod -R 755 .

# 确保数据目录可写
chmod 777 data
```

### 6. git pull 失败

**解决方法：**

```bash
# 检查远程仓库地址
git remote -v

# 如果地址不对，更新它
git remote set-url origin https://github.com/你的用户名/china-map-bilibili.git

# 然后再拉取
git pull origin main
```

### 7. 使用 Nginx 反向代理

如果需要使用 Nginx，配置示例：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 验证服务是否运行

### 方法一：检查 PM2 状态

```bash
pm2 list
```

应该看到类似输出：
```
┌────┬────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ id │ name    │ mode    │ status  │ cpu     │ memory │        │
├────┼────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ 0  │ china-m │ fork    │ online  │ 0%      │ 100mb   │        │
└────┴────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
```

### 方法二：检查端口监听

```bash
netstat -tuln | grep 3000
# 或
ss -tuln | grep 3000
```

应该看到类似输出：
```
tcp   0   0  0.0.0.0:3000   0.0.0.0:*   LISTEN
```

### 方法三：直接测试 API

```bash
curl http://localhost:3000/api/votes
```

应该返回 JSON 数据：
```json
{}
```

### 方法四：从外部测试

```bash
# 在本地电脑上执行
curl http://your-server-ip.com:3000/api/votes
```

## 查看日志

### PM2 日志

```bash
# 查看所有日志
pm2 logs china-map

# 只查看错误日志
pm2 logs china-map --err

# 实时跟踪日志
pm2 logs china-map --lines 100

# 清空日志
pm2 flush china-map
```

## 手动部署脚本

运行自动部署脚本：

```bash
# 使用默认路径 /var/www/china-map-bilibili
bash scripts/manual-deploy.sh

# 或指定自定义路径
bash scripts/manual-deploy.sh /path/to/your/project
```

脚本会自动完成：
1. 检查 Node.js、npm、PM2、Git
2. 拉取最新代码
3. 安装依赖
4. 启动/重启服务
5. 配置开机自启

## 联系支持

如果以上方法都无法解决问题，请提供以下信息：

1. 操作系统版本：`cat /etc/os-release`
2. Node.js 版本：`node --version`
3. PM2 状态：`pm2 list`
4. PM2 日志：`pm2 logs china-map --lines 50`
5. 具体错误信息
