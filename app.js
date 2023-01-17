const cors = require('cors');
const express = require('express');
const app = express();
app.use(cors());
app.use(express.json());
const { getReviews, getCategories, getReview, getComments, postComment, patchReview, getUsers, getApi, deleteComment, getUser, patchComment, postReview, deleteReview } = require('./controllers/board-game-review-controllers')
const { handle500Paths, handle404Paths, handleCustomErrors, handlesPsqlErrors } = require('./controllers/controllers.errors');


app.get('/api/reviews', getReviews)
app.get('/api/categories', getCategories)
app.get('/api/reviews/:review_id', getReview)
app.get('/api/reviews/:review_id/comments', getComments)
app.post('/api/reviews/:review_id/comments', postComment)
app.patch('/api/reviews/:review_id', patchReview)
app.delete('/api/comments/:comment_id', deleteComment)
app.get('/api/users', getUsers)
app.get('/api/users/:username', getUser)
app.patch('/api/comments/:comment_id', patchComment)
app.post('/api/reviews', postReview)
app.delete('/api/reviews/:review_id', deleteReview)




app.get('/api', getApi)

app.use(handlesPsqlErrors);
app.use(handleCustomErrors);
app.all('/*', handle404Paths);
app.use(handle500Paths);

module.exports = app;