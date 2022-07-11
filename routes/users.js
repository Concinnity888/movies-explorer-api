const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getUser,
  updateUser,
} = require('../controllers/users');

const usersRoutes = express.Router();

usersRoutes.get('/me', getUser);

usersRoutes.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
  }),
}), updateUser);

module.exports = {
  usersRoutes,
};
