// Node.js Express 服务器示例
const express = require('express');
const app = express();
const port = 3000;

// 中间件
app.use(express.json());
app.use(express.static('public'));

// 路由
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/api/users', (req, res) => {
    const users = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
    ];
    res.json(users);
});

app.post('/api/users', (req, res) => {
    const { name } = req.body;
    const newUser = {
        id: Date.now(),
        name: name
    };
    res.status(201).json(newUser);
});

// 启动服务器
app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});