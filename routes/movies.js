const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getMovies,
  deleteMovie,
  createMovie,
} = require('../controllers/movies');

const moviesRoutes = express.Router();

moviesRoutes.get('/', getMovies);

moviesRoutes.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

moviesRoutes.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    trailer: Joi.string().required().regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    nameRU: Joi.string().required().regex(/[а-я]+/i),
    nameEN: Joi.string().required().regex(/[a-z]+/i),
    thumbnail: Joi.string().required().regex(/https?:\/\/(www)?(\.)?[0-9а-яa-zё]{1,}\.[а-яa-zё]{2}[a-zа-яё\-._~:/?#[\]@!$&'()*+,;=]*#?/i),
    movieId: Joi.string().required(),
  }),
}), createMovie);

module.exports = {
  moviesRoutes,
};
