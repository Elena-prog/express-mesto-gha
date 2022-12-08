const router = require('express').Router();
const { celebrate } = require('celebrate');
const { updateUser, updateAvatar, getUserInfo } = require('../controllers/users');
const { updateUserValidation, avatarValidation } = require('../utils/userValidation');
// const corsControl = require('../middlewares/corsControl');

router.patch('/me', celebrate(updateUserValidation), updateUser);

router.get('/me', getUserInfo);

router.patch('/me/avatar', celebrate(avatarValidation), updateAvatar);

module.exports = router;
