const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, paramsValidation } = require('../utils/cardValidation');

router.get('/', getCards);

router.post('/', celebrate(createCardValidation), createCard);

router.delete('/:cardId', celebrate(paramsValidation), deleteCard);

router.put('/:cardId/likes', celebrate(paramsValidation), likeCard);

router.delete('/:cardId/likes', celebrate(paramsValidation), dislikeCard);

module.exports = router;
