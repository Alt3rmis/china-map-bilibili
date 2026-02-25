// Express 服务器入口 - 处理静态文件和API路由

const express = require('express');
const path = require('path');
const voteRoutes = require('./routes/voteRoutes.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '..', '..')));

app.use('/api', voteRoutes);

app.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
});
