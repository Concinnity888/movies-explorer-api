const bcrypt = require('bcrypt');

const User = require('../models/user');
const { getToken } = require('../utils/jwt');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const ConflictError = require('../errors/ConflictError');
const UnauthorizedError = require('../errors/UnauthorizedError');

const DUBLICATE_MONGOOSE_ERROR_CODE = 11000;
const SAULT_ROUNDS = 10;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      next(new UnauthorizedError('Неправильные логин или пароль'));
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      next(new UnauthorizedError('Неправильные логин или пароль'));
      return;
    }

    const token = await getToken(user._id);
    res.status(200).send({
      token,
    });
  } catch (err) {
    next(err);
  }
};

const getUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      next(new NotFoundError('Пользователь по указанному _id не найден'));
      return;
    }
    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

const createUser = async (req, res, next) => {
  const {
    name,
    email,
    password,
  } = req.body;

  try {
    const hashPassword = await bcrypt.hash(password, SAULT_ROUNDS);
    const user = await User.create({
      name,
      email,
      password: hashPassword,
    });

    if (!user) {
      next(new ValidationError('Переданы некорректные данные при создании пользователя'));
      return;
    }

    res.status(201).send({
      _id: user._id,
      email,
      name,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при создании пользователя'));
    } else if (err.code === DUBLICATE_MONGOOSE_ERROR_CODE) {
      next(new ConflictError('Пользователь уже существует'));
    } else {
      next(err);
    }
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email } = req.body;
    const result = await User.find({ email });
    if (result.length <= 1) {
      const user = await User.findByIdAndUpdate(
        req.user.id,
        { name, email },
        { new: true, runValidators: true },
      );
      if (!user) {
        next(new NotFoundError('Пользователь с указанным _id не найден'));
        return;
      }
      res.status(200).send(user);
    } else {
      next(new ConflictError('Пользователь уже существует'));
      return;
    }
  } catch (err) {
    if (err.name === 'ValidationError') {
      next(new ValidationError('Переданы некорректные данные при обновлении профиля'));
    } else {
      next(err);
    }
  }
};

module.exports = {
  login,
  createUser,
  updateUser,
  getUser,
};
