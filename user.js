const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword, generateToken, authenticateToken } = require('./auth');
const pool = require('./db'); // Подключение к базе данных

// Регистрация нового пользователя
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await hashPassword(password);

        const newUser = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING *',
            [username, hashedPassword]
        );

        const token = generateToken({ id: newUser.rows[0].id, username: newUser.rows[0].username });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Аутентификация пользователя
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (user.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const match = await comparePassword(password, user.rows[0].password_hash);

        if (!match) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        const token = generateToken({ id: user.rows[0].id, username: user.rows[0].username });
        res.json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Защищенный эндпоинт
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Protected endpoint accessed successfully' });
});