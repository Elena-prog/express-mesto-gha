const card = require('../models/card');

module.exports.getCards = (req, res) => {
    card.find({})
    .populate('owner')
    .then(cards => res.status(200).send({data: cards}))
    .catch((err) => {
        if (err.name === 'CastError') {
            res.status(404).send({ message: 'Карточки не найдены'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка' });
        }
    })
}

module.exports.createCard = (req, res) => {
    const {name, link} = req.body;

    card.create({name, link, owner: req.user._id})
    .then(card => res.send({data: card}))
    .catch((err) => {
        if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы некорректные данные'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка' });
        }
    })
}

module.exports.deleteCard = (req, res) => {
    card.findByIdAndRemove(req.params.cardId)
    .orFail(new Error('Not Found'))
    .then(card => res.send({data: card}))
    .catch((err) => {
        if(err.name === 'Error'){
            res.status(404).send({ message: 'Карточка не найдена'});
        } else if (err.name === 'CastError') {
            res.status(400).send({ message: 'Карточка не найдена'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка' });
        }
    })
}

module.exports.likeCard = (req, res) => {
    card.findByIdAndUpdate(
        req.params.cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true }
    )
    .orFail(new Error('Not Found'))
    .then(card => res.send({data: card}))
    .catch((err) => {
        if(err.name === 'Error'){
            res.status(404).send({ message: 'Карточка не найдена'});
        } else if (err.name === 'CastError') {
            res.status(400).send({ message: 'Карточка не найдена'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка' });
        }
    })
}

module.exports.dislikeCard = (req, res) => {
    card.findByIdAndUpdate(
        req.params.cardId,
        { $pull: { likes: req.user._id } },
        { new: true }
    )
    .then(card => res.send({data: card}))
    .catch((err) => {
        if (err.name === 'CastError') {
            res.status(404).send({ message: 'Карточка не найдена'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка' });
        }
    })
}

