const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const VOTES_FILE = path.join(__dirname, 'data', 'vote-data.json');

// 中间件
app.use(express.json());
app.use(express.static(__dirname));

// CORS 支持
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// 读取投票数据
async function readVotes() {
    try {
        const data = await fs.readFile(VOTES_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        // 文件不存在时返回空对象
        return {};
    }
}

// 写入投票数据
async function writeVotes(votes) {
    await fs.mkdir(path.dirname(VOTES_FILE), { recursive: true });
    await fs.writeFile(VOTES_FILE, JSON.stringify(votes, null, 2), 'utf8');
}

// API: 获取投票数据
app.get('/api/votes', async (req, res) => {
    try {
        const votes = await readVotes();
        res.json(votes);
    } catch (error) {
        console.error('读取投票数据失败:', error);
        res.status(500).json({ error: '读取投票数据失败' });
    }
});

// API: 提交投票
app.post('/api/vote', async (req, res) => {
    try {
        const { province } = req.body;

        if (!province) {
            return res.status(400).json({ error: '缺少地区参数' });
        }

        const votes = await readVotes();

        // 初始化该地区的投票数据
        if (!votes[province]) {
            votes[province] = { votes: 0, description: '' };
        }

        // 增加票数
        votes[province].votes += 1;

        // 保存到文件
        await writeVotes(votes);

        console.log(`投票成功: ${province}, 总票数: ${votes[province].votes}`);

        res.json({ success: true, votes: votes[province].votes });
    } catch (error) {
        console.error('保存投票失败:', error);
        res.status(500).json({ error: '保存投票失败' });
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
