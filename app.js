require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const handleError = require('./middlewares/handleError');
const router = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const PORT = process.env.PORT || 3000;

const app = express();

const options = {
  origin: [
    'http://localhost:3001',
    'https://mesto.russia.nomoredomains.club',
    'http://mesto.russia.nomoredomains.club',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

mongoose.connect('mongodb://localhost:27017/mestodb', {
  autoIndex: true,
});

app.use(helmet());
app.use('*', cors(options));
app.use(requestLogger);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(handleError);

app.listen(PORT);
