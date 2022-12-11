const router = require('express').Router();
const { celebrate } = require('celebrate');
const { login, createUser, exit } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { registrationValidation, loginValidation } = require('../utils/loginValidation');

const users = require('./users');
const cards = require('./cards');
const NotFoundError = require('../errors/not-found-err');

router.post('/signup', celebrate(registrationValidation), createUser);
router.post('/signin', celebrate(loginValidation), login);
router.post('/signout', exit);
router.use(auth);
router.use('/users', users);
router.use('/cards', cards);

router.all('/*', (req, res, next) => next(new NotFoundError('Страница не найдена')));

module.exports = router;
