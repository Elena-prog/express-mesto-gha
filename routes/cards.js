const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { body, params } = require('../utils/cardValidation');

router.get('/', getCards);

router.post('/', celebrate({ body }), createCard);

router.delete('/:cardId', celebrate({ params }), deleteCard);

router.put('/:cardId/likes', celebrate({ params }), likeCard);

router.delete('/:cardId/likes', celebrate({ params }), dislikeCard);

module.exports = router;
