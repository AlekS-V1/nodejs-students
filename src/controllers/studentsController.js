// src/controllers/studentsController.js - функції, які відповідають за обробку запитів і формування відповіді

import { Student } from "../models/student.js";
import createHttpError from 'http-errors';

// Отримати список усіх студентів згідно умов пагінациї
export const getStudents = async (req, res) => {
  // Отримуємо пара метри пагінації
  const {
    page = 1,
    perPage = 10,
    gender,
    minAvgMark,
    search,
    // Отримуємо значення параметрів сортування
    // дефолтне сортування по _id
    sortBy = '_id',
    sortOrder = 'asc'
  } = req.query;
// визначаємо, скільки записів пропустити для зсуву на потрібну сторінку
  const skip = (page - 1) * perPage;

  // Створюємо опис базового запиту до колекції
  const studentsQuery = Student.find();

  // Текстовий пошук по name (працює лише якщо створено текстовий індекс)
  if (search) {
    studentsQuery.where({
      $text: { $search: search }
    });
  }

  // Будуємо фільтрацію:
  // -Фільтр за статтю
  if (gender) {
    studentsQuery.where('gender').equals(gender);
  }
  // -Фільтр за середнім балом
  if (minAvgMark) {
    studentsQuery.where('avgMark').gte(minAvgMark);
  }

  // Пагінація + сортування:
  // Виконуємо одразу два запити паралельно
  const [totalItems, students] = await Promise.all([
    studentsQuery.clone().countDocuments(),
    studentsQuery
      .skip(skip)
      .limit(perPage)
    // Додамєдо сортування в ланцюжок методів квері
      .sort({[sortBy]: sortOrder}),
  ]);

  // Обчислюємо загальну кількість «сторінок»
  const totalPages = Math.ceil(totalItems / perPage);
  // const students = await Student.find();
  res.status(200).json({
    page,
    perPage,
    totalItems,
    totalPages,
    students,
  });
};

// Отримати одного студента за id
export const getStudentId = async (req, res, next) => {

  const { studentId } = req.params;
  const student = await Student.findById(studentId);
  // Код що був до цього
  // if (!student) {
  //   return res.status(404).json({ message: 'Student not found' });
  // }
  // Додаємо базову обробку помилки замість res.status(404)
  if (!student) {
    next(createHttpError(404,'Student not found'));
    return;
  }

  res.status(200).json(student);
};

// Створення нового студента з додаванням до колекції
export const createdStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.status(201).json(student);
};

// Видалення студента/документа з колекції
export const deleteStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndDelete({
    _id: studentId,
  });
  if (!student) {
    next(createHttpError(404, "Student not found"));
    return;
  }
  res.status(200).json(student);
};

// Оновити окремі дані студента

export const updateStudent = async (req, res, next) => {
  const { studentId } = req.params;
  const student = await Student.findOneAndUpdate(
    { _id: studentId }, // Шукаємо по id
    req.body,
    { new: true }, // повертаємо оновлений документ
  );

  if (!student) {
    next(createHttpError(404, 'Student not found'));
    return;
  }

  res.status(200).json(student);
};
