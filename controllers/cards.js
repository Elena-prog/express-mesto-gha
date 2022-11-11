const card = require('../models/card');

const OK = 200;
const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  card.find({})
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(() => {
      res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('Not Found'))
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not Found'))
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not Found'))
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'Error') {
        res.status(NOT_FOUND).send({ message: 'Карточка не найдена' });
      } else
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Карточка не найдена' });
      } else {
        res.status(SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
