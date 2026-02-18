# Nginx 反向代理配置指南

## 问题说明

访问 `http://47.116.182.49/` 时 `/api/votes` 返回 404（或 404），但服务器内部访问正常。

**原因：** Nginx 配置了反向代理但没有正确配置 `/api` 路径。

## 解决方法

### 步骤一：查找 Nginx 配置文件

运行配置查找脚本：

```bash
npm run find-nginx
```

这会搜索以下位置的配置文件：
- `/etc/nginx/nginx.conf` - 主配置文件
- `/etc/nginx/sites-available/*` - Ubuntu/Debian 站点配置
- `/etc/nginx/conf.d/*` - CentOS/RHEL 包含额外配置
- `/etc/nginx/sites-enabled/*` - 已启用的站点

找到输出会显示：
- 服务器监听端口 (listen)
- 服务器名称 (server_name)
- 是否已配置 `/api` 代理
- 当前位置配置 (location /)

### 步骤二：添加反向代理配置

找到包含 `location /` 的配置文件后，在文件中添加以下配置：

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

**说明：**

- `proxy_pass http://localhost:3000/api/` - 将 `/api` 请求转发到本地 3000 端口
- 注意末尾的 `/`，这是为了让 Express 正确处理路由
- `proxy_set_header` - 保留原始的 HTTP 头信息
- `proxy_cache_bypass $http_upgrade` - 对 WebSocket 连接的特殊处理

### 步骤三：重载 Nginx 配置

```bash
# 测试配置
sudo nginx -t

# 如果测试通过，重载配置
sudo nginx -s reload

# 或者强制重载（CentOS/RHEL）
sudo nginx -s reload
```

### 步骤四：验证配置

```bash
# 测试外部访问
curl http://47.116.182.49/api/votes
```

应该返回 JSON 数据：
```json
{}
```

## 常见配置文件位置

### Ubuntu/Debian

**默认站点配置：**
```
/etc/nginx/sites-available/default
```

**特定域名配置：**
```
/etc/nginx/sites-available/47.116.182.49
/etc/nginx/sites-available/your-domain.com
```

### CentOS/RHEL

**主配置文件：**
```
/etc/nginx/nginx.conf
```

**包含额外配置：**
```
/etc/nginx/conf.d/your-domain.conf
/etc/nginx/conf.d/default.conf
```

## 完整配置示例

### 示例一：默认站点配置 (Ubuntu)

```nginx
server {
    listen 80;
    server_name 47.116.182.49;

    location / {
        root /var/www/china-map-bilibili;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # 添加 API 反向代理
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 示例二：主配置文件 (CentOS)

```nginx
http {
    server {
        listen 80;
        server_name 47.116.182.49;

        location / {
            root /var/www/china-map-bilibili;
            index index.html;
        }

        location /api/ {
            proxy_pass http://localhost:3000/api/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

### 示例三：HTTPS 配置（如果有 SSL 证书）

```nginx
server {
    listen 443 ssl http2;
    server_name 47.116.182.49;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        root /var/www/china-map-bilibili;
        index index.html;
    }

    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 阿里云服务器注意事项

如果使用阿里云、腾讯云等，除了配置 Nginx 外，还需要：

### 1. 防火墙配置

在云服务器控制台的安全组中开放：
- **入方向** HTTP 80 端口（如果使用 HTTPS 则开放 443）
- **入方向** 可以是 0.0.0.0/0（所有 IP）

### 2. Nginx 不在标准位置

如果 Nginx 是通过宝塔面板、LNMP 等一键安装的，配置文件位置可能不同：

**宝塔面板：**
```
/www/server/panel/vhost/nginx/你的域名.conf
```

**LNMP 一键包：**
```
/usr/local/nginx/conf/vhost/你的域名.conf
```

## 测试检查清单

- [ ] 运行 `npm run find-nginx` 找到配置文件
- [ ] 在配置文件中添加 `location /api/` 块
- [ ] 运行 `sudo nginx -t` 测试配置
- [ ] 运行 `sudo nginx -s reload` 重载配置
- [ ] 外部访问 `http://47.116.182.49/api/votes` 返回数据
- [ ] 网站地图 `http://47.116.182.49` 正常访问

## 故障排除

### 问题：添加配置后仍然 404

1. **检查 Nginx 是否真的重载了**
   ```bash
   sudo nginx -s reload
   ```

2. **检查 Express 服务是否在 3000 端口运行**
   ```bash
   netstat -tuln | grep 3000
   # 或
   lsof -i :3000
   ```

3. **查看 Nginx 错误日志**
   ```bash
   tail -f /var/log/nginx/error.log
   ```

4. **查看 PM2 状态**
   ```bash
   pm2 list
   pm2 logs china-map
   ```

### 问题：配置语法错误

如果 `nginx -t` 报语法错误：
- 检查花括号 `{}` 是否匹配
- 检查分号 `;` 是否正确
- 注意 dollar 符号 `$` 在 Nginx 配置中需要转义为 `$$`

如果复制示例代码，注意：
- 示例中的 `$` 变量需要改为 `$$`（例如 `$http_upgrade` → `$$http_upgrade`）
- 或者直接写死（不带变量）：`proxy_set_header Upgrade "upgrade";`
