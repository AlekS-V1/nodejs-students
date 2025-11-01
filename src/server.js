// src/server.js - відповідає за складання застосунку та запуск сервера

import express from 'express';
import cors from 'cors';
import 'dotenv/config';  // Такий імпорт одразу ініціалізує бібліотеку
import { connectMongoDB } from './db/connectMongoDB.js';
import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import studentsRoutes from './routes/studentsRoutes.js';

const app = express();
const PORT = process.env.PORT ?? 3000; // Використання змінних

// Допомагає відслідковувати, як працює застосунок
app.use(logger);
// app.use(pino({
//   level: 'info',
//   transport: {
//     target: 'pino-pretty',
//     options: {
//       colorize: true,
//       translateTime: 'HH:MM:ss',
//       ignore: 'pid,hostname',
//       messageFormat: '{req.method} {req.url} {res.statusCode} - {responseTime}ms',
//       hideObject: true,
//     },
//   },
// }),
// );

// Middleware для парсингу JSON і додає його у req.body
app.use(express.json());

// Дозволяє запити з будь-яких джерел/доменів
app.use(cors());


// Логування часу

app.use((req, res, next) => {
  console.log(`Time: ${new Date().toLocaleString()}`);
  next();
});

// Перший маршрут
// GET-запит до кореневого маршруту "/"
// app.get('/', (req, res) => {
//   res.status(200).json({
//     message: 'Hello world!',
//   });
// });

// GET-запит до маршруту "/health"
// app.get('/health', (req, res) => {
//   res.status(200).json({
//     status: 'Ok!',
//   });
// });

// Список усіх користувачів тепер у routes/studentsRoutes.js
// app.get('/students', async (req, res) => {
//   const students = await Student.find();
//   console.log(req.body); // тепер тіло HTTP-запиту доступне як JS-об’єкт з middleware — express.json()
//   res.status(200).json(students);
// });

// Конкретний користувач за id тепер у routes/studentsRoutes.js
// app.get('/students/:studentId', async (req, res) => {

//   const { studentId } = req.params;
//   const student = await Student.findById(studentId);
//   if (!student) {
//     return res.status(404).json({ message: 'Student not found' });
//   }

//   res.status(200).json(student);
// });

// підключаємо групу маршрутів студента
app.use(studentsRoutes);

// Маршрут для тестування middleware помилки
// app.get('/test-error', (req, res) => {
//   throw new Error('Something went wrong');
// });


// Middleware 404 — якщо маршрут не знайдено (після всіх маршрутів)
app.use(notFoundHandler);
// app.use((req, res) => {
//   res.status(404).json({ message: 'Route not found' });
// });

// Middleware Error для обробки помилок, якщо під час запиту виникла помилка  (останнє)
app.use(errorHandler);
// app.use((err, req, res, next) => {
//   console.error('Error: ', err.message);

//   const isProd = process.env.NODE_ENV === "production";

//   res.status(500).json({
//     message: isProd ? "Something went wrong. Please try again later." : err.message,
//   });
// });

await connectMongoDB();

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
