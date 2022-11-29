// const users = require('./users');
// const cards = require('./cards');

// module.exports = { users, cards };
const router = require('express').Router();
const { celebrate } = require('celebrate');
const { NOT_FOUND } = require('../constants');
const { login, createUser } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { body } = require('../utils/loginValidation');

const users = require('./users');
const cards = require('./cards');

router.post('/signup', celebrate({ body }), createUser);
router.post('/signin', celebrate({ body }), login);
router.use(auth);
router.use('/users', users);
router.use('/cards', cards);

router.all('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: 'Страница не найдена' });
});

module.exports = router;
