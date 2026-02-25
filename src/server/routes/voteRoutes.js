// 投票 API 路由 - 处理投票相关的 HTTP 请求

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const VOTE_DATA_FILE = path.join(__dirname, '..', '..', '..', 'data', 'votes.json');

/**
 * 读取投票数据
 * @returns {Object} 投票数据对象
 */
function readVoteData() {
    try {
        if (fs.existsSync(VOTE_DATA_FILE)) {
            const data = fs.readFileSync(VOTE_DATA_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('读取投票数据失败:', error);
    }
    return {};
}

/**
 * 写入投票数据
 * @param {Object} data - 投票数据对象
 */
function writeVoteData(data) {
    try {
        fs.writeFileSync(VOTE_DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('写入投票数据失败:', error);
    }
}

router.get('/votes', (req, res) => {
    const voteData = readVoteData();
    res.json(voteData);
});

router.post('/vote', (req, res) => {
    const { province } = req.body;

    if (!province) {
        return res.status(400).json({ error: '缺少省份参数' });
    }

    const voteData = readVoteData();

    if (!voteData[province]) {
        voteData[province] = {
            votes: 0,
            description: ''
        };
    }

    voteData[province].votes += 1;

    writeVoteData(voteData);

    res.json({
        success: true,
        province: province,
        votes: voteData[province].votes
    });
});

module.exports = router;
