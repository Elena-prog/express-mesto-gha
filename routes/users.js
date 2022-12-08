const router = require('express').Router();
const { celebrate } = require('celebrate');
const {
  getUsers, getUser, updateUser, updateAvatar, getUserInfo,
} = require('../controllers/users');
const { updateUserValidation, paramsValidation, avatarValidation } = require('../utils/userValidation');
const corsControl = require('../middlewares/corsControl');

// router.get('/', corsControl, getUsers);

router.patch('/me', celebrate(updateUserValidation), corsControl, updateUser);

router.get('/me', getUserInfo);

// router.get('/:userId', celebrate(paramsValidation), corsControl, getUser);

router.patch('/me/avatar', celebrate(avatarValidation), corsControl, updateAvatar);

module.exports = router;
