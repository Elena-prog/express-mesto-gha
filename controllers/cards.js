const card = require('../models/card');
const NotFoundError = require('../errors/not-found-err');
const BadRequestError = require('../errors/bad-request-err');
const ForbiddenError = require('../errors/forbidden-err');
const { OK, CREATED } = require('../constants');

module.exports.getCards = (req, res, next) => {
  card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  card.create({ name, link, owner: req.user._id })
    .then((cardData) => res.status(CREATED).send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  card.findById(req.params.cardId)
    .orFail(new NotFoundError())
    .then((cardData) => {
      if (req.user._id === cardData.owner.toString()) {
        cardData.remove()
          .then((deletedCard) => {
            res.status(OK).send({ data: deletedCard });
          })
          .catch((err) => {
            if (err.name === 'CastError') {
              throw new BadRequestError();
            }
          })
          .catch(next);
      } else {
        throw new ForbiddenError('Недостаточно прав для удаления карточки');
      }
    })
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Карточка не найдена'));
      }
      if (err.name === 'ForbiddenError') {
        return next(new ForbiddenError('Недостаточно прав для удаления карточки'));
      }
      return next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError())
    .then((cardData) => res.status(OK).send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Карточка не найдена'));
      }
      return next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(new NotFoundError())
    .then((cardData) => res.status(OK).send({ data: cardData }))
    .catch((err) => {
      if (err.name === 'NotFoundError') {
        return next(new NotFoundError('Карточка не найдена'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Карточка не найдена'));
      }
      return next(err);
    });
};
