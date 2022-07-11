const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const cors = require('cors');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { routes } = require('./routes');
const { limiter } = require('./utils/limiter');

const { PORT = 3000, NODE_ENV, DB_NAME } = process.env;
const { DEFAULT_DB_NAME } = require('./utils/config');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.use(helmet());

app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use(limiter);

app.use(routes);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

async function main() {
  try {
    await mongoose.connect(NODE_ENV === 'production' ? DB_NAME : DEFAULT_DB_NAME, {
      useNewUrlParser: true,
      useUnifiedTopology: false,
    });

    app.listen(PORT);
  } catch (err) {
    console.error(err);
  }
}

main();
