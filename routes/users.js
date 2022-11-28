const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const { body, params } = require('../utils/userValidation');

router.get('/', getUsers);

router.patch('/me', celebrate({ body }), updateUser);

router.get('/me', getUserInfo);

router.get('/:userId', celebrate({ params }), getUser);

router.patch('/me/avatar', celebrate({ body }), updateAvatar);

module.exports = router;
