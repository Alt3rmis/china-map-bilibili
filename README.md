# 快递里的中国 - 城市地图

这是一个基于 B站 UP主"老猫鱼不吃鱼"的"快递里的中国"系列视频制作的交互式中国地图网页。

## 功能特点
- 🗺️ 交互式中国地图，支持省份和城市两级视图
- 🔍 高亮显示已制作视频的省份/城市
- 📍 点击省份可下钻查看该省的详细地图
- 📺 点击地图上的区域查看对应的城市/省份视频
- 🗳️ 投票功能：为没有视频的地区投票（每10分钟可投1票）
- 📊 排行榜：按省份、地区、最期待三种方式查看覆盖率排行
- 📱 响应式设计，支持移动端访问
- 🎨 酷炫的渐变色视觉效果

## 如何使用

### 安装依赖
```bash
npm install
```

### 运行服务器
```bash
npm start
```
服务器将在 http://localhost:3000 启动

**注意：** 必须使用服务器运行才能使用投票功能，因为投票数据需要持久化存储在服务器端。

### 静态文件访问（无投票功能）
如仅需查看地图和视频，可直接用浏览器打开 `index.html` 文件：
```bash
open index.html
```

### 服务器部署

本项目支持自动部署到 Linux VPS/云服务器。完整配置指南请查看 [docs/DEPLOY.md](docs/DEPLOY.md)。

**部署前准备：**

1. **在服务器上安装 Node.js 和 npm**
   ```bash
   # Ubuntu/Debian
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # CentOS/RHEL
   curl -fsSL https://rpm.nodesource.com/setup_lts.x | sudo bash -
   sudo yum install -y nodejs
   ```

2. **安装 PM2（进程管理器）**
   ```bash
   sudo npm install -g pm2
   ```

3. **首次手动部署**
   ```bash
   # 克隆代码到服务器
   cd /var/www
   git clone https://github.com/你的用户名/china-map-bilibili.git
   cd china-map-bilibili

   # 安装依赖
   npm install

   # 检查部署环境（可选）
   npm run check-deploy

   # 启动服务器
   pm2 start server.js --name china-map

   # 设置开机自启
   pm2 startup
   pm2 save
   ```

**快速开始（自动部署）：**

1. **配置 GitHub Secrets**（在仓库 Settings → Secrets and variables → Actions）：
   - `SERVER_HOST` - 服务器IP或域名
   - `SERVER_USER` - SSH用户名
   - `SERVER_PATH` - 部署路径（如 `/var/www/china-map-bilibili`）
   - `SSH_PRIVATE_KEY` - SSH私钥内容

2. **推送代码触发自动部署**：
   ```bash
   git add .
   git commit -m "update"
   git push origin main
   ```

代码推送到 `main` 分支后，GitHub Actions 会自动部署到服务器。详细配置说明请参考 [部署指南](docs/DEPLOY.md)。

## 获取和更新数据

本项目提供了完整的数据处理流水线，支持从 B站获取原始数据并自动处理。

### 推荐工作流程（新增原始数据处理）

```bash
# 1. 从 B站 获取原始数据
# 在浏览器中登录 B站，打开合集页面：https://space.bilibili.com/238365787/lists/475111
# 在控制台运行 scripts/fetch-bilibili-data.js，将输出的数据粘贴到 data/raw_data.js

# 2. 自动处理原始数据（一键完成）
npm run process-data
# 或者直接运行: node scripts/process-raw-data.js
```

**process-raw-data.js 会自动完成：**
- 从 `raw_data.js` 读取新数据
- 与现有 `data.js` 合并
- **保留现有 manualCity 值（重要！）**
- 自动提取城市名称
- 按省份重新组织数据
- 生成完整的 provinceData 格式

### 传统方式（API 获取）

```bash
# 1. 从 B站 API 获取数据（Node.js 版本）
node scripts/fetch-data.js

# 2. 自动提取城市名称
node scripts/extract-cities.js

# 3. 按省份重新组织数据
node scripts/reorganize-by-province.js
```

### 方式一：Node.js 脚本（推荐）

#### 1. 获取原始数据
```bash
node scripts/fetch-data.js
```

