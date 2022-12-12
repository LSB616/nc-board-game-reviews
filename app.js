const express = require('express');
const app = express();
app.use(express.json());

const {} = require('./controllers/board-game-review-controllers')
const {} = require('./controllers/controllers.errors');





module.exports = app;