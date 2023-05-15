const express = require('express');
const app = express();
const userRoutes = require('./user');
const blogRoutes = require('./blog');

app.use(express.json());

// Регистрация маршрутов
app.use('/api/users', userRoutes);
app.use('/api/blog', blogRoutes);

// Запуск сервера
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

//Чтобы отредактировать запись блога, отправьте PUT-запрос на `/api/blog/posts/:postId`, где `:postId` - это
// идентификатор редактируемой записи. В теле запроса укажите обновленные значения `date` и `message`, а также
// авторизационный заголовок `Authorization` с JWT-токеном.

//Чтобы удалить запись блога, отправьте DELETE-запрос на `/api/blog/posts/:postId`, где `:postId` - это идентификатор
// удаляемой записи. Авторизационный заголовок `Authorization` с JWT-токеном также должен присутствовать.
