const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');

const PORT = 3000;
const app =  express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
    req.user = {
        _id: '636a783c38c75a6b12e004ef'
    };
    next();
})
app.use('/users', users);
app.use('/cards', cards);
app.all('/*', (req, res) => {
    res.status(404).send({message: 'Страница не найдена'})
})

app.listen(PORT, () => {
    console.log(`App listened on port ${PORT}`);
})


