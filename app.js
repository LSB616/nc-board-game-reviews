const express = require('express');
const app = express();
app.use(express.json());

const { getReviews } = require('./controllers/board-game-review-controllers')
const {} = require('./controllers/controllers.errors');



app.get('/api/reviews', getReviews)

module.exports = app;