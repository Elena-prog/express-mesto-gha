const mongoose = require('mongoose');
const { REGEXP_URL, REGEXP_EMAIL } = require('../constants');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: 'Жак-Ив Кусто',
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    about: {
      type: String,
      default: 'Исследователь',
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
  },
);

userSchema.path('avatar').validate((link) => {
  const urlRegex = REGEXP_URL;
  return urlRegex.test(link);
}, 'Invalid URL.');

userSchema.path('email').validate((email) => {
  const emailRegex = REGEXP_EMAIL;
  return emailRegex.test(email);
}, 'Invalid email.');

module.exports = mongoose.model('user', userSchema);
