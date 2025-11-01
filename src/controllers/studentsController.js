// src/controllers/studentsController.js - функції, які відповідають за обробку запитів і формування відповіді

import { Student } from "../models/student.js";
import createHttpError from 'http-errors';

// Отримати список усіх студентів
export const getStudents = async (req, res) => {
  const students = await Student.find();
  res.status(200).json(students);
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