脚本会自动：
- 获取所有页面的视频数据
- 解析标题中的城市信息
- 按发布时间排序
- 保存到 `data/data.js`

**注意事项：** B站 API 可能需要登录态，如脚本返回错误请查看 `scripts/README.md` 中的其他获取方式。

#### 2. 自动提取城市名称
```bash
node scripts/extract-cities.js
```

此脚本会：
- 从视频标题中自动提取所有城市名称
- 添加 `autoCities` 字段（自动提取的城市数组）
- 保留 `manualCity` 字段（用于手动标记）
- 显示统计信息

#### 3. 按省份重新组织数据
```bash
node scripts/reorganize-by-province.js
```

此脚本会：
- 将所有城市视频按省份分组
- 自动将城市映射到对应省份
- 生成 `provinceData` 格式（按省份组织）
- 显示每个省份的视频数量

### 方式二：手动获取

如 API 不可用，可以手动获取数据：
1. 访问合集页面：https://space.bilibili.com/238365787/lists/475111
2. 滚动查看所有视频
3. 根据标题格式 `快递里的中国 [城市名]: [描述]` 确定城市
4. 按照 `data/data.js` 中的格式添加数据

详细说明请查看 [scripts/README.md](scripts/README.md)

## raw_data.js 处理详解

### 工作原理

`process-raw-data.js` 脚本实现了一个完整的数据处理流水线：

1. **读取原始数据**：从 `data/raw_data.js` 读取 `RAW_DATA` 数组
2. **保留手动标记**：读取现有 `data.js`，保存所有 `manualCity` 值
3. **智能合并**：根据视频标题和 URL 匹配，只更新未手动标记的视频
4. **自动提取**：对视频标题进行城市名称提取
5. **省份组织**：将所有视频按省份分组

### 使用场景

#### 场景一：首次使用
```bash
# 1. 创建 raw_data.js（已存在模板）
# 2. 从 B站 获取数据，粘贴到 raw_data.js
# 3. 运行处理
npm run process-data
```

#### 场景二：增量更新
```bash
# 1. 从 B站 获取新视频数据
# 2. 将新数据追加到 raw_data.js 的 RAW_DATA 数组
# 3. 运行处理（保留所有已有 manualCity）
npm run process-data
```

### 数据格式要求

raw_data.js 中的 RAW_DATA 应该是视频对象数组：

```javascript
const RAW_DATA = [
    {
        title: "快递里的中国 成都：蓉城的快递江湖",
        url: "https://www.bilibili.com/video/BV1xx411c7Xm",
        date: "2024-01-01",
        aid: 123456789,
        bvid: "BV1xx411c7Xm",
        view: 100000,      // 注意：可以是 view 或 views
        danmaku: 5000
    },
    // ... 更多视频
];
```

### 关键特性

✅ **保留 manualCity**：任何在现有 data.js 中设置了 manualCity 的视频，都会保留该值

✅ **支持增量更新**：可以多次运行 process-raw-data.js，不会覆盖已有内容

✅ **智能合并**：通过标题+URL 唯一标识匹配视频，避免重复

## 数据格式说明

### ProvinceData 格式（当前使用）

数据按省份组织，每个省份包含该省所有城市的视频：

```javascript
const provinceData = {
    "四川": {
        videos: [
            {
                title: "快递里的中国 成都：蓉城的快递江湖",
                url: "https://www.bilibili.com/video/BV1xx411c7Xm",
                date: "2024-01-01",
                aid: 123456789,
                bvid: "BV1xx411c7Xm",
                views: 100000,
                danmaku: 5000,
                city: "成都",
                autoCities: ["成都"],
                manualCity: "成都"
            },
            {
                title: "快递里的中国 绵阳",
                url: "https://www.bilibili.com/video/BV1yy411c7Xn",
                date: "2024-01-02",
                aid: 123456790,
                bvid: "BV1yy411c7Xn",
                views: 95000,
                danmaku: 4500,
                city: "绵阳",
                autoCities: ["绵阳"],
                manualCity: "绵阳"
            }
        ]
    },
    "广东": {
        videos: [...]
    }
};
```

### 字段说明

