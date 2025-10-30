// src/server.js

import express from 'express';
import cors from 'cors';
import pino from 'pino-http';
import 'dotenv/config';  // Такий імпорт одразу ініціалізує бібліотеку


const app = express();
const PORT = process.env.PORT ?? 3000; // Використання змінних

// Middleware для парсингу JSON і додає його у req.body
app.use(express.json());

app.use(cors()); // Дозволяє запити з будь-яких джерел

app.use(pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'HH:MM:ss',
      ignore: 'pid,hostname',
      messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
      hideObject: true,
    },
  },
}),
);



// Логування часу

app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Перший маршрут
// GET-запит до кореневого маршруту "/"
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello world!',
  });
});
// GET-запит до маршруту "/health"
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'Ok!',
  });
});

// Список усіх користувачів

app.get('/users', (req, res) => {
  console.log(req.body); // тепер тіло HTTP-запиту доступне як JS-об’єкт з middleware — express.json()
  res.status(200).json(
    [
      {
        id: 1, name: 'Kostja'
      }
    ]);
});

// Конкретний користувач за id

app.get('/users/:userId', (req, res) => {

  const { userId } = req.params;
  res.status(200).json({ id: userId, name: 'Kyrylo' });
});

// Маршрут для тестування middleware помилки
app.get('/test-error', (req, res) => {
  throw new Error('Something went wrong');
});

// Middleware 404 (після всіх маршрутів)
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});
// Middleware для обробки помилок  (останнє)
app.use((err, req, res, next) => {
  console.error('Error: ', err.message);

  const isProd = process.env.NODE_ENV === "production";

  res.status(500).json({
    message: isProd ? "Something went wrong. Please try again later." : err.message,
  });
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
