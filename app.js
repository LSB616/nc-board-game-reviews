const express = require('express');
const app = express();
app.use(express.json());

const { getReviews, getCategories } = require('./controllers/board-game-review-controllers')
const { handle500Paths, handle404Paths } = require('./controllers/controllers.errors');

app.get('/api/reviews', getReviews)
app.get('/api/categories', getCategories)


app.all('/*', handle404Paths);
app.use(handle500Paths);

module.exports = app;