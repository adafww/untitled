const pool = require('./db'); // Подключение к базе данных

// Функция для заполнения базы данных стартовыми записями блога
const seedDatabase = async () => {
    try {
        const initialPosts = [
            { date: '2022-01-01', message: 'Первая запись блога', authorId: 1 },
            { date: '2022-02-01', message: 'Вторая запись блога', authorId: 2 },
            { date: '2022-03-01', message: 'Третья запись блога', authorId: 1 },
            // Добавьте здесь другие стартовые записи
        ];

        for (const post of initialPosts) {
            await pool.query(
                'INSERT INTO blog_posts (date, message, author_id) VALUES ($1, $2, $3)',
                [post.date, post.message, post.authorId]
            );
        }

        console.log('База данных успешно заполнена стартовыми записями блога.');
    } catch (err) {
        console.error('Ошибка при заполнении базы данных:', err);
    } finally {
        // Закрываем подключение к базе данных после выполнения скрипта
        pool.end();
    }
};

seedDatabase();