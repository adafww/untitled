const { Pool } = require('pg');

const pool = new Pool({
    user: 'your-username', // Замените на имя пользователя вашей базы данных
    host: 'your-host', // Замените на хост вашей базы данных
    database: 'your-database', // Замените на имя вашей базы данных
    password: 'your-password', // Замените на пароль вашей базы данных
    port: 5432, // Замените на порт вашей базы данных
});

module.exports = pool;