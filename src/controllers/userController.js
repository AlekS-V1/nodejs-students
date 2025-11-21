// src/controllers/userController.js

import createHttpError from 'http-errors';

export const updateUserAvatar = async (req, res, next) => {
  if (!req.file) {
    next(createHttpError(400, 'No file'));
    return;
  }
  console.log(req.file);
  res.status(200).json({ url: '' });
};
