const Movie = require('../models/movie');
const ValidationError = require('../errors/ValidationError');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({ owner: req.user.id });
    res.status(200).send(movies);
  } catch (err) {
    next(err);
  }
};

const createMovie = async (req, res, next) => {
  try {
    const {
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      movieId,
      nameRU,
      nameEN,
    } = req.body;
    const movie = new Movie({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      thumbnail,
      owner: req.user.id,
      movieId,
      nameRU,
      nameEN,
    });
    res.status(201).send(await movie.save());
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при создании фильма'));
    } else {
      next(err);
    }
  }
};

const deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.movieId);
    if (!movie) {
      next(new NotFoundError('Фильм с указанным _id не найден'));
      return;
    }

    const movieOwner = movie.owner.toString().replace('new ObjectId("', '');
    if (req.user.id === movieOwner) {
      const currentMovie = await Movie.findByIdAndRemove(req.params.cardId);
      res.status(200).send(currentMovie);
    } else {
      next(new ForbiddenError('Нет доступа'));
    }
  } catch (err) {
    if (err.kind === 'ObjectId') {
      next(new BadRequestError('Переданы некорректные данные при удалении фильма'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};





