const card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');

module.exports.getCards = (req, res, next) => {
  card.find({})
    .then((cards) => res.status(200).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequestError('Переданы некорректные данные');
      }
    })
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  card.findById(req.params.cardId)
    .orFail(new Error('Not Found'))
    .then((cardData) => {
      if (req.user._id === cardData.owner.toString()) {
        card.findByIdAndRemove(req.params.cardId)
          .orFail(new Error('Not Found'))
          .then((deletedCard) => {
            res.send({ data: deletedCard });
          })
          .catch((err) => {
            if (err.name === 'Error') {
              throw new NotFoundError('Карточка не найдена');
            } else if (err.name === 'CastError') {
              throw new BadRequestError('Карточка не найдена');
            }
          })
          .catch(next);
      } else {
        res.status(403).send({ message: 'Нет прав' });
      }
    })
    .catch((err) => {
      if (err.name === 'Error') {
        throw new NotFoundError('Карточка не найдена');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Карточка не найдена');
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not Found'))
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'Error') {
        throw new NotFoundError('Карточка не найдена');
      } else if (err.name === 'CastError') {
        throw new BadRequestError('Карточка не найдена');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new Error('Not Found'))
    .then((cardData) => res.send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'Error') {
        throw new NotFoundError('Карточка не найдена');
      } else
      if (err.name === 'CastError') {
        throw new BadRequestError('Карточка не найдена');
      }
    })
    .catch(next);
};
