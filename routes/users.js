const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const { updateUserValidation, paramsValidation, avatarValidation } = require('../utils/userValidation');

router.get('/', getUsers);

router.patch('/me', celebrate(updateUserValidation), updateUser);

router.get('/me', getUserInfo);

router.get('/:userId', celebrate(paramsValidation), getUser);

router.patch('/me/avatar', celebrate(avatarValidation), updateAvatar);

module.exports = router;
