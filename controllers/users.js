const user = require('../models/user');

module.exports.getUsers = (req, res) => {
    user.find({})
    .then(users => res.send({data: users}))
    .catch((err) => {
        if (err.name === 'CastError') {
            res.status(404).send({ message: 'Пользователи не найдены'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка' });
        }
    })
}

module.exports.getUser = (req, res) => {
    user.findById(req.params.userId)
    .then(user => { 
        res.send({data: user})
    })
    .catch((err) => {
        if (err.name === 'CastError') {
            res.status(400).send({ message: 'Пользователь не найден'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка'});
        }
    })
}

module.exports.createUser = (req, res) => {
    const {name, about, avatar} = req.body;

    user.create({name, about, avatar})
    .then(user => res.send({data: user}))
    .catch((err) => {
        if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы некорректные данные'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка'});
        }
    })
}

module.exports.updateUser = (req, res) => {
    const {name, about} = req.body;

    user.findByIdAndUpdate(
        req.user._id,
        {
            name,
            about
        },
        {
            new: true,
            runValidators: true,
            upsert: true
        }
    )
    .orFail(()=> {
        throw new Error('Пользователь не найден');
    })
    .then(user => res.send({data: user}))
    .catch((err) => {
        if(err.statusCode === 404) {
            res.status(404).send({ message: 'Пользователь не найден'});
        }
        if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы некорректные данные'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка' });
        }
    })
}

module.exports.updateAvatar = (req, res) => {
    const {avatar} = req.body;

    user.findByIdAndUpdate(
        req.user._id,
        {
            avatar
        },
        {
            new: true,
            runValidators: true,
            upsert: true
        }
    )
    .then(user => res.send({data: user}))
    .catch((err) => {
        if (err.name === 'ValidationError') {
            res.status(400).send({ message: 'Переданы некорректные данные'});
          } else {
            res.status(500).send({ message: 'Произошла ошибка' });
        }
    })
}