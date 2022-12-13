const { request, response } = require("../app");
const { selectCategories, selectReview } = require("../models/board-game-review-models");
const { checkIfReviewIdExists, isIdValid } = require('../controllers/controller_functions');

exports.getCategories = (req, res, next) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err);
    });
};






















exports.getReview = (req, res, next) => {
    const id = req.params.review_id
    Promise.all([checkIfReviewIdExists(id), isIdValid(id), selectReview(id)])
    .then(([idExists, isValidId, review]) => {
        res.status(200).send({review})
    })
    .catch((err) => {
        next(err);
    });
};