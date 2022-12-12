const { request, response } = require("../app");
const { selectReviews } = require("../models/board-game-review-models");

exports.getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err)
    })
};