| 字段 | 说明 | 示例 |
|------|------|------|
| `title` | 视频标题 | `"快递里的中国 成都：蓉城的快递江湖"` |
| `url` | B站视频链接 | `"https://www.bilibili.com/video/BV1xx411c7Xm"` |
| `date` | 发布日期（YYYY-MM-DD） | `"2024-01-01"` |
| `aid` | 视频 aid | `123456789` |
| `bvid` | 视频 bvid | `"BV1xx411c7Xm"` |
| `views` | 观看数 | `100000` |
| `danmaku` | 弹幕数 | `5000` |
| `city` | 城市名称（主要归属城市） | `"成都"` |
| `autoCities` | 从标题自动提取的城市数组 | `["成都"]` |
| `manualCity` | 手动标记的城市（优先使用） | `"成都"` |

### 数据更新方式

#### 添加新的省份和城市

编辑 `data/data.js` 文件：

```javascript
const provinceData = {
    // 新增省份
    "省份名": {
        videos: [
            {
                title: "视频标题",
                url: "https://www.bilibili.com/video/BVxxxxxx",
                date: "2024-01-01",
                city: "城市名",
                autoCities: ["城市名"],
                manualCity: "城市名"
            }
        ]
    }
};
```

### 注意事项

1. **省份名称**：必须使用 ECharts 中国地图支持的省份名称（如"重庆"、"四川"、"广东"等）
2. **视频链接**：使用完整的 B站视频 URL（如 `https://www.bilibili.com/video/BVxxxxxx`）
3. **多期视频**：如果一个城市有多期视频，只需在 `videos` 数组中添加多个条目即可
4. **发布日期**：格式为 `YYYY-MM-DD`，用于视频排序（最新发布的显示在前面）
5. **城市映射**：`scripts/reorganize-by-province.js` 会自动将城市映射到对应省份
6. **manualCity 保留**：使用 `npm run process-data` 或 `node scripts/process-raw-data.js` 处理数据时，现有 `data.js` 中的所有 `manualCity` 值都会被保留，不会被覆盖
7. **增量更新**：可以多次从 B站 获取新视频并追加到 `raw_data.js`，然后运行 `npm run process-data`，只会处理新增的视频

## 文件结构

```
china-map-bilibili/
├── server.js                    # Node.js 服务器（投票功能）
├── index.html                   # 主页面
├── styles.css                    # 样式文件
├── app.js                       # 页面逻辑
├── package.json                  # 项目配置（包含 npm scripts）
├── README.md                    # 说明文档（本文件）
├── .github/                     # GitHub Actions 配置
│   └── workflows/
│       └── deploy.yml         # 自动部署工作流
├── scripts/                     # 工具脚本
│   ├── fetch-data.js            # B站数据获取（Node.js）
│   ├── fetch-bilibili-data.js  # B站数据获取（浏览器版本）
│   ├── extract-cities.js        # 城市名称自动提取
│   ├── process-raw-data.js      # 原始数据处理流水线（推荐）
│   ├── reorganize-by-province.js # 按省份重新组织数据
│   ├── deploy.sh               # 手动部署脚本
│   └── README.md              # 脚本说明文档
├── docs/                        # 文档
│   └── DEPLOY.md              # 自动部署配置指南
└── data/                        # 数据文件夹
    ├── raw_data.js             # 原始数据（从 B站控制台粘贴）
    ├── data.js                 # 最终数据配置（provinceData 格式）
    ├── vote-data.json          # 投票数据（自动生成，不要手动编辑）
    └── README.md              # 数据说明
```

## 技术栈

- **ECharts 5.4.3**：地图可视化
- **Express 4.18.2**：服务器和API
- **PM2**：进程管理器（保持服务持续运行）
- **原生 JavaScript**：无需构建工具
- **CSS3**：渐变色和动画效果
- **localStorage**：客户端投票限制（10分钟冷却）
- **JSON 文件存储**：投票数据持久化

## 投票功能说明

### 功能特点
- 为没有视频的地区进行投票
- 每个终端每10分钟只能投票一次（全局限制）
- 投票数据持久化存储在服务器端
- 支持排行榜查看最期待的地区

### API 接口
- `GET /api/votes` - 获取所有投票数据
- `POST /api/vote` - 提交投票（请求体：`{ province: "地区名" }`）

## 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## 许可

本项目仅供学习交流使用。视频版权归原作者所有。
