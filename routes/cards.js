const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
} = require('../controllers/cards');
const { createCardValidation, paramsValidation } = require('../utils/cardValidation');
const corsControl = require('../middlewares/corsControl');

router.get('/', getCards);

router.post('/', celebrate(createCardValidation), corsControl, createCard);

router.delete('/:cardId', celebrate(paramsValidation), corsControl, deleteCard);

router.put('/:cardId/likes', celebrate(paramsValidation), corsControl, likeCard);

router.delete('/:cardId/likes', celebrate(paramsValidation), corsControl, dislikeCard);

module.exports = router;
