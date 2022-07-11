const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;

const getToken = (id) => jwt.sign({ id }, NODE_ENV !== 'production' ? 'some-secret-key' : JWT_SECRET, { expiresIn: '7d' });

module.exports = {
  getToken,
};
