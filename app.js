const express = require('express');
const app = express();
app.use(express.json());

const { getCategories, getReview } = require('./controllers/board-game-review-controllers')
const { handle500Paths, handle404Paths, handleCustomErrors } = require('./controllers/controllers.errors');



app.get('/api/categories', getCategories)









app.get('/api/reviews/:review_id', getReview)

app.use(handleCustomErrors);
app.all('/*', handle404Paths);
app.use(handle500Paths);

module.exports = app;