const express = require('express');
const app = express();
app.use(express.json());


const { getReviews, getCategories, getReview, getComments, postComment, patchReview, getUsers } = require('./controllers/board-game-review-controllers')
const { handle500Paths, handle404Paths, handleCustomErrors, handlesPsqlErrors } = require('./controllers/controllers.errors');

app.get('/api/reviews', getReviews)
app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReview)
app.get('/api/reviews/:review_id/comments', getComments)
app.post('/api/reviews/:review_id/comments', postComment)
app.patch('/api/reviews/:review_id', patchReview)
app.get('/api/users', getUsers)


app.use(handlesPsqlErrors);
app.use(handleCustomErrors);
app.all('/*', handle404Paths);
app.use(handle500Paths);

module.exports = app;