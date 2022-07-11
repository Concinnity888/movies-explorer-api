const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { usersRoutes } = require('./users');
const { moviesRoutes } = require('./movies');
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const {
  createUser,
  login,
} = require('../controllers/users');

const routes = express.Router();

routes.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), createUser);
routes.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);

routes.use(auth);

routes.use('/users', usersRoutes);
routes.use('/movies', moviesRoutes);

routes.use((req, res, next) => {
  next(new NotFoundError('Маршрут не найден'));
});

module.exports = {
  routes,
};
