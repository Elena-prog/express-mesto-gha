const router = require('express').Router();
const { celebrate } = require('celebrate');
const { NOT_FOUND } = require('../constants');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { registrationValidation, loginValidation } = require('../utils/loginValidation');

const users = require('./users');
const cards = require('./cards');

router.post('/signup', celebrate(registrationValidation), createUser);
router.post('/signin', celebrate(loginValidation), login);
router.use(auth);
router.use('/users', users);
router.use('/cards', cards);

router.all('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
