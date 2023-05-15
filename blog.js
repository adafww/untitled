const express = require('express');
const router = express.Router();
const { authenticateToken } = require('./auth');
const pool = require('./db'); // Подключение к базе данных

// Создание новой записи блога
// Получение списка записей блога с пагинацией
router.get('/posts', async (req, res) => {
    try {
        const { page = 1, pageSize = 20 } = req.query; // Параметры пагинации: текущая страница и количество записей на странице

        const offset = (page - 1) * pageSize;
        const limit = pageSize;

        const queryResult = await pool.query(
            'SELECT * FROM blog_posts ORDER BY date DESC OFFSET $1 LIMIT $2',
            [offset, limit]
        );

        const totalCount = await pool.query('SELECT COUNT(*) FROM blog_posts');
        const totalPages = Math.ceil(totalCount.rows[0].count / pageSize);

        res.json({
            page: Number(page),
            pageSize: Number(pageSize),
            totalPages,
            totalCount: totalCount.rows[0].count,
            data: queryResult.rows,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Редактирование записи блога
router.put('/posts/:postId', authenticateToken, async (req, res) => {
    try {
        const { date, message } = req.body;
        const postId = req.params.postId; // Идентификатор записи блога
        const authorId = req.user.id; // Идентификатор авторизованного пользователя

        const updatedPost = await pool.query(
            'UPDATE blog_posts SET date = $1, message = $2 WHERE id = $3 AND author_id = $4 RETURNING *',
            [date, message, postId, authorId]
        );

        if (updatedPost.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found or user is not the author' });
        }

        res.json(updatedPost.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Удаление записи блога
router.delete('/posts/:postId', authenticateToken, async (req, res) => {
    try {
        const postId = req.params.postId; // Идентификатор записи блога
        const authorId = req.user.id; // Идентификатор авторизованного пользователя

        const deletedPost = await pool.query(
            'DELETE FROM blog_posts WHERE id = $1 AND author_id = $2 RETURNING *',
            [postId, authorId]
        );

        if (deletedPost.rows.length === 0) {
            return res.status(404).json({ message: 'Post not found or user is not the author' });
        }

        res.json({ message: 'Post deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;