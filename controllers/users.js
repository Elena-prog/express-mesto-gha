const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const user = require('../models/user');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const UnauthorizedError = require('../errors/unauthorized');
const ConflictError = require('../errors/conflict-err');
const { OK, CREATED } = require('../constants');

const { NODE_ENV, KEY } = process.env;

const findUserById = (id, res, next) => {
  user.findById(id)
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((userData) => res.status(OK).send(userData))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Пользователь не найден'));
      }
      return next(err);
    });
};

// module.exports.getUsers = (req, res, next) => {
//   user.find({})
//     .then((users) => res.status(OK).send(users))
//     .catch(next);
// };

// module.exports.getUser = (req, res, next) => {
//   findUserById(req.params.userId, res, next);
// };

module.exports.getUserInfo = (req, res, next) => {
  findUserById(req.user._id, res, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;

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
        const data = userData.toObject();
        delete data.password;
        res.status(CREATED).send(data);
      })
      .catch((error) => {
        if (error.name === 'ValidationError') {
          return next(new BadRequestError('Переданы некорректные данные'));
        }
        if (error.code === 11000) {
          return next(new ConflictError('Этот email уже существует'));
        }
        return next(error);
      });
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
      throw new NotFoundError('Пользователь не найден');
    })
    .then((userData) => res.status(OK).send(userData))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
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
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((userData) => res.status(OK).send(userData))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
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
            NODE_ENV === 'production' ? KEY : 'dev-secret',
            { expiresIn: '7d' },
          );
          res.cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
            secure: NODE_ENV === 'production',
          });
          const loggedUser = userData.toObject();
          delete loggedUser.password;
          res.status(OK).send({ data: loggedUser });
        });
    })
    .catch(next);
};
