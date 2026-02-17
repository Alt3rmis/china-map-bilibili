# 自动部署配置指南

本项目使用 GitHub Actions 实现自动部署到 Linux VPS/云服务器。

## 一、服务器准备

### 1. 确保服务器已安装必要软件
```bash
# 更新软件包
sudo apt update && sudo apt upgrade -y

# 安装 git
sudo apt install git -y

# 安装 nginx（如果还没有）
sudo apt install nginx -y
```

### 2. 准备部署目录
```bash
# 创建网站目录
sudo mkdir -p /var/www/china-map-bilibili
sudo chown -R $USER:$USER /var/www/china-map-bilibili
cd /var/www/china-map-bilibili

# 克隆代码（首次）
git clone https://github.com/YOUR_USERNAME/china-map-bilibili.git .
# 或者使用 SSH 克隆（推荐）
git clone git@github.com:YOUR_USERNAME/china-map-bilibili.git
```

### 3. 配置 nginx
```bash
sudo nano /etc/nginx/sites-available/china-map-bilibili
```

添加以下配置：
```nginx
server {
    listen 80;
    server_name your-domain.com;  # 替换为你的域名或服务器IP

    root /var/www/china-map-bilibili;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # 启用 gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

启用配置：
```bash
sudo ln -s /etc/nginx/sites-available/china-map-bilibili /etc/nginx/sites-enabled/
sudo nginx -t  # 测试配置
sudo systemctl restart nginx
```

## 二、配置 GitHub SSH 密钥

### 1. 生成 SSH 密钥对
```bash
# 在本地或服务器上生成密钥
ssh-keygen -t ed25519 -C "github-actions-deploy" -f ~/.ssh/github_deploy_key -N ""
```

### 2. 添加公钥到服务器
```bash
# 复制公钥内容
cat ~/.ssh/github_deploy_key.pub

# 添加到服务器的 authorized_keys
ssh your-server "cat >> ~/.ssh/authorized_keys" < ~/.ssh/github_deploy_key.pub
```

### 3. 在 GitHub 仓库中添加 Secrets

进入你的 GitHub 仓库 → Settings → Secrets and variables → Actions → New repository secret

添加以下 Secrets：

| Secret 名称 | 说明 | 示例值 |
|------------|------|--------|
| `SERVER_HOST` | 服务器IP地址或域名 | `192.168.1.100` 或 `your-domain.com` |
| `SERVER_USER` | SSH用户名 | `root` 或 `your-username` |
| `SERVER_PORT` | SSH端口（可选，默认22） | `22` |
| `SERVER_PATH` | 服务器上的部署路径 | `/var/www/china-map-bilibili` |
| `SSH_PRIVATE_KEY` | SSH私钥内容 | 整个私钥文件的内容（包括-----BEGIN...-----END...） |

**重要提示**：
- `SSH_PRIVATE_KEY` 的值是整个私钥文件内容，包括 `-----BEGIN...` 和 `-----END...` 标记
- 使用 `cat ~/.ssh/github_deploy_key` 复制完整内容

### 4. 服务器添加 GitHub 到 known_hosts（避免 SSH 提示）
```bash
ssh-keyscan github.com >> ~/.ssh/known_hosts
```

## 三、测试部署

### 方法1: 自动部署测试

1. 修改代码后提交到 main 分支：
```bash
git add .
git commit -m "test deploy"
git push origin main
```

2. 前往 GitHub 仓库的 Actions 标签页，查看部署进度

### 方法2: 手动触发部署

1. 前往 GitHub 仓库 → Actions 标签页
2. 选择 "Deploy to Server" 工作流
3. 点击 "Run workflow" 按钮

### 方法3: 使用部署脚本（本地手动部署）
```bash
# 赋予脚本执行权限
chmod +x scripts/deploy.sh

# 执行部署
./scripts/deploy.sh root your-domain.com /var/www/china-map-bilibili
```

## 四、故障排查

### 1. SSH 连接失败
- 检查 `SSH_PRIVATE_KEY` 是否包含完整的私钥内容
- 确认服务器已添加公钥到 `authorized_keys`
- 检查服务器防火墙是否开放 SSH 端口

### 2. Git pull 失败
- 确保 `SERVER_PATH` 是 git 仓库目录
- 检查仓库 URL 是否正确
- 可能需要在服务器上首次使用 `git pull` 时确认身份

### 3. 权限问题
- 确保 GitHub Actions 用户有权限读写部署目录
- 可能需要调整目录权限：`sudo chown -R your-user:your-group /var/www/china-map-bilibili`

## 五、部署流程说明

1. **触发条件**：
   - 推送到 `main` 或 `master` 分支
   - 手动触发工作流

2. **部署步骤**：
   - GitHub Actions 拉取代码
   - 通过 SSH 连接到服务器
   - 执行 `git pull` 更新代码
   - 完成部署

3. **特点**：
   - 自动化：push 代码即部署
   - 免费：GitHub Actions 公开仓库免费使用
   - 实时：代码更新后几分钟内完成部署
   - 灵活：支持手动触发部署

## 六、进阶配置

### 启用 HTTPS（使用 Let's Encrypt）
```bash
# 安装 certbot
sudo apt install certbot python3-certbot-nginx -y

# 申请证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 配置自定义域名
修改 nginx 配置中的 `server_name` 为你的域名。

## 七、安全建议

1. **使用专用部署用户**
   - 不要使用 root 用户部署
   - 创建专用用户并配置 sudo 权限

2. **定期更换 SSH 密钥**
   - 定期轮换部署密钥
   - 删除不再使用的密钥

3. **限制 GitHub Actions 权限**
   - 只授予必要的仓库权限
   - 使用分支保护规则
