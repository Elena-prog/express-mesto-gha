const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict-err');

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  user.findById(req.params.userId)
    .orFail(new Error('Not Found'))
    .then((userData) => {
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        throw new NotFoundError('Пользователь не найден');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  user.findById(req.user._id)
    .orFail(new Error('Not Found'))
    .then((userData) => {
      res.send({ data: userData });
    })
    .catch((err) => {
      if (err.name === 'Error') {
        throw new NotFoundError('Пользователь не найден');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Пользователь не найден');
      }
    })
    .catch(next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

  if (!user.checkEmail(email)) {
    throw new BadRequestError('Переданы некорректные данные');
  }

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      throw new Error('не удалось захешировать пароль');
    }
    user.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    })
      .then((userData) => {
        res.status(201).send({
          name: userData.name,
          about: userData.about,
          avatar: userData.avatar,
          email: userData.email,
        });
      })
      .catch((error) => {
        if (error.code === 11000) {
          throw new ConflictError('Этот email уже существует');
        }
        if (error.name === 'ValidationError') {
          throw new BadRequestError('Переданы некорректные данные');
        }
      })
      .catch(next);
  });
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new Error('Пользователь не найден');
    })
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      if (err.name === 'Error') {
        throw new NotFoundError('Пользователь не найден');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;

  user.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((userData) => res.send({ data: userData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  user.findOne({ email })
    .select('+password')
    .then((userData) => {
      if (!userData) {
        throw new UnauthorizedError('Неправильные почта или пароль');
      }
      return bcrypt.compare(password, userData.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неправильные почта или пароль');
          }
          const token = jwt.sign(
            { _id: userData._id },
            'some-secret-key',
            { expiresIn: '7d' },
          );
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            sameSite: true,
          });
          res.send({ data: userData });
        });
    })
    .catch(() => {
      throw new UnauthorizedError('Неправильные почта или пароль');
    })
    .catch(next);
};
