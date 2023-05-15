const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // Замените на свой секретный ключ

// Функция для хэширования пароля
const hashPassword = async (password) => {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
};

// Функция для сравнения пароля с хэшем
const comparePassword = async (password, hashedPassword) => {
    const match = await bcrypt.compare(password, hashedPassword);
    return match;
};

// Функция для генерации JWT-токена
const generateToken = (payload) => {
    const token = jwt.sign(payload, SECRET_KEY);
    return token;
};

// Middleware для проверки JWT-токена
const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Token not found' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.user = user;
        next();
    });
};

module.exports = {
    hashPassword,
    comparePassword,
    generateToken,
    authenticateToken,
};