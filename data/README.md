# 数据文件说明

此文件夹用于存放项目的所有数据配置。

## 文件说明

### raw_data.js
原始数据文件，用于从 B站 控制台获取的原始数据。

**用途：**
- 存放从 B站 控制台运行 `fetch-bilibili-data.js` 脚本后获取的数据
- 作为数据处理的输入源

**格式：**
```javascript
const RAW_DATA = [
    {
        title: "快递里的中国 成都：蓉城的快递江湖",
        url: "https://www.bilibili.com/video/BV1xx411c7Xm",
        date: "2024-01-01",
        aid: 123456789,
        bvid: "BV1xx411c7Xm",
        view: 100000,      // 观看数（可以是 view 或 views）
        danmaku: 5000
    },
    // ... 更多视频
];
```

**如何获取数据：**
1. 登录 B站
2. 打开合集页面：https://space.bilibili.com/238365787/lists/475111
3. 在浏览器控制台运行 `scripts/fetch-bilibili-data.js`
4. 复制输出的数据，替换 `RAW_DATA = []` 中的数组内容
5. 运行 `npm run process-data` 处理数据

### data.js
最终的数据配置文件，按省份组织数据。

**用途：**
- 应用页面（app.js）读取此文件
- 包含省份级别的视频信息
- 保留所有 `manualCity` 手动标记

**格式：**
```javascript
const provinceData = {
    "省份名称": {
        videos: [
            {
                title: "视频标题",
                url: "视频链接",
                date: "发布时间",
                aid: 视频ID,
                bvid: "BV号",
                views: 观看数,
                danmaku: 弹幕数,
                city: "主要城市名称",
                autoCities: ["自动提取的城市1", "城市2"],  // 可能多个
                manualCity: "手动标记的城市"  // 优先使用此值
            }
        ]
    }
};
```

## 数据格式说明

### ProvinceData 格式（当前使用）

数据按省份组织，每个省份包含该省所有城市的视频：

| 字段 | 类型 | 说明 | 示例 |
|------|------|------|------|
| `title` | string | 视频标题 | `"快递里的中国 成都：蓉城的快递江湖"` |
| `url` | string | B站视频链接 | `"https://www.bilibili.com/video/BV1xx411c7Xm"` |
| `date` | string | 发布日期（YYYY-MM-DD） | `"2024-01-01"` |
| `aid` | number | 视频 aid | `123456789` |
| `bvid` | string | 视频 bvid | `"BV1xx411c7Xm"` |
| `views` | number | 观看数 | `100000` |
| `danmaku` | number | 弹幕数 | `5000` |
| `city` | string | 城市名称（主要归属城市） | `"成都"` |
| `autoCities` | array | 从标题自动提取的城市数组 | `["成都"]` |
| `manualCity` | string/null | 手动标记的城市（优先使用） | `"成都"` 或 `null` |

### 字段优先级

1. **city 字段**：用于确定视频归属的城市和省份
2. **manualCity 字段**：如果有值，优先使用此字段；否则使用 autoCities 的第一个元素
3. **autoCities 字段**：用于记录标题中自动提取的所有城市，便于人工审核

## 数据更新流程

### 推荐方式（使用 raw_data.js）

```bash
# 1. 从 B站 获取原始数据
# 在浏览器控制台运行 scripts/fetch-bilibili-data.js
# 将输出粘贴到 data/raw_data.js 中的 RAW_DATA 数组

# 2. 一键处理数据
npm run process-data
# 或
node scripts/process-raw-data.js
```

**处理流程：**
- ✅ 读取 `raw_data.js` 中的新数据
- ✅ 读取现有 `data.js`（如果存在）
- ✅ **保留现有 manualCity 值**（重要！）
- ✅ 合并数据，只更新未手动标记的视频
- ✅ 自动提取新视频的城市名称
- ✅ 按省份重新组织数据
- ✅ 生成 `data.js`（provinceData 格式）

### 传统方式

直接编辑 `data.js` 文件添加新数据。

## 注意事项

1. **省份名称**：必须使用 ECharts 中国地图支持的省份名称（如"重庆"、"四川"、"广东"等）
2. **视频链接**：使用完整的 B站视频 URL（如 `https://www.bilibili.com/video/BVxxxxxx`）
3. **多期视频**：如果一个城市有多期视频，只需在 `videos` 数组中添加多个条目即可
4. **发布日期**：格式为 `YYYY-MM-DD`，用于视频排序（最新发布的显示在前面）
5. **manualCity 保留**：使用 `npm run process-data` 时，现有 `data.js` 中的所有 `manualCity` 值都会被保留，不会被覆盖
6. **增量更新**：可以多次从 B站 获取新视频并追加到 `raw_data.js`，然后运行 `npm run process-data`，只会处理新增的视频
