// src/routes/studentsRoutes.js

import { Router } from 'express';
import {getStudents, getStudentId, createdStudent, deleteStudent, updateStudent} from '../controllers/studentsController.js';
import { celebrate } from 'celebrate';
import { createStudentSchema, getStudentsSchema, studentIdParamSchema, updateStudentSchema } from '../validations/studentsValidation.js';

const router = Router();

router.get('/students', celebrate(getStudentsSchema), getStudents);
// router.get('/students', async (req, res) => {
//   const students = await Student.find();
//   res.status(200).json(students);
// }); тепер у controllers/studentsController.js

router.get('/students/:studentId', celebrate(studentIdParamSchema), getStudentId);
// router.get('/students/:studentId', async (req, res) => {
//   const { studentId } = req.params;
//   const student = await Student.findById(studentId);
//   if (!student) {
//     return res.status(404).json({ message: 'Student not found' });
//   }
//   res.status(200).json(student);
// }); тепер у controllers/studentsController.js

router.post('/students', celebrate(createStudentSchema), createdStudent);

router.delete('/students/:studentId', celebrate(studentIdParamSchema), deleteStudent);

router.patch('/students/:studentId', celebrate(updateStudentSchema), updateStudent);

export default router;
