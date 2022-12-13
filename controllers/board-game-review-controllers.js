const { request, response } = require("../app");
const { selectReviews, selectCategories, selectComment  } = require("../models/board-game-review-models");
const { checkIfReviewIdExists, isIdValid } = require('../controllers/controller_functions');


exports.getCategories = (req, res) => {
    selectCategories()
    .then((categories) => {
        res.status(200).send({categories})
    })
    .catch((err) => {
        next(err);
    });
};


exports.getReviews = (req, res, next) => {
    selectReviews()
    .then((reviews) => {
        res.status(200).send({reviews})
    })
    .catch((err) => {
        next(err)
    });
};









exports.getComments = (req, res, next) => {
    const id = req.params.review_id;
    Promise.all([checkIfReviewIdExists(id), isIdValid(id), selectComment(id)])
    .then(([idExists, isValidId, comments]) => {
        res.status(200).send({comments})
    })
    .catch((err) => {
        next(err);
    });
};