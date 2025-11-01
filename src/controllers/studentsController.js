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
